import { Color } from "./color";
import { Enemy } from "./enemy";
import { environment, environmentColumns, EnvironmentKey, environmentRows } from "./environment";
import { KeyState } from "./key_state";
import { clampValue, collideCircles, columnToX, getCollisionVelocity, getEnvironmentColor, mapLinear, randomInt, rowToY, wrapValue } from "./util";
import { Vector } from "./vector";

let previousTimeMillis: number;

export let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
canvas.id = "gameCanvas";
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

let environmentTileSize: number = 50;
let centerRow: number = environmentRows / 2 - canvas.width / 2 / environmentTileSize;
let centerColumn: number = environmentColumns / 2 - canvas.height / 2 / environmentTileSize;

let minimumSpeed: number = 0.003;
let currentSpeed: number = minimumSpeed;
let speedDegredationTimeMillis: number = 700;
let lastSpeedBoostSpeed: number;

let lastSpeedBoostTimeMillis: number;

let currentRotation: number = 0;
let minimumRotationSpeed: number = 0.004;
let currentRotationSpeed: number = minimumRotationSpeed;
let lastSpeedBoostRotationSpeed: number;

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
let guyVelocityColumn: number = 0;
let guyVelocityRow: number = 0;
let guyHitVelocityColumn: number = 0;
let guyHitVelocityRow: number = 0;
let guyLastHitTimeMillis: number;
let guyHitRecoveryDurationMillis: number = 800;
let minGuyRadius: number = 10;
let maxGuyRadius: number = 40;
let currentGuyRadius: number = minGuyRadius;
let lastSpeedBoostGuyRadius: number;

let environmentTimers: {currentTime: number, maxTime: number}[] = [
    {currentTime: 0, maxTime: 7000},
    {currentTime: 0, maxTime: 3500},
    {currentTime: 0, maxTime: 3500},
    {currentTime: 0, maxTime: 3500},
];
let currentTransformation: number = 0;

