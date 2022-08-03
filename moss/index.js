import { Terminal, SplashTexts } from './util.js';
import { Commands } from './commands.js';


document.getElementById("input").focus();
const vinput = document.getElementById("vinput");
function Tick() {
    // clear vinput children
    while (vinput.firstChild) {
        vinput.removeChild(vinput.firstChild);
    }
    // update vinput
    let colored = Terminal.color_string("|rGrey|:> |rWhite|" + document.getElementById("input").value);
    for (let i=0; i<colored.length; i++) {
        vinput.appendChild(colored[i]);
    }
    requestAnimationFrame(Tick);
}
Tick();
Terminal.print("|rGrey|Welcome to |rDarkGreen|Moss|rGrey|!");
Terminal.print("|rGrey|Type |rWhite|help|rGrey| for a list of help topics.");
Terminal.print("|rYellow|" + SplashTexts[Math.floor(Math.random() * SplashTexts.length)]);
Terminal.add_newline();

document.addEventListener("click", _ => {
    document.getElementById("input").focus();
});
document.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        Terminal.print("|rGrey|:> |rWhite|" + document.getElementById("input").value);
        // TODO: use a deticated argument separator
        //       Instead of using the built in split function
        var args = document.getElementById("input").value.split(" ");
        if (args[0].toLowerCase() in Commands) {
            Commands[args[0].toLowerCase()](...args.slice(1));
        } else {
            Terminal.print(`|rRed|Error: Command \"${args[0]}|rRed|\" not found`);
        }
        document.getElementById("input").value = "";
    }
});
