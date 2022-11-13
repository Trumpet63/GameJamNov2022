import { Color } from "./color";
import { environmentColumns, EnvironmentKey, environmentRows } from "./environment";
import { canvas } from "./index";
import { getDistance, getEnvironmentColor, mapLinear, wrapValue } from "./util";
import { Vector } from "./vector";

export class Enemy {
    public row: number;
    public column: number;
    public x: number;
    public y: number;
    public radius: number;
    public lastHitTimeMillis: number;
    public hitVelocityColumn: number;
    public hitVelocityRow: number;
    public moveVelocityColumn: number;
    public moveVelicityRow: number;
    public totalVelocityColumn: number;
    public totalVelocityRow: number;
    public hitRecoveryDurationMillis: number = 500;
    public lastUpdateTimeMillis: number;
    public maxHealth: number;
    public currentHealth: number;
    public element: EnvironmentKey;
    public defaultColor: Color;
    public moveSpeed: number;

    public constructor(
        row: number,
        column: number,
        radius: number,
        health: number,
        element: EnvironmentKey,
        moveSpeed: number,
    ) {
        this.row = row;
        this.column = column;
        this.radius = radius;
        this.hitVelocityColumn = 0;
        this.hitVelocityRow = 0;
        this.maxHealth = health;
        this.currentHealth = health * Math.random();
        this.element = element;
        let tempColor = this.element === EnvironmentKey.DEFAULT
            ? new Color(255, 255, 255)
            : getEnvironmentColor(this.element);
        this.defaultColor = Color.lerpColors(
            tempColor,
            new Color(255, 255, 255),
            0.15,
        );
        this.moveVelocityColumn = 0;
        this.moveVelicityRow = 0;
        this.moveSpeed = moveSpeed;
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
        
        let hitVelocityColumn: number = 0;
        let hitVelocityRow: number = 0;
        if (this.lastHitTimeMillis !== undefined) {
            hitVelocityColumn = mapLinear(
                this.lastHitTimeMillis,
                currentTimeMillis,
                this.lastHitTimeMillis + this.hitRecoveryDurationMillis,
                this.hitVelocityColumn,
                0,
            );

            hitVelocityRow = mapLinear(
                this.lastHitTimeMillis,
                currentTimeMillis,
                this.lastHitTimeMillis + this.hitRecoveryDurationMillis,
                this.hitVelocityRow,
                0,
            );
        }

        this.totalVelocityColumn = hitVelocityColumn + this.moveVelocityColumn;
        this.totalVelocityRow = hitVelocityRow + this.moveVelicityRow;

        this.column += this.totalVelocityColumn * elapsedTimeMillis;
        this.row += this.totalVelocityRow * elapsedTimeMillis;

        let dx = getDistance(wrappedCenterColumn, this.column, 0, environmentColumns - 1) * environmentTileSize;
        let dy = getDistance(wrappedCenterRow, this.row, 0, environmentRows - 1) * environmentTileSize;

        let moveVelocity: Vector = new Vector(-dx, -dy).normalize().scale(this.moveSpeed);
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
        /*
           a           b
        [0 1 2 3 4 5 6 7 8]

        dist1 = Math.abs(a - b);
        dist2 = (a - min) + (max - b);

        a - b = -6 (mod 9) => 3


             b       a
        [0 1 2 3 4 5 6 7 8]
        
        b - a = -4 (mod 9) = 5
        len + (2 + 1) - (6 + 1) = len + 3 - 7 = len - 4 = 5
        // ​len + (min(a,b) + 1) - (max(a,b) + 1)
        */

        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        
        let colorRatio = 1;
        if (this.lastHitTimeMillis !== undefined) {
            colorRatio = mapLinear(
                this.lastHitTimeMillis,
                currentTimeMillis,
                this.lastHitTimeMillis + 1000,
                0,
                1,
            );
        }
        ctx.fillStyle = Color.lerpColors(
            new Color(255, 0, 0),
            this.defaultColor,
            colorRatio,
        ).toString();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();

        let width: number = this.maxHealth / 2;
        let height: number = 4;
        let topLeftX: number = this.x - width / 2;
        let topLeftY: number = this.y - this.radius - height / 2 - 8;
        ctx.save();
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillRect(topLeftX, topLeftY, width * (this.currentHealth / this.maxHealth), height);
        ctx.strokeRect(topLeftX, topLeftY, width, height);
        ctx.restore();
    }
}
