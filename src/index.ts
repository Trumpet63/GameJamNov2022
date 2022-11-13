import { Color } from "./color";
import { Enemy } from "./enemy";
import { environment, environmentColumns, EnvironmentKey, environmentRows } from "./environment";
import { FloatingText } from "./floating_text";
import { KeyState } from "./key_state";
import { Missile } from "./missile";
import { clampValue, collideCircles, columnToX, getCollisionVelocity, getEnvironmentColor, getTintedColor, mapLinear, randomInt, rowToY, wrapValue } from "./util";
import { Vector } from "./vector";
import { waves } from "./waves";

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
let guyMaxHealth: number = 100;
let guyCurrentHealth: number = guyMaxHealth;
let guyLastDamagedTimeMillis: number;

let environmentTimers: {currentTime: number, maxTime: number}[] = [
    {currentTime: 0, maxTime: 7000},
    {currentTime: 0, maxTime: 3500},
    {currentTime: 0, maxTime: 3500},
    {currentTime: 0, maxTime: 3500},
];
let currentTransformation: number = 0;
let transformationLevels: {exp: number, toNextLevel: number, level: number}[] = [
    {exp: 0, toNextLevel: 200, level: 1},
    {exp: 0, toNextLevel: 100, level: 1},
    {exp: 0, toNextLevel: 100, level: 1},
    {exp: 0, toNextLevel: 100, level: 1},
];

let minEnemyRadius: number = 7;
let maxEnemyRadius: number = 20;
let enemies: Enemy[] = [];

let missiles: Missile[] = [];

let currentWave: number = -1;
let previousWaveEndTimeMillis: number = performance.now();
let waveRestTimeMillis: number = 8000;
let isInRestTime: boolean = true;

let floatingTexts: FloatingText[] = [];

