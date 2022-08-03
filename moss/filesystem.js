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
        this.type = "folder";
    }
}

export class Drive extends Folder {
    constructor(name, files = []) {
        super(name + ":", files);
    }
}

export var Filesystem = new Drive("C", [
    new Folder("Homework", [
        new Folder("Math", [
            new Folder("Algebra", [
                new File("Homework1.txt", "1. 2x + 3 = 5\n2. 3x - 2 = 7\n3. 4x + 5 = 9"),
                new File("Not_a_viris.exe", "pretend there's super bad code in here"),
            ]),
            new Folder("Geometry", [
                new File("Homework1.txt", "Cube"),
                new File("Homework2.txt", "Cone"),
                new File("Homework3.txt", "Sphere"),
            ]),
        ]),
        new Folder("English", [
            new File("Homework1.txt", "Write a story about a dog"),
            new File("Homework2.txt", "Write a story about a cat"),
            new File("Homework3.txt", "Write a story about a bird"),
            new File("Homework4.txt", "Have Github Copilot create the contents of this folder"),
        ])
    ]),
    new File("README.txt", "Thank you for reading me!")
]);
