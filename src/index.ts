import { Color } from "./color";
import { environment, EnvironmentKey } from "./environment";
import { KeyState } from "./key_state";
import { clampValue, mapLinear } from "./util";

let previousTimeMillis: number;

let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
canvas.id = "gameCanvas";
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

let environmentTileSize: number = 50;
let topLeftRow: number = 9;
let topLeftColumn: number = 9;
let minimumSpeed: number = 0.001;
let currentSpeed: number = minimumSpeed;
let speedDegredationTimeMillis: number = 700;
let lastSpeedBoostSpeed: number;
let lastSpeedBoostTimeMillis: number;

let currentRotation: number = 0;
let minimumRotationspeed: number = 0.001;
let currentRotationSpeed: number = minimumRotationspeed;

let logCounter: number = 0;

let keyStates: Map<string, KeyState> = new Map();
keyStates.set("W", KeyState.UP);
keyStates.set("A", KeyState.UP);
keyStates.set("S", KeyState.UP);
keyStates.set("D", KeyState.UP);

let mouseDownY: number;
let mouseDownTime: number;

let preloadRegistry: Map<string, boolean> = new Map();

let guySprite: HTMLImageElement = loadImage("../assets/guy.png");

// let centerColumn: number = topLeftColumn + (canvas.width / 2) / environmentTileSize;
// let centerRow: number = topLeftRow + (canvas.height / 2) / environmentTileSize;
// let centerX: number = columnToX(centerColumn);
// let centerY: number = rowToY(centerRow);

// let guyRadius: number = 8;
// ctx.save();
// ctx.beginPath();
// ctx.arc(centerX, centerY, guyRadius, 0, 2 * Math.PI);
// ctx.closePath();

// ctx.lineWidth = 2;
// ctx.strokeStyle = "black";
// ctx.stroke();

// ctx.fillStyle = "white";
// ctx.fill();

document.body.appendChild(canvas);

document.onkeydown = (e: KeyboardEvent) => {
    if (e.repeat) {
        return;
    }
    let key = e.key.toUpperCase();
    if (keyStates.has(key)) {
        keyStates.set(key, KeyState.DOWN);
    }
};
document.onkeyup = (e: KeyboardEvent) => {
    if (e.repeat) {
        return;
    }
    let key = e.key.toUpperCase();
    if (keyStates.has(key)) {
        keyStates.set(key, KeyState.UP);
    }
};
document.onmousedown = (e: MouseEvent) => {
    mouseDownY = e.clientY;
    mouseDownTime = performance.now();
}
document.onmouseup = (e: MouseEvent) => {
    let mouseUpY = e.clientY;
    let mouseUpTime: number = performance.now();
    let speedBoost = clampValue(
        0,
        (mouseUpY - mouseDownY) / (mouseUpTime - mouseDownTime),
        10,
    );
    lastSpeedBoostSpeed = speedBoost * 0.005;
    lastSpeedBoostTimeMillis = mouseUpTime;
}

function draw(currentTimeMillis: number) {
    if (previousTimeMillis === undefined) {
        previousTimeMillis = currentTimeMillis;
        window.requestAnimationFrame(draw);
        return;
    }
    let elapsedTimeMillis = currentTimeMillis - previousTimeMillis;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let moveX: number = (keyStates.get("A") === KeyState.DOWN ? -1 : 0)
        + (keyStates.get("D") === KeyState.DOWN ? 1 : 0);
    let moveY: number = (keyStates.get("W") === KeyState.DOWN ? -1 : 0)
        + (keyStates.get("S") === KeyState.DOWN ? 1 : 0);
    let magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
    if (magnitude > 0) {
        moveX = moveX / magnitude * elapsedTimeMillis * currentSpeed;
        moveY = moveY / magnitude * elapsedTimeMillis * currentSpeed;
        topLeftColumn += moveX;
        topLeftRow += moveY;
    }
    if (lastSpeedBoostSpeed !== undefined) {
        currentSpeed = mapLinear(
            0,
            currentTimeMillis - lastSpeedBoostTimeMillis,
            speedDegredationTimeMillis,
            lastSpeedBoostSpeed,
            minimumSpeed,
        );
    } else {
        currentSpeed = minimumSpeed;
    }

    ctx.save();
    for (let i = 0; i < environment.length; i++) {
        for (let j = 0; j < environment[i].length; j++) {
            let key: EnvironmentKey = environment[i][j];
            let color: string;
            switch(key) {
                case EnvironmentKey.FOREST:
                    color = Color.toRGB(0, 255, 0);
                    break;
                case EnvironmentKey.DESERT:
                    color = Color.toRGB(255, 255, 50);
                    break;
                case EnvironmentKey.WATER:
                    color = Color.toRGB(0, 0, 255);
                    break;
            }
            ctx.fillStyle = color;
            let x = columnToX(j);
            let y = rowToY(i);

            ctx.fillRect(x, y, environmentTileSize, environmentTileSize);
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("(" + i + "," + j + ")", x, y);
        }
    }
    ctx.restore();

    let centerColumn = topLeftColumn + (canvas.width / 2) / environmentTileSize;
    let centerRow = topLeftRow + (canvas.height / 2) / environmentTileSize;
    let centerX = columnToX(centerColumn);
    let centerY = rowToY(centerRow);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(guySprite, centerX - guySprite.width / 2, centerY - guySprite.height / 2);
    ctx.restore();

    let fps: number = 1000 / elapsedTimeMillis;
    ctx.save();
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.font = "30px Arial";
    ctx.fillText(Math.round(fps).toString() + "FPS", canvas.width, canvas.height);
    ctx.restore();

    previousTimeMillis = currentTimeMillis;
    window.requestAnimationFrame(draw);
}

function loadImage(imageSource: string): HTMLImageElement {
    if (preloadRegistry.has(imageSource)) {
        throw new Error("You attempted to load the same image twice during preloading.");
    }
    preloadRegistry.set(imageSource, false);

    // The order these 3 things are done in is VERY important!
    let image = new Image();
    image.onload = () => {
        preloadRegistry.set(imageSource, true);
    }
    image.src = imageSource;

    return image;
}

function columnToX(column: number) {
    return (column - topLeftColumn) * environmentTileSize;
}

function rowToY(row: number) {
    return (row - topLeftRow) * environmentTileSize;
}

function preload() {
    for (let [key, loaded] of preloadRegistry) {
        if (!loaded) {
            window.setTimeout(preload, 0);
            return;
        }
    }
    window.requestAnimationFrame(draw);
}

window.setTimeout(preload, 0);

