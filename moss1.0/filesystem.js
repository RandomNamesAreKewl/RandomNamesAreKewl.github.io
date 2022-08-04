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

export var Filesystem = new Drive("C", [
    new Folder("System", [
        new Folder("Cache", [
            new File("Cache2fcb", "2231844322"),
            new File("Cache12fb", "2231123422"),
            new File("Cache1950", "Commands.clear();\nvar ap = document.createElement(\"img\");\nap.src = \"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Aperture_Science.svg/1200px-Aperture_Science.svg.png\";\nap.width = 128;\ndocument.getElementById(\"text\").appendChild(ap);\nTerminal.add_newline();\nTerminal.print(\"The cake is a lie\");")
        ]),
        new Folder("Test", [
            new File("Colors.exe", "var colors = [\"Black\", \"Red\", \"Green\", \"Yellow\", \"Blue\", \"Magenta\", \"Cyan\", \"White\", \"DarkRed\", \"DarkGreen\", \"DarkYellow\", \"DarkBlue\", \"DarkMagenta\", \"DarkCyan\", \"Grey\", \"Blink\"];\nfor(var i=0; i<colors.length; i++) {\n    for(var j=0; j<colors.length; j++) {\n        Terminal.print(\"|f\" + colors[i] + \"||b\" + colors[j] + \"|\" + colors[i] + \", \" + colors[j]);\n    }\n}"),
            new File("3DAccel.exe", "Brick();")
        ])
    ]),
    new Folder("Programs", [
        new File("test.exe", "Terminal.print(\"Hello World!\");"),
        new File("prompt_time.exe", "prompt = `\"|rGrey|\" + new Date().getHours() + \":\" + new Date().getMinutes() + \" \" + CurrentWorkingDirectory.printPath() + \"> |rWhite|\"`"),
    ]),
    new File("|rGrey|Puzzle.txt", "Congrats! You solved the puzzle!"),
    new File("README.txt", "|rYellow|Remember that this is a work in progress, and that it is not finished yet.\nIf you find any bugs, please report them to me on the GitHub page. Thanks!"),
]);
