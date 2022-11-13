var exports;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/color.ts":
/*!**********************!*\
  !*** ./src/color.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Color": () => (/* binding */ Color)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toString() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
    static toRGB(r, g, b) {
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    static toRGBA(r, g, b, a) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
    static lerpColors(c1, c2, ratio) {
        return new Color((0,_util__WEBPACK_IMPORTED_MODULE_0__.mapLinear)(0, ratio, 1, c1.r, c2.r), (0,_util__WEBPACK_IMPORTED_MODULE_0__.mapLinear)(0, ratio, 1, c1.g, c2.g), (0,_util__WEBPACK_IMPORTED_MODULE_0__.mapLinear)(0, ratio, 1, c1.b, c2.b));
    }
}


/***/ }),

/***/ "./src/enemy.ts":
/*!**********************!*\
  !*** ./src/enemy.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Enemy": () => (/* binding */ Enemy)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./vector */ "./src/vector.ts");





class Enemy {
    constructor(row, column, radius, health, element, moveSpeed) {
        this.hitRecoveryDurationMillis = 500;
        this.row = row;
        this.column = column;
        this.radius = radius;
        this.hitVelocityColumn = 0;
        this.hitVelocityRow = 0;
        this.maxHealth = health;
        this.currentHealth = health * Math.random();
        this.element = element;
        let tempColor = this.element === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT
            ? new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 255, 255)
            : (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEnvironmentColor)(this.element);
        this.defaultColor = _color__WEBPACK_IMPORTED_MODULE_0__.Color.lerpColors(tempColor, new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 255, 255), 0.15);
        this.moveVelocityColumn = 0;
        this.moveVelicityRow = 0;
        this.moveSpeed = moveSpeed;
    }
    update(wrappedCenterColumn, wrappedCenterRow, environmentTileSize, currentTimeMillis) {
        let elapsedTimeMillis = 0;
        if (this.lastUpdateTimeMillis !== undefined) {
            elapsedTimeMillis = currentTimeMillis - this.lastUpdateTimeMillis;
        }
        let hitVelocityColumn = 0;
        let hitVelocityRow = 0;
        if (this.lastHitTimeMillis !== undefined) {
            hitVelocityColumn = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(this.lastHitTimeMillis, currentTimeMillis, this.lastHitTimeMillis + this.hitRecoveryDurationMillis, this.hitVelocityColumn, 0);
            hitVelocityRow = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(this.lastHitTimeMillis, currentTimeMillis, this.lastHitTimeMillis + this.hitRecoveryDurationMillis, this.hitVelocityRow, 0);
        }
        this.totalVelocityColumn = hitVelocityColumn + this.moveVelocityColumn;
        this.totalVelocityRow = hitVelocityRow + this.moveVelicityRow;
        this.column += this.totalVelocityColumn * elapsedTimeMillis;
        this.row += this.totalVelocityRow * elapsedTimeMillis;
        let dx = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(wrappedCenterColumn, this.column, 0, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns - 1) * environmentTileSize;
        let dy = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(wrappedCenterRow, this.row, 0, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows - 1) * environmentTileSize;
        let moveVelocity = new _vector__WEBPACK_IMPORTED_MODULE_4__.Vector(-dx, -dy).normalize().scale(this.moveSpeed);
        this.moveVelocityColumn = moveVelocity.x;
        this.moveVelicityRow = moveVelocity.y;
        this.x = _index__WEBPACK_IMPORTED_MODULE_2__.canvas.width / 2 + dx;
        this.y = _index__WEBPACK_IMPORTED_MODULE_2__.canvas.height / 2 + dy;
        this.lastUpdateTimeMillis = currentTimeMillis;
    }
    draw(currentTimeMillis, ctx) {
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
            colorRatio = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(this.lastHitTimeMillis, currentTimeMillis, this.lastHitTimeMillis + 1000, 0, 1);
        }
        ctx.fillStyle = _color__WEBPACK_IMPORTED_MODULE_0__.Color.lerpColors(new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 0, 0), this.defaultColor, colorRatio).toString();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        let width = this.maxHealth / 2;
        let height = 4;
        let topLeftX = this.x - width / 2;
        let topLeftY = this.y - this.radius - height / 2 - 8;
        ctx.save();
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillRect(topLeftX, topLeftY, width * (this.currentHealth / this.maxHealth), height);
        ctx.strokeRect(topLeftX, topLeftY, width, height);
        ctx.restore();
    }
}


/***/ }),

/***/ "./src/environment.ts":
/*!****************************!*\
  !*** ./src/environment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EnvironmentKey": () => (/* binding */ EnvironmentKey),
/* harmony export */   "environment": () => (/* binding */ environment),
/* harmony export */   "environmentColumns": () => (/* binding */ environmentColumns),
/* harmony export */   "environmentRows": () => (/* binding */ environmentRows)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

var EnvironmentKey;
(function (EnvironmentKey) {
    EnvironmentKey[EnvironmentKey["DEFAULT"] = 0] = "DEFAULT";
    EnvironmentKey[EnvironmentKey["FOREST"] = 1] = "FOREST";
    EnvironmentKey[EnvironmentKey["DESERT"] = 2] = "DESERT";
    EnvironmentKey[EnvironmentKey["WATER"] = 3] = "WATER";
})(EnvironmentKey || (EnvironmentKey = {}));
let environment = [];
let environmentRows = 30;
let environmentColumns = 30;
for (let i = 0; i < environmentRows; i++) {
    let row = [];
    for (let j = 0; j < environmentColumns; j++) {
        if (Math.random() < 0.997) {
            row.push(EnvironmentKey.DEFAULT);
        }
        else {
            row.push((0,_util__WEBPACK_IMPORTED_MODULE_0__.randomInt)(1, 3));
        }
    }
    environment.push(row);
}
for (let k = 0; k < 10; k++) {
    let environmentCopy = [];
    for (let i = 0; i < environmentRows; i++) {
        let row = [];
        for (let j = 0; j < environmentColumns; j++) {
            row.push(environment[i][j]);
        }
        environmentCopy.push(row);
    }
    for (let i = 0; i < environmentRows; i++) {
        for (let j = 0; j < environmentColumns; j++) {
            if (environmentCopy[i][j] !== EnvironmentKey.DEFAULT && Math.random() > 0.5) {
                switch ((0,_util__WEBPACK_IMPORTED_MODULE_0__.randomInt)(1, 4)) {
                    case 1:
                        environment[(0,_util__WEBPACK_IMPORTED_MODULE_0__.wrapValue)(0, i + 1, environmentRows - 1)][j] = environment[i][j];
                        break;
                    case 2:
                        environment[i][(0,_util__WEBPACK_IMPORTED_MODULE_0__.wrapValue)(0, j + 1, environmentColumns - 1)] = environment[i][j];
                        break;
                    case 3:
                        environment[(0,_util__WEBPACK_IMPORTED_MODULE_0__.wrapValue)(0, i - 1, environmentRows - 1)][j] = environment[i][j];
                        break;
                    case 4:
                        environment[i][(0,_util__WEBPACK_IMPORTED_MODULE_0__.wrapValue)(0, j - 1, environmentColumns - 1)] = environment[i][j];
                        break;
                }
            }
        }
    }
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "canvas": () => (/* binding */ canvas)
/* harmony export */ });
/* harmony import */ var _enemy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enemy */ "./src/enemy.ts");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _key_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./key_state */ "./src/key_state.ts");
/* harmony import */ var _missile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./missile */ "./src/missile.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./vector */ "./src/vector.ts");






