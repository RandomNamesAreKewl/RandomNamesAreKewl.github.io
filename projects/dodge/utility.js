var Vector2 = /** @class */ (function () {
    function Vector2(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    Vector2.prototype.LengthSquared = function () {
        return (Math.pow(this.X, 2)) + (Math.pow(this.Y, 2));
    };
    Vector2.prototype.Length = function () {
        return Math.sqrt(this.LengthSquared());
    };
    Vector2.prototype.Add = function (b) {
        return new Vector2(this.X + b.X, this.Y + b.Y);
    };
    Vector2.prototype.Sub = function (b) {
        return new Vector2(this.X - b.X, this.Y - b.Y);
    };
    Vector2.prototype.Mul = function (b) {
        return new Vector2(this.X * b.X, this.Y * b.Y);
    };
    Vector2.prototype.Div = function (b) {
        return new Vector2(this.X / b.X, this.Y / b.Y);
    };
    Vector2.prototype.Scale = function (factor) {
        return new Vector2(this.X * factor, this.Y * factor);
    };
    Vector2.prototype.Distance = function (b) {
        return b.Sub(this).Length();
    };
    return Vector2;
}());
;
