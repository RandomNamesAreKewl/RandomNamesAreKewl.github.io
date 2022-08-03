export const Terminal = {
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
    ],
    color_string: function(text) {
        let bits = text.split("|");
        let fgColor = "White";
        let bgColor = "Black";
        let result = [];
        for(var i=0; i<bits.length; i++) {
            if (i % 2 == 1) {
                if (Terminal.colors.includes(bits[i].slice(1).toLowerCase()) && i < bits.length - 1) {
                    switch(bits[i][0]) {
                        case "f":
                            fgColor = bits[i].slice(1).toLowerCase();
                            break;
                        case "b":
                            bgColor = bits[i].slice(1).toLowerCase();
                            break;
                        case "r":
                            fgColor = bits[i].slice(1).toLowerCase();
                            bgColor = "Black";
                            break;
                        case "!":
                            fgColor = bgColor.toLowerCase(); // Force a deep copy. Can be used as color names are all lowercase.
                            bgColor = bits[i].slice(1).toLowerCase();
                            break;
                    }
                } else {
                    let temp = document.createElement("span");
                    temp.classList.add("fg" + Terminal.colors.indexOf(fgColor));
                    temp.classList.add("bg" + Terminal.colors.indexOf(bgColor));
                    temp.innerText = "|" + bits[i];
                    if (i < bits.length - 1) {
                        temp.innerText += "|";
                    }
                    result.push(temp);
                }
            } else {
                let temp = document.createElement("span");
                temp.classList.add("fg" + Terminal.colors.indexOf(fgColor));
                temp.classList.add("bg" + Terminal.colors.indexOf(bgColor));
                temp.innerText = bits[i];
                result.push(temp);
            }
        }
        return result;
    },
    print: (text, nonewline = false) => {
        let colored = Terminal.color_string(text);
        for (let i=0; i<colored.length; i++) {
            document.getElementById("text").appendChild(colored[i]);
        }
        if (!nonewline) {
            document.getElementById("text").appendChild(document.createElement("br"));
        }
    },
    add_newline: () => {
        document.getElementById("text").appendChild(document.createElement("br"));
    }
};

export const SplashTexts = [
    "Welcome to Moss!",
    "Don't steal features from Minecraft. Oh wait...",
    "Moss is a work in progress.",
    "Moss is a nutritional supplement.",
    "Moss is a type of fungus.",
    "hi.",
    "|rDarkGreen|Moss",
    "|rDarkGreen|Moss|rYellow| is a |rGreen|green|rYellow| color.",
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
    "Fun fact: there are 33 splash texts.",
    "Thank you extremjaws for telling me that I can't spell aesthetics. I'm not salty at all."
];