function write(s, color) {
    var text = s.split("\n");
    text.forEach(function (line, index) {
        if (line.length > 0) {
            var span = document.createElement("span");
            span.textContent = line;
            if (color)
                span.className = color;
            document.body.appendChild(span);
        }
        if (index < text.length - 1)
            document.body.appendChild(document.createElement("br"));
    });
}
var filesystem = new VirtualDirectory("");
filesystem.addFile(new VirtualDirectory("projects"));
filesystem.getPath("projects").addFile(new FilesystemNode("Windows98MinesweeperRecreation", function () {
    location.assign("projects/minesweeper");
}, { Type: "file", Executable: true }));
// filesystem.getPath("projects").addFile(new FilesystemNode("MOSS2.0", () => {}, {Type: "file", Executable: true}));
filesystem.getPath("projects").addFile(new FilesystemNode("MOSS", function () {
    location.assign("projects/moss1.0");
}, { Type: "file", Executable: true }));
filesystem.getPath("projects").addFile(new FilesystemNode("Dodge", function () {
    location.assign("projects/dodge");
}, { Type: "file", Executable: true }));
filesystem.getPath("projects").addFile(new FilesystemNode("DeltaSymbols", function () {
    location.assign("projects/deltasymbols");
}, { Type: "file", Executable: true }));
var currentWorkingDirectory = filesystem;
function pushPrompt() {
    write("\n[user@randomnamesarekewl.github.io ", "green");
    write(currentWorkingDirectory.getAbsPath());
    write("]$ ", "green");
    if (document.querySelector("#cmdinput"))
        document.body.removeChild(document.querySelector("#cmdinput"));
    var input = document.body.appendChild(document.createElement("input"));
    input.id = "cmdinput";
    input.focus();
    document.onclick = function (_) { return input.focus(); };
    input.onkeydown = function (e) {
        var _a;
        if (e.key == "Enter") {
            write("".concat(input.value, "\n"));
            if (input.value[0] == "." && input.value[1] == "/") {
                var args = input.value.split(" ");
                (_a = currentWorkingDirectory.getPath(args[0])).value.apply(_a, args);
                pushPrompt();
                return;
            }
            var returnCode = runCommand(input.value, function (Reason, AdditionContext) {
                switch (Reason) {
                    case "cmd_not_found":
                        write("Could not find command\n", "red");
                        break;
                    case "js_exception":
                        write(AdditionContext + "\n", "red");
                        break;
                }
                write("Error: ".concat(Reason, "\n"), "red");
            });
            if (returnCode != 0)
                write("[Exited with code ".concat(returnCode, "]\n"), (returnCode == 0) ? "gray" : "red");
            pushPrompt();
        }
    };
}
document.addEventListener("DOMContentLoaded", function () {
    write("|-----------------------------------------------------------------|\n");
    write("| Welcome to my website (randomnamesarekewl.github.com)           |\n");
    write("| TIPS:                                                           |\n");
    write("|  - If you don't know how to use a terminal, type \"help basics\". |\n");
    write("|  - There are fun little easter eggs                             |\n");
    write("|  - I don't know if mobile works with this site. (Sorry)         |\n");
    write("|-----------------------------------------------------------------|\n");
    pushPrompt();
});
defineCommand("clear", function () {
    while (document.body.firstChild)
        document.body.removeChild(document.body.firstChild);
    return 0;
});
defineCommand("ls", function () {
    var folders = currentWorkingDirectory.queryNodes("folder");
    var files = currentWorkingDirectory.queryNodes("file");
    folders.forEach(function (folder) {
        write(folder + "\n", "cyan");
    });
    files.forEach(function (file) {
        write(file + "\n", "lime");
    });
    return 0;
});
defineCommand("cd", function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length != 2) {
        write("cd <path>\n", "red");
        return -1;
    }
    var newCWD = currentWorkingDirectory.getPath(args[1]);
    if (newCWD.flags.Type == "file") {
        write("Cannot change directory into file.", "red");
        return 1;
    }
    currentWorkingDirectory = newCWD;
    return 0;
});
defineCommand("help", function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length != 2 || !(args[1] in helpTopics)) {
        write("Help topics:\n", "gray");
        write(" - basics\n", "gray");
        write(" - commands\n", "gray");
        write("\n", "gray");
        write("Every command has it's own help topic\n", "gray");
    }
    else {
        write(helpTopics[args[1]] + "\n", "gray");
    }
    return 0;
});
var helpTopics = {
    "basics": "|---------------------|\n| Command line basics |\n| - Type commands     |\n| - Stuff happens     |\n|                     |\n| TODO:               |\n| Write a better help |\n| article for basics  |\n|---------------------|",
    "commands": "help\nclear",
    "help": "help <topic?>\nProvides help for a given topics. If a valid topic is not given, a list of valid topics will be given.",
    "clear": "clear\nClears the terminal."
};
