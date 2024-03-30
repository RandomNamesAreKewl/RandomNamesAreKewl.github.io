var commands = {};
function defineCommand(name, callback) {
    commands[name] = callback;
}
function runCommand(cmd, onFail) {
    var args = cmd.split(" ");
    if (args[0].toLowerCase() in commands) {
        try {
            return commands[args[0].toLowerCase()].apply(commands, args);
        }
        catch (e) {
            if (onFail)
                onFail("js_exception", e.message);
            return Infinity;
        }
    }
    else {
        if (onFail)
            onFail("cmd_not_found");
    }
}
defineCommand("error", function () {
    throw new Error("Behold, an error you've caused.\nAlarm however, this should not cause.\n\nYour discovery must be applauded.\nA test message written late in the night.\n\nA method weaved without mallice.\nYet an error it brings fourth.\n\n(I spent too long coming up with this :/)");
    return 0;
});