let previousTimeMillis;
let canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
canvas.id = "gameCanvas";
let ctx = canvas.getContext("2d");
let environmentTileSize = 50;
let centerRow = _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows / 2 - canvas.width / 2 / environmentTileSize;
let centerColumn = _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns / 2 - canvas.height / 2 / environmentTileSize;
let minimumSpeed = 0.003;
let currentSpeed = minimumSpeed;
let speedDegredationTimeMillis = 700;
let lastSpeedBoostSpeed;
let lastSpeedBoostTimeMillis;
let currentRotation = 0;
let minimumRotationSpeed = 0.004;
let currentRotationSpeed = minimumRotationSpeed;
let lastSpeedBoostRotationSpeed;
let logCounter = 0;
let keyStates = new Map();
keyStates.set("W", _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.UP);
keyStates.set("A", _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.UP);
keyStates.set("S", _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.UP);
keyStates.set("D", _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.UP);
let mouseDownY;
let mouseDownTime;
let preloadRegistry = new Map();
let guySprite = loadImage("../assets/guy.png");
let guyVelocityColumn = 0;
let guyVelocityRow = 0;
let guyHitVelocityColumn = 0;
let guyHitVelocityRow = 0;
let guyLastHitTimeMillis;
let guyHitRecoveryDurationMillis = 800;
let minGuyRadius = 10;
let maxGuyRadius = 40;
let currentGuyRadius = minGuyRadius;
let lastSpeedBoostGuyRadius;
let environmentTimers = [
    { currentTime: 0, maxTime: 7000 },
    { currentTime: 0, maxTime: 3500 },
    { currentTime: 0, maxTime: 3500 },
    { currentTime: 0, maxTime: 3500 },
];
let currentTransformation = 0;
let enemies = [];
// spawnEnemies();
let missile;
document.body.appendChild(canvas);
document.onkeydown = (e) => {
    if (e.repeat) {
        return;
    }
    let key = e.key.toUpperCase();
    if (keyStates.has(key)) {
        keyStates.set(key, _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.DOWN);
    }
};
document.onkeyup = (e) => {
    if (e.repeat) {
        return;
    }
    let key = e.key.toUpperCase();
    if (keyStates.has(key)) {
        keyStates.set(key, _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.UP);
    }
};
document.onmousedown = (e) => {
    mouseDownY = e.clientY;
    mouseDownTime = performance.now();
};
document.onmouseup = (e) => {
    let mouseUpY = e.clientY;
    let mouseUpTime = performance.now();
    let speedBoost = (0,_util__WEBPACK_IMPORTED_MODULE_4__.clampValue)(0, (mouseUpY - mouseDownY) / (mouseUpTime - mouseDownTime), 10);
    lastSpeedBoostTimeMillis = mouseUpTime;
    lastSpeedBoostSpeed = Math.max(minimumSpeed, speedBoost * 0.004);
    lastSpeedBoostRotationSpeed = Math.max(minimumRotationSpeed, speedBoost * 0.005);
    lastSpeedBoostGuyRadius = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(0, speedBoost, 10, minGuyRadius, maxGuyRadius);
};
function draw(currentTimeMillis) {
    if (previousTimeMillis === undefined) {
        previousTimeMillis = currentTimeMillis;
        window.requestAnimationFrame(draw);
        return;
    }
    let elapsedTimeMillis = currentTimeMillis - previousTimeMillis;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let moveX = (keyStates.get("A") === _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.DOWN ? -1 : 0)
        + (keyStates.get("D") === _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.DOWN ? 1 : 0);
    let moveY = (keyStates.get("W") === _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.DOWN ? -1 : 0)
        + (keyStates.get("S") === _key_state__WEBPACK_IMPORTED_MODULE_2__.KeyState.DOWN ? 1 : 0);
    let magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
    if (magnitude > 0) {
        moveX = moveX / magnitude * currentSpeed;
        moveY = moveY / magnitude * currentSpeed;
    }
    let hitX = 0;
    let hitY = 0;
    if (guyLastHitTimeMillis !== undefined) {
        hitX = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(guyLastHitTimeMillis, currentTimeMillis, guyLastHitTimeMillis + guyHitRecoveryDurationMillis, guyHitVelocityColumn, 0);
        hitY = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(guyLastHitTimeMillis, currentTimeMillis, guyLastHitTimeMillis + guyHitRecoveryDurationMillis, guyHitVelocityRow, 0);
    }
    guyVelocityColumn = moveX + hitX;
    guyVelocityRow = moveY + hitY;
    centerColumn += guyVelocityColumn * elapsedTimeMillis;
    centerRow += guyVelocityRow * elapsedTimeMillis;
    currentRotation += elapsedTimeMillis * currentRotationSpeed;
    if (lastSpeedBoostSpeed !== undefined) {
        currentSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostSpeed, minimumSpeed);
        currentRotationSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostRotationSpeed, minimumRotationSpeed);
        currentGuyRadius = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostGuyRadius, minGuyRadius);
    }
    else {
        currentSpeed = minimumSpeed;
        currentRotationSpeed = minimumRotationSpeed;
        currentGuyRadius = minGuyRadius;
    }
    let topLeftColumn = centerColumn - (canvas.width / 2) / environmentTileSize;
    let topLeftRow = centerRow - (canvas.height / 2) / environmentTileSize;
    let guyCenterX = (0,_util__WEBPACK_IMPORTED_MODULE_4__.columnToX)(centerColumn, topLeftColumn, environmentTileSize);
    let guyCenterY = (0,_util__WEBPACK_IMPORTED_MODULE_4__.rowToY)(centerRow, topLeftRow, environmentTileSize);
    let environmentDrawCount = drawEnvironment(topLeftColumn, topLeftRow);
    if (missile === undefined) {
        missile = new _missile__WEBPACK_IMPORTED_MODULE_3__.Missile(centerRow + 5, centerColumn + 5, 5, _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT, 0.0003);
    }
    // update all enemy x's and y's and move velocities
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    }
    missile.update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    // do collision and game simulation stuff
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if ((0,_util__WEBPACK_IMPORTED_MODULE_4__.collideCircles)(canvas.width / 2, canvas.height / 2, currentGuyRadius, enemy.x, enemy.y, enemy.radius)
            && (enemy.lastHitTimeMillis === undefined
                || (currentTimeMillis - enemy.lastHitTimeMillis) > enemy.hitRecoveryDurationMillis)) {
            let enemyMass = enemy.radius;
            let guyMass = currentGuyRadius;
            let guyCenter = new _vector__WEBPACK_IMPORTED_MODULE_5__.Vector(guyCenterX, guyCenterY);
            let enemyCenter = new _vector__WEBPACK_IMPORTED_MODULE_5__.Vector(enemy.x, enemy.y);
            let guyVelocity = new _vector__WEBPACK_IMPORTED_MODULE_5__.Vector(guyVelocityColumn, guyVelocityRow)
                .plus(enemyCenter.minus(guyCenter).normalize().scale(0.01));
            let enemyVelocity = new _vector__WEBPACK_IMPORTED_MODULE_5__.Vector(enemy.hitVelocityColumn, enemy.hitVelocityRow);
            let guyHitVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getCollisionVelocity)(guyCenter, enemyCenter, guyMass, enemyMass, guyVelocity, enemyVelocity).scale(0.2);
            guyHitVelocityColumn = guyHitVelocity.x;
            guyHitVelocityRow = guyHitVelocity.y;
            guyLastHitTimeMillis = currentTimeMillis;
            let enemyHitVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getCollisionVelocity)(enemyCenter, guyCenter, enemyMass, guyMass, enemyVelocity, guyVelocity).scale(0.3);
            enemy.lastHitTimeMillis = currentTimeMillis;
            enemy.hitVelocityColumn = enemyHitVelocity.x;
            enemy.hitVelocityRow = enemyHitVelocity.y;
            let damageMultiplier = getDamageMultiplier(currentTransformation, enemy.element);
            console.log(damageMultiplier);
            enemy.currentHealth -= (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(minGuyRadius, currentGuyRadius, maxGuyRadius, 0, 10 * damageMultiplier);
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
    missile.draw(currentTimeMillis, ctx);
    // update environment timers
    let currentEnvironment = getCurrentEnvironment(centerColumn, centerRow);
    if (currentEnvironment !== currentTransformation) {
        let currentTimer = environmentTimers[currentEnvironment];
        currentTimer.currentTime += elapsedTimeMillis;
        if (currentTimer.currentTime > currentTimer.maxTime) {
            currentTimer.currentTime = currentTimer.maxTime;
        }
    }
    for (let i = 0; i < environmentTimers.length; i++) {
        if (i !== currentEnvironment) {
            let currentTimer = environmentTimers[i];
            currentTimer.currentTime -= elapsedTimeMillis;
            if (currentTimer.currentTime < 0) {
                currentTimer.currentTime = 0;
            }
        }
    }
    // trigger transformation
    if (currentEnvironment !== currentTransformation
        && environmentTimers[currentEnvironment].currentTime === environmentTimers[currentEnvironment].maxTime) {
        console.log("TRANSFORM!!!");
        for (let i = 0; i < environmentTimers.length; i++) {
            environmentTimers[i].currentTime = 0;
        }
        currentTransformation = currentEnvironment;
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
    // draw transform-to bar
    if (currentEnvironment !== currentTransformation) {
        let tileCenterX = guyCenterX + 50;
        let tileCenterY = guyCenterY - 70;
        let tileSize = 25;
        ctx.save();
        drawEnvironmentTile(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, currentEnvironment);
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.strokeRect(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, tileSize);
        ctx.restore();
        let width = 100;
        let height = 10;
        let topLeftX = tileCenterX - tileSize / 2 - width - 10;
        let topLeftY = tileCenterY - height / 2;
        let currentEnvironmentTimer = environmentTimers[currentEnvironment];
        let fillRatio = (currentEnvironmentTimer.currentTime / currentEnvironmentTimer.maxTime);
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillStyle = "gray";
        ctx.fillRect(topLeftX, topLeftY, width * fillRatio, height);
        ctx.strokeRect(topLeftX, topLeftY, width, height);
        ctx.restore();
    }
    // draw fps
    let fps = 1000 / elapsedTimeMillis;
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
function loadImage(imageSource) {
    if (preloadRegistry.has(imageSource)) {
        throw new Error("You attempted to load the same image twice during preloading.");
    }
    preloadRegistry.set(imageSource, false);
    // The order these 3 things are done in is VERY important!
    let image = new Image();
    image.onload = () => {
        preloadRegistry.set(imageSource, true);
    };
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
        let minRadius = 7;
        let maxRadius = 20;
        let radius = (0,_util__WEBPACK_IMPORTED_MODULE_4__.randomInt)(minRadius, maxRadius);
        let health = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(minRadius, radius, maxRadius, 50, 200);
        let speed = (0,_util__WEBPACK_IMPORTED_MODULE_4__.mapLinear)(minRadius, radius, maxRadius, 0.001, 0.0005);
        enemies.push(new _enemy__WEBPACK_IMPORTED_MODULE_0__.Enemy(Math.random() * _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns, Math.random() * _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows, radius, health, (0,_util__WEBPACK_IMPORTED_MODULE_4__.randomInt)(0, 3), speed));
    }
}
function drawEnvironment(topLeftColumn, topLeftRow) {
    let bottomRightColumn = topLeftColumn + canvas.width / environmentTileSize;
    let bottomRightRow = topLeftRow + canvas.height / environmentTileSize;
    let minColumn = Math.floor(topLeftColumn);
    let maxColumn = Math.ceil(bottomRightColumn);
    let minRow = Math.floor(topLeftRow);
    let maxRow = Math.ceil(bottomRightRow);
    let environmentDrawCount = 0;
    ctx.save();
    for (let i = minRow; i <= maxRow; i++) {
        for (let j = minColumn; j <= maxColumn; j++) {
            let wrappedRow = (0,_util__WEBPACK_IMPORTED_MODULE_4__.wrapValue)(0, i, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows - 1);
            let wrappedColumn = (0,_util__WEBPACK_IMPORTED_MODULE_4__.wrapValue)(0, j, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns - 1);
            let key = _environment__WEBPACK_IMPORTED_MODULE_1__.environment[wrappedRow][wrappedColumn];
            let x = (0,_util__WEBPACK_IMPORTED_MODULE_4__.columnToX)(j, topLeftColumn, environmentTileSize);
            let y = (0,_util__WEBPACK_IMPORTED_MODULE_4__.rowToY)(i, topLeftRow, environmentTileSize);
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
function drawEnvironmentTile(x, y, size, key) {
    ctx.fillStyle = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getEnvironmentColor)(key).toString();
    ctx.fillRect(x, y, size, size);
}
function getCurrentEnvironment(centerColumn, centerRow) {
    let wrappedRow = (0,_util__WEBPACK_IMPORTED_MODULE_4__.wrapValue)(0, Math.floor(centerRow), _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows - 1);
    let wrappedColumn = (0,_util__WEBPACK_IMPORTED_MODULE_4__.wrapValue)(0, Math.floor(centerColumn), _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns - 1);
    return _environment__WEBPACK_IMPORTED_MODULE_1__.environment[wrappedRow][wrappedColumn];
}
function getDamageMultiplier(attacker, defender) {
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT || defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT) {
        return 1;
    }
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.FOREST) {
        if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.WATER) {
            return 3;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DESERT) {
            return 0.5;
        }
        else {
            return 1;
        }
    }
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DESERT) {
        if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.FOREST) {
            return 3;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.WATER) {
            return 0.5;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DESERT) {
            return 1;
        }
    }
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.WATER) {
        if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DESERT) {
            return 3;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.FOREST) {
            return 0.5;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.WATER) {
            return 1;
        }
    }
}
window.setTimeout(preload, 0);