let enemies: Enemy[] = [];
spawnEnemies();

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
    lastSpeedBoostTimeMillis = mouseUpTime;
    lastSpeedBoostSpeed = Math.max(minimumSpeed, speedBoost * 0.004);
    lastSpeedBoostRotationSpeed = Math.max(minimumRotationSpeed, speedBoost * 0.005);
    lastSpeedBoostGuyRadius = mapLinear(0, speedBoost, 10, minGuyRadius, maxGuyRadius);
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
        moveX = moveX / magnitude * currentSpeed;
        moveY = moveY / magnitude * currentSpeed;
    }

    let hitX: number = 0;
    let hitY: number = 0;
    if (guyLastHitTimeMillis !== undefined) {
        hitX = mapLinear(
            guyLastHitTimeMillis,
            currentTimeMillis,
            guyLastHitTimeMillis + guyHitRecoveryDurationMillis,
            guyHitVelocityColumn,
            0,
        );
        hitY = mapLinear(
            guyLastHitTimeMillis,
            currentTimeMillis,
            guyLastHitTimeMillis + guyHitRecoveryDurationMillis,
            guyHitVelocityRow,
            0,
        );
    }
    
    guyVelocityColumn = moveX + hitX;
    guyVelocityRow = moveY + hitY;

    centerColumn += guyVelocityColumn * elapsedTimeMillis;
    centerRow += guyVelocityRow * elapsedTimeMillis;

    currentRotation += elapsedTimeMillis * currentRotationSpeed;

    if (lastSpeedBoostSpeed !== undefined) {
        currentSpeed = mapLinear(
            0,
            currentTimeMillis - lastSpeedBoostTimeMillis,
            speedDegredationTimeMillis,
            lastSpeedBoostSpeed,
            minimumSpeed,
        );
        currentRotationSpeed = mapLinear(
            0,
            currentTimeMillis - lastSpeedBoostTimeMillis,
            speedDegredationTimeMillis,
            lastSpeedBoostRotationSpeed,
            minimumRotationSpeed,
        );
        currentGuyRadius = mapLinear(
            0,
            currentTimeMillis - lastSpeedBoostTimeMillis,
            speedDegredationTimeMillis,
            lastSpeedBoostGuyRadius,
            minGuyRadius,
        );
    } else {
        currentSpeed = minimumSpeed;
        currentRotationSpeed = minimumRotationSpeed;
        currentGuyRadius = minGuyRadius;
    }

    let topLeftColumn: number = centerColumn - (canvas.width / 2) / environmentTileSize;
    let topLeftRow: number = centerRow - (canvas.height / 2) / environmentTileSize;
    let guyCenterX = columnToX(centerColumn, topLeftColumn, environmentTileSize);
    let guyCenterY = rowToY(centerRow, topLeftRow, environmentTileSize);
    
    let environmentDrawCount = drawEnvironment(topLeftColumn, topLeftRow);

    // update all enemy x's and y's
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    }

    // do collision and game simulation stuff
    for (let i = 0; i < enemies.length; i++) {
        let enemy: Enemy = enemies[i];
        if (collideCircles(
            canvas.width / 2,
            canvas.height / 2,
            currentGuyRadius,
            enemy.x,
            enemy.y,
            enemy.radius)
            && (
                enemy.lastHitTimeMillis === undefined
                || (currentTimeMillis - enemy.lastHitTimeMillis) > enemy.hitRecoveryDurationMillis
            )
        ) {
            let enemyMass: number = enemy.radius;
            let guyMass: number = currentGuyRadius;
            let guyCenter: Vector = new Vector(guyCenterX, guyCenterY);
            let enemyCenter: Vector = new Vector(enemy.x, enemy.y);
            let guyVelocity: Vector = new Vector(guyVelocityColumn, guyVelocityRow)
                .plus(enemyCenter.minus(guyCenter).normalize().scale(0.01));
            let enemyVelocity: Vector = new Vector(enemy.hitVelocityColumn, enemy.hitVelocityRow);
            let guyHitVelocity: Vector = getCollisionVelocity(
                guyCenter,
                enemyCenter,
                guyMass,
                enemyMass,
                guyVelocity,
                enemyVelocity,
            ).scale(0.2);
            guyHitVelocityColumn = guyHitVelocity.x;
            guyHitVelocityRow = guyHitVelocity.y;
            guyLastHitTimeMillis = currentTimeMillis;
            
            let enemyHitVelocity: Vector = getCollisionVelocity(
                enemyCenter,
                guyCenter,
                enemyMass,
                guyMass,
                enemyVelocity,
                guyVelocity,
            ).scale(0.3);
            enemy.lastHitTimeMillis = currentTimeMillis;
            enemy.hitVelocityColumn = enemyHitVelocity.x;
            enemy.hitVelocityRow = enemyHitVelocity.y;
            
            let damageMultiplier: number = getDamageMultiplier(currentTransformation as EnvironmentKey, enemy.element);
            console.log(damageMultiplier);
            enemy.currentHealth -= mapLinear(
                minGuyRadius,
                currentGuyRadius,
                maxGuyRadius,
                0,
                10 * damageMultiplier,
            );
        }
    }

    // remove dead enemies
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].currentHealth <= 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // draw all enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw(currentTimeMillis, ctx);
    }

    // update environment timers
    let currentEnvironment: EnvironmentKey = getCurrentEnvironment(centerColumn, centerRow);
    if (currentEnvironment !== (currentTransformation as EnvironmentKey)) {
        let currentTimer = environmentTimers[currentEnvironment];
        currentTimer.currentTime += elapsedTimeMillis;
        if (currentTimer.currentTime > currentTimer.maxTime) {
            currentTimer.currentTime = currentTimer.maxTime
        }
    }
    for (let i = 0; i < environmentTimers.length; i++) {
        if ((i as EnvironmentKey) !== currentEnvironment) {
            let currentTimer = environmentTimers[i];
            currentTimer.currentTime -= elapsedTimeMillis;
            if (currentTimer.currentTime < 0) {
                currentTimer.currentTime = 0;
            }
        }
    }

    // trigger transformation
    if (currentEnvironment !== (currentTransformation as EnvironmentKey)
        && environmentTimers[currentEnvironment].currentTime === environmentTimers[currentEnvironment].maxTime
    ) {
        console.log("TRANSFORM!!!");
        for (let i = 0; i < environmentTimers.length; i++) {
            environmentTimers[i].currentTime = 0;
        }
        currentTransformation = currentEnvironment as number;
    }
    
    // draw environment draw count
    ctx.save();
    ctx.fillStyle = "black";
    ctx.textBaseline = "bottom";
    ctx.font = "30px Arial";
    ctx.fillText(environmentDrawCount.toString(), canvas.width / 2 - 10, canvas.height);
    ctx.restore();

    // draw the guy
    ctx.save();
    ctx.translate(guyCenterX, guyCenterY);
    ctx.rotate(currentRotation);
    ctx.translate(-guyCenterX, -guyCenterY);
    ctx.drawImage(guySprite, guyCenterX - guySprite.width / 2, guyCenterY - guySprite.height / 2);
    ctx.restore();

    // draw guy radius (for testing)
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.arc(guyCenterX, guyCenterY, currentGuyRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    if (currentEnvironment !== currentTransformation) {
        let tileCenterX: number = guyCenterX + 50;
        let tileCenterY: number = guyCenterY - 70;
        let tileSize: number = 25;
        ctx.save();
        drawEnvironmentTile(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, currentEnvironment);
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.strokeRect(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, tileSize);
        ctx.restore();

        let width: number = 100;
        let height: number = 10;
        let topLeftX: number = tileCenterX - tileSize / 2 - width - 10;
        let topLeftY: number = tileCenterY - height / 2;
        let currentEnvironmentTimer: {currentTime: number, maxTime: number} = environmentTimers[currentEnvironment];
        let fillRatio: number = (currentEnvironmentTimer.currentTime / currentEnvironmentTimer.maxTime);
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillStyle = "gray";
        ctx.fillRect(topLeftX, topLeftY, width * fillRatio, height);
        ctx.strokeRect(topLeftX, topLeftY, width, height);
        ctx.restore();
    }
    // TODO: on transformation, set the transformed-to timer to zero

    // draw fps
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

function preload() {
    for (let [key, loaded] of preloadRegistry) {
        if (!loaded) {
            window.setTimeout(preload, 0);
            return;
        }
    }
    window.requestAnimationFrame(draw);
}

function spawnEnemies() {
    for (let i = 0; i < 10; i++) {
        let minRadius: number = 7;
        let maxRadius: number = 20;
        let radius: number = randomInt(minRadius, maxRadius);
        let health: number = mapLinear(minRadius, radius, maxRadius, 50, 200);
        enemies.push(new Enemy(
            Math.random() * environmentColumns,
            Math.random() * environmentRows,
            radius,
            health,
            randomInt(0, 3) as EnvironmentKey,
        ));
    }
}

function drawEnvironment(topLeftColumn: number, topLeftRow: number) {
    let bottomRightColumn: number = topLeftColumn + canvas.width / environmentTileSize;
    let bottomRightRow: number = topLeftRow + canvas.height / environmentTileSize;
    let minColumn: number = Math.floor(topLeftColumn);
    let maxColumn: number = Math.ceil(bottomRightColumn);
    let minRow: number = Math.floor(topLeftRow);
    let maxRow: number = Math.ceil(bottomRightRow);
    let environmentDrawCount: number = 0;
    ctx.save();
    for (let i = minRow; i <= maxRow; i++) {
        for (let j = minColumn; j <= maxColumn; j++) {
            let wrappedRow: number = wrapValue(0, i, environmentRows - 1);
            let wrappedColumn: number = wrapValue(0, j, environmentColumns - 1);
            let key: EnvironmentKey = environment[wrappedRow][wrappedColumn];
            let x = columnToX(j, topLeftColumn, environmentTileSize);
            let y = rowToY(i, topLeftRow, environmentTileSize);
            drawEnvironmentTile(Math.floor(x), Math.floor(y), environmentTileSize, key);

            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("(" + wrappedRow + "," + wrappedColumn + ")", x, y);
            environmentDrawCount++;
        }
    }
    ctx.restore();
    return environmentDrawCount;
}

function drawEnvironmentTile(x: number, y: number, size: number, key: EnvironmentKey) {
    ctx.fillStyle = getEnvironmentColor(key).toString();
    ctx.fillRect(x, y, size, size);
}

function getCurrentEnvironment(centerColumn: number, centerRow: number): EnvironmentKey {
    let wrappedRow: number = wrapValue(0, Math.floor(centerRow), environmentRows - 1);
    let wrappedColumn: number = wrapValue(0, Math.floor(centerColumn), environmentColumns - 1);
    return environment[wrappedRow][wrappedColumn];
}

function getDamageMultiplier(attacker: EnvironmentKey, defender: EnvironmentKey): number {
    if (attacker === EnvironmentKey.DEFAULT || defender === EnvironmentKey.DEFAULT) {
        return 1;
    }
    
    if (attacker === EnvironmentKey.FOREST) {
        if (defender === EnvironmentKey.WATER) {
            return 3;
        } else if (defender === EnvironmentKey.DESERT) {
            return 0.5;
        } else {
            return 1;
        }
    }

    if (attacker === EnvironmentKey.DESERT) {
        if (defender === EnvironmentKey.FOREST) {
            return 3;
        } else if (defender === EnvironmentKey.WATER) {
            return 0.5;
        } else if (defender === EnvironmentKey.DESERT) {
            return 1;
        }
    }

    if (attacker === EnvironmentKey.WATER) {
        if (defender === EnvironmentKey.DESERT) {
            return 3;
        } else if (defender === EnvironmentKey.FOREST) {
            return 0.5;
        } else if (defender === EnvironmentKey.WATER) {
            return 1;
        }
    }
}

window.setTimeout(preload, 0);

