import { Terminal } from './util.js';
import { Buffer, Character, Colors } from './video.js';


const view = document.getElementById("view");
const ctx = view.getContext("2d");
view.width = 8 * 80 + 24;
view.height = 12 * 50 + 24;
const font = document.createElement("canvas");
const fontctx = font.getContext("2d");
font.width = 96;
font.height = 144;
const font_key = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\",./<>?`~\\| █";
const default_font = new Image();
default_font.src = "font.png";
default_font.onload = () => {
    fontctx.drawImage(default_font, 0, 0);
}
function Update() {
    ctx.clearRect(0, 0, view.width, view.height);
    for(var i=0; i<Buffer.length; i++) {
        for(var j=0; j<Buffer[i].length; j++) {
            ctx.fillStyle = Colors[Buffer[i][j].bg];
            ctx.fillRect(12 + j * 8, 12 + i * 12, 8, 12);
            ctx.fillStyle = Buffer[i][j].fg;
            for(var k=0; k<font_key.length; k++) {
                if(Buffer[i][j].char == font_key[k]) {
                    ctx.drawImage(font, (k % 12) * 8, Math.floor(k / 12) * 12, 8, 12, 12 + j * 8, 12 + i * 12, 8, 12);
                    break;
                }
            }
        }
    }
    requestAnimationFrame(Update);
}
Update();
if(Terminal.get_drive("c").getFilePath("system/shell.exe") != undefined) {
    Terminal.get_drive("c").getFilePath("system/shell.exe").content(Terminal);
} else {
    Terminal.print("error: could not find c:/system/shell.exe");
}
