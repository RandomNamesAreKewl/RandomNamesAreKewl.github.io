import { Terminal, SplashTexts } from './util.js';
import { Commands, CurrentWorkingDirectory, prompt, CurrentProgram } from './commands.js';


document.getElementById("input").focus();
const vinput = document.getElementById("vinput");
function Tick() {
    requestAnimationFrame(Tick);
}
// Startup delay of 0.3 seconds
// For aesthetic purposes
setTimeout(() => {
    Tick();
    Terminal.print("|rGrey|Welcome to |rDarkGreen|Moss|rGrey|!");
    Terminal.print("|rGrey|Type |rWhite|help|rGrey| for a list of help topics.");
    Terminal.print("|rYellow|" + SplashTexts[Math.floor(Math.random() * SplashTexts.length)]);
    Terminal.add_newline();
    let colored = Terminal.color_string(eval(prompt) + document.getElementById("input").value);
    for (let i=0; i<colored.length; i++) {
        vinput.appendChild(colored[i]);
    }
}, 300);

document.addEventListener("click", _ => {
    document.getElementById("input").focus();
});
document.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        if(CurrentProgram == null) {
            Terminal.print(eval(prompt) + document.getElementById("input").value);
            // TODO: use a deticated argument separator
            //       Instead of using the built in split function
            var args = document.getElementById("input").value.split(" ");
            if (args[0].toLowerCase() in Commands) {
                Commands[args[0].toLowerCase()](...args.slice(1));
            } else {
                Terminal.print(`|rRed|Error: Command \"${args[0]}|rRed|\" not found`);
            }
            document.getElementById("input").value = "";
            Terminal.add_newline();
        }
    }
    // Janky solution for updating the vinput AFTER the character has been typed
    setTimeout(() => {
        while (vinput.firstChild) {
            vinput.removeChild(vinput.firstChild);
        }
        let colored = Terminal.color_string(eval(prompt) + document.getElementById("input").value);
        for (let i=0; i<colored.length; i++) {
            vinput.appendChild(colored[i]);
        }
    }, 1);
});