let isGameOver: boolean = false;
let gameOverTimeMillis: number;

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
    lastSpeedBoostSpeed = Math.max(minimumSpeed, speedBoost * 0.003);
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

    // update all enemy x's and y's and move velocities
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    }

    // update all missiles
    for (let i = 0; i < missiles.length; i++) {
        missiles[i].update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    }

    // update all the floating texts
    for (let i = 0; i < floatingTexts.length; i++) {
        floatingTexts[i].update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    }

    // do enemy-guy collision and game simulation stuff
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
            && !isGameOver
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
            
            // determine damage delt to enemy
            let damageMultiplier: number = getDamageMultiplier(currentTransformation as EnvironmentKey, enemy.element);
            let damageDealt: number = mapLinear(
                minGuyRadius,
                currentGuyRadius,
                maxGuyRadius,
                0,
                (10 + transformationLevels[currentTransformation as number].level - 1) * damageMultiplier,
            );
            enemy.currentHealth -= damageDealt;

            // award xp if enemy was killed
            if (enemy.currentHealth <= 0) {
                let expGain: number = mapLinear(
                    minEnemyRadius,
                    enemy.radius,
                    maxEnemyRadius,
                    50,
                    400,
                );
                if (currentTransformation !== EnvironmentKey.DEFAULT) {
                    transformationLevels[currentTransformation as number].exp += expGain;
                }
                transformationLevels[EnvironmentKey.DEFAULT as number].exp += expGain * 0.3;
            }

            // spawn floating text
            floatingTexts.push(new FloatingText(
                enemy.row,
                enemy.column,
                "-" + (Math.round(damageDealt * 10) / 10).toFixed(1)
                    + (damageMultiplier === 3 ? " CRITICAL" : ""),
                "black",
                20,
                currentTimeMillis,
            ));
        }
    }

    // do missile-guy collision
    for (let i = 0; i < missiles.length; i++) {
        let missile: Missile = missiles[i];
        if (collideCircles(
            canvas.width / 2,
            canvas.height / 2,
            minGuyRadius, // Deliberately use min guy radius here
            missile.x,
            missile.y,
            missile.radius)
            && !isGameOver
        ) {
            let damageMultiplier: number = getDamageMultiplier(missile.element, currentTransformation as EnvironmentKey);
            let damageDealt: number = damageMultiplier * 10
            guyCurrentHealth -= damageDealt;
            guyLastDamagedTimeMillis = currentTimeMillis;
            missiles.splice(i, 1);
            i--;

            // spawn floating text
            floatingTexts.push(new FloatingText(
                centerRow,
                centerColumn,
                "-" + (Math.round(damageDealt * 10) / 10).toFixed(1)
                    + (damageMultiplier === 3 ? " CRITICAL" : ""),
                "red",
                20,
                currentTimeMillis,
            ));
        }
    }

    // remove dead enemies
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].currentHealth <= 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // detect the end of a wave
    if (enemies.length === 0 && !isInRestTime) {
        previousWaveEndTimeMillis = currentTimeMillis;
        isInRestTime = true;
    }

    // remove old missiles
    for (let i = 0; i < missiles.length; i++) {
        let missile: Missile = missiles[i];
        if (currentTimeMillis - missile.creationTimeMillis > missile.lifetimeMillis) {
            missiles.splice(i, 1);
            i--;
        }
    }

    // remove old floating texts
    for (let i = 0; i < floatingTexts.length; i++) {
        let floatingText: FloatingText = floatingTexts[i];
        if (currentTimeMillis - floatingText.creationTimeMillis > floatingText.lifetimeMillis) {
            floatingTexts.splice(i, 1);
            i--;
        }
    }

    // draw all enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw(currentTimeMillis, ctx);
    }

    // draw all missiles
    for (let i = 0; i < missiles.length; i++) {
        missiles[i].draw(currentTimeMillis, ctx);
    }

    // draw all floating texts
    for (let i = 0; i < floatingTexts.length; i++) {
        floatingTexts[i].draw(currentTimeMillis, ctx);
    }

    // enemies can maybe spawn missiles
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (currentTimeMillis - enemy.lastMissileSpawnAttemptMillis > 1000) {
            let spawnChance = mapLinear(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.2, 1);
            if (Math.random() <= spawnChance) {
                let moveSpeed = mapLinear(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.0003, 0.001);
                let turnSpeed = mapLinear(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.001, 0.0001);
                let lifeTimeMillis = mapLinear(minEnemyRadius, enemy.radius, maxEnemyRadius, 3000, 8000);
                missiles.push(new Missile(enemy.row, enemy.column, 3, enemy.element, moveSpeed, turnSpeed, lifeTimeMillis, currentTimeMillis));
            }
            enemy.lastMissileSpawnAttemptMillis = currentTimeMillis;
        }
    }

    // update environment timers
    let currentEnvironment: EnvironmentKey = getCurrentEnvironment(centerColumn, centerRow);
    if (!isGameOver) {
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
    }

    // trigger transformation
    if (currentEnvironment !== (currentTransformation as EnvironmentKey)
        && environmentTimers[currentEnvironment].currentTime === environmentTimers[currentEnvironment].maxTime
        && !isGameOver
    ) {
        for (let i = 0; i < environmentTimers.length; i++) {
            environmentTimers[i].currentTime = 0;
        }
        currentTransformation = currentEnvironment as number;
    }

    // update transformation levels
    for (let i = 0; i < transformationLevels.length; i++) {
        let transformation = transformationLevels[i];
        if (transformation.exp >= transformation.toNextLevel) {
            transformation.exp -= transformation.toNextLevel;
            transformation.level++;
            transformation.toNextLevel *= 1.1;

            if (i as EnvironmentKey === EnvironmentKey.DEFAULT) {
                guyMaxHealth += 20;
            }
        }
    }

    if (guyCurrentHealth <= 0 && !isGameOver) {
        isGameOver = true;
        gameOverTimeMillis = currentTimeMillis;
    }
    
    // draw environment draw count
    if (false) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.textBaseline = "bottom";
        ctx.font = "30px Arial";
        ctx.fillText(environmentDrawCount.toString(), canvas.width / 2 - 10, canvas.height);
        ctx.restore();
    }

    // draw the guy
    if (!isGameOver) {
        ctx.save();
        ctx.translate(guyCenterX, guyCenterY);
        ctx.rotate(currentRotation);
        ctx.translate(-guyCenterX, -guyCenterY);
        ctx.drawImage(guySprite, guyCenterX - guySprite.width / 2, guyCenterY - guySprite.height / 2);
        ctx.restore();
    }

    // color the guy's head
    if (!isGameOver) {
        ctx.save();
        let guyColorRatio: number = 1;
        let guyDefaultColor: Color = getTintedColor(currentTransformation as EnvironmentKey);
        if (guyLastDamagedTimeMillis !== undefined) {
            guyColorRatio = mapLinear(
                guyLastDamagedTimeMillis,
                currentTimeMillis,
                guyLastDamagedTimeMillis + 1000,
                0,
                1,
            );
        }
        let guyColor: Color = Color.lerpColors(
            new Color(255, 0, 0),
            guyDefaultColor,
            guyColorRatio,
        );
        ctx.fillStyle = guyColor.toString();
        ctx.beginPath();
        ctx.arc(guyCenterX, guyCenterY, 6, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // draw guy swirly thing
    if (!isGameOver) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        ctx.beginPath();
        ctx.arc(
            guyCenterX,
            guyCenterY,
            currentGuyRadius,
            currentTimeMillis / 60,
            currentTimeMillis / 60 + mapLinear(minGuyRadius, currentGuyRadius, maxGuyRadius, 1, 2),
        );
        ctx.stroke();
        ctx.restore();
    }

    // draw the guy's health bar
    if (!isGameOver) {
        let guyHealthWidth: number = guyMaxHealth / 2;
        let guyHealthHeight: number = 6;
        let guyHealthTopLeftX: number = guyCenterX - guyHealthWidth / 2;
        let guyHealthTopLeftY: number = guyCenterY - maxGuyRadius - guyHealthHeight / 2 - 8;
        ctx.save();
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillRect(guyHealthTopLeftX, guyHealthTopLeftY, guyHealthWidth * (guyCurrentHealth / guyMaxHealth), guyHealthHeight);
        ctx.strokeRect(guyHealthTopLeftX, guyHealthTopLeftY, guyHealthWidth, guyHealthHeight);
        ctx.restore();
    }

    // draw transform-to bar
    if (currentEnvironment !== currentTransformation && !isGameOver) {
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

    // draw the UI background
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, 40);
    ctx.restore();

    // draw the wave number
    ctx.save();
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "20px Arial";
    ctx.fillText("Wave " + (currentWave + 1), 3, 0);
    ctx.restore();

    // draw the current number of enemies alive
    ctx.save();
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "20px Arial";
    ctx.fillText(enemies.length + " Enemies Left", 100, 0);
    ctx.restore();

    // draw the wave rest timer and/or trigger the next wave
    if (enemies.length === 0) {
        let restTimeRemainingMillis = waveRestTimeMillis - (currentTimeMillis - previousWaveEndTimeMillis);
        guyCurrentHealth = Math.min(
            guyMaxHealth,
            guyCurrentHealth + elapsedTimeMillis / waveRestTimeMillis * guyMaxHealth,
        )
        if (restTimeRemainingMillis <= 0 && !isGameOver) {
            currentWave++;
            spawnEnemies(currentWave);
            isInRestTime = false;
        } else {
            ctx.save();
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = "20px Arial";
            let tenths: number = Math.round(restTimeRemainingMillis / 100);
            ctx.fillText(
                (tenths / 10).toFixed(1) + "s Until Next Wave",
                3,
                20,
            )
            ctx.restore();
        }
    }

    // draw tranformation exp bars and levels
    drawTransformationExpBar(canvas.width - 200, 3, 0);
    drawTransformationExpBar(canvas.width - 200, 23, 1);
    drawTransformationExpBar(canvas.width, 3, 2);
    drawTransformationExpBar(canvas.width, 23, 3);

    // draw game over text
    if (isGameOver) {
        let timeSinceGameOverMillis: number = currentTimeMillis - gameOverTimeMillis;
        let textOpacity = mapLinear(0, timeSinceGameOverMillis, 2000, 0, 1);
        ctx.save();
        ctx.globalAlpha = textOpacity;
        ctx.font = "40px Arial"
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.restore();
        console.log(textOpacity);
    }

    // draw fps
    if (false) {
        let fps: number = 1000 / elapsedTimeMillis;
        ctx.save();
        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.font = "30px Arial";
        ctx.fillText(Math.round(fps).toString() + "FPS", canvas.width, canvas.height);
        ctx.restore();
    }
    
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

function spawnEnemies(currentWave: number) {
    let currentTimeMillis: number = performance.now();
    let wave: number[] = waves[currentWave];
    for (let i = 0; i < wave.length; i++) {
        let radius: number = wave[i];
        let health: number = mapLinear(minEnemyRadius, radius, maxEnemyRadius, 50, 200);
        let speed: number = mapLinear(minEnemyRadius, radius, maxEnemyRadius, 0.001, 0.0005);
        enemies.push(new Enemy(
            Math.random() * environmentColumns,
            Math.random() * environmentRows,
            radius,
            health,
            randomInt(0, 3) as EnvironmentKey,
            speed,
            currentTimeMillis,
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

            // ctx.fillStyle = "black";
            // ctx.textAlign = "center";
            // ctx.textBaseline = "middle";
            // ctx.fillText("(" + wrappedRow + "," + wrappedColumn + ")", x, y);
            // environmentDrawCount++;
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

function drawTransformationExpBar(
    x: number,
    y: number,
    environment: EnvironmentKey,
) {
    let tileSize: number = 15;
    let tileCenterX: number = x - tileSize / 2 - 10;
    let tileCenterY: number = y + tileSize / 2;
    ctx.save();
    drawEnvironmentTile(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, environment);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, tileSize);
    ctx.restore();

    let width: number = 100;
    let height: number = 10;
    let topLeftX: number = tileCenterX - tileSize / 2 - width - 10;
    let topLeftY: number = tileCenterY - height / 2;
    let transformation: {exp: number, toNextLevel: number, level: number} = transformationLevels[environment as number];
    let fillRatio: number = (transformation.exp / transformation.toNextLevel);
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillStyle = "gray";
    ctx.fillRect(topLeftX, topLeftY, width * fillRatio, height);
    ctx.strokeRect(topLeftX, topLeftY, width, height);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "14px Arial";
    ctx.fillText("Lv. " + transformation.level, tileCenterX - width - tileSize - 15, tileCenterY + 1);
    ctx.restore();
}

window.setTimeout(preload, 0);

