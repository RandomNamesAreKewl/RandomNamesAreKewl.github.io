class Vector2 {
	X: number
	Y: number

	constructor(X: number, Y: number) {
		this.X = X;
		this.Y = Y;
	}

	LengthSquared(): number {
		return (this.X ** 2) + (this.Y ** 2);
	}

	Length(): number {
		return Math.sqrt(this.LengthSquared());
	}

	Add(b: Vector2): Vector2 {
		return new Vector2(this.X + b.X, this.Y + b.Y);
	}

	Sub(b: Vector2): Vector2 {
		return new Vector2(this.X - b.X, this.Y - b.Y);
	}

	Mul(b: Vector2): Vector2 {
		return new Vector2(this.X * b.X, this.Y * b.Y);
	}

	Div(b: Vector2): Vector2 {
		return new Vector2(this.X / b.X, this.Y / b.Y);
	}

	Scale(factor: number): Vector2 {
		return new Vector2(this.X * factor, this.Y * factor);
	}

	Distance(b: Vector2): number {
		return b.Sub(this).Length();
	}
};
