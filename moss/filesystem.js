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
    ]),
    new Folder("Programs", [
        new File("test.js", "Terminal.print(\"Hello World!\");"),
        new File("prompt_time.js", "prompt = `\"|rGrey|\" + new Date().getHours() + \":\" + new Date().getMinutes() + \" \" + CurrentWorkingDirectory.printPath() + \"> |rWhite|\"`"),
    ]),
    new File("|rGrey|Puzzle.txt", "Congrats! You solved the puzzle!"),
    new File("README.txt", "|rYellow|Remember that this is a work in progress, and that it is not finished yet.\nIf you find any bugs, please report them to me on the GitHub page. Thanks!"),
]);
