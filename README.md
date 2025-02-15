
# EL LEVERT JR
Romanian version of Leveret by Neeve. Includes many Romaniations such as "stealing", "cabal", "g" and "Jhon".
# Commands
## 1. help
Sends list of base commands.

##  2. t/tag `(name) args` 
Execute tag `(name)`, receiving `tag.args` = `args`.

Subcommands:
- add `type (name) (body)` - Add tag `(name)`. If `body` contains a code block it will be treated as a script tag. If an image file is attached, it will be added as an url. If a text file is attached, it will be added as a script. If the first argument is `vm2` the tag will be added as a vm2 script.
- alias `(name) (alias_name) args` - If tag `(name)` doesn't exist, it will be created and aliased to `(alias_name)` with `args` being appended to `tag.args`. If `(name)` already exists and is owned by you, it will be updated to be an alias. Moderators can bypass ownership checks.
- chown `(name) (new_owner)` - Transfers tag to another user, specified either as an username, tag, mention or id.
- delete `(name)` - Deletes tag `(name)` if it's owned by you or if you are a moderator.
- dump - Sends a list of all tags.
- edit `(name) (new_body)` - Edits tag `(name)` with a new body, same ownership and attachment rules as `add`.
- list `user` - Lists all of your tags. If `user` is specified, their tags will be listed instead.
- owner `(name)` - Sends the owner of tag `(name)`.
- quota - Sends your quota, affected by `add`, `alias`, `chown`, `delete` and `edit`. If your quota reaches the limit, you will not be able to add any more tags until you free up some space.
- raw `(name)` - Sends the source code of tag `(name)`.
- search `(query)` - Searches the tags list for `(query)`. Matches are approximated, suspicious results are to be expected.

## 3. eval `(script)`
Evaluate specified script. See API section for more information.

Subcommands:
- langs - Sends the list of enabled languages.
- vm2  `(script)` - Eval script with the vm2 backend. See API/vm2 for more information.
- c, cpp, py `(script)` - Eval script with the external vm backend, quite slow.

## 4. perm
Root command for the permission manager. Can be executed by anyone.
For this feature to work properly, set the `owner` field in `config.json`.

Subcommands:
- add `(group_name)` `(user)` - Add `(user)` to `(group_name)`. Can be executed by admin and above. Cannot add yourself to a group with a level higher than your own.
- remove `(group_name)` `(user)` - Remove `(user)` from `(group_name)`. Can be executed by admin and above.
- list - Sends registered permissions. Can be executed by anyone.
- addgroup `(group_name) (level)` - Add `(group_name)` with the specified level.
   Level 1 = Moderator
   Level 2 = Admin
- removegroup `(group_name)` - Removes `(group_name)` from the group list and from the permission list of everyone added to it.
- check `(user)` - Sends permission details for `(user)`. Can be executed by anyone

## 5. oc `-version (EU/t) (duration)`
Calculates overclock EU, duration and tier for the specified parameters.
If `-version` is not specified, the calculator defaults to `ceu`. Allowed versions are:
- ceu
- nomi
- tj

## 6.  reminder
Root command for the reminder manager.

Subcommands:
- add `(date) "message"` - Adds a reminder for the specified date.
- list `user` - Lists all of your reminders. If `user` is specified, their reminders will be listed instead.
- remove `(index)` - Removes reminder at the specified index in your list.
- removeall - Removes all reminders.

# Evaluation API
## 1. `eval` / pure js API
Mirrors the API of Leveret, see https://gist.github.com/NotMyWing/632d738644c17aa71931169af5cb2767. If the output is empty, `Cannot send an empty message.` will be sent instead.

## 2. `vm2` / nodejs API
Allows for more advanced scripts than the pure js API, allowing for async functions and importing internal and external libraries.

**When not using `reply`, script output must be send with `return`.**

### Internal module whitelist:
- assert
- buffer
- crypto
- events
- path
- querystring
- url
- util
- zlib

### External module whitelist:
- canvas.cjs - Customized canvas and webgl implementation
- three - three.js

### Global scope:
- tag - Similar to the `tag` object in pure js.
- msg - Similar to the `msg` object in pure js.
- reply, request, fetchTag, dumpTags, findUsers - Async versions of their pure js counterparts.

### Example:
    %eval vm2 ```js
    return "Amogus";
    ```

# Config
`config/auth.json` must exist and contain the following lines:

    {
        "token": "bot token"
    }

`config/config.json` must have the property `owner` set to your own Discord id.
`config/reactions.json` must contain at least `"enableReacts": false`. If `enableReacts` is set to true, the file must have the following structure:

    {
        "enableReacts": true,
        "parans": {
            "left": [left paranthesis emoji ids],
            "right": [right paranthesis emoji ids]
        },
        "funnyWords": [
            {
                "words": "word" or ["word1", "word2"],
                "react": "emoji" or ["emoji1", "emoji2"]
            },
            ...
        ]
    }

# Startup
If running for the first time run `npm install` and hope isolated-vm decides to actually install without 50 errors (rare occurrence).
To start the bot, navigate to the root directory and run `npm start`. Logs will be printed both to the console and to files in the `logs` folder.

# Importing
To download the tag database from the original bot run `%eval JSON.stringify(util.dumpTags().map(x => util.fetchTag(x)))` and download the resulting file. To import these tags, navigate to the root directory and run `node ./database/importer/importer.js -i path-to-tags`.

To delete all imported tags run `node ./database/importer/importer.js --p1`.

```txt
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀ 
⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀ 
⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀ 
⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀ 
⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀ 
⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀ 
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ 
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ 
⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀ 
⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀ 
⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
```