type FSNodeFlags = {
	Type: "file" | "folder";
	Executable?: boolean;
};

class FilesystemNode {
	name: string;
	value: any;
	flags: FSNodeFlags;
	parent: FilesystemNode;

	constructor(name: string, value: any, flags: FSNodeFlags)
	{
		this.name = name;
		this.value = value;
		this.flags = flags;
	}
}

class VirtualDirectory extends FilesystemNode {
	value: FilesystemNode[];

	constructor(name: string) {
		super(name, [], {
			Type: "folder"
		});
	}

	addFile(node: FilesystemNode) {
		this.value.push(node);
		node.parent = this;
	}

	queryNodes(nodeType: "file" | "folder"): string[] {
		let files: string[] = [];

		this.value.forEach(fsnode => {
			if(fsnode.flags.Type == nodeType) {
				files.push(fsnode.name);
			}
		});

		return files;
	}

	getPath(path: string): FilesystemNode {
		let pathParts: string[] = path.split("/");
		let currentPos: FilesystemNode = this;

		for (let index = 0; index < pathParts.length; index++) {
			const pathPart = pathParts[index];
			if(currentPos.flags.Type == "file")
				throw new Error("Attempted to access file as folder");

			if(pathPart == ".")
				continue;
			if(pathPart == "..") {
				if(currentPos.parent)
					currentPos = currentPos.parent;
				else {
					throw new Error("Attempted to access parent of root directory");
				}
			}

			for (let j = 0; j < currentPos.value.length; j++) {
				const childNode: FilesystemNode = currentPos.value[j];
				if(childNode.name == pathPart) {
					currentPos = childNode;
					break;
				}
			}
		}

		return currentPos;
	}

	getAbsPath(): string {
		if(!this.parent)
			return "/";
		let absPath = "";
		let elements: string[] = [
			this.name
		];
		let currentPos: FilesystemNode = this;
		while(currentPos.parent)
		{
			currentPos = currentPos.parent;
			elements.push(currentPos.name);
		}

		elements.reverse().forEach(element => {
			if(element.length > 0)
				absPath += "/" + element;
		});

		return absPath;
	}
}
