import { Terminal, SplashTexts } from './util.js';


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
    echo: "Type |rGrey|echo <text>|rWhite| to print <text> to the terminal."
}
