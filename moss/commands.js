import { Terminal, SplashTexts } from './util.js';
import { Filesystem } from './filesystem.js';


export var CurrentWorkingDirectory = Filesystem;
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
            if(args[0] == "..") {
                if(CurrentWorkingDirectory.parent != null) {
                    CurrentWorkingDirectory = CurrentWorkingDirectory.parent;
                } else {
                    Terminal.print("|rRed|Error: Already at root");
                }
                return;
            }
            var new_dir = CurrentWorkingDirectory.files.find(file => file.name == args[0]);
            if(new_dir == undefined) {
                Terminal.print(`|rRed|Error: Directory \"${args[0]}|rRed|\" not found`);
            } else {
                if(new_dir.type == "directory") {
                    CurrentWorkingDirectory = new_dir;
                } else {
                    Terminal.print(`|rRed|Error: \"${args[0]}|rRed|\" is not a directory`);
                }
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
}
