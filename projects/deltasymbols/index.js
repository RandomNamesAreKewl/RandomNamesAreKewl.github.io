var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var sentence = document.querySelector("#sentence");
function redraw() {
    var lineWidth = parseFloat(document.querySelector("#line-width-setting").value);
    var rings = parseInt(document.querySelector("#rings-setting").value);
    var verts = parseInt(document.querySelector("#verts-setting").value);
    ctx.lineWidth = lineWidth;
    var size = Math.ceil(Math.sqrt(sentence.value.split(" ").length)) * ctx.lineWidth * rings * 6;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = document.querySelector("#color-setting").value;
    ctx.lineWidth = lineWidth;
    drawString(ctx.lineWidth * rings * 3, ctx.lineWidth * rings * 3, sentence.value, rings, verts);
}
sentence.addEventListener("keyup", redraw);
function drawString(x, y, str, rings, verts) {
    if (rings === void 0) { rings = 4; }
    if (verts === void 0) { verts = 6; }
    var words = str.split(" ");
    var ox = 0;
    var oy = 0;
    var wrap = Math.floor(Math.sqrt(words.length) * ctx.lineWidth * rings * 6);
    words.forEach(function (word) {
        drawCharacter(x + ox, y + oy, word, rings, verts);
        ox += ctx.lineWidth * rings * 6;
        if (ox >= wrap) {
            ox = 0;
            oy += ctx.lineWidth * rings * 6;
        }
    });
}
function drawCharacter(x, y, word, rings, verts) {
    if (rings === void 0) { rings = 4; }
    if (verts === void 0) { verts = 6; }
    var hash = strHash(word.toLowerCase());
    var rand = splitmix32(hash);
    var amount = 360 / verts;
    for (var i = 0; i < rings; i++) {
        ctx.beginPath();
        var cur_ring = (ctx.lineWidth * 2.5) * i + (ctx.lineWidth * 3);
        var last_ring = cur_ring - ctx.lineWidth * 2.5;
        ctx.moveTo(x, y - cur_ring);
        for (var j = 0; j < verts; j++) {
            var angle = deg2rad((j + 1) * amount);
            var next_x = x - Math.sin(angle) * cur_ring;
            var next_y = y - Math.cos(angle) * cur_ring;
            if (rand() <= 0.75) {
                ctx.lineTo(next_x, next_y);
            }
            else {
                ctx.moveTo(next_x, next_y);
            }
        }
        for (var j = 0; j < verts; j++) {
            var angle = deg2rad((j + 1) * amount);
            var from_x = x - Math.sin(angle) * last_ring;
            var from_y = y - Math.cos(angle) * last_ring;
            var next_x = x - Math.sin(angle) * cur_ring;
            var next_y = y - Math.cos(angle) * cur_ring;
            ctx.moveTo(from_x, from_y);
            if (rand() <= 0.25) {
                ctx.lineTo(next_x, next_y);
            }
        }
        ctx.stroke();
    }
}
function strHash(str) {
    var hash = 0, i, chr;
    if (str.length === 0)
        return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
function splitmix32(a) {
    return function () {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        var t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    };
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
redraw();
