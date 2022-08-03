import { Terminal, SplashTexts } from './util.js';
import { Filesystem } from './filesystem.js';


export var CurrentWorkingDirectory = Filesystem;
export var Drives = [Filesystem];
export var prompt = `"|rGrey|" + CurrentWorkingDirectory.printPath() + "> |rWhite|"`;
// Define commands here
export const Commands = {
    help: (...args) => {
        if(args.length == 0) {
            Terminal.print("Help topics:");
            for(var i in help_topics) {
                Terminal.print("    " + i);
            }
        } else {
            if(args[0] in help_topics) {
                if(typeof help_topics[args[0]] == "string") {
                    Terminal.print(help_topics[args[0]]);
                } else if(typeof help_topics[args[0]] == "function") {
                    help_topics[args[0]]();
                }
            } else {
                Terminal.print(`|rRed|Error: Help topic \"${args[0]}|rRed|\" not found`);
            }
        }
    },
    clear: (...args) => {
        document.getElementById("text").innerHTML = "";
    },
    echo: (...args) => {
        Terminal.print(args.join(" "));
    },
    splash: (...args) => {
        if(args.length < 1) {
            Terminal.print("|rYellow|" + SplashTexts[Math.floor(Math.random() * SplashTexts.length)]);
        } else {
            if(args[0] == "*") {
                for(var i=0; i<SplashTexts.length; i++) {
                    Terminal.print("|rYellow|" + SplashTexts[i]);
                }
            } else {
                for(var i=0; i<args[0]; i++) {
                    Terminal.print("|rYellow|" + SplashTexts[Math.floor(Math.random() * SplashTexts.length)]);
                }
            }
        }
    },
    dir: (...args) => {
        CurrentWorkingDirectory.files.forEach(file => {
            Terminal.print(file.name);
        });
    },
    cd: (...args) => {
        if(args.length < 1) {
            Terminal.print("|rRed|Error: No directory specified");
        } else {
            let dir = CurrentWorkingDirectory.getFilePath(args.join(" "));
            if(dir == null) {
                Terminal.print(`|rRed|Error: Directory \"${args[0]}|rRed|\" not found`);
            } else if(dir.type != "directory") {
                Terminal.print(`|rRed|Error: \"${args[0]}|rRed|\" is not a directory`);
            } else {
                CurrentWorkingDirectory = dir;
            }
        }
    },
    cat: (...args) => {
        if(args.length < 1) {
            Terminal.print("|rRed|Error: No file specified");
        } else {
            var file = CurrentWorkingDirectory.files.find(file => file.name == args[0]);
            if(file == undefined) {
                Terminal.print(`|rRed|Error: File \"${args[0]}|rRed|\" not found`);
            } else {
                Terminal.print(file.content);
            }
        }
    },
    prompt: (...args) => {
        if(args.length < 1) {
            prompt = `"|rGrey|" + CurrentWorkingDirectory.printPath() + "> |rWhite|"`;
        } else {
            prompt = args.join(" ");
        }
    },
    run: (...args) => {
        if(args.length < 1) {
            Terminal.print("|rRed|Error: No file specified");
        } else {
            var file = CurrentWorkingDirectory.getFilePath(args.join(" "));
            if(file == undefined) {
                Terminal.print(`|rRed|Error: File \"${args[0]}|rRed|\" not found`);
            } else {
                if(file.type == "file") {
                    eval(file.content);
                } else {
                    Terminal.print(`|rRed|Error: \"${args[0]}|rRed|\" is not a file`);
                }
            }
        }
    }
};

const help_topics = {
    commands: () => {
        Terminal.print("Commands:");
        for(var i in Commands) {
            Terminal.print("    " + i);
        }
    },
    help: "Type |rGrey|help|rWhite| to get a list of help topics. Type |rGrey|help <topic>|rWhite| to get help on a specific topic.",
    clear: "Type |rGrey|clear|rWhite| to clear the terminal.",
    echo: "Type |rGrey|echo <text>|rWhite| to print <text> to the terminal.",
    splash: "Type |rGrey|splash|rWhite| to print a random splash text to the terminal. Type |rGrey|splash <number>|rWhite| to print <number> random splash texts to the terminal. Type |rGrey|splash *|rWhite| to print all splash texts to the terminal.",
    dir: "Type |rGrey|dir|rWhite| to list the files in the current directory.",
    cat: "Type |rGrey|cat <file>|rWhite| to print the contents of <file> to the terminal.",
    prompt: "Type |rGrey|prompt|rWhite| to reset the prompt to the default. Type |rGrey|prompt <js>|rWhite| to set the prompt to <js>.",
}
export var CurrentProgram = null;

function Brick() {
    CurrentProgram = "brick";
    Commands.clear();
    document.getElementById("input").disabled = true;
    prompt = "\"Press any key to continue\"";
    document.getElementById("view").style.backgroundColor = "#000099";
    Terminal.print("A fatal exception has occurred at 0xFF2342CD in MOSS");
    Terminal.print("If this is the first time you've seen this error screen, restart your computer.\n");
    Terminal.print("If this screen appears again, follow these steps:");
    Terminal.print("-Check to make sure any new hardware or software is properly installed.");
    Terminal.print("-If this is a new installation, ask your hardware or software manufacturer for any MOSS updates you might need.");
    Terminal.print("-If problems continue, disable or remove any newly installed hardware or software.");
    Terminal.print("-Disable BIOS memory options such as caching or shadowing.");
    Terminal.print("-If you don't know how to disable your BIOS memory caching or shadowing options.\n god help you.");
    Terminal.print("If the problem continues, give this code to your system administrator: 0xCD42FF23");
    Terminal.print("The current application will be terminated\n");
    setTimeout(() => {
        document.addEventListener("keyup", () => {
            Commands.clear();
            document.getElementById("view").style.backgroundColor = "#00000000";
            document.getElementById("vinput").innerHTML = "";
            setTimeout(() => {
                location.reload();
            }, 3000);
        });
    }, 100)
}
