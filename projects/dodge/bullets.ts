class Bullet {
	public Damage: number
	public Size: number
	public Position: Vector2
	public Velocity: Vector2
	public LifeTime: number

	constructor(Damage: number, Size: number, Position: Vector2, Velocity: Vector2, LifeTime: number)
	{
		this.Damage = Damage;
		this.Size = Size;
		this.Position = Position;
		this.Velocity = Velocity;

		this.LifeTime = LifeTime;
	}

	public Update(ctx: CanvasRenderingContext2D)
	{
		this.Position.X += this.Velocity.X;
		this.Position.Y += this.Velocity.Y;
		ctx.fillStyle = (this.Damage <= 0)? "#00FF00" : "#FFFFFF";
		ctx.beginPath();
		ctx.arc(this.Position.X, this.Position.Y, this.Size, 0, Math.PI * 2);
		ctx.fill();

		this.LifeTime -= 1;
	}
};
