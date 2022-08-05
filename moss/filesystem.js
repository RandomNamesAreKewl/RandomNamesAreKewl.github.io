export class File {
    constructor(name, content, parent = null) {
        this.name = name;
        this.content = content;
        this.parent = parent;
        this.type = "file";
    }

    printPath() {
        if(this.parent == null) {
            return this.name;
        } else {
            return this.parent.printPath() + "/" + this.name;
        }
    }
}

export class CodeFile extends File {
    constructor(name, content, parent = null) {
        super(name, content, parent);
        this.type = "code";
    }
}

export class Folder extends File {
    constructor(name, files = [], parent = null) {
        super(name, null, parent)
        this.files = files;
        files.forEach(file => {
            file.parent = this;
        });
        this.type = "directory";
    }

    getFilePath(path) {
        var path_parts = path.split("/");
        var current_dir = this;
        for(var i = 0; i < path_parts.length; i++) {
            var file = current_dir.files.find(file => file.name == path_parts[i]);
            if(path_parts[i] == "..") {
                if(current_dir.parent != null) {
                    current_dir = current_dir.parent;
                } else {
                    return undefined;
                }
            } else if(file == undefined) {
                return undefined;
            } else {
                if(file.type == "directory") {
                    current_dir = file;
                } else {
                    return file;
                }
            }
        }
        return current_dir;
    }
}

export class Drive extends Folder {
    constructor(name, files = []) {
        super(name + ":", files);
    }
}

export var Filesystem = new Drive("c", [
    new Folder("system", [
        new Folder("commands", [
            new CodeFile("echo.exe", (Terminal, args) => {
                Terminal.print(args.join(" ") + "\n");
            }),
            new CodeFile("cd.exe", (Terminal, args) => {
                Terminal.change_dir(args.join(" "));
            }),
            new CodeFile("dir.exe", (Terminal, args) => {
                Terminal.get_current_dir().files.filter(file => file.type == "directory").forEach(file => {
                    Terminal.print("dir  - " + file.name + "\n", "grey");
                })
                Terminal.get_current_dir().files.filter(file => (file.type == "file" || file.type == "code")).forEach(file => {
                    Terminal.print("file - " + file.name + "\n", "grey");
                })
            }),
            new CodeFile("type.exe", (Terminal, args) => {
                var file = Terminal.get_current_dir().getFilePath(args.join(" "));
                if(file == undefined) {
                    Terminal.print("No such file or directory\n", "red", "black");
                } else {
                    Terminal.print(file.content + "\n", "grey");
                }
            }),
            new CodeFile("cls.exe", (Terminal, args) => {
                Terminal.clear_screen();
            }),
            new CodeFile("help.exe", (Terminal, args) => {
                if(args.length < 1) {
                    Terminal.print("help <topic> - displays help for <topic>\ntopics:\n", "grey");
                    Terminal.get_drive("c").getFilePath("system/help").files.filter(file => file.type == "file").forEach(file => {
                        Terminal.print("- " + file.name.slice(0, -4) + "\n", "grey");
                    })
                } else {
                    var file = Terminal.get_drive("c").getFilePath("system/help/" + args.join(" ") + ".txt");
                    if(file == undefined) {
                        Terminal.print("No such file or directory\n", "red", "black");
                    } else {
                        // Grey is more readable than white
                        Terminal.print(file.content + "\n", "grey");
                    }
                }
            })
        ]),
        new Folder("help", [
            new File("moss.txt", "moss is the os of the future. if you think using a crt outdated, you're wrong.\nmoss is designed for 80x25 character displays so things may display incorrectly if you use another size."),
        ]),
        new CodeFile("shell.exe", (Terminal, CurrentWorkingDirectory) => {
            Terminal.print("welcome to ", "grey");
            Terminal.print("moss", "darkgreen");
            Terminal.print(" 2.0\n", "grey");
            Terminal.print("type \"help\" for a list of topics.\n", "grey");
            function shell() {
                Terminal.get_userinput("\n" + Terminal.get_current_dir().printPath() + "> ").then(input => {
                    var args = input.split(" ");
                    var command = args.shift();
                    if(Filesystem.getFilePath("system/commands/" + command + ".exe") !== undefined) {
                        Filesystem.getFilePath("system/commands/" + command + ".exe").content(Terminal, args);
                    } else {
                        Terminal.print(`Error: Command \"${command}\" not found\n`, "red");
                    }
                    shell();
                });
            }
            shell();
        })
    ])
]);
