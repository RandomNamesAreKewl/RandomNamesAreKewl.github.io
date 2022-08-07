import { Buffer, Character } from './video.js';
import { Filesystem } from './filesystem.js';

export var cursor_pos = [0, 0];
export const Terminal = {
    // Deprecated
    colors: [
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "magenta",
        "cyan",
        "white",
        "darkred",
        "darkgreen",
        "darkyellow",
        "darkblue",
        "darkmagenta",
        "darkcyan",
        "grey",
        "blink", // Special color. Blinking text. Not a real color.
    ],
    print: (text, fg = "white", bg = "black") => {
        for(var i = 0; i < text.length; i++) {
            if(text[i] == "\n") {
                cursor_pos[0]++;
                cursor_pos[1] = 0;
            } else {
                if(cursor_pos[1] >= Buffer[0].length) {
                    cursor_pos[0]++;
                    cursor_pos[1] = 0;
                }
                Buffer[cursor_pos[0]][cursor_pos[1]] = new Character(text[i], fg, bg);
                cursor_pos[1]++;
            }
        }
    },
    get_userinput: (prompt = "> ", fg = "white", bg = "black") => {
        Terminal.print(prompt, fg, bg);
        Buffer[cursor_pos[0]][cursor_pos[1]] = new Character("█", fg, bg);
        return new Promise((resolve, reject) => {
            var input = "";
            function keydown(e) {
                if(e.key === "Enter") {
                    document.removeEventListener("keydown", keydown);
                    Buffer[cursor_pos[0]][cursor_pos[1]] = new Character(" ", fg, bg);
                    Terminal.print("\n", fg, bg);
                    resolve(input);
                } else if(e.key === "Backspace") {
                    if(input.length > 0) {
                        Buffer[cursor_pos[0]][cursor_pos[1]] = new Character(" ", fg, bg);
                        input = input.slice(0, -1);
                        cursor_pos[1]--;
                        Buffer[cursor_pos[0]][cursor_pos[1]] = new Character("█", fg, bg);
                    }
                }
                if(e.key.length == 1) {
                    input += e.key.toLowerCase();
                    Terminal.print(e.key.toLowerCase(), fg, bg);
                    Buffer[cursor_pos[0]][cursor_pos[1]] = new Character("█", fg, bg);
                }
            }
            document.addEventListener("keydown", keydown);
        });
    },
    change_dir: (path) => {
        var new_path = CurrentWorkingDirectory.getFilePath(path);
        if(new_path == undefined) {
            Terminal.print("No such file or directory\n", "red", "black");
        } else {
            CurrentWorkingDirectory = new_path;
        }
    },
    get_current_dir: () => {
        return CurrentWorkingDirectory;
    },
    get_drive: (letter) => {
        return Drives.find(drive => drive.name == letter + ":");
    },
    clear_screen: () => {
        for(var i = 0; i < Buffer.length; i++) {
            for(var j = 0; j < Buffer[i].length; j++) {
                Buffer[i][j] = new Character(" ", "white", "black");
            }
        }
        cursor_pos = [0, 0];
    },
    display_mode: "text"
};

var CurrentWorkingDirectory = Filesystem;
var Drives = [Filesystem];

// Might make these work with the new Terminal.print() function later
export const RemovedSplashTexts = [
    "|rDarkGreen|Moss",
    "|rDarkGreen|Moss|rYellow| is a |rGreen|green|rYellow| color.",
    "|rBlink|Time to blink!"
];

export const SplashTexts = [
    "Welcome to Moss!",
    "Don't steal features from Minecraft. Oh wait...",
    "Moss is a work in progress.",
    "Moss is a nutritional supplement.",
    "Moss is a type of fungus.",
    "hi.",
    "Thinking about cheese...",
    "Did you know BSP stands for Binary Space Partitioning?",
    "Did you know that the first game to use BSP was DOOM?",
    "Did you know that there are 3 did you know's in this list?",
    "Everything seems to be in order.",
    "Half-Lit 3 comes out in XXXX",
    "Did you know that I'm the creator of Moss? Also that I'm writing this at 7:44 PM?",
    "\"You're old and wrong.\" - Not me",
    "I'm not a fan of the color red.",
    "I like blue. It just looks nice.",
    "Some people think that Half-Lit: Source is worse than Half-Lit 1. I disagree.",
    "How many splash texts are there? Wasn't counting.",
    "Github exists.",
    "I don't know what to put here. So imagine something very inspiring is here.",
    "I spent over half an hour on making the aesthetics alone.",
    "Cats are cute.",
    "Tomatos are edible.",
    "How have I not run out of ideas yet? I have no idea.",
    "I'm running out of ideas.",
    "I need to stop writing these.",
    "I need to make an idea generator.",
    "I need to finish a game someday.",
    "Ok I ran out of ideas. I'll just put a bunch of random words here.",
    "I am a string.",
    "Thank you extremjaws for telling me that I can't spell aesthetics. I'm not salty at all.",
    "MOSS is definitely not a ripoff of Minecraft. Seriously, it's not even in the same genre.",
    "I used Visual Studio Code to make this.",
    "I hope you enjoy Moss.",
    "I only added splash texts because I was bored.",
    "Splash texts are fun.",
    "DO A BARREL ROLL!",
    "This is the only splash text that\nis split into multiple lines.",
    "I'm not sure if I should add more splash texts.",
    "If you have any ideas for splash texts, please tell me.",
    "Team Building 2 is not a sequel to TB Classic?",
    "I dare you to count the number of splash texts.",
    "\"I'm not sure if I should add more splash texts.\" - Me",
    "\"Prepare for unforeseen consequences.\" - G-Guy",
    "\"Quotes are a fun splash text to add.\" - Me",
    "Rembember to like and subscribe! Also, hit the bell icon! If this is a YouTube video, that is.\nIf it's not, then I'm sorry.",
    "\"The true citizen conserves valuable oxygen\" - Consul",
    "I'm not going to fin",
    "I'm going to finish this splash text",
    "I wrote this in my free time.",
    "Alt+F4 for free cookies!",
    "You'roue",
    "Don't program a minecraft clone at 3 AM (SCARY)(POLICE CALLED)!"
];
