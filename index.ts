function write(s: string, color?: string)
{
	let text = s.split("\n");
	text.forEach((line, index) => {
		if(line.length > 0)
		{
			let span = document.createElement("span");
			span.textContent = line;
			if(color)
				span.className = color;
			document.body.appendChild(span);
		}

		if(index < text.length - 1)
			document.body.appendChild(document.createElement("br"));
	});
}
let filesystem = new VirtualDirectory("");
filesystem.addFile(new VirtualDirectory("projects"));
(filesystem.getPath("projects") as VirtualDirectory).addFile(new FilesystemNode("Windows98MinesweeperRecreation", () => {
	location.assign("projects/minesweeper");
}, {Type: "file", Executable: true}));
// filesystem.getPath("projects").addFile(new FilesystemNode("MOSS2.0", () => {}, {Type: "file", Executable: true}));
(filesystem.getPath("projects") as VirtualDirectory).addFile(new FilesystemNode("MOSS", () => {
	location.assign("projects/moss1.0");
}, {Type: "file", Executable: true}));
(filesystem.getPath("projects") as VirtualDirectory).addFile(new FilesystemNode("Dodge", () => {
	location.assign("projects/dodge");
}, {Type: "file", Executable: true}));
(filesystem.getPath("projects") as VirtualDirectory).addFile(new FilesystemNode("DeltaSymbols", () => {
	location.assign("projects/deltasymbols");
}, {Type: "file", Executable: true}));
let currentWorkingDirectory = filesystem;

function pushPrompt()
{
	write("\n[user@randomnamesarekewl.github.io ", "green");
	write(currentWorkingDirectory.getAbsPath());
	write("]$ ", "green");
	if(document.querySelector("#cmdinput"))
		document.body.removeChild(document.querySelector("#cmdinput"));
	let input = document.body.appendChild(document.createElement("input"));
	input.id = "cmdinput";
	input.focus();
	document.onclick = _ => input.focus();
	input.onkeydown = e => {
		if(e.key == "Enter")
		{
			write(`${input.value}\n`);
			if(input.value[0] == "." && input.value[1] == "/") {
				let args: string[] = input.value.split(" ");
				currentWorkingDirectory.getPath(args[0]).value(... args);
				pushPrompt();
				return;
			}
			let returnCode: number = runCommand(input.value, (Reason: string, AdditionContext?: string) => {
				switch (Reason) {
					case "cmd_not_found":
						write("Could not find command\n", "red");
						break;
					
					case "js_exception":
						write(AdditionContext + "\n", "red");
						break;
				}
				write(`Error: ${Reason}\n`, "red");
			});
			if(returnCode != 0)
				write(`[Exited with code ${returnCode}]\n`, (returnCode == 0)? "gray" : "red");
			pushPrompt();
		}
	};
}

document.addEventListener("DOMContentLoaded", () => {
	write("|-----------------------------------------------------------------|\n");
	write("| Welcome to my website (randomnamesarekewl.github.com)           |\n");
	write("| TIPS:                                                           |\n");
	write("|  - If you don't know how to use a terminal, type \"help basics\". |\n");
	write("|  - There are fun little easter eggs                             |\n");
	write("|  - I don't know if mobile works with this site. (Sorry)         |\n");
	write("|-----------------------------------------------------------------|\n");
	pushPrompt();
});

defineCommand("clear", () => {
	while(document.body.firstChild)
		document.body.removeChild(document.body.firstChild);
	return 0;
});

defineCommand("ls", () => {
	let folders: string[] = currentWorkingDirectory.queryNodes("folder");
	let files: string[] = currentWorkingDirectory.queryNodes("file");

	folders.forEach(folder => {
		write(folder + "\n", "cyan");
	});
	files.forEach(file => {
		write(file + "\n", "lime");
	});
	return 0;
});

defineCommand("cd", (... args: string[]) => {
	if(args.length != 2) {
		write("cd <path>\n", "red");
		return -1;
	}
	let newCWD = currentWorkingDirectory.getPath(args[1]);
	if(newCWD.flags.Type == "file") {
		write("Cannot change directory into file.", "red");
		return 1;
	}
	currentWorkingDirectory = newCWD as VirtualDirectory;
	return 0;
});

defineCommand("help", (... args: string[]) => {
	if(args.length != 2 || !(args[1] in helpTopics)) {
		write("Help topics:\n", "gray");
		write(" - basics\n", "gray");
		write(" - commands\n", "gray");
		write("\n", "gray");
		write("Every command has it's own help topic\n", "gray");
	} else {
		write(helpTopics[args[1]] + "\n", "gray");
	}
	return 0;
});

let helpTopics = {
	"basics":
`|---------------------|
| Command line basics |
| - Type commands     |
| - Stuff happens     |
|                     |
| TODO:               |
| Write a better help |
| article for basics  |
|---------------------|`,
	"commands":
`help
clear`,
	"help":
`help <topic?>
Provides help for a given topics. If a valid topic is not given, a list of valid topics will be given.`,
	"clear":
`clear
Clears the terminal.`
};
