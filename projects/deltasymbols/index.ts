let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
let sentence = document.querySelector("#sentence") as HTMLInputElement;

function redraw()
{
	let lineWidth = parseFloat((document.querySelector("#line-width-setting") as HTMLInputElement).value);
	let rings = parseInt((document.querySelector("#rings-setting") as HTMLInputElement).value);
	let verts = parseInt((document.querySelector("#verts-setting") as HTMLInputElement).value);
	ctx.lineWidth = lineWidth;
	let size = Math.ceil(Math.sqrt(sentence.value.split(" ").length)) * ctx.lineWidth * rings * 6;
	canvas.width = size;
	canvas.height = size;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = (document.querySelector("#color-setting") as HTMLInputElement).value;
	ctx.lineWidth = lineWidth;
	drawString(ctx.lineWidth * rings * 3, ctx.lineWidth * rings * 3, sentence.value, rings, verts);
}
sentence.addEventListener("keyup", redraw);

function drawString(x: number, y: number, str: String, rings=4, verts=6)
{
	let words = str.split(" ");
	let ox = 0;
	let oy = 0;
	let wrap = Math.floor(Math.sqrt(words.length) * ctx.lineWidth * rings * 6);
	words.forEach(word => {
		drawCharacter(x + ox, y + oy, word, rings, verts);
		ox += ctx.lineWidth * rings * 6;
		if(ox >= wrap)
		{
			ox = 0;
			oy += ctx.lineWidth * rings * 6;
		}
	});
}

function drawCharacter(x: number, y: number, word: string, rings=4, verts=6)
{
	let hash = strHash(word.toLowerCase());
	let rand = splitmix32(hash);
	let amount = 360 / verts;
	for(let i = 0; i < rings; i++)
	{
		ctx.beginPath();
		let cur_ring = (ctx.lineWidth * 2.5) * i + (ctx.lineWidth * 3);
		let last_ring = cur_ring - ctx.lineWidth * 2.5;
		ctx.moveTo(x, y - cur_ring);
		for(let j = 0; j < verts; j++)
		{
			let angle = deg2rad((j + 1) * amount);
			let next_x = x - Math.sin(angle) * cur_ring;
			let next_y = y - Math.cos(angle) * cur_ring;
			if(rand() <= 0.75)
			{
				ctx.lineTo(next_x, next_y);
			} else {
				ctx.moveTo(next_x, next_y);
			}
		}
		for(let j = 0; j < verts; j++)
		{
			let angle = deg2rad((j + 1) * amount);
			let from_x = x - Math.sin(angle) * last_ring;
			let from_y = y - Math.cos(angle) * last_ring;
			let next_x = x - Math.sin(angle) * cur_ring;
			let next_y = y - Math.cos(angle) * cur_ring;
			ctx.moveTo(from_x, from_y);
			if(rand() <= 0.25)
			{
				ctx.lineTo(next_x, next_y);
			}
		}
		ctx.stroke();
	}
}

function strHash(str: string) {
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

function splitmix32(a) {
	return function() {
		a |= 0; a = a + 0x9e3779b9 | 0;
		var t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
		t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
		return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
	}
}

function deg2rad(deg)
{
	return deg * (Math.PI / 180);
}
redraw();
