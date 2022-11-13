import { environmentColumns, environmentRows } from "./environment";
import { canvas } from "./index";
import { getDistance } from "./util";

export class FloatingText {
    public column: number;
    public row: number;
    public x: number;
    public y: number;
    public color: string;
    public text: string;
    public velocityRow: number;
    public lastUpdateTimeMillis: number;
    public lifetimeMillis: number;
    public creationTimeMillis: number;
    public size: number;

    public constructor(
        row: number,
        column: number,
        text: string,
        color: string,
        size: number,
        velocityRow: number,
        currentTimeMillis: number,
    ) {
        this.row = row;
        this.column = column;
        this.text = text;
        this.color = color;
        this.size = size;
        this.velocityRow = velocityRow;
        this.lifetimeMillis = 1000;
        this.creationTimeMillis = currentTimeMillis;
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

        this.row += this.velocityRow * elapsedTimeMillis;

        let dx = getDistance(wrappedCenterColumn, this.column, 0, environmentColumns - 1) * environmentTileSize;
        let dy = getDistance(wrappedCenterRow, this.row, 0, environmentRows - 1) * environmentTileSize;

        this.x = canvas.width / 2 + dx;
        this.y = canvas.height / 2 + dy;

        this.lastUpdateTimeMillis = currentTimeMillis;
    }

    public draw(
        currentTimeMillis: number,
        ctx: CanvasRenderingContext2D,
    ) {
        ctx.save();
        ctx.font = this.size + "px Arial";
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y)
        ctx.restore();
    }
}