/***/ }),

/***/ "./src/key_state.ts":
/*!**************************!*\
  !*** ./src/key_state.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeyState": () => (/* binding */ KeyState)
/* harmony export */ });
var KeyState;
(function (KeyState) {
    KeyState[KeyState["UP"] = 0] = "UP";
    KeyState[KeyState["DOWN"] = 1] = "DOWN";
})(KeyState || (KeyState = {}));


/***/ }),

/***/ "./src/missile.ts":
/*!************************!*\
  !*** ./src/missile.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Missile": () => (/* binding */ Missile)
/* harmony export */ });
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vector */ "./src/vector.ts");




class Missile {
    constructor(row, column, radius, element, moveSpeed) {
        this.logCounter = 0;
        this.row = row;
        this.column = column;
        this.radius = radius;
        this.element = element;
        this.moveSpeed = moveSpeed;
        this.turningSpeed = 0.001;
        this.moveVelocityColumn = 0;
        this.moveVelicityRow = 0;
    }
    update(wrappedCenterColumn, wrappedCenterRow, environmentTileSize, currentTimeMillis) {
        let elapsedTimeMillis = 0;
        if (this.lastUpdateTimeMillis !== undefined) {
            elapsedTimeMillis = currentTimeMillis - this.lastUpdateTimeMillis;
        }
        this.totalVelocityColumn = this.moveVelocityColumn;
        this.totalVelocityRow = this.moveVelicityRow;
        this.column += this.totalVelocityColumn * elapsedTimeMillis;
        this.row += this.totalVelocityRow * elapsedTimeMillis;
        let dx = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getDistance)(wrappedCenterColumn, this.column, 0, _environment__WEBPACK_IMPORTED_MODULE_0__.environmentColumns - 1) * environmentTileSize;
        let dy = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getDistance)(wrappedCenterRow, this.row, 0, _environment__WEBPACK_IMPORTED_MODULE_0__.environmentRows - 1) * environmentTileSize;
        let idealMoveDirection = new _vector__WEBPACK_IMPORTED_MODULE_3__.Vector(-dx, -dy).normalize();
        let moveDirection;
        if (this.lastUpdateTimeMillis === undefined) {
            moveDirection = idealMoveDirection;
            console.log("idealMoveDirection", idealMoveDirection);
        }
        else {
            let idealAngle = idealMoveDirection.direction();
            let currentAngle = Math.atan2(this.moveVelicityRow, this.moveVelocityColumn);
            let dAngle = -(0,_util__WEBPACK_IMPORTED_MODULE_2__.getDistance)(idealAngle, currentAngle, 0, 2 * Math.PI);
            let angleSign = dAngle / Math.sqrt(dAngle * dAngle);
            if (dAngle === 0) {
                angleSign = 1;
            }
            let maxTurnSpeed = Math.min(Math.abs(dAngle), this.turningSpeed * elapsedTimeMillis);
            let newAngle = currentAngle + maxTurnSpeed * angleSign;
            moveDirection = new _vector__WEBPACK_IMPORTED_MODULE_3__.Vector(Math.cos(newAngle), Math.sin(newAngle));
            if (this.logCounter < 1) {
                console.log(this.column, this.row);
                console.log(dx, dy);
                console.log("idealMoveDirection", idealMoveDirection);
                console.log("idealAngle", idealAngle);
                console.log("currentAngle", currentAngle);
                console.log("dAngle", dAngle);
                console.log("angleSign", angleSign);
                console.log("maxTurnSpeed", maxTurnSpeed);
                console.log("newAngle", newAngle);
                console.log("moveDirection", moveDirection);
                this.logCounter++;
            }
        }
        let moveVelocity;
        if (this.lastUpdateTimeMillis !== undefined) {
            moveVelocity = moveDirection.scale(this.moveSpeed * elapsedTimeMillis);
        }
        else {
            moveVelocity = moveDirection.scale(0.0001);
        }
        this.moveVelocityColumn = moveVelocity.x;
        this.moveVelicityRow = moveVelocity.y;
        this.x = _index__WEBPACK_IMPORTED_MODULE_1__.canvas.width / 2 + dx;
        this.y = _index__WEBPACK_IMPORTED_MODULE_1__.canvas.height / 2 + dy;
        this.lastUpdateTimeMillis = currentTimeMillis;
    }
    draw(currentTimeMillis, ctx) {
        let moveDirection = new _vector__WEBPACK_IMPORTED_MODULE_3__.Vector(this.moveVelocityColumn, this.moveVelicityRow)
            .normalize()
            .scale(10);
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.x - moveDirection.x, this.y - moveDirection.y);
        ctx.lineTo(this.x + moveDirection.x, this.y + moveDirection.y);
        ctx.closePath();
        ctx.stroke();
        // ctx.fillRect(this.x, this.y, 4, 4);
        ctx.restore();
    }
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clampValue": () => (/* binding */ clampValue),
/* harmony export */   "collideCircles": () => (/* binding */ collideCircles),
/* harmony export */   "columnToX": () => (/* binding */ columnToX),
/* harmony export */   "getCollisionVelocity": () => (/* binding */ getCollisionVelocity),
/* harmony export */   "getDistance": () => (/* binding */ getDistance),
/* harmony export */   "getEnvironmentColor": () => (/* binding */ getEnvironmentColor),
/* harmony export */   "mapLinear": () => (/* binding */ mapLinear),
/* harmony export */   "randomInt": () => (/* binding */ randomInt),
/* harmony export */   "rowToY": () => (/* binding */ rowToY),
/* harmony export */   "wrapValue": () => (/* binding */ wrapValue)
/* harmony export */ });
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vector */ "./src/vector.ts");



// note: assumes fromStart is less than fromEnd, toStart is less than toEnd
function mapLinear(fromStart, fromValue, fromEnd, toStart, toEnd) {
    fromValue = clampValue(Math.min(fromStart, fromEnd), fromValue, Math.max(fromStart, fromEnd));
    let ratio = (fromValue - fromStart) / (fromEnd - fromStart);
    return toStart + ratio * (toEnd - toStart);
}
function clampValue(min, value, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}
// function taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// The maximum is inclusive and the minimum is inclusive
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function wrapValue(min, value, max) {
    if (value < min || value > max) {
        return mod(value - min, max + 1 - min) + min;
    }
    return value;
}
// this modulo handles negatives how it's supposed to
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}
function columnToX(column, topLeftColumn, environmentTileSize) {
    return (column - topLeftColumn) * environmentTileSize;
}
function rowToY(row, topLeftRow, environmentTileSize) {
    return (row - topLeftRow) * environmentTileSize;
}
function collideCircles(x1, y1, r1, x2, y2, r2) {
    return Math.abs(x1 - x2) < r1 + r2
        && Math.abs(y1 - y2) < r1 + r2;
}
function getCollisionVelocity(c1, c2, m1, m2, v1, v2) {
    let c1Minusc2 = c1.minus(c2);
    return c1Minusc2
        .scale(-2 * m2 / (m1 + m2)
        * _vector__WEBPACK_IMPORTED_MODULE_2__.Vector.innerProduct(v1.minus(v2), c1Minusc2)
        / c1Minusc2.normSquared());
}
function getEnvironmentColor(key) {
    switch (key) {
        case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT:
            return new _color__WEBPACK_IMPORTED_MODULE_0__.Color(100, 255, 100);
        case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.FOREST:
            return new _color__WEBPACK_IMPORTED_MODULE_0__.Color(0, 200, 0);
        case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DESERT:
            return new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 255, 50);
        case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.WATER:
            return new _color__WEBPACK_IMPORTED_MODULE_0__.Color(0, 0, 255);
    }
}
// a is assumed to be the origin
function getDistance(a, b, min, max) {
    let dist1 = wrapValue(min, b - a, max);
    let dist2 = wrapValue(min, a - b, max);
    let minDist;
    let direction = 0;
    //        a   b
    // [0 1 2 3 4 5 6 7 8]
    if (b >= a && dist1 <= dist2) {
        direction = 1;
        minDist = dist1;
        //    a           b
        // [0 1 2 3 4 5 6 7 8]
    }
    else if (b >= a && dist1 > dist2) {
        direction = -1;
        minDist = dist2;
        //        b   a
        // [0 1 2 3 4 5 6 7 8]
    }
    else if (b < a && dist2 <= dist1) {
        direction = -1;
        minDist = dist2;
        //    b           a
        // [0 1 2 3 4 5 6 7 8]
    }
    else if (b < a && dist2 > dist1) {
        direction = 1;
        minDist = dist1;
    }
    return direction * minDist;
}


/***/ }),

/***/ "./src/vector.ts":
/*!***********************!*\
  !*** ./src/vector.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector": () => (/* binding */ Vector)
