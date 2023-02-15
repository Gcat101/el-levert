import { spawn } from "child_process";
import net from "net";
import crypto from "crypto";
import genericPool from "generic-pool";

import VMUtil from "../../util/VMUtil.js";

class VM2ProcPool {
    constructor({ min, max, ...limits }) {
        limits.cpu = limits.cpu || 100;
        limits.memory = limits.memory || 2000;
        limits.time = limits.time || 4000;

        this.limits = limits;
        this.limitError = null;

        this.dirname = "./vm/vm2-runner";
    }

    createPool() {
        const ref = crypto.randomBytes(20).toString("hex"),
              kill = () => {
            spawn("sh", ["-c", `pkill -9 -f ${ref}`]);
        };

        const factory = {
            destroy: kill
        };

        let stderrCache = "";

        factory.create = function() {
            const runner = spawn("cpulimit", [
                "-ql",
                this.limits.cpu,
                "--",
                "xvfb-run",
                "-as",
                "-screen 0 1024x768x24 -ac +extension GLX +render -noreset",
                "node",
                `--max-old-space-size=${this.limits.memory}`,
                "ProcessRunner.js",
                ref
            ], {
                cwd: this.dirname,
                shell: false
            });

            runner.stdout.on("data", (data) => {
                const str = data.toString().trim();

                if(!str.toLowerCase().includes("debugger") && typeof runner.socket === "undefined") {
                    runner.socket = runner.socket || str;
                }
            });

            runner.stderr.on("data", (data) => {
                stderrCache = stderrCache + data.toString();
                
                if(stderrCache.includes("FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory")) {
                    this.limitError = "Code execution exceeed allowed memory.";
                }
            });

            return runner;
        }.bind(this);

        const pool = genericPool.createPool(factory, {
            min: this.min,
            max: this.max
        });

        this.kill = kill;
        this.pool = pool;
    }

    async prepare_cp() {
        if(typeof this.childProcess !== "undefined") {
            this.pool.destroy(this.childProcess);
        }

        const childProcess = await this.pool.acquire();
        await VMUtil.waitUntil(() => childProcess.socket);

        this.childProcess = childProcess;
    }

    listen(socket, funcs) {
        return new Promise((resolve, reject) => {
            let buf = "";

            const recieve = async data => {
                buf += String(data);
                
                if(buf.endsWith("\n")) {
                    let data;

                    try {
                        data = JSON.parse(buf);
                    } catch(err) {
                        reject(err.message);
                    }

                    buf = "";

                    switch(data.packetType) {
                    case "return":
                        resolve(data);

                        break;
                    case "funcCall": {
                            let res;

                            try {
                                res = await funcs[data.funcCall.name](data.funcCall.args);
                            } catch(err) {
                                reject(err.message);
                            }

                            VMUtil.sockWrite(socket, "funcReturn", {
                                funcReturn: {
                                    uniqueName: data.funcCall.uniqueName,
                                    data: res
                                }
                            });
                        }

                        break;   
                    }
                }
            };

            socket.on("data", recieve);
            socket.on("close", _ => reject(new Error("Socket was cabaled.")));
        });
    }

    async run(code, scope, options, funcs, additionalPath) {
        if(typeof this.childProcess === "undefined") {
            await this.prepare_cp();
        }

        const socket = net.createConnection(this.childProcess.socket),
              timer = setTimeout(() => {
            this.limitError = "Code execution took too long and was killed.";
            this.kill();
        }, this.limits.time);

        VMUtil.sockWrite(socket, "script", {
            script: {
                code: code,
                scope: scope,
                options: options,
                funcs: Object.keys(funcs),
                additionalPath: additionalPath
            }
        });

        let data;

        try {
            data = await this.listen(socket, funcs);
        } catch (error) {
            const limit = this.limitError;
            this.limitError = null;

            if(limit !== null) {
                await this.prepare_cp();
            }

            throw new Error(limit || error);
        } finally {
            clearTimeout(timer);
        }
        
        if(data.error) {
            const err = class extends Error {
                constructor(message, stack) {
                    super(message);

                   this.message = message;
                    this.stack = stack;
                }
            };

            Object.defineProperty(err, "name", {
                value: data.error.name
            });

            throw new err(data.error.message, data.error.stack);
        }

        return data.result;
    }
}

export default VM2ProcPool;