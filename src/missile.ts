import { Color } from "./color";
import { environmentColumns, EnvironmentKey, environmentRows } from "./environment";
import { canvas } from "./index";
import { getDistance } from "./util";
import { Vector } from "./vector";

export class Missile {
    public row: number;
    public column: number;
    public x: number;
    public y: number;
    public radius: number;
    public moveVelocityColumn: number;
    public moveVelicityRow: number;
    public totalVelocityColumn: number;
    public totalVelocityRow: number;
    public lastUpdateTimeMillis: number;
    public element: EnvironmentKey;
    public defaultColor: Color;
    public moveSpeed: number;
    public lifetimeMillis: number;
    public turningSpeed: number;
    private logCounter: number = 0;

    public constructor(
        row: number,
        column: number,
        radius: number,
        element: EnvironmentKey,
        moveSpeed: number,
    ) {
        this.row = row;
        this.column = column;
        this.radius = radius;
        this.element = element;
        this.moveSpeed = moveSpeed;
        this.turningSpeed = 0.001;
        this.moveVelocityColumn = 0;
        this.moveVelicityRow = 0;
    }

    public update(
        wrappedCenterColumn: number,
        wrappedCenterRow: number,
        environmentTileSize: number,
        currentTimeMillis: number,
    ) {
        let elapsedTimeMillis = 0;
        if (this.lastUpdateTimeMillis !== undefined) {
            elapsedTimeMillis = currentTimeMillis - this.lastUpdateTimeMillis;
        }

        this.totalVelocityColumn = this.moveVelocityColumn;
        this.totalVelocityRow = this.moveVelicityRow;

        this.column += this.totalVelocityColumn * elapsedTimeMillis;
        this.row += this.totalVelocityRow * elapsedTimeMillis;

        let dx = getDistance(wrappedCenterColumn, this.column, 0, environmentColumns - 1) * environmentTileSize;
        let dy = getDistance(wrappedCenterRow, this.row, 0, environmentRows - 1) * environmentTileSize;

        let idealMoveDirection: Vector = new Vector(-dx, -dy).normalize();
        let moveDirection: Vector;
        if (this.lastUpdateTimeMillis === undefined) {
            moveDirection = idealMoveDirection;
            console.log("idealMoveDirection", idealMoveDirection);
        } else {
            let idealAngle: number = idealMoveDirection.direction();
            let currentAngle: number = Math.atan2(this.moveVelicityRow, this.moveVelocityColumn);
            let dAngle: number = -getDistance(idealAngle, currentAngle, 0, 2 * Math.PI);
            let angleSign = dAngle / Math.sqrt(dAngle * dAngle);
            if (dAngle === 0) {
                angleSign = 1;
            }
            let maxTurnSpeed: number = Math.min(Math.abs(dAngle), this.turningSpeed * elapsedTimeMillis);
            let newAngle = currentAngle + maxTurnSpeed * angleSign;
            moveDirection = new Vector(Math.cos(newAngle), Math.sin(newAngle));
        }

        let moveVelocity: Vector;
        if (this.lastUpdateTimeMillis !== undefined) {
            moveVelocity = moveDirection.scale(this.moveSpeed * elapsedTimeMillis);
        } else {
            moveVelocity = moveDirection.scale(0.0001);
        }
        this.moveVelocityColumn = moveVelocity.x;
        this.moveVelicityRow = moveVelocity.y;


        this.x = canvas.width / 2 + dx;
        this.y = canvas.height / 2 + dy;

        this.lastUpdateTimeMillis = currentTimeMillis;
    }

    public draw(
        currentTimeMillis: number,
        ctx: CanvasRenderingContext2D,
    ) {
        let moveDirection: Vector = new Vector(this.moveVelocityColumn, this.moveVelicityRow)
            .normalize()
            .scale(10);
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(
            this.x - moveDirection.x,
            this.y - moveDirection.y,
        );
        ctx.lineTo(
            this.x + moveDirection.x,
            this.y + moveDirection.y,
        );
        ctx.closePath();
        ctx.stroke();
        // ctx.fillRect(this.x, this.y, 4, 4);
        ctx.restore();
    }
}
