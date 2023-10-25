let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
let player = {
	Health: 20,
	MaxHealth: 20,
	IFrames: 0,
	Position: new Vector2(250, 250)
};
let bullets = [];
let input: { [key: string]: boolean } = {};
let time = 0;

document.addEventListener("DOMContentLoaded", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	player.Position.X = Math.floor(canvas.width / 2);
	player.Position.Y = Math.floor(canvas.height / 2);

	setInterval(update, 1000 / 30);
	function update() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if(input["ArrowLeft"])
			player.Position.X -= 10;

		if(input["ArrowRight"])
			player.Position.X += 10;

		if(input["ArrowUp"])
			player.Position.Y -= 10;

		if(input["ArrowDown"])
			player.Position.Y += 10;

		for (let i = 0; i < bullets.length; i++) {
			const bullet: Bullet = bullets[i];
			bullet.Update(ctx);
			if(bullet.LifeTime <= 0) {
				delete bullets[i];
				bullets.splice(i, 1);
				i--;
				continue;
			}
			if(player.IFrames <= 0 && bullet.Position.Distance(player.Position) <= bullet.Size + 20) {
				player.Health -= bullet.Damage;
				if(player.Health > player.MaxHealth) {
					player.Health = player.MaxHealth;
				}
				if(bullet.Damage > 0)
					player.IFrames = 20;
				else {
					delete bullets[i];
					bullets.splice(i, 1);
					i--;
					continue;
				}
				if(player.Health <= 0) {
					location.reload();
				}
			}
		}

		ctx.fillStyle = (player.IFrames % 4 == 0)? "#FF0000" : "#880000";
		ctx.beginPath();
		ctx.arc(player.Position.X, player.Position.Y, 20, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#FF0000";
		ctx.fillRect(canvas.width / 2 - player.MaxHealth * 2.5, canvas.height - 80, player.MaxHealth * 5, 60);
		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(canvas.width / 2 - player.MaxHealth * 2.5, canvas.height - 80, player.Health * 5, 60);

		ctx.fillStyle = "#FFFF00";
		ctx.font = "64px Arial";
		ctx.fillText(time.toString(), 16, 64);

		if(player.IFrames > 0)
			player.IFrames--;
	}

	setInterval(() => {
		let randangle = Math.random() * (Math.PI * 2);
		let randDir = new Vector2(Math.cos(randangle), Math.sin(randangle));
		let vel = randDir.Scale(-2);
		let bullet = new Bullet(1, 10, player.Position.Add(randDir.Scale(400)), vel.Scale(5), 480);
		bullets.push(bullet);
	}, 250);

	setInterval(() => {
		let bullet = new Bullet(-4, 10, new Vector2(Math.random() * canvas.width, canvas.height + 20),
			new Vector2(4 - Math.random() * 8, -8), 240);
		bullets.push(bullet);
	}, 3000);

	setInterval(() => {
		let bullet = new Bullet(5, 20, new Vector2(Math.random() * canvas.width, -20),
			new Vector2(8 - Math.random() * 16, 8), 240);
		bullets.push(bullet);
	}, 500);

	setInterval(() => {
		time++;
	}, 1000);
	document.body.appendChild(canvas);
});

document.addEventListener("keydown", e => {
	input[e.key] = true;
});

document.addEventListener("keyup", e => {
	input[e.key] = false;
});
