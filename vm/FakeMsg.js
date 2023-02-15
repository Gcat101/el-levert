import VMUtil from "../util/VMUtil.js";

class FakeMsg {
    constructor(msg) {
        this.msg = msg;
        this.fixedMsg = VMUtil.removeCircRef(msg);
    }

    reply(text, options) {
        return JSON.stringify(Util.formatReply(text, options));
    }
}

export default FakeMsg;