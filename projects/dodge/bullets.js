var Bullet = /** @class */ (function () {
    function Bullet(Damage, Size, Position, Velocity, LifeTime) {
        this.Damage = Damage;
        this.Size = Size;
        this.Position = Position;
        this.Velocity = Velocity;
        this.LifeTime = LifeTime;
    }
    Bullet.prototype.Update = function (ctx) {
        this.Position.X += this.Velocity.X;
        this.Position.Y += this.Velocity.Y;
        ctx.fillStyle = (this.Damage <= 0) ? "#00FF00" : "#FFFFFF";
        ctx.beginPath();
        ctx.arc(this.Position.X, this.Position.Y, this.Size, 0, Math.PI * 2);
        ctx.fill();
        this.LifeTime -= 1;
    };
    return Bullet;
}());
;
