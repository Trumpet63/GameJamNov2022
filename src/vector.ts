export class Vector {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public minus(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    public plus(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public static innerProduct(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    public scale(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    public normalize(): Vector {
        return new Vector(this.x, this.y).scale(1 / this.magnitude());
    }

    public direction(): number {
        return Math.atan2(this.y, this.x);
    }
}