/* harmony export */ });
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    plus(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    static innerProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normSquared() {
        return this.x * this.x + this.y * this.y;
    }
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    normalize() {
        return new Vector(this.x, this.y).scale(1 / this.magnitude());
    }
    direction() {
        return Math.atan2(this.y, this.x);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9jb2xvci50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2VuZW15LnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvZW52aXJvbm1lbnQudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2tleV9zdGF0ZS50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL21pc3NpbGUudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWFwTGluZWFyIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyB0aGlzLnIgKyBcIixcIiArIHRoaXMuZyArIFwiLFwiICsgdGhpcy5iICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0b1JHQihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICsgciArIFwiLFwiICsgZyArIFwiLFwiICsgYiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9SR0JBKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBcInJnYmEoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIsXCIgKyBhICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwQ29sb3JzKGMxOiBDb2xvciwgYzI6IENvbG9yLCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgbWFwTGluZWFyKDAsIHJhdGlvLCAxLCBjMS5yLCBjMi5yKSxcclxuICAgICAgICAgICAgbWFwTGluZWFyKDAsIHJhdGlvLCAxLCBjMS5nLCBjMi5nKSxcclxuICAgICAgICAgICAgbWFwTGluZWFyKDAsIHJhdGlvLCAxLCBjMS5iLCBjMi5iKSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnRDb2x1bW5zLCBFbnZpcm9ubWVudEtleSwgZW52aXJvbm1lbnRSb3dzIH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHsgZ2V0RGlzdGFuY2UsIGdldEVudmlyb25tZW50Q29sb3IsIG1hcExpbmVhciwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmVteSB7XHJcbiAgICBwdWJsaWMgcm93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyByYWRpdXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0SGl0VGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaGl0VmVsb2NpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsaWNpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXM6IG51bWJlciA9IDUwMDtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIG1heEhlYWx0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRIZWFsdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbGVtZW50OiBFbnZpcm9ubWVudEtleTtcclxuICAgIHB1YmxpYyBkZWZhdWx0Q29sb3I6IENvbG9yO1xyXG4gICAgcHVibGljIG1vdmVTcGVlZDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICByb3c6IG51bWJlcixcclxuICAgICAgICBjb2x1bW46IG51bWJlcixcclxuICAgICAgICByYWRpdXM6IG51bWJlcixcclxuICAgICAgICBoZWFsdGg6IG51bWJlcixcclxuICAgICAgICBlbGVtZW50OiBFbnZpcm9ubWVudEtleSxcclxuICAgICAgICBtb3ZlU3BlZWQ6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcm93O1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMuaGl0VmVsb2NpdHlDb2x1bW4gPSAwO1xyXG4gICAgICAgIHRoaXMuaGl0VmVsb2NpdHlSb3cgPSAwO1xyXG4gICAgICAgIHRoaXMubWF4SGVhbHRoID0gaGVhbHRoO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEhlYWx0aCA9IGhlYWx0aCAqIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICBsZXQgdGVtcENvbG9yID0gdGhpcy5lbGVtZW50ID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUXHJcbiAgICAgICAgICAgID8gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpXHJcbiAgICAgICAgICAgIDogZ2V0RW52aXJvbm1lbnRDb2xvcih0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdENvbG9yID0gQ29sb3IubGVycENvbG9ycyhcclxuICAgICAgICAgICAgdGVtcENvbG9yLFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSksXHJcbiAgICAgICAgICAgIDAuMTUsXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiA9IDA7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsaWNpdHlSb3cgPSAwO1xyXG4gICAgICAgIHRoaXMubW92ZVNwZWVkID0gbW92ZVNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoXHJcbiAgICAgICAgd3JhcHBlZENlbnRlckNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJSb3c6IG51bWJlcixcclxuICAgICAgICBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBoaXRWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxuICAgICAgICBpZiAodGhpcy5sYXN0SGl0VGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGhpdFZlbG9jaXR5Q29sdW1uID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyArIHRoaXMuaGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGl0VmVsb2NpdHlDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaGl0VmVsb2NpdHlSb3cgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICsgdGhpcy5oaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRWZWxvY2l0eVJvdyxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRvdGFsVmVsb2NpdHlDb2x1bW4gPSBoaXRWZWxvY2l0eUNvbHVtbiArIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uO1xyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eVJvdyA9IGhpdFZlbG9jaXR5Um93ICsgdGhpcy5tb3ZlVmVsaWNpdHlSb3c7XHJcblxyXG4gICAgICAgIHRoaXMuY29sdW1uICs9IHRoaXMudG90YWxWZWxvY2l0eUNvbHVtbiAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHRoaXMucm93ICs9IHRoaXMudG90YWxWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgICAgICBsZXQgZHggPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyQ29sdW1uLCB0aGlzLmNvbHVtbiwgMCwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgICAgIGxldCBkeSA9IGdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJSb3csIHRoaXMucm93LCAwLCBlbnZpcm9ubWVudFJvd3MgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcblxyXG4gICAgICAgIGxldCBtb3ZlVmVsb2NpdHk6IFZlY3RvciA9IG5ldyBWZWN0b3IoLWR4LCAtZHkpLm5vcm1hbGl6ZSgpLnNjYWxlKHRoaXMubW92ZVNwZWVkKTtcclxuICAgICAgICB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiA9IG1vdmVWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMubW92ZVZlbGljaXR5Um93ID0gbW92ZVZlbG9jaXR5Lnk7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IGNhbnZhcy53aWR0aCAvIDIgKyBkeDtcclxuICAgICAgICB0aGlzLnkgPSBjYW52YXMuaGVpZ2h0IC8gMiArIGR5O1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcoXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgYSAgICAgICAgICAgYlxyXG4gICAgICAgIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuXHJcbiAgICAgICAgZGlzdDEgPSBNYXRoLmFicyhhIC0gYik7XHJcbiAgICAgICAgZGlzdDIgPSAoYSAtIG1pbikgKyAobWF4IC0gYik7XHJcblxyXG4gICAgICAgIGEgLSBiID0gLTYgKG1vZCA5KSA9PiAzXHJcblxyXG5cclxuICAgICAgICAgICAgIGIgICAgICAgYVxyXG4gICAgICAgIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgICAgICBcclxuICAgICAgICBiIC0gYSA9IC00IChtb2QgOSkgPSA1XHJcbiAgICAgICAgbGVuICsgKDIgKyAxKSAtICg2ICsgMSkgPSBsZW4gKyAzIC0gNyA9IGxlbiAtIDQgPSA1XHJcbiAgICAgICAgLy8g4oCLbGVuICsgKG1pbihhLGIpICsgMSkgLSAobWF4KGEsYikgKyAxKVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb2xvclJhdGlvID0gMTtcclxuICAgICAgICBpZiAodGhpcy5sYXN0SGl0VGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbG9yUmF0aW8gPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICsgMTAwMCxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gQ29sb3IubGVycENvbG9ycyhcclxuICAgICAgICAgICAgbmV3IENvbG9yKDI1NSwgMCwgMCksXHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbG9yLFxyXG4gICAgICAgICAgICBjb2xvclJhdGlvLFxyXG4gICAgICAgICkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gdGhpcy5tYXhIZWFsdGggLyAyO1xyXG4gICAgICAgIGxldCBoZWlnaHQ6IG51bWJlciA9IDQ7XHJcbiAgICAgICAgbGV0IHRvcExlZnRYOiBudW1iZXIgPSB0aGlzLnggLSB3aWR0aCAvIDI7XHJcbiAgICAgICAgbGV0IHRvcExlZnRZOiBudW1iZXIgPSB0aGlzLnkgLSB0aGlzLnJhZGl1cyAtIGhlaWdodCAvIDIgLSA4O1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogKHRoaXMuY3VycmVudEhlYWx0aCAvIHRoaXMubWF4SGVhbHRoKSwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcmFuZG9tSW50LCB3cmFwVmFsdWUgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5leHBvcnQgZW51bSBFbnZpcm9ubWVudEtleSB7XHJcbiAgICBERUZBVUxULFxyXG4gICAgRk9SRVNULFxyXG4gICAgREVTRVJULFxyXG4gICAgV0FURVIsXHJcbn1cclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudDogRW52aXJvbm1lbnRLZXlbXVtdID0gW107XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnRSb3dzOiBudW1iZXIgPSAzMDtcclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudENvbHVtbnM6IG51bWJlciA9IDMwO1xyXG5cclxuZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgbGV0IHJvdzogRW52aXJvbm1lbnRLZXlbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC45OTcpIHtcclxuICAgICAgICAgICAgcm93LnB1c2goRW52aXJvbm1lbnRLZXkuREVGQVVMVCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcm93LnB1c2gocmFuZG9tSW50KDEsIDMpIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbnZpcm9ubWVudC5wdXNoKHJvdyk7XHJcbn1cclxuXHJcbmZvciAobGV0IGsgPSAwOyBrIDwgMTA7IGsrKykge1xyXG4gICAgbGV0IGVudmlyb25tZW50Q29weTogRW52aXJvbm1lbnRLZXlbXVtdID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJvdzogRW52aXJvbm1lbnRLZXlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICAgICAgcm93LnB1c2goZW52aXJvbm1lbnRbaV1bal0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbnZpcm9ubWVudENvcHkucHVzaChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChlbnZpcm9ubWVudENvcHlbaV1bal0gIT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQgJiYgTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHJhbmRvbUludCgxLCA0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbd3JhcFZhbHVlKDAsIGkrMSwgZW52aXJvbm1lbnRSb3dzIC0gMSldW2pdID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbaV1bd3JhcFZhbHVlKDAsIGorMSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSldID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbd3JhcFZhbHVlKDAsIGktMSwgZW52aXJvbm1lbnRSb3dzIC0gMSldW2pdID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbaV1bd3JhcFZhbHVlKDAsIGotMSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSldID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgRW5lbXkgfSBmcm9tIFwiLi9lbmVteVwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudCwgZW52aXJvbm1lbnRDb2x1bW5zLCBFbnZpcm9ubWVudEtleSwgZW52aXJvbm1lbnRSb3dzIH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgS2V5U3RhdGUgfSBmcm9tIFwiLi9rZXlfc3RhdGVcIjtcclxuaW1wb3J0IHsgTWlzc2lsZSB9IGZyb20gXCIuL21pc3NpbGVcIjtcclxuaW1wb3J0IHsgY2xhbXBWYWx1ZSwgY29sbGlkZUNpcmNsZXMsIGNvbHVtblRvWCwgZ2V0Q29sbGlzaW9uVmVsb2NpdHksIGdldEVudmlyb25tZW50Q29sb3IsIG1hcExpbmVhciwgcmFuZG9tSW50LCByb3dUb1ksIHdyYXBWYWx1ZSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG5sZXQgcHJldmlvdXNUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5leHBvcnQgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5jYW52YXMud2lkdGggPSA4MDA7XHJcbmNhbnZhcy5oZWlnaHQgPSA4MDA7XHJcbmNhbnZhcy5pZCA9IFwiZ2FtZUNhbnZhc1wiO1xyXG5sZXQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxubGV0IGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlciA9IDUwO1xyXG5sZXQgY2VudGVyUm93OiBudW1iZXIgPSBlbnZpcm9ubWVudFJvd3MgLyAyIC0gY2FudmFzLndpZHRoIC8gMiAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbmxldCBjZW50ZXJDb2x1bW46IG51bWJlciA9IGVudmlyb25tZW50Q29sdW1ucyAvIDIgLSBjYW52YXMuaGVpZ2h0IC8gMiAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcblxyXG5sZXQgbWluaW11bVNwZWVkOiBudW1iZXIgPSAwLjAwMztcclxubGV0IGN1cnJlbnRTcGVlZDogbnVtYmVyID0gbWluaW11bVNwZWVkO1xyXG5sZXQgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXM6IG51bWJlciA9IDcwMDtcclxubGV0IGxhc3RTcGVlZEJvb3N0U3BlZWQ6IG51bWJlcjtcclxuXHJcbmxldCBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXM6IG51bWJlcjtcclxuXHJcbmxldCBjdXJyZW50Um90YXRpb246IG51bWJlciA9IDA7XHJcbmxldCBtaW5pbXVtUm90YXRpb25TcGVlZDogbnVtYmVyID0gMC4wMDQ7XHJcbmxldCBjdXJyZW50Um90YXRpb25TcGVlZDogbnVtYmVyID0gbWluaW11bVJvdGF0aW9uU3BlZWQ7XHJcbmxldCBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQ6IG51bWJlcjtcclxuXHJcbmxldCBsb2dDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxubGV0IGtleVN0YXRlczogTWFwPHN0cmluZywgS2V5U3RhdGU+ID0gbmV3IE1hcCgpO1xyXG5rZXlTdGF0ZXMuc2V0KFwiV1wiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJBXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIlNcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiRFwiLCBLZXlTdGF0ZS5VUCk7XHJcblxyXG5sZXQgbW91c2VEb3duWTogbnVtYmVyO1xyXG5sZXQgbW91c2VEb3duVGltZTogbnVtYmVyO1xyXG5cclxubGV0IHByZWxvYWRSZWdpc3RyeTogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwKCk7XHJcblxyXG5sZXQgZ3V5U3ByaXRlOiBIVE1MSW1hZ2VFbGVtZW50ID0gbG9hZEltYWdlKFwiLi4vYXNzZXRzL2d1eS5wbmdcIik7XHJcbmxldCBndXlWZWxvY2l0eUNvbHVtbjogbnVtYmVyID0gMDtcclxubGV0IGd1eVZlbG9jaXR5Um93OiBudW1iZXIgPSAwO1xyXG5sZXQgZ3V5SGl0VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbmxldCBndXlIaXRWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxubGV0IGd1eUxhc3RIaXRUaW1lTWlsbGlzOiBudW1iZXI7XHJcbmxldCBndXlIaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzOiBudW1iZXIgPSA4MDA7XHJcbmxldCBtaW5HdXlSYWRpdXM6IG51bWJlciA9IDEwO1xyXG5sZXQgbWF4R3V5UmFkaXVzOiBudW1iZXIgPSA0MDtcclxubGV0IGN1cnJlbnRHdXlSYWRpdXM6IG51bWJlciA9IG1pbkd1eVJhZGl1cztcclxubGV0IGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzOiBudW1iZXI7XHJcblxyXG5sZXQgZW52aXJvbm1lbnRUaW1lcnM6IHtjdXJyZW50VGltZTogbnVtYmVyLCBtYXhUaW1lOiBudW1iZXJ9W10gPSBbXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDcwMDB9LFxyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiAzNTAwfSxcclxuICAgIHtjdXJyZW50VGltZTogMCwgbWF4VGltZTogMzUwMH0sXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDM1MDB9LFxyXG5dO1xyXG5sZXQgY3VycmVudFRyYW5zZm9ybWF0aW9uOiBudW1iZXIgPSAwO1xyXG5cclxubGV0IGVuZW1pZXM6IEVuZW15W10gPSBbXTtcclxuLy8gc3Bhd25FbmVtaWVzKCk7XHJcblxyXG5sZXQgbWlzc2lsZTogTWlzc2lsZTtcclxuXHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuXHJcbmRvY3VtZW50Lm9ua2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuRE9XTik7XHJcbiAgICB9XHJcbn07XHJcbmRvY3VtZW50Lm9ua2V5dXAgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgaWYgKGUucmVwZWF0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGtleSA9IGUua2V5LnRvVXBwZXJDYXNlKCk7XHJcbiAgICBpZiAoa2V5U3RhdGVzLmhhcyhrZXkpKSB7XHJcbiAgICAgICAga2V5U3RhdGVzLnNldChrZXksIEtleVN0YXRlLlVQKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgbW91c2VEb3duWSA9IGUuY2xpZW50WTtcclxuICAgIG1vdXNlRG93blRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxufVxyXG5kb2N1bWVudC5vbm1vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgbGV0IG1vdXNlVXBZID0gZS5jbGllbnRZO1xyXG4gICAgbGV0IG1vdXNlVXBUaW1lOiBudW1iZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGxldCBzcGVlZEJvb3N0ID0gY2xhbXBWYWx1ZShcclxuICAgICAgICAwLFxyXG4gICAgICAgIChtb3VzZVVwWSAtIG1vdXNlRG93blkpIC8gKG1vdXNlVXBUaW1lIC0gbW91c2VEb3duVGltZSksXHJcbiAgICAgICAgMTAsXHJcbiAgICApO1xyXG4gICAgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzID0gbW91c2VVcFRpbWU7XHJcbiAgICBsYXN0U3BlZWRCb29zdFNwZWVkID0gTWF0aC5tYXgobWluaW11bVNwZWVkLCBzcGVlZEJvb3N0ICogMC4wMDQpO1xyXG4gICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkID0gTWF0aC5tYXgobWluaW11bVJvdGF0aW9uU3BlZWQsIHNwZWVkQm9vc3QgKiAwLjAwNSk7XHJcbiAgICBsYXN0U3BlZWRCb29zdEd1eVJhZGl1cyA9IG1hcExpbmVhcigwLCBzcGVlZEJvb3N0LCAxMCwgbWluR3V5UmFkaXVzLCBtYXhHdXlSYWRpdXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3KGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIpIHtcclxuICAgIGlmIChwcmV2aW91c1RpbWVNaWxsaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByZXZpb3VzVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGVsYXBzZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXMgLSBwcmV2aW91c1RpbWVNaWxsaXM7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgbGV0IG1vdmVYOiBudW1iZXIgPSAoa2V5U3RhdGVzLmdldChcIkFcIikgPT09IEtleVN0YXRlLkRPV04gPyAtMSA6IDApXHJcbiAgICAgICAgKyAoa2V5U3RhdGVzLmdldChcIkRcIikgPT09IEtleVN0YXRlLkRPV04gPyAxIDogMCk7XHJcbiAgICBsZXQgbW92ZVk6IG51bWJlciA9IChrZXlTdGF0ZXMuZ2V0KFwiV1wiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IC0xIDogMClcclxuICAgICAgICArIChrZXlTdGF0ZXMuZ2V0KFwiU1wiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IDEgOiAwKTtcclxuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQobW92ZVggKiBtb3ZlWCArIG1vdmVZICogbW92ZVkpO1xyXG4gICAgaWYgKG1hZ25pdHVkZSA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IG1vdmVYIC8gbWFnbml0dWRlICogY3VycmVudFNwZWVkO1xyXG4gICAgICAgIG1vdmVZID0gbW92ZVkgLyBtYWduaXR1ZGUgKiBjdXJyZW50U3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGhpdFg6IG51bWJlciA9IDA7XHJcbiAgICBsZXQgaGl0WTogbnVtYmVyID0gMDtcclxuICAgIGlmIChndXlMYXN0SGl0VGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaGl0WCA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgZ3V5TGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyArIGd1eUhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Q29sdW1uLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaGl0WSA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgZ3V5TGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyArIGd1eUhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Um93LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGd1eVZlbG9jaXR5Q29sdW1uID0gbW92ZVggKyBoaXRYO1xyXG4gICAgZ3V5VmVsb2NpdHlSb3cgPSBtb3ZlWSArIGhpdFk7XHJcblxyXG4gICAgY2VudGVyQ29sdW1uICs9IGd1eVZlbG9jaXR5Q29sdW1uICogZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICBjZW50ZXJSb3cgKz0gZ3V5VmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICBjdXJyZW50Um90YXRpb24gKz0gZWxhcHNlZFRpbWVNaWxsaXMgKiBjdXJyZW50Um90YXRpb25TcGVlZDtcclxuXHJcbiAgICBpZiAobGFzdFNwZWVkQm9vc3RTcGVlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY3VycmVudFNwZWVkID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAtIGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGxhc3RTcGVlZEJvb3N0U3BlZWQsXHJcbiAgICAgICAgICAgIG1pbmltdW1TcGVlZCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJlbnRSb3RhdGlvblNwZWVkID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAtIGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGxhc3RTcGVlZEJvb3N0Um90YXRpb25TcGVlZCxcclxuICAgICAgICAgICAgbWluaW11bVJvdGF0aW9uU3BlZWQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJyZW50R3V5UmFkaXVzID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAtIGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBtaW5HdXlSYWRpdXMsXHJcbiAgICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3VycmVudFNwZWVkID0gbWluaW11bVNwZWVkO1xyXG4gICAgICAgIGN1cnJlbnRSb3RhdGlvblNwZWVkID0gbWluaW11bVJvdGF0aW9uU3BlZWQ7XHJcbiAgICAgICAgY3VycmVudEd1eVJhZGl1cyA9IG1pbkd1eVJhZGl1cztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdG9wTGVmdENvbHVtbjogbnVtYmVyID0gY2VudGVyQ29sdW1uIC0gKGNhbnZhcy53aWR0aCAvIDIpIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCB0b3BMZWZ0Um93OiBudW1iZXIgPSBjZW50ZXJSb3cgLSAoY2FudmFzLmhlaWdodCAvIDIpIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBndXlDZW50ZXJYID0gY29sdW1uVG9YKGNlbnRlckNvbHVtbiwgdG9wTGVmdENvbHVtbiwgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICBsZXQgZ3V5Q2VudGVyWSA9IHJvd1RvWShjZW50ZXJSb3csIHRvcExlZnRSb3csIGVudmlyb25tZW50VGlsZVNpemUpO1xyXG4gICAgXHJcbiAgICBsZXQgZW52aXJvbm1lbnREcmF3Q291bnQgPSBkcmF3RW52aXJvbm1lbnQodG9wTGVmdENvbHVtbiwgdG9wTGVmdFJvdyk7XHJcblxyXG4gICAgaWYgKG1pc3NpbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIG1pc3NpbGUgPSBuZXcgTWlzc2lsZShjZW50ZXJSb3cgKyA1LCBjZW50ZXJDb2x1bW4gKyA1LCA1LCBFbnZpcm9ubWVudEtleS5ERUZBVUxULCAwLjAwMDMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBhbGwgZW5lbXkgeCdzIGFuZCB5J3MgYW5kIG1vdmUgdmVsb2NpdGllc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZW5lbWllc1tpXS51cGRhdGUoY2VudGVyQ29sdW1uLCBjZW50ZXJSb3csIGVudmlyb25tZW50VGlsZVNpemUsIGN1cnJlbnRUaW1lTWlsbGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBtaXNzaWxlLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG5cclxuICAgIC8vIGRvIGNvbGxpc2lvbiBhbmQgZ2FtZSBzaW11bGF0aW9uIHN0dWZmXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZW5lbXk6IEVuZW15ID0gZW5lbWllc1tpXTtcclxuICAgICAgICBpZiAoY29sbGlkZUNpcmNsZXMoXHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBlbmVteS54LFxyXG4gICAgICAgICAgICBlbmVteS55LFxyXG4gICAgICAgICAgICBlbmVteS5yYWRpdXMpXHJcbiAgICAgICAgICAgICYmIChcclxuICAgICAgICAgICAgICAgIGVuZW15Lmxhc3RIaXRUaW1lTWlsbGlzID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgIHx8IChjdXJyZW50VGltZU1pbGxpcyAtIGVuZW15Lmxhc3RIaXRUaW1lTWlsbGlzKSA+IGVuZW15LmhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXNcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgZW5lbXlNYXNzOiBudW1iZXIgPSBlbmVteS5yYWRpdXM7XHJcbiAgICAgICAgICAgIGxldCBndXlNYXNzOiBudW1iZXIgPSBjdXJyZW50R3V5UmFkaXVzO1xyXG4gICAgICAgICAgICBsZXQgZ3V5Q2VudGVyOiBWZWN0b3IgPSBuZXcgVmVjdG9yKGd1eUNlbnRlclgsIGd1eUNlbnRlclkpO1xyXG4gICAgICAgICAgICBsZXQgZW5lbXlDZW50ZXI6IFZlY3RvciA9IG5ldyBWZWN0b3IoZW5lbXkueCwgZW5lbXkueSk7XHJcbiAgICAgICAgICAgIGxldCBndXlWZWxvY2l0eTogVmVjdG9yID0gbmV3IFZlY3RvcihndXlWZWxvY2l0eUNvbHVtbiwgZ3V5VmVsb2NpdHlSb3cpXHJcbiAgICAgICAgICAgICAgICAucGx1cyhlbmVteUNlbnRlci5taW51cyhndXlDZW50ZXIpLm5vcm1hbGl6ZSgpLnNjYWxlKDAuMDEpKTtcclxuICAgICAgICAgICAgbGV0IGVuZW15VmVsb2NpdHk6IFZlY3RvciA9IG5ldyBWZWN0b3IoZW5lbXkuaGl0VmVsb2NpdHlDb2x1bW4sIGVuZW15LmhpdFZlbG9jaXR5Um93KTtcclxuICAgICAgICAgICAgbGV0IGd1eUhpdFZlbG9jaXR5OiBWZWN0b3IgPSBnZXRDb2xsaXNpb25WZWxvY2l0eShcclxuICAgICAgICAgICAgICAgIGd1eUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGVuZW15Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZ3V5TWFzcyxcclxuICAgICAgICAgICAgICAgIGVuZW15TWFzcyxcclxuICAgICAgICAgICAgICAgIGd1eVZlbG9jaXR5LFxyXG4gICAgICAgICAgICAgICAgZW5lbXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgKS5zY2FsZSgwLjIpO1xyXG4gICAgICAgICAgICBndXlIaXRWZWxvY2l0eUNvbHVtbiA9IGd1eUhpdFZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Um93ID0gZ3V5SGl0VmVsb2NpdHkueTtcclxuICAgICAgICAgICAgZ3V5TGFzdEhpdFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBlbmVteUhpdFZlbG9jaXR5OiBWZWN0b3IgPSBnZXRDb2xsaXNpb25WZWxvY2l0eShcclxuICAgICAgICAgICAgICAgIGVuZW15Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZ3V5Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlNYXNzLFxyXG4gICAgICAgICAgICAgICAgZ3V5TWFzcyxcclxuICAgICAgICAgICAgICAgIGVuZW15VmVsb2NpdHksXHJcbiAgICAgICAgICAgICAgICBndXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgKS5zY2FsZSgwLjMpO1xyXG4gICAgICAgICAgICBlbmVteS5sYXN0SGl0VGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBlbmVteS5oaXRWZWxvY2l0eUNvbHVtbiA9IGVuZW15SGl0VmVsb2NpdHkueDtcclxuICAgICAgICAgICAgZW5lbXkuaGl0VmVsb2NpdHlSb3cgPSBlbmVteUhpdFZlbG9jaXR5Lnk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgZGFtYWdlTXVsdGlwbGllcjogbnVtYmVyID0gZ2V0RGFtYWdlTXVsdGlwbGllcihjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgRW52aXJvbm1lbnRLZXksIGVuZW15LmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYW1hZ2VNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgZW5lbXkuY3VycmVudEhlYWx0aCAtPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICBtaW5HdXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgbWF4R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDEwICogZGFtYWdlTXVsdGlwbGllcixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIGRlYWQgZW5lbWllc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGVuZW1pZXNbaV0uY3VycmVudEhlYWx0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGVuZW1pZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBpLS07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgYWxsIGVuZW1pZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0uZHJhdyhjdXJyZW50VGltZU1pbGxpcywgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBtaXNzaWxlLmRyYXcoY3VycmVudFRpbWVNaWxsaXMsIGN0eCk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGVudmlyb25tZW50IHRpbWVyc1xyXG4gICAgbGV0IGN1cnJlbnRFbnZpcm9ubWVudDogRW52aXJvbm1lbnRLZXkgPSBnZXRDdXJyZW50RW52aXJvbm1lbnQoY2VudGVyQ29sdW1uLCBjZW50ZXJSb3cpO1xyXG4gICAgaWYgKGN1cnJlbnRFbnZpcm9ubWVudCAhPT0gKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSkpIHtcclxuICAgICAgICBsZXQgY3VycmVudFRpbWVyID0gZW52aXJvbm1lbnRUaW1lcnNbY3VycmVudEVudmlyb25tZW50XTtcclxuICAgICAgICBjdXJyZW50VGltZXIuY3VycmVudFRpbWUgKz0gZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA+IGN1cnJlbnRUaW1lci5tYXhUaW1lKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA9IGN1cnJlbnRUaW1lci5tYXhUaW1lXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFRpbWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICgoaSBhcyBFbnZpcm9ubWVudEtleSkgIT09IGN1cnJlbnRFbnZpcm9ubWVudCkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFRpbWVyID0gZW52aXJvbm1lbnRUaW1lcnNbaV07XHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSAtPSBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdHJpZ2dlciB0cmFuc2Zvcm1hdGlvblxyXG4gICAgaWYgKGN1cnJlbnRFbnZpcm9ubWVudCAhPT0gKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSlcclxuICAgICAgICAmJiBlbnZpcm9ubWVudFRpbWVyc1tjdXJyZW50RW52aXJvbm1lbnRdLmN1cnJlbnRUaW1lID09PSBlbnZpcm9ubWVudFRpbWVyc1tjdXJyZW50RW52aXJvbm1lbnRdLm1heFRpbWVcclxuICAgICkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVFJBTlNGT1JNISEhXCIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRUaW1lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZW52aXJvbm1lbnRUaW1lcnNbaV0uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50VHJhbnNmb3JtYXRpb24gPSBjdXJyZW50RW52aXJvbm1lbnQgYXMgbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBkcmF3IGVudmlyb25tZW50IGRyYXcgY291bnRcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KGVudmlyb25tZW50RHJhd0NvdW50LnRvU3RyaW5nKCksIGNhbnZhcy53aWR0aCAvIDIgLSAxMCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIC8vIGRyYXcgdGhlIGd1eVxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC50cmFuc2xhdGUoZ3V5Q2VudGVyWCwgZ3V5Q2VudGVyWSk7XHJcbiAgICBjdHgucm90YXRlKGN1cnJlbnRSb3RhdGlvbik7XHJcbiAgICBjdHgudHJhbnNsYXRlKC1ndXlDZW50ZXJYLCAtZ3V5Q2VudGVyWSk7XHJcbiAgICBjdHguZHJhd0ltYWdlKGd1eVNwcml0ZSwgZ3V5Q2VudGVyWCAtIGd1eVNwcml0ZS53aWR0aCAvIDIsIGd1eUNlbnRlclkgLSBndXlTcHJpdGUuaGVpZ2h0IC8gMik7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIC8vIGRyYXcgZ3V5IHJhZGl1cyAoZm9yIHRlc3RpbmcpXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoZ3V5Q2VudGVyWCwgZ3V5Q2VudGVyWSwgY3VycmVudEd1eVJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAvLyBkcmF3IHRyYW5zZm9ybS10byBiYXJcclxuICAgIGlmIChjdXJyZW50RW52aXJvbm1lbnQgIT09IGN1cnJlbnRUcmFuc2Zvcm1hdGlvbikge1xyXG4gICAgICAgIGxldCB0aWxlQ2VudGVyWDogbnVtYmVyID0gZ3V5Q2VudGVyWCArIDUwO1xyXG4gICAgICAgIGxldCB0aWxlQ2VudGVyWTogbnVtYmVyID0gZ3V5Q2VudGVyWSAtIDcwO1xyXG4gICAgICAgIGxldCB0aWxlU2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBkcmF3RW52aXJvbm1lbnRUaWxlKHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyLCB0aWxlQ2VudGVyWSAtIHRpbGVTaXplIC8gMiwgdGlsZVNpemUsIGN1cnJlbnRFbnZpcm9ubWVudCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCB0aWxlU2l6ZSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSAxMDA7XHJcbiAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gMTA7XHJcbiAgICAgICAgbGV0IHRvcExlZnRYOiBudW1iZXIgPSB0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiAtIHdpZHRoIC0gMTA7XHJcbiAgICAgICAgbGV0IHRvcExlZnRZOiBudW1iZXIgPSB0aWxlQ2VudGVyWSAtIGhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRFbnZpcm9ubWVudFRpbWVyOiB7Y3VycmVudFRpbWU6IG51bWJlciwgbWF4VGltZTogbnVtYmVyfSA9IGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF07XHJcbiAgICAgICAgbGV0IGZpbGxSYXRpbzogbnVtYmVyID0gKGN1cnJlbnRFbnZpcm9ubWVudFRpbWVyLmN1cnJlbnRUaW1lIC8gY3VycmVudEVudmlyb25tZW50VGltZXIubWF4VGltZSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JheVwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogZmlsbFJhdGlvLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGZwc1xyXG4gICAgbGV0IGZwczogbnVtYmVyID0gMTAwMCAvIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KE1hdGgucm91bmQoZnBzKS50b1N0cmluZygpICsgXCJGUFNcIiwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2VTb3VyY2U6IHN0cmluZyk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgaWYgKHByZWxvYWRSZWdpc3RyeS5oYXMoaW1hZ2VTb3VyY2UpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGF0dGVtcHRlZCB0byBsb2FkIHRoZSBzYW1lIGltYWdlIHR3aWNlIGR1cmluZyBwcmVsb2FkaW5nLlwiKTtcclxuICAgIH1cclxuICAgIHByZWxvYWRSZWdpc3RyeS5zZXQoaW1hZ2VTb3VyY2UsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBUaGUgb3JkZXIgdGhlc2UgMyB0aGluZ3MgYXJlIGRvbmUgaW4gaXMgVkVSWSBpbXBvcnRhbnQhXHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICBwcmVsb2FkUmVnaXN0cnkuc2V0KGltYWdlU291cmNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGltYWdlLnNyYyA9IGltYWdlU291cmNlO1xyXG5cclxuICAgIHJldHVybiBpbWFnZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlbG9hZCgpIHtcclxuICAgIGZvciAobGV0IFtrZXksIGxvYWRlZF0gb2YgcHJlbG9hZFJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgaWYgKCFsb2FkZWQpIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGF3bkVuZW1pZXMoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBsZXQgbWluUmFkaXVzOiBudW1iZXIgPSA3O1xyXG4gICAgICAgIGxldCBtYXhSYWRpdXM6IG51bWJlciA9IDIwO1xyXG4gICAgICAgIGxldCByYWRpdXM6IG51bWJlciA9IHJhbmRvbUludChtaW5SYWRpdXMsIG1heFJhZGl1cyk7XHJcbiAgICAgICAgbGV0IGhlYWx0aDogbnVtYmVyID0gbWFwTGluZWFyKG1pblJhZGl1cywgcmFkaXVzLCBtYXhSYWRpdXMsIDUwLCAyMDApO1xyXG4gICAgICAgIGxldCBzcGVlZDogbnVtYmVyID0gbWFwTGluZWFyKG1pblJhZGl1cywgcmFkaXVzLCBtYXhSYWRpdXMsIDAuMDAxLCAwLjAwMDUpO1xyXG4gICAgICAgIGVuZW1pZXMucHVzaChuZXcgRW5lbXkoXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBlbnZpcm9ubWVudENvbHVtbnMsXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBlbnZpcm9ubWVudFJvd3MsXHJcbiAgICAgICAgICAgIHJhZGl1cyxcclxuICAgICAgICAgICAgaGVhbHRoLFxyXG4gICAgICAgICAgICByYW5kb21JbnQoMCwgMykgYXMgRW52aXJvbm1lbnRLZXksXHJcbiAgICAgICAgICAgIHNwZWVkLFxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RW52aXJvbm1lbnQodG9wTGVmdENvbHVtbjogbnVtYmVyLCB0b3BMZWZ0Um93OiBudW1iZXIpIHtcclxuICAgIGxldCBib3R0b21SaWdodENvbHVtbjogbnVtYmVyID0gdG9wTGVmdENvbHVtbiArIGNhbnZhcy53aWR0aCAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICBsZXQgYm90dG9tUmlnaHRSb3c6IG51bWJlciA9IHRvcExlZnRSb3cgKyBjYW52YXMuaGVpZ2h0IC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBtaW5Db2x1bW46IG51bWJlciA9IE1hdGguZmxvb3IodG9wTGVmdENvbHVtbik7XHJcbiAgICBsZXQgbWF4Q29sdW1uOiBudW1iZXIgPSBNYXRoLmNlaWwoYm90dG9tUmlnaHRDb2x1bW4pO1xyXG4gICAgbGV0IG1pblJvdzogbnVtYmVyID0gTWF0aC5mbG9vcih0b3BMZWZ0Um93KTtcclxuICAgIGxldCBtYXhSb3c6IG51bWJlciA9IE1hdGguY2VpbChib3R0b21SaWdodFJvdyk7XHJcbiAgICBsZXQgZW52aXJvbm1lbnREcmF3Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgZm9yIChsZXQgaSA9IG1pblJvdzsgaSA8PSBtYXhSb3c7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSBtaW5Db2x1bW47IGogPD0gbWF4Q29sdW1uOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IHdyYXBwZWRSb3c6IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBpLCBlbnZpcm9ubWVudFJvd3MgLSAxKTtcclxuICAgICAgICAgICAgbGV0IHdyYXBwZWRDb2x1bW46IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBqLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgbGV0IGtleTogRW52aXJvbm1lbnRLZXkgPSBlbnZpcm9ubWVudFt3cmFwcGVkUm93XVt3cmFwcGVkQ29sdW1uXTtcclxuICAgICAgICAgICAgbGV0IHggPSBjb2x1bW5Ub1goaiwgdG9wTGVmdENvbHVtbiwgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIGxldCB5ID0gcm93VG9ZKGksIHRvcExlZnRSb3csIGVudmlyb25tZW50VGlsZVNpemUpO1xyXG4gICAgICAgICAgICBkcmF3RW52aXJvbm1lbnRUaWxlKE1hdGguZmxvb3IoeCksIE1hdGguZmxvb3IoeSksIGVudmlyb25tZW50VGlsZVNpemUsIGtleSk7XHJcblxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChcIihcIiArIHdyYXBwZWRSb3cgKyBcIixcIiArIHdyYXBwZWRDb2x1bW4gKyBcIilcIiwgeCwgeSk7XHJcbiAgICAgICAgICAgIGVudmlyb25tZW50RHJhd0NvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIHJldHVybiBlbnZpcm9ubWVudERyYXdDb3VudDtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0Vudmlyb25tZW50VGlsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6ZTogbnVtYmVyLCBrZXk6IEVudmlyb25tZW50S2V5KSB7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gZ2V0RW52aXJvbm1lbnRDb2xvcihrZXkpLnRvU3RyaW5nKCk7XHJcbiAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2l6ZSwgc2l6ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEN1cnJlbnRFbnZpcm9ubWVudChjZW50ZXJDb2x1bW46IG51bWJlciwgY2VudGVyUm93OiBudW1iZXIpOiBFbnZpcm9ubWVudEtleSB7XHJcbiAgICBsZXQgd3JhcHBlZFJvdzogbnVtYmVyID0gd3JhcFZhbHVlKDAsIE1hdGguZmxvb3IoY2VudGVyUm93KSwgZW52aXJvbm1lbnRSb3dzIC0gMSk7XHJcbiAgICBsZXQgd3JhcHBlZENvbHVtbjogbnVtYmVyID0gd3JhcFZhbHVlKDAsIE1hdGguZmxvb3IoY2VudGVyQ29sdW1uKSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSk7XHJcbiAgICByZXR1cm4gZW52aXJvbm1lbnRbd3JhcHBlZFJvd11bd3JhcHBlZENvbHVtbl07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhbWFnZU11bHRpcGxpZXIoYXR0YWNrZXI6IEVudmlyb25tZW50S2V5LCBkZWZlbmRlcjogRW52aXJvbm1lbnRLZXkpOiBudW1iZXIge1xyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUIHx8IGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChhdHRhY2tlciA9PT0gRW52aXJvbm1lbnRLZXkuRk9SRVNUKSB7XHJcbiAgICAgICAgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkZPUkVTVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuREVTRVJUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkZPUkVTVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcblxyXG4iLCJleHBvcnQgZW51bSBLZXlTdGF0ZSB7XHJcbiAgICBVUCxcclxuICAgIERPV04sXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudENvbHVtbnMsIEVudmlyb25tZW50S2V5LCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBnZXREaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWlzc2lsZSB7XHJcbiAgICBwdWJsaWMgcm93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyByYWRpdXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsaWNpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGxhc3RVcGRhdGVUaW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZWxlbWVudDogRW52aXJvbm1lbnRLZXk7XHJcbiAgICBwdWJsaWMgZGVmYXVsdENvbG9yOiBDb2xvcjtcclxuICAgIHB1YmxpYyBtb3ZlU3BlZWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsaWZldGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIHR1cm5pbmdTcGVlZDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsb2dDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICByb3c6IG51bWJlcixcclxuICAgICAgICBjb2x1bW46IG51bWJlcixcclxuICAgICAgICByYWRpdXM6IG51bWJlcixcclxuICAgICAgICBlbGVtZW50OiBFbnZpcm9ubWVudEtleSxcclxuICAgICAgICBtb3ZlU3BlZWQ6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcm93O1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5tb3ZlU3BlZWQgPSBtb3ZlU3BlZWQ7XHJcbiAgICAgICAgdGhpcy50dXJuaW5nU3BlZWQgPSAwLjAwMTtcclxuICAgICAgICB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiA9IDA7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsaWNpdHlSb3cgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoXHJcbiAgICAgICAgd3JhcHBlZENlbnRlckNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJSb3c6IG51bWJlcixcclxuICAgICAgICBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eUNvbHVtbiA9IHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uO1xyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eVJvdyA9IHRoaXMubW92ZVZlbGljaXR5Um93O1xyXG5cclxuICAgICAgICB0aGlzLmNvbHVtbiArPSB0aGlzLnRvdGFsVmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICB0aGlzLnJvdyArPSB0aGlzLnRvdGFsVmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICAgICAgbGV0IGR4ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlckNvbHVtbiwgdGhpcy5jb2x1bW4sIDAsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgICAgICBsZXQgZHkgPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyUm93LCB0aGlzLnJvdywgMCwgZW52aXJvbm1lbnRSb3dzIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxuICAgICAgICBsZXQgaWRlYWxNb3ZlRGlyZWN0aW9uOiBWZWN0b3IgPSBuZXcgVmVjdG9yKC1keCwgLWR5KS5ub3JtYWxpemUoKTtcclxuICAgICAgICBsZXQgbW92ZURpcmVjdGlvbjogVmVjdG9yO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbW92ZURpcmVjdGlvbiA9IGlkZWFsTW92ZURpcmVjdGlvbjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZGVhbE1vdmVEaXJlY3Rpb25cIiwgaWRlYWxNb3ZlRGlyZWN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaWRlYWxBbmdsZTogbnVtYmVyID0gaWRlYWxNb3ZlRGlyZWN0aW9uLmRpcmVjdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudEFuZ2xlOiBudW1iZXIgPSBNYXRoLmF0YW4yKHRoaXMubW92ZVZlbGljaXR5Um93LCB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbik7XHJcbiAgICAgICAgICAgIGxldCBkQW5nbGU6IG51bWJlciA9IC1nZXREaXN0YW5jZShpZGVhbEFuZ2xlLCBjdXJyZW50QW5nbGUsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgbGV0IGFuZ2xlU2lnbiA9IGRBbmdsZSAvIE1hdGguc3FydChkQW5nbGUgKiBkQW5nbGUpO1xyXG4gICAgICAgICAgICBpZiAoZEFuZ2xlID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhbmdsZVNpZ24gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBtYXhUdXJuU3BlZWQ6IG51bWJlciA9IE1hdGgubWluKE1hdGguYWJzKGRBbmdsZSksIHRoaXMudHVybmluZ1NwZWVkICogZWxhcHNlZFRpbWVNaWxsaXMpO1xyXG4gICAgICAgICAgICBsZXQgbmV3QW5nbGUgPSBjdXJyZW50QW5nbGUgKyBtYXhUdXJuU3BlZWQgKiBhbmdsZVNpZ247XHJcbiAgICAgICAgICAgIG1vdmVEaXJlY3Rpb24gPSBuZXcgVmVjdG9yKE1hdGguY29zKG5ld0FuZ2xlKSwgTWF0aC5zaW4obmV3QW5nbGUpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ0NvdW50ZXIgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbiwgdGhpcy5yb3cpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZHgsIGR5KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRlYWxNb3ZlRGlyZWN0aW9uXCIsIGlkZWFsTW92ZURpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkZWFsQW5nbGVcIiwgaWRlYWxBbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnRBbmdsZVwiLCBjdXJyZW50QW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkQW5nbGVcIiwgZEFuZ2xlKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYW5nbGVTaWduXCIsIGFuZ2xlU2lnbik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1heFR1cm5TcGVlZFwiLCBtYXhUdXJuU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdBbmdsZVwiLCBuZXdBbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1vdmVEaXJlY3Rpb25cIiwgbW92ZURpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0NvdW50ZXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1vdmVWZWxvY2l0eTogVmVjdG9yO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbW92ZVZlbG9jaXR5ID0gbW92ZURpcmVjdGlvbi5zY2FsZSh0aGlzLm1vdmVTcGVlZCAqIGVsYXBzZWRUaW1lTWlsbGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtb3ZlVmVsb2NpdHkgPSBtb3ZlRGlyZWN0aW9uLnNjYWxlKDAuMDAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uID0gbW92ZVZlbG9jaXR5Lng7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsaWNpdHlSb3cgPSBtb3ZlVmVsb2NpdHkueTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMueCA9IGNhbnZhcy53aWR0aCAvIDIgKyBkeDtcclxuICAgICAgICB0aGlzLnkgPSBjYW52YXMuaGVpZ2h0IC8gMiArIGR5O1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcoXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICkge1xyXG4gICAgICAgIGxldCBtb3ZlRGlyZWN0aW9uOiBWZWN0b3IgPSBuZXcgVmVjdG9yKHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uLCB0aGlzLm1vdmVWZWxpY2l0eVJvdylcclxuICAgICAgICAgICAgLm5vcm1hbGl6ZSgpXHJcbiAgICAgICAgICAgIC5zY2FsZSgxMCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gNTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICAgICAgdGhpcy54IC0gbW92ZURpcmVjdGlvbi54LFxyXG4gICAgICAgICAgICB0aGlzLnkgLSBtb3ZlRGlyZWN0aW9uLnksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgICAgICB0aGlzLnggKyBtb3ZlRGlyZWN0aW9uLngsXHJcbiAgICAgICAgICAgIHRoaXMueSArIG1vdmVEaXJlY3Rpb24ueSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgLy8gY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCA0LCA0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRLZXkgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbi8vIG5vdGU6IGFzc3VtZXMgZnJvbVN0YXJ0IGlzIGxlc3MgdGhhbiBmcm9tRW5kLCB0b1N0YXJ0IGlzIGxlc3MgdGhhbiB0b0VuZFxyXG5leHBvcnQgZnVuY3Rpb24gbWFwTGluZWFyKFxyXG4gICAgZnJvbVN0YXJ0OiBudW1iZXIsXHJcbiAgICBmcm9tVmFsdWU6IG51bWJlcixcclxuICAgIGZyb21FbmQ6IG51bWJlcixcclxuICAgIHRvU3RhcnQ6IG51bWJlcixcclxuICAgIHRvRW5kOiBudW1iZXJcclxuKSB7XHJcbiAgICBmcm9tVmFsdWUgPSBjbGFtcFZhbHVlKE1hdGgubWluKGZyb21TdGFydCwgZnJvbUVuZCksIGZyb21WYWx1ZSwgTWF0aC5tYXgoZnJvbVN0YXJ0LCBmcm9tRW5kKSk7XHJcbiAgICBsZXQgcmF0aW86IG51bWJlciA9IChmcm9tVmFsdWUgLSBmcm9tU3RhcnQpIC8gKGZyb21FbmQgLSBmcm9tU3RhcnQpO1xyXG4gICAgcmV0dXJuIHRvU3RhcnQgKyByYXRpbyAqICh0b0VuZCAtIHRvU3RhcnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXBWYWx1ZShtaW46IG51bWJlciwgdmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIGlmICh2YWx1ZSA8IG1pbikge1xyXG4gICAgICAgIHJldHVybiBtaW47XHJcbiAgICB9XHJcbiAgICBpZiAodmFsdWUgPiBtYXgpIHtcclxuICAgICAgICByZXR1cm4gbWF4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG4vLyBmdW5jdGlvbiB0YWtlbiBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hdGgvcmFuZG9tXHJcbi8vIFRoZSBtYXhpbXVtIGlzIGluY2x1c2l2ZSBhbmQgdGhlIG1pbmltdW0gaXMgaW5jbHVzaXZlXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JhcFZhbHVlKG1pbjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgaWYgKHZhbHVlIDwgbWluIHx8IHZhbHVlID4gbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1vZCh2YWx1ZSAtIG1pbiwgbWF4ICsgMSAtIG1pbikgKyBtaW47XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbi8vIHRoaXMgbW9kdWxvIGhhbmRsZXMgbmVnYXRpdmVzIGhvdyBpdCdzIHN1cHBvc2VkIHRvXHJcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ0Njc1MzkvamF2YXNjcmlwdC1tb2R1bG8tZ2l2ZXMtYS1uZWdhdGl2ZS1yZXN1bHQtZm9yLW5lZ2F0aXZlLW51bWJlcnNcclxuZnVuY3Rpb24gbW9kKG46IG51bWJlciwgbTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKChuICUgbSkgKyBtKSAlIG07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb2x1bW5Ub1goY29sdW1uOiBudW1iZXIsIHRvcExlZnRDb2x1bW46IG51bWJlciwgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKGNvbHVtbiAtIHRvcExlZnRDb2x1bW4pICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvd1RvWShyb3c6IG51bWJlciwgdG9wTGVmdFJvdzogbnVtYmVyLCBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAocm93IC0gdG9wTGVmdFJvdykgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sbGlkZUNpcmNsZXMoeDE6IG51bWJlciwgeTE6IG51bWJlciwgcjE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgcjI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKHgxIC0geDIpIDwgcjEgKyByMlxyXG4gICAgICAgICYmIE1hdGguYWJzKHkxIC0geTIpIDwgcjEgKyByMjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbGxpc2lvblZlbG9jaXR5KGMxOiBWZWN0b3IsIGMyOiBWZWN0b3IsIG0xOiBudW1iZXIsIG0yOiBudW1iZXIsIHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgbGV0IGMxTWludXNjMjogVmVjdG9yID0gYzEubWludXMoYzIpO1xyXG4gICAgcmV0dXJuIGMxTWludXNjMlxyXG4gICAgICAgIC5zY2FsZShcclxuICAgICAgICAgICAgLTIgKiBtMiAvIChtMSArIG0yKVxyXG4gICAgICAgICAgICAqIFZlY3Rvci5pbm5lclByb2R1Y3QodjEubWludXModjIpLCBjMU1pbnVzYzIpXHJcbiAgICAgICAgICAgIC8gYzFNaW51c2MyLm5vcm1TcXVhcmVkKClcclxuICAgICAgICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW52aXJvbm1lbnRDb2xvcihrZXk6IEVudmlyb25tZW50S2V5KTogQ29sb3Ige1xyXG4gICAgc3dpdGNoKGtleSkge1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuREVGQVVMVDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigxMDAsIDI1NSwgMTAwKTtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkZPUkVTVDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAyMDAsIDApO1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuREVTRVJUOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKDI1NSwgMjU1LCA1MCk7XHJcbiAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5XQVRFUjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAyNTUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBhIGlzIGFzc3VtZWQgdG8gYmUgdGhlIG9yaWdpblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzdGFuY2UoYTogbnVtYmVyLCBiOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgbGV0IGRpc3QxID0gd3JhcFZhbHVlKG1pbiwgYiAtIGEsIG1heCk7XHJcbiAgICBsZXQgZGlzdDIgPSB3cmFwVmFsdWUobWluLCBhIC0gYiwgbWF4KTtcclxuICAgIGxldCBtaW5EaXN0OiBudW1iZXI7XHJcbiAgICBsZXQgZGlyZWN0aW9uID0gMDtcclxuICAgIC8vICAgICAgICBhICAgYlxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgaWYgKGIgPj0gYSAmJiBkaXN0MSA8PSBkaXN0Mikge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgbWluRGlzdCA9IGRpc3QxO1xyXG4gICAgLy8gICAgYSAgICAgICAgICAgYlxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgfSBlbHNlIGlmIChiID49IGEgJiYgZGlzdDEgPiBkaXN0Mikge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgIG1pbkRpc3QgPSBkaXN0MjtcclxuICAgIC8vICAgICAgICBiICAgYVxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgfSBlbHNlIGlmIChiIDwgYSAmJiBkaXN0MiA8PSBkaXN0MSkge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgIG1pbkRpc3QgPSBkaXN0MjtcclxuICAgIC8vICAgIGIgICAgICAgICAgIGFcclxuICAgIC8vIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgIH0gZWxzZSBpZiAoYiA8IGEgJiYgZGlzdDIgPiBkaXN0MSkge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgbWluRGlzdCA9IGRpc3QxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpcmVjdGlvbiAqIG1pbkRpc3Q7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFZlY3RvciB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1pbnVzKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbHVzKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5uZXJQcm9kdWN0KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gdjEueCAqIHYyLnggKyB2MS55ICogdjIueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtU3F1YXJlZCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHNjYWxhcjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICogc2NhbGFyLCB0aGlzLnkgKiBzY2FsYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngsIHRoaXMueSkuc2NhbGUoMSAvIHRoaXMubWFnbml0dWRlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXJlY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==