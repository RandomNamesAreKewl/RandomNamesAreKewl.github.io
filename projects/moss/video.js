export class Character {
    constructor(char, fg, bg) {
        this.char = char.toLowerCase();
        this.fg = fg;
        this.bg = bg;
    }
}

export const Colors = {
    black:      "#00000000",
    red:        "#FF0000FF",
    green:      "#00FF00FF",
    yellow:     "#FFFF00FF",
    blue:       "#0000FFFF",
    magenta:    "#FF00FFFF",
    cyan:       "#00FFFFFF",
    white:      "#FFFFFFFF",
    darkred:    "#7F0000FF",
    darkgreen:  "#007F00FF",
    darkyellow: "#7F7F00FF",
    darkblue:   "#00007FFF",
    darkmagenta:"#7F007FFF",
    darkcyan:   "#007F7FFF",
    grey:       "#7F7F7FFF",
    blink:      "#FFFFFFFF", // TODO: Blinking text
}

export var Buffer = [];
for(var i = 0; i < 50; i++) {
    Buffer.push(new Array(80).fill(new Character(" ", "white", "black")));
}
