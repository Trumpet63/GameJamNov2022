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
    constructor(row, column, radius, health, element, moveSpeed, barrageNumber, currentTimeMillis) {
        this.hitRecoveryDurationMillis = 500;
        this.row = row;
        this.column = column;
        this.radius = radius;
        this.hitVelocityColumn = 0;
        this.hitVelocityRow = 0;
        this.maxHealth = health;
        this.currentHealth = health;
        this.element = element;
        this.defaultColor = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getTintedColor)(this.element);
        this.moveVelocityColumn = 0;
        this.moveVelicityRow = 0;
        this.moveSpeed = moveSpeed;
        this.barrageNumber = barrageNumber;
        this.lastBarrageMissile = this.barrageNumber;
        this.lastBarrageStartMillis = currentTimeMillis;
        this.lastMissileSpawnAttemptMillis = currentTimeMillis;
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
let environmentRows = 60;
let environmentColumns = 60;
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

/***/ "./src/floating_text.ts":
/*!******************************!*\
  !*** ./src/floating_text.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FloatingText": () => (/* binding */ FloatingText)
/* harmony export */ });
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



class FloatingText {
    constructor(row, column, text, color, size, velocityRow, currentTimeMillis) {
        this.row = row;
        this.column = column;
        this.text = text;
        this.color = color;
        this.size = size;
        this.velocityRow = velocityRow;
        this.lifetimeMillis = 1000;
        this.creationTimeMillis = currentTimeMillis;
    }
    update(wrappedCenterColumn, wrappedCenterRow, environmentTileSize, currentTimeMillis) {
        let elapsedTimeMillis = 0;
        if (this.lastUpdateTimeMillis !== undefined) {
            elapsedTimeMillis = currentTimeMillis - this.lastUpdateTimeMillis;
        }
        this.row += this.velocityRow * elapsedTimeMillis;
        let dx = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getDistance)(wrappedCenterColumn, this.column, 0, _environment__WEBPACK_IMPORTED_MODULE_0__.environmentColumns - 1) * environmentTileSize;
        let dy = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getDistance)(wrappedCenterRow, this.row, 0, _environment__WEBPACK_IMPORTED_MODULE_0__.environmentRows - 1) * environmentTileSize;
        this.x = _index__WEBPACK_IMPORTED_MODULE_1__.canvas.width / 2 + dx;
        this.y = _index__WEBPACK_IMPORTED_MODULE_1__.canvas.height / 2 + dy;
        this.lastUpdateTimeMillis = currentTimeMillis;
    }
    draw(currentTimeMillis, ctx) {
        ctx.save();
        ctx.font = this.size + "px Arial";
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
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
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _enemy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enemy */ "./src/enemy.ts");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _floating_text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./floating_text */ "./src/floating_text.ts");
/* harmony import */ var _key_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./key_state */ "./src/key_state.ts");
/* harmony import */ var _missile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./missile */ "./src/missile.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vector */ "./src/vector.ts");
/* harmony import */ var _waves__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./waves */ "./src/waves.ts");









let previousTimeMillis;
let canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
canvas.id = "gameCanvas";
let ctx = canvas.getContext("2d");
let environmentTileSize = 50;
let centerRow = _environment__WEBPACK_IMPORTED_MODULE_2__.environmentRows / 2 - canvas.width / 2 / environmentTileSize;
let centerColumn = _environment__WEBPACK_IMPORTED_MODULE_2__.environmentColumns / 2 - canvas.height / 2 / environmentTileSize;
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
keyStates.set("W", _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.UP);
keyStates.set("A", _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.UP);
keyStates.set("S", _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.UP);
keyStates.set("D", _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.UP);
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
let guyMaxHealth = 100;
let guyCurrentHealth = guyMaxHealth;
let guyLastDamagedTimeMillis;
let environmentSprites = [
    loadImage("../assets/default.png"),
    loadImage("../assets/forest.png"),
    loadImage("../assets/desert.png"),
    loadImage("../assets/water.png"),
];
let environmentTimers = [
    { currentTime: 0, maxTime: 7000 },
    { currentTime: 0, maxTime: 3500 },
    { currentTime: 0, maxTime: 3500 },
    { currentTime: 0, maxTime: 3500 },
];
let currentTransformation = 0;
let transformationLevels = [
    { exp: 0, toNextLevel: 200, level: 1 },
    { exp: 0, toNextLevel: 100, level: 1 },
    { exp: 0, toNextLevel: 100, level: 1 },
    { exp: 0, toNextLevel: 100, level: 1 },
];
let minEnemyRadius = 7;
let maxEnemyRadius = 20;
let enemies = [];
let missiles = [];
let currentWave = -1;
let previousWaveEndTimeMillis = performance.now();
let waveRestTimeMillis = 8000;
let isInRestTime = true;
let floatingTexts = [];
let numTutorialsToShow = 3;
let numTutorialsShown = 0;
let isGameOver = false;
let gameOverTimeMillis;
let isGameWon;
document.body.appendChild(canvas);
document.onkeydown = (e) => {
    if (e.repeat) {
        return;
    }
    let key = e.key.toUpperCase();
    if (keyStates.has(key)) {
        keyStates.set(key, _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.DOWN);
    }
};
document.onkeyup = (e) => {
    if (e.repeat) {
        return;
    }
    let key = e.key.toUpperCase();
    if (keyStates.has(key)) {
        keyStates.set(key, _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.UP);
    }
};
document.onmousedown = (e) => {
    mouseDownY = e.clientY;
    mouseDownTime = performance.now();
};
document.onmouseup = (e) => {
    let mouseUpY = e.clientY;
    let mouseUpTime = performance.now();
    let speedBoost = (0,_util__WEBPACK_IMPORTED_MODULE_6__.clampValue)(0, (mouseUpY - mouseDownY) / (mouseUpTime - mouseDownTime), 10);
    lastSpeedBoostTimeMillis = mouseUpTime;
    lastSpeedBoostSpeed = Math.max(minimumSpeed, speedBoost * 0.003);
    lastSpeedBoostRotationSpeed = Math.max(minimumRotationSpeed, speedBoost * 0.005);
    lastSpeedBoostGuyRadius = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(0, speedBoost, 10, minGuyRadius, maxGuyRadius);
};
function draw(currentTimeMillis) {
    if (previousTimeMillis === undefined) {
        previousTimeMillis = currentTimeMillis;
        window.requestAnimationFrame(draw);
        return;
    }
    let elapsedTimeMillis = currentTimeMillis - previousTimeMillis;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let moveX = (keyStates.get("A") === _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.DOWN ? -1 : 0)
        + (keyStates.get("D") === _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.DOWN ? 1 : 0);
    let moveY = (keyStates.get("W") === _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.DOWN ? -1 : 0)
        + (keyStates.get("S") === _key_state__WEBPACK_IMPORTED_MODULE_4__.KeyState.DOWN ? 1 : 0);
    let magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
    if (magnitude > 0) {
        moveX = moveX / magnitude * currentSpeed;
        moveY = moveY / magnitude * currentSpeed;
    }
    let hitX = 0;
    let hitY = 0;
    if (guyLastHitTimeMillis !== undefined) {
        hitX = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(guyLastHitTimeMillis, currentTimeMillis, guyLastHitTimeMillis + guyHitRecoveryDurationMillis, guyHitVelocityColumn, 0);
        hitY = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(guyLastHitTimeMillis, currentTimeMillis, guyLastHitTimeMillis + guyHitRecoveryDurationMillis, guyHitVelocityRow, 0);
    }
    guyVelocityColumn = moveX + hitX;
    guyVelocityRow = moveY + hitY;
    centerColumn += guyVelocityColumn * elapsedTimeMillis;
    centerRow += guyVelocityRow * elapsedTimeMillis;
    currentRotation += elapsedTimeMillis * currentRotationSpeed;
    if (lastSpeedBoostSpeed !== undefined) {
        currentSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostSpeed, minimumSpeed);
        currentRotationSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostRotationSpeed, minimumRotationSpeed);
        currentGuyRadius = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostGuyRadius, minGuyRadius);
    }
    else {
        currentSpeed = minimumSpeed;
        currentRotationSpeed = minimumRotationSpeed;
        currentGuyRadius = minGuyRadius;
    }
    let topLeftColumn = centerColumn - (canvas.width / 2) / environmentTileSize;
    let topLeftRow = centerRow - (canvas.height / 2) / environmentTileSize;
    let guyCenterX = (0,_util__WEBPACK_IMPORTED_MODULE_6__.columnToX)(centerColumn, topLeftColumn, environmentTileSize);
    let guyCenterY = (0,_util__WEBPACK_IMPORTED_MODULE_6__.rowToY)(centerRow, topLeftRow, environmentTileSize);
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
        let enemy = enemies[i];
        if ((0,_util__WEBPACK_IMPORTED_MODULE_6__.collideCircles)(canvas.width / 2, canvas.height / 2, currentGuyRadius, enemy.x, enemy.y, enemy.radius)
            && (enemy.lastHitTimeMillis === undefined
                || (currentTimeMillis - enemy.lastHitTimeMillis) > enemy.hitRecoveryDurationMillis)
            && !isGameOver) {
            let enemyMass = enemy.radius;
            let guyMass = currentGuyRadius;
            let guyCenter = new _vector__WEBPACK_IMPORTED_MODULE_7__.Vector(guyCenterX, guyCenterY);
            let enemyCenter = new _vector__WEBPACK_IMPORTED_MODULE_7__.Vector(enemy.x, enemy.y);
            let guyVelocity = new _vector__WEBPACK_IMPORTED_MODULE_7__.Vector(guyVelocityColumn, guyVelocityRow)
                .plus(enemyCenter.minus(guyCenter).normalize().scale(0.01));
            let enemyVelocity = new _vector__WEBPACK_IMPORTED_MODULE_7__.Vector(enemy.hitVelocityColumn, enemy.hitVelocityRow);
            let guyHitVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_6__.getCollisionVelocity)(guyCenter, enemyCenter, guyMass, enemyMass, guyVelocity, enemyVelocity).scale(0.2);
            guyHitVelocityColumn = guyHitVelocity.x;
            guyHitVelocityRow = guyHitVelocity.y;
            guyLastHitTimeMillis = currentTimeMillis;
            let enemyHitVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_6__.getCollisionVelocity)(enemyCenter, guyCenter, enemyMass, guyMass, enemyVelocity, guyVelocity).scale(0.3);
            enemy.lastHitTimeMillis = currentTimeMillis;
            enemy.hitVelocityColumn = enemyHitVelocity.x;
            enemy.hitVelocityRow = enemyHitVelocity.y;
            // determine damage delt to enemy
            let damageMultiplier = getDamageMultiplier(currentTransformation, enemy.element);
            let damageDealt = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minGuyRadius, currentGuyRadius, maxGuyRadius, 0, (10 + transformationLevels[currentTransformation].level - 1) * damageMultiplier);
            enemy.currentHealth -= damageDealt;
            // award xp if enemy was killed
            if (enemy.currentHealth <= 0) {
                let expGain = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 50, 400);
                if (currentTransformation !== _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DEFAULT) {
                    transformationLevels[currentTransformation].exp += expGain;
                }
                transformationLevels[_environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DEFAULT].exp += expGain * 0.6;
            }
            // spawn floating text
            floatingTexts.push(new _floating_text__WEBPACK_IMPORTED_MODULE_3__.FloatingText(enemy.row, enemy.column, "-" + (Math.round(damageDealt * 10) / 10).toFixed(1)
                + (damageMultiplier === 3 ? " CRITICAL" : ""), "black", 20, -0.001, currentTimeMillis));
        }
    }
    // do missile-guy collision
    for (let i = 0; i < missiles.length; i++) {
        let missile = missiles[i];
        if ((0,_util__WEBPACK_IMPORTED_MODULE_6__.collideCircles)(canvas.width / 2, canvas.height / 2, minGuyRadius, // Deliberately use min guy radius here
        missile.x, missile.y, missile.radius)
            && !isGameOver) {
            let damageMultiplier = getDamageMultiplier(missile.element, currentTransformation);
            let damageDealt = damageMultiplier * 10;
            guyCurrentHealth -= damageDealt;
            guyLastDamagedTimeMillis = currentTimeMillis;
            missiles.splice(i, 1);
            i--;
            // spawn floating text
            floatingTexts.push(new _floating_text__WEBPACK_IMPORTED_MODULE_3__.FloatingText(centerRow, centerColumn, "-" + (Math.round(damageDealt * 10) / 10).toFixed(1)
                + (damageMultiplier === 3 ? " CRITICAL" : ""), "red", 20, -0.001, currentTimeMillis));
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
        let missile = missiles[i];
        if (currentTimeMillis - missile.creationTimeMillis > missile.lifetimeMillis) {
            missiles.splice(i, 1);
            i--;
        }
    }
    // remove old floating texts
    for (let i = 0; i < floatingTexts.length; i++) {
        let floatingText = floatingTexts[i];
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
    let barrageRateMillis = 5000;
    let missileFireRateMillis = 500;
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (currentTimeMillis - enemy.lastBarrageStartMillis > barrageRateMillis) {
            enemy.lastBarrageMissile = 0;
            enemy.lastBarrageStartMillis = currentTimeMillis;
        }
        if (currentTimeMillis - enemy.lastMissileSpawnAttemptMillis > missileFireRateMillis
            && enemy.lastBarrageMissile < enemy.barrageNumber) {
            let spawnChance = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.4, 1);
            if (Math.random() <= spawnChance) {
                let moveSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.0003, 0.001);
                let turnSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.001, 0.0001);
                let lifeTimeMillis = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 3000, 8000);
                missiles.push(new _missile__WEBPACK_IMPORTED_MODULE_5__.Missile(enemy.row, enemy.column, 3, enemy.element, moveSpeed, turnSpeed, lifeTimeMillis, currentTimeMillis));
            }
            enemy.lastBarrageMissile++;
            enemy.lastMissileSpawnAttemptMillis = currentTimeMillis;
            enemy.lastBarrageStartMillis = currentTimeMillis;
        }
    }
    // update environment timers
    let currentEnvironment = getCurrentEnvironment(centerColumn, centerRow);
    if (!isGameOver) {
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
    }
    // trigger transformation
    if (currentEnvironment !== currentTransformation
        && environmentTimers[currentEnvironment].currentTime === environmentTimers[currentEnvironment].maxTime
        && !isGameOver) {
        for (let i = 0; i < environmentTimers.length; i++) {
            environmentTimers[i].currentTime = 0;
        }
        currentTransformation = currentEnvironment;
    }
    // update transformation levels
    for (let i = 0; i < transformationLevels.length; i++) {
        let transformation = transformationLevels[i];
        if (transformation.exp >= transformation.toNextLevel) {
            transformation.exp -= transformation.toNextLevel;
            transformation.level++;
            transformation.toNextLevel *= 1.1;
            if (i === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DEFAULT) {
                guyMaxHealth += 20;
            }
        }
    }
    if (guyCurrentHealth <= 0 && !isGameOver) {
        isGameOver = true;
        isGameWon = false;
        gameOverTimeMillis = currentTimeMillis;
    }
    // draw environment draw count
    if (false) {}
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
        let guyColorRatio = 1;
        let guyDefaultColor = (0,_util__WEBPACK_IMPORTED_MODULE_6__.getTintedColor)(currentTransformation);
        if (guyLastDamagedTimeMillis !== undefined) {
            guyColorRatio = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(guyLastDamagedTimeMillis, currentTimeMillis, guyLastDamagedTimeMillis + 1000, 0, 1);
        }
        let guyColor = _color__WEBPACK_IMPORTED_MODULE_0__.Color.lerpColors(new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 0, 0), guyDefaultColor, guyColorRatio);
        ctx.fillStyle = guyColor.toString();
        ctx.beginPath();
        ctx.arc(guyCenterX, guyCenterY, 6, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    // draw guy swirly thing
    if (!isGameOver) {
        let guyDefaultColor = (0,_util__WEBPACK_IMPORTED_MODULE_6__.getTintedColor)(currentTransformation);
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = guyDefaultColor.toString();
        ctx.beginPath();
        ctx.arc(guyCenterX, guyCenterY, currentGuyRadius, currentTimeMillis / 60, currentTimeMillis / 60 + (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minGuyRadius, currentGuyRadius, maxGuyRadius, 1, 2));
        ctx.stroke();
        ctx.restore();
    }
    // draw the guy's health bar
    if (!isGameOver) {
        let guyHealthWidth = guyMaxHealth / 2;
        let guyHealthHeight = 6;
        let guyHealthTopLeftX = guyCenterX - guyHealthWidth / 2;
        let guyHealthTopLeftY = guyCenterY - maxGuyRadius - guyHealthHeight / 2 - 8;
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
        let tileCenterX = guyCenterX + 50;
        let tileCenterY = guyCenterY - 70;
        let tileSize = 25;
        ctx.save();
        drawEnvironmentTile(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, currentEnvironment);
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = "black";
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
        ctx.fillStyle = "black";
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
        guyCurrentHealth = Math.min(guyMaxHealth, guyCurrentHealth + elapsedTimeMillis / waveRestTimeMillis * guyMaxHealth);
        if (restTimeRemainingMillis <= 0 && !isGameOver) {
            currentWave++;
            isInRestTime = false;
            if (currentWave >= _waves__WEBPACK_IMPORTED_MODULE_8__.waves.length) {
                isGameOver = true;
                isGameWon = true;
                gameOverTimeMillis = currentTimeMillis;
            }
            else {
                spawnEnemies(currentWave);
            }
        }
        else if (!isGameOver) {
            ctx.save();
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = "20px Arial";
            let tenths = Math.round(restTimeRemainingMillis / 100);
            ctx.fillText((tenths / 10).toFixed(1) + "s Until Next Wave", 3, 20);
            ctx.restore();
        }
    }
    // draw tranformation exp bars and levels
    drawTransformationExpBar(canvas.width - 200, 3, 0);
    drawTransformationExpBar(canvas.width - 200, 23, 1);
    drawTransformationExpBar(canvas.width, 3, 2);
    drawTransformationExpBar(canvas.width, 23, 3);
    // draw game over text
    if (isGameOver && !isGameWon) {
        let timeSinceGameOverMillis = currentTimeMillis - gameOverTimeMillis;
        let textOpacity = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(0, timeSinceGameOverMillis, 2000, 0, 1);
        ctx.save();
        ctx.globalAlpha = textOpacity;
        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
    else if (isGameOver && isGameWon) {
        let timeSinceGameOverMillis = currentTimeMillis - gameOverTimeMillis;
        let textOpacity = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(0, timeSinceGameOverMillis, 2000, 0, 1);
        ctx.save();
        ctx.globalAlpha = textOpacity;
        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
    // draw the drag tutorial text
    if (numTutorialsShown < numTutorialsToShow
        && currentTimeMillis > 2000 + 2000 * numTutorialsShown) {
        floatingTexts.push(new _floating_text__WEBPACK_IMPORTED_MODULE_3__.FloatingText(centerRow - 3, centerColumn - 5, "vv Click, Drag, Release! vv", "black", 40, 0.006, currentTimeMillis));
        numTutorialsShown++;
    }
    // draw fps
    if (false) {}
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
function spawnEnemies(currentWave) {
    let currentTimeMillis = performance.now();
    let wave = _waves__WEBPACK_IMPORTED_MODULE_8__.waves[currentWave];
    for (let i = 0; i < wave.length; i++) {
        let radius = wave[i];
        let health = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, radius, maxEnemyRadius, 50, 200);
        let speed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, radius, maxEnemyRadius, 0.001, 0.0005);
        let barrageNumber;
        if (radius < 10) {
            barrageNumber = 1;
        }
        else if (radius >= 10 && radius < 15) {
            barrageNumber = (0,_util__WEBPACK_IMPORTED_MODULE_6__.randomInt)(2, 3);
        }
        else if (radius >= 15) {
            barrageNumber = (0,_util__WEBPACK_IMPORTED_MODULE_6__.randomInt)(4, 5);
        }
        enemies.push(new _enemy__WEBPACK_IMPORTED_MODULE_1__.Enemy(Math.random() * _environment__WEBPACK_IMPORTED_MODULE_2__.environmentColumns, Math.random() * _environment__WEBPACK_IMPORTED_MODULE_2__.environmentRows, radius, health, (0,_util__WEBPACK_IMPORTED_MODULE_6__.randomInt)(0, 3), speed, barrageNumber, currentTimeMillis));
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
            let wrappedRow = (0,_util__WEBPACK_IMPORTED_MODULE_6__.wrapValue)(0, i, _environment__WEBPACK_IMPORTED_MODULE_2__.environmentRows - 1);
            let wrappedColumn = (0,_util__WEBPACK_IMPORTED_MODULE_6__.wrapValue)(0, j, _environment__WEBPACK_IMPORTED_MODULE_2__.environmentColumns - 1);
            let key = _environment__WEBPACK_IMPORTED_MODULE_2__.environment[wrappedRow][wrappedColumn];
            let x = (0,_util__WEBPACK_IMPORTED_MODULE_6__.columnToX)(j, topLeftColumn, environmentTileSize);
            let y = (0,_util__WEBPACK_IMPORTED_MODULE_6__.rowToY)(i, topLeftRow, environmentTileSize);
            drawEnvironmentTile(Math.floor(x), Math.floor(y), environmentTileSize, key);
            // mark each tile with its row and column
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
function drawEnvironmentTile(x, y, size, key) {
    let environmentSprite = environmentSprites[key];
    ctx.drawImage(environmentSprite, x, y, size, size);
    // ctx.fillStyle = getEnvironmentColor(key).toString();
    // ctx.fillRect(x, y, size, size);
}
function getCurrentEnvironment(centerColumn, centerRow) {
    let wrappedRow = (0,_util__WEBPACK_IMPORTED_MODULE_6__.wrapValue)(0, Math.floor(centerRow), _environment__WEBPACK_IMPORTED_MODULE_2__.environmentRows - 1);
    let wrappedColumn = (0,_util__WEBPACK_IMPORTED_MODULE_6__.wrapValue)(0, Math.floor(centerColumn), _environment__WEBPACK_IMPORTED_MODULE_2__.environmentColumns - 1);
    return _environment__WEBPACK_IMPORTED_MODULE_2__.environment[wrappedRow][wrappedColumn];
}
function getDamageMultiplier(attacker, defender) {
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DEFAULT || defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DEFAULT) {
        return 1;
    }
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.FOREST) {
        if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.WATER) {
            return 3;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DESERT) {
            return 0.5;
        }
        else {
            return 1;
        }
    }
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DESERT) {
        if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.FOREST) {
            return 3;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.WATER) {
            return 0.5;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DESERT) {
            return 1;
        }
    }
    if (attacker === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.WATER) {
        if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DESERT) {
            return 3;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.FOREST) {
            return 0.5;
        }
        else if (defender === _environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.WATER) {
            return 1;
        }
    }
}
function drawTransformationExpBar(x, y, environment) {
    let tileSize = 15;
    let tileCenterX = x - tileSize / 2 - 10;
    let tileCenterY = y + tileSize / 2;
    ctx.save();
    drawEnvironmentTile(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, environment);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(tileCenterX - tileSize / 2, tileCenterY - tileSize / 2, tileSize, tileSize);
    ctx.restore();
    let width = 100;
    let height = 10;
    let topLeftX = tileCenterX - tileSize / 2 - width - 10;
    let topLeftY = tileCenterY - height / 2;
    let transformation = transformationLevels[environment];
    let fillRatio = (transformation.exp / transformation.toNextLevel);
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
    constructor(row, column, radius, element, moveSpeed, turningSpeed, lifeTimeMillis, currentTimeMillis) {
        this.logCounter = 0;
        this.row = row;
        this.column = column;
        this.radius = radius;
        this.element = element;
        this.moveSpeed = moveSpeed;
        this.turningSpeed = turningSpeed;
        this.moveVelocityColumn = 0;
        this.moveVelicityRow = 0;
        this.defaultColor = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getTintedColor)(this.element);
        this.lifetimeMillis = lifeTimeMillis;
        this.creationTimeMillis = currentTimeMillis;
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
            .scale(9);
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(this.x - moveDirection.x, this.y - moveDirection.y);
        ctx.lineTo(this.x + moveDirection.x, this.y + moveDirection.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        moveDirection = moveDirection.scale(0.9);
        ctx.save();
        ctx.strokeStyle = this.defaultColor.toString();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x - moveDirection.x, this.y - moveDirection.y);
        ctx.lineTo(this.x + moveDirection.x, this.y + moveDirection.y);
        ctx.closePath();
        ctx.stroke();
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
/* harmony export */   "getTintedColor": () => (/* binding */ getTintedColor),
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
function getTintedColor(key) {
    let color = key === _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT
        ? new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 255, 255)
        : getEnvironmentColor(key);
    return _color__WEBPACK_IMPORTED_MODULE_0__.Color.lerpColors(color, new _color__WEBPACK_IMPORTED_MODULE_0__.Color(255, 255, 255), 0.15);
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


/***/ }),

/***/ "./src/waves.ts":
/*!**********************!*\
  !*** ./src/waves.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "waves": () => (/* binding */ waves)
/* harmony export */ });
let waves = [
    [7, 7, 10],
    [7, 7, 7, 10, 10],
    [7, 8, 9, 10, 10, 10],
    [7, 7, 7, 8, 9, 10, 10, 10],
    [7, 7, 7, 8, 9, 10, 10, 15],
    [7, 7, 7, 7, 8, 9, 15, 15, 15],
    [7, 7, 7, 7, 8, 9, 15, 15, 20],
    [7, 7, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 20, 20, 20, 20],
];


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ3hDTSxJQUFJLEtBQUssR0FBZTtJQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzlCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDOUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0NBQ2pFOzs7Ozs7O1VDVEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2NvbG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvZW5lbXkudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9lbnZpcm9ubWVudC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2Zsb2F0aW5nX3RleHQudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2tleV9zdGF0ZS50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL21pc3NpbGUudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvd2F2ZXMudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYXBMaW5lYXIgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArIHRoaXMuciArIFwiLFwiICsgdGhpcy5nICsgXCIsXCIgKyB0aGlzLmIgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvUkdCKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0b1JHQkEocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHIgKyBcIixcIiArIGcgKyBcIixcIiArIGIgKyBcIixcIiArIGEgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnBDb2xvcnMoYzE6IENvbG9yLCBjMjogQ29sb3IsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICBtYXBMaW5lYXIoMCwgcmF0aW8sIDEsIGMxLnIsIGMyLnIpLFxyXG4gICAgICAgICAgICBtYXBMaW5lYXIoMCwgcmF0aW8sIDEsIGMxLmcsIGMyLmcpLFxyXG4gICAgICAgICAgICBtYXBMaW5lYXIoMCwgcmF0aW8sIDEsIGMxLmIsIGMyLmIpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudENvbHVtbnMsIEVudmlyb25tZW50S2V5LCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBnZXREaXN0YW5jZSwgZ2V0RW52aXJvbm1lbnRDb2xvciwgZ2V0VGludGVkQ29sb3IsIG1hcExpbmVhciwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmVteSB7XHJcbiAgICBwdWJsaWMgcm93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyByYWRpdXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0SGl0VGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaGl0VmVsb2NpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsaWNpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXM6IG51bWJlciA9IDUwMDtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIG1heEhlYWx0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRIZWFsdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbGVtZW50OiBFbnZpcm9ubWVudEtleTtcclxuICAgIHB1YmxpYyBkZWZhdWx0Q29sb3I6IENvbG9yO1xyXG4gICAgcHVibGljIG1vdmVTcGVlZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxhc3RCYXJyYWdlU3RhcnRNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0TWlzc2lsZVNwYXduQXR0ZW1wdE1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGJhcnJhZ2VOdW1iZXI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0QmFycmFnZU1pc3NpbGU6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcm93OiBudW1iZXIsXHJcbiAgICAgICAgY29sdW1uOiBudW1iZXIsXHJcbiAgICAgICAgcmFkaXVzOiBudW1iZXIsXHJcbiAgICAgICAgaGVhbHRoOiBudW1iZXIsXHJcbiAgICAgICAgZWxlbWVudDogRW52aXJvbm1lbnRLZXksXHJcbiAgICAgICAgbW92ZVNwZWVkOiBudW1iZXIsXHJcbiAgICAgICAgYmFycmFnZU51bWJlcjogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnJvdyA9IHJvdztcclxuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcclxuICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Q29sdW1uID0gMDtcclxuICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Um93ID0gMDtcclxuICAgICAgICB0aGlzLm1heEhlYWx0aCA9IGhlYWx0aDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRIZWFsdGggPSBoZWFsdGg7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDb2xvciA9IGdldFRpbnRlZENvbG9yKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4gPSAwO1xyXG4gICAgICAgIHRoaXMubW92ZVZlbGljaXR5Um93ID0gMDtcclxuICAgICAgICB0aGlzLm1vdmVTcGVlZCA9IG1vdmVTcGVlZDtcclxuICAgICAgICB0aGlzLmJhcnJhZ2VOdW1iZXIgPSBiYXJyYWdlTnVtYmVyO1xyXG4gICAgICAgIHRoaXMubGFzdEJhcnJhZ2VNaXNzaWxlID0gdGhpcy5iYXJyYWdlTnVtYmVyO1xyXG4gICAgICAgIHRoaXMubGFzdEJhcnJhZ2VTdGFydE1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHRoaXMubGFzdE1pc3NpbGVTcGF3bkF0dGVtcHRNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJDb2x1bW46IG51bWJlcixcclxuICAgICAgICB3cmFwcGVkQ2VudGVyUm93OiBudW1iZXIsXHJcbiAgICAgICAgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgZWxhcHNlZFRpbWVNaWxsaXMgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWxhcHNlZFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcyAtIHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBoaXRWZWxvY2l0eUNvbHVtbjogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgaGl0VmVsb2NpdHlSb3c6IG51bWJlciA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBoaXRWZWxvY2l0eUNvbHVtbiA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgKyB0aGlzLmhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Q29sdW1uLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGhpdFZlbG9jaXR5Um93ID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyArIHRoaXMuaGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGl0VmVsb2NpdHlSb3csXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50b3RhbFZlbG9jaXR5Q29sdW1uID0gaGl0VmVsb2NpdHlDb2x1bW4gKyB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbjtcclxuICAgICAgICB0aGlzLnRvdGFsVmVsb2NpdHlSb3cgPSBoaXRWZWxvY2l0eVJvdyArIHRoaXMubW92ZVZlbGljaXR5Um93O1xyXG5cclxuICAgICAgICB0aGlzLmNvbHVtbiArPSB0aGlzLnRvdGFsVmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICB0aGlzLnJvdyArPSB0aGlzLnRvdGFsVmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICAgICAgbGV0IGR4ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlckNvbHVtbiwgdGhpcy5jb2x1bW4sIDAsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgICAgICBsZXQgZHkgPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyUm93LCB0aGlzLnJvdywgMCwgZW52aXJvbm1lbnRSb3dzIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxuICAgICAgICBsZXQgbW92ZVZlbG9jaXR5OiBWZWN0b3IgPSBuZXcgVmVjdG9yKC1keCwgLWR5KS5ub3JtYWxpemUoKS5zY2FsZSh0aGlzLm1vdmVTcGVlZCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4gPSBtb3ZlVmVsb2NpdHkueDtcclxuICAgICAgICB0aGlzLm1vdmVWZWxpY2l0eVJvdyA9IG1vdmVWZWxvY2l0eS55O1xyXG5cclxuICAgICAgICB0aGlzLnggPSBjYW52YXMud2lkdGggLyAyICsgZHg7XHJcbiAgICAgICAgdGhpcy55ID0gY2FudmFzLmhlaWdodCAvIDIgKyBkeTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICAgICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgIGEgICAgICAgICAgIGJcclxuICAgICAgICBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcblxyXG4gICAgICAgIGRpc3QxID0gTWF0aC5hYnMoYSAtIGIpO1xyXG4gICAgICAgIGRpc3QyID0gKGEgLSBtaW4pICsgKG1heCAtIGIpO1xyXG5cclxuICAgICAgICBhIC0gYiA9IC02IChtb2QgOSkgPT4gM1xyXG5cclxuXHJcbiAgICAgICAgICAgICBiICAgICAgIGFcclxuICAgICAgICBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICAgICAgXHJcbiAgICAgICAgYiAtIGEgPSAtNCAobW9kIDkpID0gNVxyXG4gICAgICAgIGxlbiArICgyICsgMSkgLSAoNiArIDEpID0gbGVuICsgMyAtIDcgPSBsZW4gLSA0ID0gNVxyXG4gICAgICAgIC8vIOKAi2xlbiArIChtaW4oYSxiKSArIDEpIC0gKG1heChhLGIpICsgMSlcclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29sb3JSYXRpbyA9IDE7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb2xvclJhdGlvID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyArIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IENvbG9yLmxlcnBDb2xvcnMoXHJcbiAgICAgICAgICAgIG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRDb2xvcixcclxuICAgICAgICAgICAgY29sb3JSYXRpbyxcclxuICAgICAgICApLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBsZXQgd2lkdGg6IG51bWJlciA9IHRoaXMubWF4SGVhbHRoIC8gMjtcclxuICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSA0O1xyXG4gICAgICAgIGxldCB0b3BMZWZ0WDogbnVtYmVyID0gdGhpcy54IC0gd2lkdGggLyAyO1xyXG4gICAgICAgIGxldCB0b3BMZWZ0WTogbnVtYmVyID0gdGhpcy55IC0gdGhpcy5yYWRpdXMgLSBoZWlnaHQgLyAyIC0gODtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcclxuICAgICAgICBjdHguZmlsbFJlY3QodG9wTGVmdFgsIHRvcExlZnRZLCB3aWR0aCAqICh0aGlzLmN1cnJlbnRIZWFsdGggLyB0aGlzLm1heEhlYWx0aCksIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QodG9wTGVmdFgsIHRvcExlZnRZLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHJhbmRvbUludCwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGVudW0gRW52aXJvbm1lbnRLZXkge1xyXG4gICAgREVGQVVMVCxcclxuICAgIEZPUkVTVCxcclxuICAgIERFU0VSVCxcclxuICAgIFdBVEVSLFxyXG59XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50S2V5W11bXSA9IFtdO1xyXG5leHBvcnQgbGV0IGVudmlyb25tZW50Um93czogbnVtYmVyID0gNjA7XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnRDb2x1bW5zOiBudW1iZXIgPSA2MDtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgIGxldCByb3c6IEVudmlyb25tZW50S2V5W10gPSBbXTtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuOTk3KSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKEVudmlyb25tZW50S2V5LkRFRkFVTFQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKHJhbmRvbUludCgxLCAzKSBhcyBFbnZpcm9ubWVudEtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZW52aXJvbm1lbnQucHVzaChyb3cpO1xyXG59XHJcblxyXG5mb3IgKGxldCBrID0gMDsgayA8IDEwOyBrKyspIHtcclxuICAgIGxldCBlbnZpcm9ubWVudENvcHk6IEVudmlyb25tZW50S2V5W11bXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgICAgIGxldCByb3c6IEVudmlyb25tZW50S2V5W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKGVudmlyb25tZW50W2ldW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZW52aXJvbm1lbnRDb3B5LnB1c2gocm93KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZW52aXJvbm1lbnRDb3B5W2ldW2pdICE9PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUICYmIE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChyYW5kb21JbnQoMSwgNCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W3dyYXBWYWx1ZSgwLCBpKzEsIGVudmlyb25tZW50Um93cyAtIDEpXVtqXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W2ldW3dyYXBWYWx1ZSgwLCBqKzEsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W3dyYXBWYWx1ZSgwLCBpLTEsIGVudmlyb25tZW50Um93cyAtIDEpXVtqXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W2ldW3dyYXBWYWx1ZSgwLCBqLTEsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBlbnZpcm9ubWVudENvbHVtbnMsIGVudmlyb25tZW50Um93cyB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IGNhbnZhcyB9IGZyb20gXCIuL2luZGV4XCI7XHJcbmltcG9ydCB7IGdldERpc3RhbmNlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZsb2F0aW5nVGV4dCB7XHJcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcm93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nO1xyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB2ZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGxhc3RVcGRhdGVUaW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbGlmZXRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjcmVhdGlvblRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzaXplOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHJvdzogbnVtYmVyLFxyXG4gICAgICAgIGNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHRleHQ6IHN0cmluZyxcclxuICAgICAgICBjb2xvcjogc3RyaW5nLFxyXG4gICAgICAgIHNpemU6IG51bWJlcixcclxuICAgICAgICB2ZWxvY2l0eVJvdzogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnJvdyA9IHJvdztcclxuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHlSb3cgPSB2ZWxvY2l0eVJvdztcclxuICAgICAgICB0aGlzLmxpZmV0aW1lTWlsbGlzID0gMTAwMDtcclxuICAgICAgICB0aGlzLmNyZWF0aW9uVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoXHJcbiAgICAgICAgd3JhcHBlZENlbnRlckNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJSb3c6IG51bWJlcixcclxuICAgICAgICBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucm93ICs9IHRoaXMudmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICAgICAgbGV0IGR4ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlckNvbHVtbiwgdGhpcy5jb2x1bW4sIDAsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgICAgICBsZXQgZHkgPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyUm93LCB0aGlzLnJvdywgMCwgZW52aXJvbm1lbnRSb3dzIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnggPSBjYW52YXMud2lkdGggLyAyICsgZHg7XHJcbiAgICAgICAgdGhpcy55ID0gY2FudmFzLmhlaWdodCAvIDIgKyBkeTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICAgICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5mb250ID0gdGhpcy5zaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnRleHQsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBFbmVteSB9IGZyb20gXCIuL2VuZW15XCI7XHJcbmltcG9ydCB7IGVudmlyb25tZW50LCBlbnZpcm9ubWVudENvbHVtbnMsIEVudmlyb25tZW50S2V5LCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBGbG9hdGluZ1RleHQgfSBmcm9tIFwiLi9mbG9hdGluZ190ZXh0XCI7XHJcbmltcG9ydCB7IEtleVN0YXRlIH0gZnJvbSBcIi4va2V5X3N0YXRlXCI7XHJcbmltcG9ydCB7IE1pc3NpbGUgfSBmcm9tIFwiLi9taXNzaWxlXCI7XHJcbmltcG9ydCB7IGNsYW1wVmFsdWUsIGNvbGxpZGVDaXJjbGVzLCBjb2x1bW5Ub1gsIGdldENvbGxpc2lvblZlbG9jaXR5LCBnZXRFbnZpcm9ubWVudENvbG9yLCBnZXRUaW50ZWRDb2xvciwgbWFwTGluZWFyLCByYW5kb21JbnQsIHJvd1RvWSwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgd2F2ZXMgfSBmcm9tIFwiLi93YXZlc1wiO1xyXG5cclxubGV0IHByZXZpb3VzVGltZU1pbGxpczogbnVtYmVyO1xyXG5cclxuZXhwb3J0IGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuY2FudmFzLndpZHRoID0gODAwO1xyXG5jYW52YXMuaGVpZ2h0ID0gODAwO1xyXG5jYW52YXMuaWQgPSBcImdhbWVDYW52YXNcIjtcclxubGV0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbmxldCBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIgPSA1MDtcclxubGV0IGNlbnRlclJvdzogbnVtYmVyID0gZW52aXJvbm1lbnRSb3dzIC8gMiAtIGNhbnZhcy53aWR0aCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5sZXQgY2VudGVyQ29sdW1uOiBudW1iZXIgPSBlbnZpcm9ubWVudENvbHVtbnMgLyAyIC0gY2FudmFzLmhlaWdodCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxubGV0IG1pbmltdW1TcGVlZDogbnVtYmVyID0gMC4wMDM7XHJcbmxldCBjdXJyZW50U3BlZWQ6IG51bWJlciA9IG1pbmltdW1TcGVlZDtcclxubGV0IHNwZWVkRGVncmVkYXRpb25UaW1lTWlsbGlzOiBudW1iZXIgPSA3MDA7XHJcbmxldCBsYXN0U3BlZWRCb29zdFNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5sZXQgY3VycmVudFJvdGF0aW9uOiBudW1iZXIgPSAwO1xyXG5sZXQgbWluaW11bVJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IDAuMDA0O1xyXG5sZXQgY3VycmVudFJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IG1pbmltdW1Sb3RhdGlvblNwZWVkO1xyXG5sZXQgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbG9nQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbmxldCBrZXlTdGF0ZXM6IE1hcDxzdHJpbmcsIEtleVN0YXRlPiA9IG5ldyBNYXAoKTtcclxua2V5U3RhdGVzLnNldChcIldcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiQVwiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJTXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIkRcIiwgS2V5U3RhdGUuVVApO1xyXG5cclxubGV0IG1vdXNlRG93blk6IG51bWJlcjtcclxubGV0IG1vdXNlRG93blRpbWU6IG51bWJlcjtcclxuXHJcbmxldCBwcmVsb2FkUmVnaXN0cnk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGd1eVNwcml0ZTogSFRNTEltYWdlRWxlbWVudCA9IGxvYWRJbWFnZShcIi4uL2Fzc2V0cy9ndXkucG5nXCIpO1xyXG5sZXQgZ3V5VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbmxldCBndXlWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxubGV0IGd1eUhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXIgPSAwO1xyXG5sZXQgZ3V5SGl0VmVsb2NpdHlSb3c6IG51bWJlciA9IDA7XHJcbmxldCBndXlMYXN0SGl0VGltZU1pbGxpczogbnVtYmVyO1xyXG5sZXQgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpczogbnVtYmVyID0gODAwO1xyXG5sZXQgbWluR3V5UmFkaXVzOiBudW1iZXIgPSAxMDtcclxubGV0IG1heEd1eVJhZGl1czogbnVtYmVyID0gNDA7XHJcbmxldCBjdXJyZW50R3V5UmFkaXVzOiBudW1iZXIgPSBtaW5HdXlSYWRpdXM7XHJcbmxldCBsYXN0U3BlZWRCb29zdEd1eVJhZGl1czogbnVtYmVyO1xyXG5sZXQgZ3V5TWF4SGVhbHRoOiBudW1iZXIgPSAxMDA7XHJcbmxldCBndXlDdXJyZW50SGVhbHRoOiBudW1iZXIgPSBndXlNYXhIZWFsdGg7XHJcbmxldCBndXlMYXN0RGFtYWdlZFRpbWVNaWxsaXM6IG51bWJlcjtcclxuXHJcbmxldCBlbnZpcm9ubWVudFNwcml0ZXM6IEhUTUxJbWFnZUVsZW1lbnRbXSA9IFtcclxuICAgIGxvYWRJbWFnZShcIi4uL2Fzc2V0cy9kZWZhdWx0LnBuZ1wiKSxcclxuICAgIGxvYWRJbWFnZShcIi4uL2Fzc2V0cy9mb3Jlc3QucG5nXCIpLFxyXG4gICAgbG9hZEltYWdlKFwiLi4vYXNzZXRzL2Rlc2VydC5wbmdcIiksXHJcbiAgICBsb2FkSW1hZ2UoXCIuLi9hc3NldHMvd2F0ZXIucG5nXCIpLFxyXG5dO1xyXG5cclxubGV0IGVudmlyb25tZW50VGltZXJzOiB7Y3VycmVudFRpbWU6IG51bWJlciwgbWF4VGltZTogbnVtYmVyfVtdID0gW1xyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiA3MDAwfSxcclxuICAgIHtjdXJyZW50VGltZTogMCwgbWF4VGltZTogMzUwMH0sXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDM1MDB9LFxyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiAzNTAwfSxcclxuXTtcclxubGV0IGN1cnJlbnRUcmFuc2Zvcm1hdGlvbjogbnVtYmVyID0gMDtcclxubGV0IHRyYW5zZm9ybWF0aW9uTGV2ZWxzOiB7ZXhwOiBudW1iZXIsIHRvTmV4dExldmVsOiBudW1iZXIsIGxldmVsOiBudW1iZXJ9W10gPSBbXHJcbiAgICB7ZXhwOiAwLCB0b05leHRMZXZlbDogMjAwLCBsZXZlbDogMX0sXHJcbiAgICB7ZXhwOiAwLCB0b05leHRMZXZlbDogMTAwLCBsZXZlbDogMX0sXHJcbiAgICB7ZXhwOiAwLCB0b05leHRMZXZlbDogMTAwLCBsZXZlbDogMX0sXHJcbiAgICB7ZXhwOiAwLCB0b05leHRMZXZlbDogMTAwLCBsZXZlbDogMX0sXHJcbl07XHJcblxyXG5sZXQgbWluRW5lbXlSYWRpdXM6IG51bWJlciA9IDc7XHJcbmxldCBtYXhFbmVteVJhZGl1czogbnVtYmVyID0gMjA7XHJcbmxldCBlbmVtaWVzOiBFbmVteVtdID0gW107XHJcblxyXG5sZXQgbWlzc2lsZXM6IE1pc3NpbGVbXSA9IFtdO1xyXG5cclxubGV0IGN1cnJlbnRXYXZlOiBudW1iZXIgPSAtMTtcclxubGV0IHByZXZpb3VzV2F2ZUVuZFRpbWVNaWxsaXM6IG51bWJlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5sZXQgd2F2ZVJlc3RUaW1lTWlsbGlzOiBudW1iZXIgPSA4MDAwO1xyXG5sZXQgaXNJblJlc3RUaW1lOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbmxldCBmbG9hdGluZ1RleHRzOiBGbG9hdGluZ1RleHRbXSA9IFtdO1xyXG5cclxubGV0IG51bVR1dG9yaWFsc1RvU2hvdzogbnVtYmVyID0gMztcclxubGV0IG51bVR1dG9yaWFsc1Nob3duOiBudW1iZXIgPSAwO1xyXG5cclxubGV0IGlzR2FtZU92ZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxubGV0IGdhbWVPdmVyVGltZU1pbGxpczogbnVtYmVyO1xyXG5sZXQgaXNHYW1lV29uOiBib29sZWFuO1xyXG5cclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG5cclxuZG9jdW1lbnQub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgIGlmIChlLnJlcGVhdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBrZXkgPSBlLmtleS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgaWYgKGtleVN0YXRlcy5oYXMoa2V5KSkge1xyXG4gICAgICAgIGtleVN0YXRlcy5zZXQoa2V5LCBLZXlTdGF0ZS5ET1dOKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25rZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuVVApO1xyXG4gICAgfVxyXG59O1xyXG5kb2N1bWVudC5vbm1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBtb3VzZURvd25ZID0gZS5jbGllbnRZO1xyXG4gICAgbW91c2VEb3duVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG59XHJcbmRvY3VtZW50Lm9ubW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgbW91c2VVcFkgPSBlLmNsaWVudFk7XHJcbiAgICBsZXQgbW91c2VVcFRpbWU6IG51bWJlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgbGV0IHNwZWVkQm9vc3QgPSBjbGFtcFZhbHVlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgKG1vdXNlVXBZIC0gbW91c2VEb3duWSkgLyAobW91c2VVcFRpbWUgLSBtb3VzZURvd25UaW1lKSxcclxuICAgICAgICAxMCxcclxuICAgICk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXMgPSBtb3VzZVVwVGltZTtcclxuICAgIGxhc3RTcGVlZEJvb3N0U3BlZWQgPSBNYXRoLm1heChtaW5pbXVtU3BlZWQsIHNwZWVkQm9vc3QgKiAwLjAwMyk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQgPSBNYXRoLm1heChtaW5pbXVtUm90YXRpb25TcGVlZCwgc3BlZWRCb29zdCAqIDAuMDA1KTtcclxuICAgIGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzID0gbWFwTGluZWFyKDAsIHNwZWVkQm9vc3QsIDEwLCBtaW5HdXlSYWRpdXMsIG1heEd1eVJhZGl1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXcoY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcikge1xyXG4gICAgaWYgKHByZXZpb3VzVGltZU1pbGxpcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgZWxhcHNlZFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcyAtIHByZXZpb3VzVGltZU1pbGxpcztcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICBsZXQgbW92ZVg6IG51bWJlciA9IChrZXlTdGF0ZXMuZ2V0KFwiQVwiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IC0xIDogMClcclxuICAgICAgICArIChrZXlTdGF0ZXMuZ2V0KFwiRFwiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IDEgOiAwKTtcclxuICAgIGxldCBtb3ZlWTogbnVtYmVyID0gKGtleVN0YXRlcy5nZXQoXCJXXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gLTEgOiAwKVxyXG4gICAgICAgICsgKGtleVN0YXRlcy5nZXQoXCJTXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gMSA6IDApO1xyXG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydChtb3ZlWCAqIG1vdmVYICsgbW92ZVkgKiBtb3ZlWSk7XHJcbiAgICBpZiAobWFnbml0dWRlID4gMCkge1xyXG4gICAgICAgIG1vdmVYID0gbW92ZVggLyBtYWduaXR1ZGUgKiBjdXJyZW50U3BlZWQ7XHJcbiAgICAgICAgbW92ZVkgPSBtb3ZlWSAvIG1hZ25pdHVkZSAqIGN1cnJlbnRTcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaGl0WDogbnVtYmVyID0gMDtcclxuICAgIGxldCBoaXRZOiBudW1iZXIgPSAwO1xyXG4gICAgaWYgKGd1eUxhc3RIaXRUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBoaXRYID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzICsgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlDb2x1bW4sXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBoaXRZID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzICsgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlSb3csXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ3V5VmVsb2NpdHlDb2x1bW4gPSBtb3ZlWCArIGhpdFg7XHJcbiAgICBndXlWZWxvY2l0eVJvdyA9IG1vdmVZICsgaGl0WTtcclxuXHJcbiAgICBjZW50ZXJDb2x1bW4gKz0gZ3V5VmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgIGNlbnRlclJvdyArPSBndXlWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgIGN1cnJlbnRSb3RhdGlvbiArPSBlbGFwc2VkVGltZU1pbGxpcyAqIGN1cnJlbnRSb3RhdGlvblNwZWVkO1xyXG5cclxuICAgIGlmIChsYXN0U3BlZWRCb29zdFNwZWVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RTcGVlZCxcclxuICAgICAgICAgICAgbWluaW11bVNwZWVkLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkLFxyXG4gICAgICAgICAgICBtaW5pbXVtUm90YXRpb25TcGVlZCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJlbnRHdXlSYWRpdXMgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RHdXlSYWRpdXMsXHJcbiAgICAgICAgICAgIG1pbkd1eVJhZGl1cyxcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtaW5pbXVtU3BlZWQ7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtaW5pbXVtUm90YXRpb25TcGVlZDtcclxuICAgICAgICBjdXJyZW50R3V5UmFkaXVzID0gbWluR3V5UmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0b3BMZWZ0Q29sdW1uOiBudW1iZXIgPSBjZW50ZXJDb2x1bW4gLSAoY2FudmFzLndpZHRoIC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IHRvcExlZnRSb3c6IG51bWJlciA9IGNlbnRlclJvdyAtIChjYW52YXMuaGVpZ2h0IC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IGd1eUNlbnRlclggPSBjb2x1bW5Ub1goY2VudGVyQ29sdW1uLCB0b3BMZWZ0Q29sdW1uLCBlbnZpcm9ubWVudFRpbGVTaXplKTtcclxuICAgIGxldCBndXlDZW50ZXJZID0gcm93VG9ZKGNlbnRlclJvdywgdG9wTGVmdFJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICBcclxuICAgIGxldCBlbnZpcm9ubWVudERyYXdDb3VudCA9IGRyYXdFbnZpcm9ubWVudCh0b3BMZWZ0Q29sdW1uLCB0b3BMZWZ0Um93KTtcclxuXHJcbiAgICAvLyB1cGRhdGUgYWxsIGVuZW15IHgncyBhbmQgeSdzIGFuZCBtb3ZlIHZlbG9jaXRpZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0udXBkYXRlKGNlbnRlckNvbHVtbiwgY2VudGVyUm93LCBlbnZpcm9ubWVudFRpbGVTaXplLCBjdXJyZW50VGltZU1pbGxpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGFsbCBtaXNzaWxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG1pc3NpbGVzW2ldLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBhbGwgdGhlIGZsb2F0aW5nIHRleHRzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZsb2F0aW5nVGV4dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmbG9hdGluZ1RleHRzW2ldLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvIGVuZW15LWd1eSBjb2xsaXNpb24gYW5kIGdhbWUgc2ltdWxhdGlvbiBzdHVmZlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGVuZW15OiBFbmVteSA9IGVuZW1pZXNbaV07XHJcbiAgICAgICAgaWYgKGNvbGxpZGVDaXJjbGVzKFxyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgY3VycmVudEd1eVJhZGl1cyxcclxuICAgICAgICAgICAgZW5lbXkueCxcclxuICAgICAgICAgICAgZW5lbXkueSxcclxuICAgICAgICAgICAgZW5lbXkucmFkaXVzKVxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICBlbmVteS5sYXN0SGl0VGltZU1pbGxpcyA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICB8fCAoY3VycmVudFRpbWVNaWxsaXMgLSBlbmVteS5sYXN0SGl0VGltZU1pbGxpcykgPiBlbmVteS5oaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgJiYgIWlzR2FtZU92ZXJcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbGV0IGVuZW15TWFzczogbnVtYmVyID0gZW5lbXkucmFkaXVzO1xyXG4gICAgICAgICAgICBsZXQgZ3V5TWFzczogbnVtYmVyID0gY3VycmVudEd1eVJhZGl1cztcclxuICAgICAgICAgICAgbGV0IGd1eUNlbnRlcjogVmVjdG9yID0gbmV3IFZlY3RvcihndXlDZW50ZXJYLCBndXlDZW50ZXJZKTtcclxuICAgICAgICAgICAgbGV0IGVuZW15Q2VudGVyOiBWZWN0b3IgPSBuZXcgVmVjdG9yKGVuZW15LngsIGVuZW15LnkpO1xyXG4gICAgICAgICAgICBsZXQgZ3V5VmVsb2NpdHk6IFZlY3RvciA9IG5ldyBWZWN0b3IoZ3V5VmVsb2NpdHlDb2x1bW4sIGd1eVZlbG9jaXR5Um93KVxyXG4gICAgICAgICAgICAgICAgLnBsdXMoZW5lbXlDZW50ZXIubWludXMoZ3V5Q2VudGVyKS5ub3JtYWxpemUoKS5zY2FsZSgwLjAxKSk7XHJcbiAgICAgICAgICAgIGxldCBlbmVteVZlbG9jaXR5OiBWZWN0b3IgPSBuZXcgVmVjdG9yKGVuZW15LmhpdFZlbG9jaXR5Q29sdW1uLCBlbmVteS5oaXRWZWxvY2l0eVJvdyk7XHJcbiAgICAgICAgICAgIGxldCBndXlIaXRWZWxvY2l0eTogVmVjdG9yID0gZ2V0Q29sbGlzaW9uVmVsb2NpdHkoXHJcbiAgICAgICAgICAgICAgICBndXlDZW50ZXIsXHJcbiAgICAgICAgICAgICAgICBlbmVteUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGd1eU1hc3MsXHJcbiAgICAgICAgICAgICAgICBlbmVteU1hc3MsXHJcbiAgICAgICAgICAgICAgICBndXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgICAgIGVuZW15VmVsb2NpdHksXHJcbiAgICAgICAgICAgICkuc2NhbGUoMC4yKTtcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlDb2x1bW4gPSBndXlIaXRWZWxvY2l0eS54O1xyXG4gICAgICAgICAgICBndXlIaXRWZWxvY2l0eVJvdyA9IGd1eUhpdFZlbG9jaXR5Lnk7XHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgZW5lbXlIaXRWZWxvY2l0eTogVmVjdG9yID0gZ2V0Q29sbGlzaW9uVmVsb2NpdHkoXHJcbiAgICAgICAgICAgICAgICBlbmVteUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGd1eUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGVuZW15TWFzcyxcclxuICAgICAgICAgICAgICAgIGd1eU1hc3MsXHJcbiAgICAgICAgICAgICAgICBlbmVteVZlbG9jaXR5LFxyXG4gICAgICAgICAgICAgICAgZ3V5VmVsb2NpdHksXHJcbiAgICAgICAgICAgICkuc2NhbGUoMC4zKTtcclxuICAgICAgICAgICAgZW5lbXkubGFzdEhpdFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgZW5lbXkuaGl0VmVsb2NpdHlDb2x1bW4gPSBlbmVteUhpdFZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgIGVuZW15LmhpdFZlbG9jaXR5Um93ID0gZW5lbXlIaXRWZWxvY2l0eS55O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gZGV0ZXJtaW5lIGRhbWFnZSBkZWx0IHRvIGVuZW15XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VNdWx0aXBsaWVyOiBudW1iZXIgPSBnZXREYW1hZ2VNdWx0aXBsaWVyKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSwgZW5lbXkuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VEZWFsdDogbnVtYmVyID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgbWluR3V5UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEd1eVJhZGl1cyxcclxuICAgICAgICAgICAgICAgIG1heEd1eVJhZGl1cyxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAoMTAgKyB0cmFuc2Zvcm1hdGlvbkxldmVsc1tjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgbnVtYmVyXS5sZXZlbCAtIDEpICogZGFtYWdlTXVsdGlwbGllcixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZW5lbXkuY3VycmVudEhlYWx0aCAtPSBkYW1hZ2VEZWFsdDtcclxuXHJcbiAgICAgICAgICAgIC8vIGF3YXJkIHhwIGlmIGVuZW15IHdhcyBraWxsZWRcclxuICAgICAgICAgICAgaWYgKGVuZW15LmN1cnJlbnRIZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4cEdhaW46IG51bWJlciA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgICAgICBtaW5FbmVteVJhZGl1cyxcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5yYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4RW5lbXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgNDAwLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VHJhbnNmb3JtYXRpb24gIT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbkxldmVsc1tjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgbnVtYmVyXS5leHAgKz0gZXhwR2FpbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uTGV2ZWxzW0Vudmlyb25tZW50S2V5LkRFRkFVTFQgYXMgbnVtYmVyXS5leHAgKz0gZXhwR2FpbiAqIDAuNjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc3Bhd24gZmxvYXRpbmcgdGV4dFxyXG4gICAgICAgICAgICBmbG9hdGluZ1RleHRzLnB1c2gobmV3IEZsb2F0aW5nVGV4dChcclxuICAgICAgICAgICAgICAgIGVuZW15LnJvdyxcclxuICAgICAgICAgICAgICAgIGVuZW15LmNvbHVtbixcclxuICAgICAgICAgICAgICAgIFwiLVwiICsgKE1hdGgucm91bmQoZGFtYWdlRGVhbHQgKiAxMCkgLyAxMCkudG9GaXhlZCgxKVxyXG4gICAgICAgICAgICAgICAgICAgICsgKGRhbWFnZU11bHRpcGxpZXIgPT09IDMgPyBcIiBDUklUSUNBTFwiIDogXCJcIiksXHJcbiAgICAgICAgICAgICAgICBcImJsYWNrXCIsXHJcbiAgICAgICAgICAgICAgICAyMCxcclxuICAgICAgICAgICAgICAgIC0wLjAwMSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG8gbWlzc2lsZS1ndXkgY29sbGlzaW9uXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pc3NpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG1pc3NpbGU6IE1pc3NpbGUgPSBtaXNzaWxlc1tpXTtcclxuICAgICAgICBpZiAoY29sbGlkZUNpcmNsZXMoXHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICBtaW5HdXlSYWRpdXMsIC8vIERlbGliZXJhdGVseSB1c2UgbWluIGd1eSByYWRpdXMgaGVyZVxyXG4gICAgICAgICAgICBtaXNzaWxlLngsXHJcbiAgICAgICAgICAgIG1pc3NpbGUueSxcclxuICAgICAgICAgICAgbWlzc2lsZS5yYWRpdXMpXHJcbiAgICAgICAgICAgICYmICFpc0dhbWVPdmVyXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VNdWx0aXBsaWVyOiBudW1iZXIgPSBnZXREYW1hZ2VNdWx0aXBsaWVyKG1pc3NpbGUuZWxlbWVudCwgY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICAgICAgbGV0IGRhbWFnZURlYWx0OiBudW1iZXIgPSBkYW1hZ2VNdWx0aXBsaWVyICogMTBcclxuICAgICAgICAgICAgZ3V5Q3VycmVudEhlYWx0aCAtPSBkYW1hZ2VEZWFsdDtcclxuICAgICAgICAgICAgZ3V5TGFzdERhbWFnZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgICAgIG1pc3NpbGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgaS0tO1xyXG5cclxuICAgICAgICAgICAgLy8gc3Bhd24gZmxvYXRpbmcgdGV4dFxyXG4gICAgICAgICAgICBmbG9hdGluZ1RleHRzLnB1c2gobmV3IEZsb2F0aW5nVGV4dChcclxuICAgICAgICAgICAgICAgIGNlbnRlclJvdyxcclxuICAgICAgICAgICAgICAgIGNlbnRlckNvbHVtbixcclxuICAgICAgICAgICAgICAgIFwiLVwiICsgKE1hdGgucm91bmQoZGFtYWdlRGVhbHQgKiAxMCkgLyAxMCkudG9GaXhlZCgxKVxyXG4gICAgICAgICAgICAgICAgICAgICsgKGRhbWFnZU11bHRpcGxpZXIgPT09IDMgPyBcIiBDUklUSUNBTFwiIDogXCJcIiksXHJcbiAgICAgICAgICAgICAgICBcInJlZFwiLFxyXG4gICAgICAgICAgICAgICAgMjAsXHJcbiAgICAgICAgICAgICAgICAtMC4wMDEsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSBkZWFkIGVuZW1pZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbmVtaWVzW2ldLmN1cnJlbnRIZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICBlbmVtaWVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlY3QgdGhlIGVuZCBvZiBhIHdhdmVcclxuICAgIGlmIChlbmVtaWVzLmxlbmd0aCA9PT0gMCAmJiAhaXNJblJlc3RUaW1lKSB7XHJcbiAgICAgICAgcHJldmlvdXNXYXZlRW5kVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIGlzSW5SZXN0VGltZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIG9sZCBtaXNzaWxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBtaXNzaWxlOiBNaXNzaWxlID0gbWlzc2lsZXNbaV07XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUaW1lTWlsbGlzIC0gbWlzc2lsZS5jcmVhdGlvblRpbWVNaWxsaXMgPiBtaXNzaWxlLmxpZmV0aW1lTWlsbGlzKSB7XHJcbiAgICAgICAgICAgIG1pc3NpbGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZW1vdmUgb2xkIGZsb2F0aW5nIHRleHRzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZsb2F0aW5nVGV4dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZmxvYXRpbmdUZXh0OiBGbG9hdGluZ1RleHQgPSBmbG9hdGluZ1RleHRzW2ldO1xyXG4gICAgICAgIGlmIChjdXJyZW50VGltZU1pbGxpcyAtIGZsb2F0aW5nVGV4dC5jcmVhdGlvblRpbWVNaWxsaXMgPiBmbG9hdGluZ1RleHQubGlmZXRpbWVNaWxsaXMpIHtcclxuICAgICAgICAgICAgZmxvYXRpbmdUZXh0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBhbGwgZW5lbWllc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZW5lbWllc1tpXS5kcmF3KGN1cnJlbnRUaW1lTWlsbGlzLCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgYWxsIG1pc3NpbGVzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pc3NpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbWlzc2lsZXNbaV0uZHJhdyhjdXJyZW50VGltZU1pbGxpcywgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGFsbCBmbG9hdGluZyB0ZXh0c1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbG9hdGluZ1RleHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZmxvYXRpbmdUZXh0c1tpXS5kcmF3KGN1cnJlbnRUaW1lTWlsbGlzLCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGVuZW1pZXMgY2FuIG1heWJlIHNwYXduIG1pc3NpbGVzXHJcbiAgICBsZXQgYmFycmFnZVJhdGVNaWxsaXM6IG51bWJlciA9IDUwMDA7XHJcbiAgICBsZXQgbWlzc2lsZUZpcmVSYXRlTWlsbGlzOiBudW1iZXIgPSA1MDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZW5lbXkgPSBlbmVtaWVzW2ldO1xyXG4gICAgICAgIGlmKGN1cnJlbnRUaW1lTWlsbGlzIC0gZW5lbXkubGFzdEJhcnJhZ2VTdGFydE1pbGxpcyA+IGJhcnJhZ2VSYXRlTWlsbGlzKSB7XHJcbiAgICAgICAgICAgIGVuZW15Lmxhc3RCYXJyYWdlTWlzc2lsZSA9IDA7XHJcbiAgICAgICAgICAgIGVuZW15Lmxhc3RCYXJyYWdlU3RhcnRNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUaW1lTWlsbGlzIC0gZW5lbXkubGFzdE1pc3NpbGVTcGF3bkF0dGVtcHRNaWxsaXMgPiBtaXNzaWxlRmlyZVJhdGVNaWxsaXNcclxuICAgICAgICAgICAgJiYgZW5lbXkubGFzdEJhcnJhZ2VNaXNzaWxlIDwgZW5lbXkuYmFycmFnZU51bWJlcikge1xyXG4gICAgICAgICAgICBsZXQgc3Bhd25DaGFuY2UgPSBtYXBMaW5lYXIobWluRW5lbXlSYWRpdXMsIGVuZW15LnJhZGl1cywgbWF4RW5lbXlSYWRpdXMsIDAuNCwgMSk7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDw9IHNwYXduQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVNwZWVkID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCBlbmVteS5yYWRpdXMsIG1heEVuZW15UmFkaXVzLCAwLjAwMDMsIDAuMDAxKTtcclxuICAgICAgICAgICAgICAgIGxldCB0dXJuU3BlZWQgPSBtYXBMaW5lYXIobWluRW5lbXlSYWRpdXMsIGVuZW15LnJhZGl1cywgbWF4RW5lbXlSYWRpdXMsIDAuMDAxLCAwLjAwMDEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpZmVUaW1lTWlsbGlzID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCBlbmVteS5yYWRpdXMsIG1heEVuZW15UmFkaXVzLCAzMDAwLCA4MDAwKTtcclxuICAgICAgICAgICAgICAgIG1pc3NpbGVzLnB1c2gobmV3IE1pc3NpbGUoZW5lbXkucm93LCBlbmVteS5jb2x1bW4sIDMsIGVuZW15LmVsZW1lbnQsIG1vdmVTcGVlZCwgdHVyblNwZWVkLCBsaWZlVGltZU1pbGxpcywgY3VycmVudFRpbWVNaWxsaXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbmVteS5sYXN0QmFycmFnZU1pc3NpbGUrKztcclxuICAgICAgICAgICAgZW5lbXkubGFzdE1pc3NpbGVTcGF3bkF0dGVtcHRNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgZW5lbXkubGFzdEJhcnJhZ2VTdGFydE1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZW52aXJvbm1lbnQgdGltZXJzXHJcbiAgICBsZXQgY3VycmVudEVudmlyb25tZW50OiBFbnZpcm9ubWVudEtleSA9IGdldEN1cnJlbnRFbnZpcm9ubWVudChjZW50ZXJDb2x1bW4sIGNlbnRlclJvdyk7XHJcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSAoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFRpbWVyID0gZW52aXJvbm1lbnRUaW1lcnNbY3VycmVudEVudmlyb25tZW50XTtcclxuICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lICs9IGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID4gY3VycmVudFRpbWVyLm1heFRpbWUpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA9IGN1cnJlbnRUaW1lci5tYXhUaW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFRpbWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoKGkgYXMgRW52aXJvbm1lbnRLZXkpICE9PSBjdXJyZW50RW52aXJvbm1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGltZXIgPSBlbnZpcm9ubWVudFRpbWVyc1tpXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSAtPSBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGltZXIuY3VycmVudFRpbWUgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB0cmlnZ2VyIHRyYW5zZm9ybWF0aW9uXHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSAoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KVxyXG4gICAgICAgICYmIGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF0uY3VycmVudFRpbWUgPT09IGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF0ubWF4VGltZVxyXG4gICAgICAgICYmICFpc0dhbWVPdmVyXHJcbiAgICApIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50VGltZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVudmlyb25tZW50VGltZXJzW2ldLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFRyYW5zZm9ybWF0aW9uID0gY3VycmVudEVudmlyb25tZW50IGFzIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgdHJhbnNmb3JtYXRpb24gbGV2ZWxzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybWF0aW9uTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybWF0aW9uID0gdHJhbnNmb3JtYXRpb25MZXZlbHNbaV07XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybWF0aW9uLmV4cCA+PSB0cmFuc2Zvcm1hdGlvbi50b05leHRMZXZlbCkge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbi5leHAgLT0gdHJhbnNmb3JtYXRpb24udG9OZXh0TGV2ZWw7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uLmxldmVsKys7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uLnRvTmV4dExldmVsICo9IDEuMTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpIGFzIEVudmlyb25tZW50S2V5ID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUKSB7XHJcbiAgICAgICAgICAgICAgICBndXlNYXhIZWFsdGggKz0gMjA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGd1eUN1cnJlbnRIZWFsdGggPD0gMCAmJiAhaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgIGlzR2FtZVdvbiA9IGZhbHNlO1xyXG4gICAgICAgIGdhbWVPdmVyVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBkcmF3IGVudmlyb25tZW50IGRyYXcgY291bnRcclxuICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChlbnZpcm9ubWVudERyYXdDb3VudC50b1N0cmluZygpLCBjYW52YXMud2lkdGggLyAyIC0gMTAsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgZ3V5XHJcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoZ3V5Q2VudGVyWCwgZ3V5Q2VudGVyWSk7XHJcbiAgICAgICAgY3R4LnJvdGF0ZShjdXJyZW50Um90YXRpb24pO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLWd1eUNlbnRlclgsIC1ndXlDZW50ZXJZKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGd1eVNwcml0ZSwgZ3V5Q2VudGVyWCAtIGd1eVNwcml0ZS53aWR0aCAvIDIsIGd1eUNlbnRlclkgLSBndXlTcHJpdGUuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb2xvciB0aGUgZ3V5J3MgaGVhZFxyXG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBsZXQgZ3V5Q29sb3JSYXRpbzogbnVtYmVyID0gMTtcclxuICAgICAgICBsZXQgZ3V5RGVmYXVsdENvbG9yOiBDb2xvciA9IGdldFRpbnRlZENvbG9yKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSk7XHJcbiAgICAgICAgaWYgKGd1eUxhc3REYW1hZ2VkVGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGd1eUNvbG9yUmF0aW8gPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICBndXlMYXN0RGFtYWdlZFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGd1eUxhc3REYW1hZ2VkVGltZU1pbGxpcyArIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGd1eUNvbG9yOiBDb2xvciA9IENvbG9yLmxlcnBDb2xvcnMoXHJcbiAgICAgICAgICAgIG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG4gICAgICAgICAgICBndXlEZWZhdWx0Q29sb3IsXHJcbiAgICAgICAgICAgIGd1eUNvbG9yUmF0aW8sXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3V5Q29sb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyhndXlDZW50ZXJYLCBndXlDZW50ZXJZLCA2LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGd1eSBzd2lybHkgdGhpbmdcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGxldCBndXlEZWZhdWx0Q29sb3I6IENvbG9yID0gZ2V0VGludGVkQ29sb3IoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGd1eURlZmF1bHRDb2xvci50b1N0cmluZygpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICBndXlDZW50ZXJYLFxyXG4gICAgICAgICAgICBndXlDZW50ZXJZLFxyXG4gICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAvIDYwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAvIDYwICsgbWFwTGluZWFyKG1pbkd1eVJhZGl1cywgY3VycmVudEd1eVJhZGl1cywgbWF4R3V5UmFkaXVzLCAxLCAyKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgdGhlIGd1eSdzIGhlYWx0aCBiYXJcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGxldCBndXlIZWFsdGhXaWR0aDogbnVtYmVyID0gZ3V5TWF4SGVhbHRoIC8gMjtcclxuICAgICAgICBsZXQgZ3V5SGVhbHRoSGVpZ2h0OiBudW1iZXIgPSA2O1xyXG4gICAgICAgIGxldCBndXlIZWFsdGhUb3BMZWZ0WDogbnVtYmVyID0gZ3V5Q2VudGVyWCAtIGd1eUhlYWx0aFdpZHRoIC8gMjtcclxuICAgICAgICBsZXQgZ3V5SGVhbHRoVG9wTGVmdFk6IG51bWJlciA9IGd1eUNlbnRlclkgLSBtYXhHdXlSYWRpdXMgLSBndXlIZWFsdGhIZWlnaHQgLyAyIC0gODtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoZ3V5SGVhbHRoVG9wTGVmdFgsIGd1eUhlYWx0aFRvcExlZnRZLCBndXlIZWFsdGhXaWR0aCAqIChndXlDdXJyZW50SGVhbHRoIC8gZ3V5TWF4SGVhbHRoKSwgZ3V5SGVhbHRoSGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdChndXlIZWFsdGhUb3BMZWZ0WCwgZ3V5SGVhbHRoVG9wTGVmdFksIGd1eUhlYWx0aFdpZHRoLCBndXlIZWFsdGhIZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0cmFuc2Zvcm0tdG8gYmFyXHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSBjdXJyZW50VHJhbnNmb3JtYXRpb24gJiYgIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBsZXQgdGlsZUNlbnRlclg6IG51bWJlciA9IGd1eUNlbnRlclggKyA1MDtcclxuICAgICAgICBsZXQgdGlsZUNlbnRlclk6IG51bWJlciA9IGd1eUNlbnRlclkgLSA3MDtcclxuICAgICAgICBsZXQgdGlsZVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgZHJhd0Vudmlyb25tZW50VGlsZSh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCBjdXJyZW50RW52aXJvbm1lbnQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyLCB0aWxlQ2VudGVyWSAtIHRpbGVTaXplIC8gMiwgdGlsZVNpemUsIHRpbGVTaXplKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBsZXQgd2lkdGg6IG51bWJlciA9IDEwMDtcclxuICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSAxMDtcclxuICAgICAgICBsZXQgdG9wTGVmdFg6IG51bWJlciA9IHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyIC0gd2lkdGggLSAxMDtcclxuICAgICAgICBsZXQgdG9wTGVmdFk6IG51bWJlciA9IHRpbGVDZW50ZXJZIC0gaGVpZ2h0IC8gMjtcclxuICAgICAgICBsZXQgY3VycmVudEVudmlyb25tZW50VGltZXI6IHtjdXJyZW50VGltZTogbnVtYmVyLCBtYXhUaW1lOiBudW1iZXJ9ID0gZW52aXJvbm1lbnRUaW1lcnNbY3VycmVudEVudmlyb25tZW50XTtcclxuICAgICAgICBsZXQgZmlsbFJhdGlvOiBudW1iZXIgPSAoY3VycmVudEVudmlyb25tZW50VGltZXIuY3VycmVudFRpbWUgLyBjdXJyZW50RW52aXJvbm1lbnRUaW1lci5tYXhUaW1lKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogZmlsbFJhdGlvLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IHRoZSBVSSBiYWNrZ3JvdW5kXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMC41O1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIDQwKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgd2F2ZSBudW1iZXJcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KFwiV2F2ZSBcIiArIChjdXJyZW50V2F2ZSArIDEpLCAzLCAwKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgY3VycmVudCBudW1iZXIgb2YgZW5lbWllcyBhbGl2ZVxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgIGN0eC5mb250ID0gXCIyMHB4IEFyaWFsXCI7XHJcbiAgICBjdHguZmlsbFRleHQoZW5lbWllcy5sZW5ndGggKyBcIiBFbmVtaWVzIExlZnRcIiwgMTAwLCAwKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgd2F2ZSByZXN0IHRpbWVyIGFuZC9vciB0cmlnZ2VyIHRoZSBuZXh0IHdhdmVcclxuICAgIGlmIChlbmVtaWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGxldCByZXN0VGltZVJlbWFpbmluZ01pbGxpcyA9IHdhdmVSZXN0VGltZU1pbGxpcyAtIChjdXJyZW50VGltZU1pbGxpcyAtIHByZXZpb3VzV2F2ZUVuZFRpbWVNaWxsaXMpO1xyXG4gICAgICAgIGd1eUN1cnJlbnRIZWFsdGggPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgZ3V5TWF4SGVhbHRoLFxyXG4gICAgICAgICAgICBndXlDdXJyZW50SGVhbHRoICsgZWxhcHNlZFRpbWVNaWxsaXMgLyB3YXZlUmVzdFRpbWVNaWxsaXMgKiBndXlNYXhIZWFsdGgsXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGlmIChyZXN0VGltZVJlbWFpbmluZ01pbGxpcyA8PSAwICYmICFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRXYXZlKys7XHJcbiAgICAgICAgICAgIGlzSW5SZXN0VGltZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFdhdmUgPj0gd2F2ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlzR2FtZVdvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBnYW1lT3ZlclRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNwYXduRW5lbWllcyhjdXJyZW50V2F2ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBcIjIwcHggQXJpYWxcIjtcclxuICAgICAgICAgICAgbGV0IHRlbnRoczogbnVtYmVyID0gTWF0aC5yb3VuZChyZXN0VGltZVJlbWFpbmluZ01pbGxpcyAvIDEwMCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChcclxuICAgICAgICAgICAgICAgICh0ZW50aHMgLyAxMCkudG9GaXhlZCgxKSArIFwicyBVbnRpbCBOZXh0IFdhdmVcIixcclxuICAgICAgICAgICAgICAgIDMsXHJcbiAgICAgICAgICAgICAgICAyMCxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IHRyYW5mb3JtYXRpb24gZXhwIGJhcnMgYW5kIGxldmVsc1xyXG4gICAgZHJhd1RyYW5zZm9ybWF0aW9uRXhwQmFyKGNhbnZhcy53aWR0aCAtIDIwMCwgMywgMCk7XHJcbiAgICBkcmF3VHJhbnNmb3JtYXRpb25FeHBCYXIoY2FudmFzLndpZHRoIC0gMjAwLCAyMywgMSk7XHJcbiAgICBkcmF3VHJhbnNmb3JtYXRpb25FeHBCYXIoY2FudmFzLndpZHRoLCAzLCAyKTtcclxuICAgIGRyYXdUcmFuc2Zvcm1hdGlvbkV4cEJhcihjYW52YXMud2lkdGgsIDIzLCAzKTtcclxuXHJcbiAgICAvLyBkcmF3IGdhbWUgb3ZlciB0ZXh0XHJcbiAgICBpZiAoaXNHYW1lT3ZlciAmJiAhaXNHYW1lV29uKSB7XHJcbiAgICAgICAgbGV0IHRpbWVTaW5jZUdhbWVPdmVyTWlsbGlzOiBudW1iZXIgPSBjdXJyZW50VGltZU1pbGxpcyAtIGdhbWVPdmVyVGltZU1pbGxpcztcclxuICAgICAgICBsZXQgdGV4dE9wYWNpdHkgPSBtYXBMaW5lYXIoMCwgdGltZVNpbmNlR2FtZU92ZXJNaWxsaXMsIDIwMDAsIDAsIDEpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGV4dE9wYWNpdHk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjQwcHggQXJpYWxcIlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsIGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfSBlbHNlIGlmKGlzR2FtZU92ZXIgJiYgaXNHYW1lV29uKSB7XHJcbiAgICAgICAgbGV0IHRpbWVTaW5jZUdhbWVPdmVyTWlsbGlzOiBudW1iZXIgPSBjdXJyZW50VGltZU1pbGxpcyAtIGdhbWVPdmVyVGltZU1pbGxpcztcclxuICAgICAgICBsZXQgdGV4dE9wYWNpdHkgPSBtYXBMaW5lYXIoMCwgdGltZVNpbmNlR2FtZU92ZXJNaWxsaXMsIDIwMDAsIDAsIDEpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGV4dE9wYWNpdHk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjQwcHggQXJpYWxcIlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiWW91IFdpbiFcIiwgY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgZHJhZyB0dXRvcmlhbCB0ZXh0XHJcbiAgICBpZiAobnVtVHV0b3JpYWxzU2hvd24gPCBudW1UdXRvcmlhbHNUb1Nob3dcclxuICAgICAgICAmJiBjdXJyZW50VGltZU1pbGxpcyA+IDIwMDAgKyAyMDAwICogbnVtVHV0b3JpYWxzU2hvd24pIHtcclxuICAgICAgICBmbG9hdGluZ1RleHRzLnB1c2gobmV3IEZsb2F0aW5nVGV4dChcclxuICAgICAgICAgICAgY2VudGVyUm93IC0gMyxcclxuICAgICAgICAgICAgY2VudGVyQ29sdW1uIC0gNSxcclxuICAgICAgICAgICAgXCJ2diBDbGljaywgRHJhZywgUmVsZWFzZSEgdnZcIixcclxuICAgICAgICAgICAgXCJibGFja1wiLFxyXG4gICAgICAgICAgICA0MCxcclxuICAgICAgICAgICAgMC4wMDYsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIG51bVR1dG9yaWFsc1Nob3duKys7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBmcHNcclxuICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgIGxldCBmcHM6IG51bWJlciA9IDEwMDAgLyBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChNYXRoLnJvdW5kKGZwcykudG9TdHJpbmcoKSArIFwiRlBTXCIsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2VTb3VyY2U6IHN0cmluZyk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgaWYgKHByZWxvYWRSZWdpc3RyeS5oYXMoaW1hZ2VTb3VyY2UpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGF0dGVtcHRlZCB0byBsb2FkIHRoZSBzYW1lIGltYWdlIHR3aWNlIGR1cmluZyBwcmVsb2FkaW5nLlwiKTtcclxuICAgIH1cclxuICAgIHByZWxvYWRSZWdpc3RyeS5zZXQoaW1hZ2VTb3VyY2UsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBUaGUgb3JkZXIgdGhlc2UgMyB0aGluZ3MgYXJlIGRvbmUgaW4gaXMgVkVSWSBpbXBvcnRhbnQhXHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICBwcmVsb2FkUmVnaXN0cnkuc2V0KGltYWdlU291cmNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGltYWdlLnNyYyA9IGltYWdlU291cmNlO1xyXG5cclxuICAgIHJldHVybiBpbWFnZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlbG9hZCgpIHtcclxuICAgIGZvciAobGV0IFtrZXksIGxvYWRlZF0gb2YgcHJlbG9hZFJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgaWYgKCFsb2FkZWQpIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGF3bkVuZW1pZXMoY3VycmVudFdhdmU6IG51bWJlcikge1xyXG4gICAgbGV0IGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGxldCB3YXZlOiBudW1iZXJbXSA9IHdhdmVzW2N1cnJlbnRXYXZlXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2F2ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCByYWRpdXM6IG51bWJlciA9IHdhdmVbaV07XHJcbiAgICAgICAgbGV0IGhlYWx0aDogbnVtYmVyID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCByYWRpdXMsIG1heEVuZW15UmFkaXVzLCA1MCwgMjAwKTtcclxuICAgICAgICBsZXQgc3BlZWQ6IG51bWJlciA9IG1hcExpbmVhcihtaW5FbmVteVJhZGl1cywgcmFkaXVzLCBtYXhFbmVteVJhZGl1cywgMC4wMDEsIDAuMDAwNSk7XHJcbiAgICAgICAgbGV0IGJhcnJhZ2VOdW1iZXI6IG51bWJlcjtcclxuICAgICAgICBpZiAocmFkaXVzIDwgMTApIHtcclxuICAgICAgICAgICAgYmFycmFnZU51bWJlciA9IDE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyYWRpdXMgPj0gMTAgJiYgcmFkaXVzIDwgMTUpIHtcclxuICAgICAgICAgICAgYmFycmFnZU51bWJlciA9IHJhbmRvbUludCgyLCAzKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJhZGl1cyA+PSAxNSkge1xyXG4gICAgICAgICAgICBiYXJyYWdlTnVtYmVyID0gcmFuZG9tSW50KDQsIDUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbmVtaWVzLnB1c2gobmV3IEVuZW15KFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogZW52aXJvbm1lbnRDb2x1bW5zLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogZW52aXJvbm1lbnRSb3dzLFxyXG4gICAgICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgICAgIGhlYWx0aCxcclxuICAgICAgICAgICAgcmFuZG9tSW50KDAsIDMpIGFzIEVudmlyb25tZW50S2V5LFxyXG4gICAgICAgICAgICBzcGVlZCxcclxuICAgICAgICAgICAgYmFycmFnZU51bWJlcixcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdFbnZpcm9ubWVudCh0b3BMZWZ0Q29sdW1uOiBudW1iZXIsIHRvcExlZnRSb3c6IG51bWJlcikge1xyXG4gICAgbGV0IGJvdHRvbVJpZ2h0Q29sdW1uOiBudW1iZXIgPSB0b3BMZWZ0Q29sdW1uICsgY2FudmFzLndpZHRoIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBib3R0b21SaWdodFJvdzogbnVtYmVyID0gdG9wTGVmdFJvdyArIGNhbnZhcy5oZWlnaHQgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IG1pbkNvbHVtbjogbnVtYmVyID0gTWF0aC5mbG9vcih0b3BMZWZ0Q29sdW1uKTtcclxuICAgIGxldCBtYXhDb2x1bW46IG51bWJlciA9IE1hdGguY2VpbChib3R0b21SaWdodENvbHVtbik7XHJcbiAgICBsZXQgbWluUm93OiBudW1iZXIgPSBNYXRoLmZsb29yKHRvcExlZnRSb3cpO1xyXG4gICAgbGV0IG1heFJvdzogbnVtYmVyID0gTWF0aC5jZWlsKGJvdHRvbVJpZ2h0Um93KTtcclxuICAgIGxldCBlbnZpcm9ubWVudERyYXdDb3VudDogbnVtYmVyID0gMDtcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBmb3IgKGxldCBpID0gbWluUm93OyBpIDw9IG1heFJvdzsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IG1pbkNvbHVtbjsgaiA8PSBtYXhDb2x1bW47IGorKykge1xyXG4gICAgICAgICAgICBsZXQgd3JhcHBlZFJvdzogbnVtYmVyID0gd3JhcFZhbHVlKDAsIGksIGVudmlyb25tZW50Um93cyAtIDEpO1xyXG4gICAgICAgICAgICBsZXQgd3JhcHBlZENvbHVtbjogbnVtYmVyID0gd3JhcFZhbHVlKDAsIGosIGVudmlyb25tZW50Q29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBsZXQga2V5OiBFbnZpcm9ubWVudEtleSA9IGVudmlyb25tZW50W3dyYXBwZWRSb3ddW3dyYXBwZWRDb2x1bW5dO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGNvbHVtblRvWChqLCB0b3BMZWZ0Q29sdW1uLCBlbnZpcm9ubWVudFRpbGVTaXplKTtcclxuICAgICAgICAgICAgbGV0IHkgPSByb3dUb1koaSwgdG9wTGVmdFJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIGRyYXdFbnZpcm9ubWVudFRpbGUoTWF0aC5mbG9vcih4KSwgTWF0aC5mbG9vcih5KSwgZW52aXJvbm1lbnRUaWxlU2l6ZSwga2V5KTtcclxuXHJcbiAgICAgICAgICAgIC8vIG1hcmsgZWFjaCB0aWxlIHdpdGggaXRzIHJvdyBhbmQgY29sdW1uXHJcbiAgICAgICAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIC8vIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICAvLyBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICAgICAgLy8gY3R4LmZpbGxUZXh0KFwiKFwiICsgd3JhcHBlZFJvdyArIFwiLFwiICsgd3JhcHBlZENvbHVtbiArIFwiKVwiLCB4LCB5KTtcclxuICAgICAgICAgICAgLy8gZW52aXJvbm1lbnREcmF3Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgcmV0dXJuIGVudmlyb25tZW50RHJhd0NvdW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RW52aXJvbm1lbnRUaWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXplOiBudW1iZXIsIGtleTogRW52aXJvbm1lbnRLZXkpIHtcclxuICAgIGxldCBlbnZpcm9ubWVudFNwcml0ZTogSFRNTEltYWdlRWxlbWVudCA9IGVudmlyb25tZW50U3ByaXRlc1trZXkgYXMgbnVtYmVyXTtcclxuICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgZW52aXJvbm1lbnRTcHJpdGUsXHJcbiAgICAgICAgeCxcclxuICAgICAgICB5LFxyXG4gICAgICAgIHNpemUsXHJcbiAgICAgICAgc2l6ZSxcclxuICAgICk7XHJcbiAgICAvLyBjdHguZmlsbFN0eWxlID0gZ2V0RW52aXJvbm1lbnRDb2xvcihrZXkpLnRvU3RyaW5nKCk7XHJcbiAgICAvLyBjdHguZmlsbFJlY3QoeCwgeSwgc2l6ZSwgc2l6ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEN1cnJlbnRFbnZpcm9ubWVudChjZW50ZXJDb2x1bW46IG51bWJlciwgY2VudGVyUm93OiBudW1iZXIpOiBFbnZpcm9ubWVudEtleSB7XHJcbiAgICBsZXQgd3JhcHBlZFJvdzogbnVtYmVyID0gd3JhcFZhbHVlKDAsIE1hdGguZmxvb3IoY2VudGVyUm93KSwgZW52aXJvbm1lbnRSb3dzIC0gMSk7XHJcbiAgICBsZXQgd3JhcHBlZENvbHVtbjogbnVtYmVyID0gd3JhcFZhbHVlKDAsIE1hdGguZmxvb3IoY2VudGVyQ29sdW1uKSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSk7XHJcbiAgICByZXR1cm4gZW52aXJvbm1lbnRbd3JhcHBlZFJvd11bd3JhcHBlZENvbHVtbl07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhbWFnZU11bHRpcGxpZXIoYXR0YWNrZXI6IEVudmlyb25tZW50S2V5LCBkZWZlbmRlcjogRW52aXJvbm1lbnRLZXkpOiBudW1iZXIge1xyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUIHx8IGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChhdHRhY2tlciA9PT0gRW52aXJvbm1lbnRLZXkuRk9SRVNUKSB7XHJcbiAgICAgICAgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkZPUkVTVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuREVTRVJUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkZPUkVTVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1RyYW5zZm9ybWF0aW9uRXhwQmFyKFxyXG4gICAgeDogbnVtYmVyLFxyXG4gICAgeTogbnVtYmVyLFxyXG4gICAgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50S2V5LFxyXG4pIHtcclxuICAgIGxldCB0aWxlU2l6ZTogbnVtYmVyID0gMTU7XHJcbiAgICBsZXQgdGlsZUNlbnRlclg6IG51bWJlciA9IHggLSB0aWxlU2l6ZSAvIDIgLSAxMDtcclxuICAgIGxldCB0aWxlQ2VudGVyWTogbnVtYmVyID0geSArIHRpbGVTaXplIC8gMjtcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBkcmF3RW52aXJvbm1lbnRUaWxlKHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyLCB0aWxlQ2VudGVyWSAtIHRpbGVTaXplIC8gMiwgdGlsZVNpemUsIGVudmlyb25tZW50KTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiZ3JheVwiO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICBjdHguc3Ryb2tlUmVjdCh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCB0aWxlU2l6ZSk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGxldCB3aWR0aDogbnVtYmVyID0gMTAwO1xyXG4gICAgbGV0IGhlaWdodDogbnVtYmVyID0gMTA7XHJcbiAgICBsZXQgdG9wTGVmdFg6IG51bWJlciA9IHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyIC0gd2lkdGggLSAxMDtcclxuICAgIGxldCB0b3BMZWZ0WTogbnVtYmVyID0gdGlsZUNlbnRlclkgLSBoZWlnaHQgLyAyO1xyXG4gICAgbGV0IHRyYW5zZm9ybWF0aW9uOiB7ZXhwOiBudW1iZXIsIHRvTmV4dExldmVsOiBudW1iZXIsIGxldmVsOiBudW1iZXJ9ID0gdHJhbnNmb3JtYXRpb25MZXZlbHNbZW52aXJvbm1lbnQgYXMgbnVtYmVyXTtcclxuICAgIGxldCBmaWxsUmF0aW86IG51bWJlciA9ICh0cmFuc2Zvcm1hdGlvbi5leHAgLyB0cmFuc2Zvcm1hdGlvbi50b05leHRMZXZlbCk7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJncmF5XCI7XHJcbiAgICBjdHguZmlsbFJlY3QodG9wTGVmdFgsIHRvcExlZnRZLCB3aWR0aCAqIGZpbGxSYXRpbywgaGVpZ2h0KTtcclxuICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgY3R4LmZvbnQgPSBcIjE0cHggQXJpYWxcIjtcclxuICAgIGN0eC5maWxsVGV4dChcIkx2LiBcIiArIHRyYW5zZm9ybWF0aW9uLmxldmVsLCB0aWxlQ2VudGVyWCAtIHdpZHRoIC0gdGlsZVNpemUgLSAxNSwgdGlsZUNlbnRlclkgKyAxKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcbn1cclxuXHJcbndpbmRvdy5zZXRUaW1lb3V0KHByZWxvYWQsIDApO1xyXG5cclxuIiwiZXhwb3J0IGVudW0gS2V5U3RhdGUge1xyXG4gICAgVVAsXHJcbiAgICBET1dOLFxyXG59XHJcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnRDb2x1bW5zLCBFbnZpcm9ubWVudEtleSwgZW52aXJvbm1lbnRSb3dzIH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHsgZ2V0RGlzdGFuY2UsIGdldFRpbnRlZENvbG9yIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNaXNzaWxlIHtcclxuICAgIHB1YmxpYyByb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHJhZGl1czogbnVtYmVyO1xyXG4gICAgcHVibGljIG1vdmVWZWxvY2l0eUNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIG1vdmVWZWxpY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIHRvdGFsVmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbFZlbG9jaXR5Um93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbGFzdFVwZGF0ZVRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbGVtZW50OiBFbnZpcm9ubWVudEtleTtcclxuICAgIHB1YmxpYyBkZWZhdWx0Q29sb3I6IENvbG9yO1xyXG4gICAgcHVibGljIG1vdmVTcGVlZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxpZmV0aW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY3JlYXRpb25UaW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHVybmluZ1NwZWVkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxvZ0NvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHJvdzogbnVtYmVyLFxyXG4gICAgICAgIGNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHJhZGl1czogbnVtYmVyLFxyXG4gICAgICAgIGVsZW1lbnQ6IEVudmlyb25tZW50S2V5LFxyXG4gICAgICAgIG1vdmVTcGVlZDogbnVtYmVyLFxyXG4gICAgICAgIHR1cm5pbmdTcGVlZDogbnVtYmVyLFxyXG4gICAgICAgIGxpZmVUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcm93O1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5tb3ZlU3BlZWQgPSBtb3ZlU3BlZWQ7XHJcbiAgICAgICAgdGhpcy50dXJuaW5nU3BlZWQgPSB0dXJuaW5nU3BlZWQ7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4gPSAwO1xyXG4gICAgICAgIHRoaXMubW92ZVZlbGljaXR5Um93ID0gMDtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDb2xvciA9IGdldFRpbnRlZENvbG9yKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5saWZldGltZU1pbGxpcyA9IGxpZmVUaW1lTWlsbGlzO1xyXG4gICAgICAgIHRoaXMuY3JlYXRpb25UaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShcclxuICAgICAgICB3cmFwcGVkQ2VudGVyQ29sdW1uOiBudW1iZXIsXHJcbiAgICAgICAgd3JhcHBlZENlbnRlclJvdzogbnVtYmVyLFxyXG4gICAgICAgIGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlcixcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IGVsYXBzZWRUaW1lTWlsbGlzID0gMDtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsYXBzZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXMgLSB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50b3RhbFZlbG9jaXR5Q29sdW1uID0gdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW47XHJcbiAgICAgICAgdGhpcy50b3RhbFZlbG9jaXR5Um93ID0gdGhpcy5tb3ZlVmVsaWNpdHlSb3c7XHJcblxyXG4gICAgICAgIHRoaXMuY29sdW1uICs9IHRoaXMudG90YWxWZWxvY2l0eUNvbHVtbiAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHRoaXMucm93ICs9IHRoaXMudG90YWxWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgICAgICBsZXQgZHggPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyQ29sdW1uLCB0aGlzLmNvbHVtbiwgMCwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgICAgIGxldCBkeSA9IGdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJSb3csIHRoaXMucm93LCAwLCBlbnZpcm9ubWVudFJvd3MgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcblxyXG4gICAgICAgIGxldCBpZGVhbE1vdmVEaXJlY3Rpb246IFZlY3RvciA9IG5ldyBWZWN0b3IoLWR4LCAtZHkpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIGxldCBtb3ZlRGlyZWN0aW9uOiBWZWN0b3I7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBtb3ZlRGlyZWN0aW9uID0gaWRlYWxNb3ZlRGlyZWN0aW9uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpZGVhbEFuZ2xlOiBudW1iZXIgPSBpZGVhbE1vdmVEaXJlY3Rpb24uZGlyZWN0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50QW5nbGU6IG51bWJlciA9IE1hdGguYXRhbjIodGhpcy5tb3ZlVmVsaWNpdHlSb3csIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uKTtcclxuICAgICAgICAgICAgbGV0IGRBbmdsZTogbnVtYmVyID0gLWdldERpc3RhbmNlKGlkZWFsQW5nbGUsIGN1cnJlbnRBbmdsZSwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICBsZXQgYW5nbGVTaWduID0gZEFuZ2xlIC8gTWF0aC5zcXJ0KGRBbmdsZSAqIGRBbmdsZSk7XHJcbiAgICAgICAgICAgIGlmIChkQW5nbGUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGFuZ2xlU2lnbiA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG1heFR1cm5TcGVlZDogbnVtYmVyID0gTWF0aC5taW4oTWF0aC5hYnMoZEFuZ2xlKSwgdGhpcy50dXJuaW5nU3BlZWQgKiBlbGFwc2VkVGltZU1pbGxpcyk7XHJcbiAgICAgICAgICAgIGxldCBuZXdBbmdsZSA9IGN1cnJlbnRBbmdsZSArIG1heFR1cm5TcGVlZCAqIGFuZ2xlU2lnbjtcclxuICAgICAgICAgICAgbW92ZURpcmVjdGlvbiA9IG5ldyBWZWN0b3IoTWF0aC5jb3MobmV3QW5nbGUpLCBNYXRoLnNpbihuZXdBbmdsZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1vdmVWZWxvY2l0eTogVmVjdG9yO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbW92ZVZlbG9jaXR5ID0gbW92ZURpcmVjdGlvbi5zY2FsZSh0aGlzLm1vdmVTcGVlZCAqIGVsYXBzZWRUaW1lTWlsbGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtb3ZlVmVsb2NpdHkgPSBtb3ZlRGlyZWN0aW9uLnNjYWxlKDAuMDAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uID0gbW92ZVZlbG9jaXR5Lng7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsaWNpdHlSb3cgPSBtb3ZlVmVsb2NpdHkueTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMueCA9IGNhbnZhcy53aWR0aCAvIDIgKyBkeDtcclxuICAgICAgICB0aGlzLnkgPSBjYW52YXMuaGVpZ2h0IC8gMiArIGR5O1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcoXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICkge1xyXG4gICAgICAgIGxldCBtb3ZlRGlyZWN0aW9uOiBWZWN0b3IgPSBuZXcgVmVjdG9yKHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uLCB0aGlzLm1vdmVWZWxpY2l0eVJvdylcclxuICAgICAgICAgICAgLm5vcm1hbGl6ZSgpXHJcbiAgICAgICAgICAgIC5zY2FsZSg5KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gODtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICAgICAgdGhpcy54IC0gbW92ZURpcmVjdGlvbi54LFxyXG4gICAgICAgICAgICB0aGlzLnkgLSBtb3ZlRGlyZWN0aW9uLnksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgICAgICB0aGlzLnggKyBtb3ZlRGlyZWN0aW9uLngsXHJcbiAgICAgICAgICAgIHRoaXMueSArIG1vdmVEaXJlY3Rpb24ueSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgbW92ZURpcmVjdGlvbiA9IG1vdmVEaXJlY3Rpb24uc2NhbGUoMC45KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZGVmYXVsdENvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDQ7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgIHRoaXMueCAtIG1vdmVEaXJlY3Rpb24ueCxcclxuICAgICAgICAgICAgdGhpcy55IC0gbW92ZURpcmVjdGlvbi55LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhcclxuICAgICAgICAgICAgdGhpcy54ICsgbW92ZURpcmVjdGlvbi54LFxyXG4gICAgICAgICAgICB0aGlzLnkgKyBtb3ZlRGlyZWN0aW9uLnksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBFbnZpcm9ubWVudEtleSB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuLy8gbm90ZTogYXNzdW1lcyBmcm9tU3RhcnQgaXMgbGVzcyB0aGFuIGZyb21FbmQsIHRvU3RhcnQgaXMgbGVzcyB0aGFuIHRvRW5kXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXBMaW5lYXIoXHJcbiAgICBmcm9tU3RhcnQ6IG51bWJlcixcclxuICAgIGZyb21WYWx1ZTogbnVtYmVyLFxyXG4gICAgZnJvbUVuZDogbnVtYmVyLFxyXG4gICAgdG9TdGFydDogbnVtYmVyLFxyXG4gICAgdG9FbmQ6IG51bWJlclxyXG4pIHtcclxuICAgIGZyb21WYWx1ZSA9IGNsYW1wVmFsdWUoTWF0aC5taW4oZnJvbVN0YXJ0LCBmcm9tRW5kKSwgZnJvbVZhbHVlLCBNYXRoLm1heChmcm9tU3RhcnQsIGZyb21FbmQpKTtcclxuICAgIGxldCByYXRpbzogbnVtYmVyID0gKGZyb21WYWx1ZSAtIGZyb21TdGFydCkgLyAoZnJvbUVuZCAtIGZyb21TdGFydCk7XHJcbiAgICByZXR1cm4gdG9TdGFydCArIHJhdGlvICogKHRvRW5kIC0gdG9TdGFydCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcFZhbHVlKG1pbjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgaWYgKHZhbHVlIDwgbWluKSB7XHJcbiAgICAgICAgcmV0dXJuIG1pbjtcclxuICAgIH1cclxuICAgIGlmICh2YWx1ZSA+IG1heCkge1xyXG4gICAgICAgIHJldHVybiBtYXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIHRha2VuIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9yYW5kb21cclxuLy8gVGhlIG1heGltdW0gaXMgaW5jbHVzaXZlIGFuZCB0aGUgbWluaW11bSBpcyBpbmNsdXNpdmVcclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cmFwVmFsdWUobWluOiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4gfHwgdmFsdWUgPiBtYXgpIHtcclxuICAgICAgICByZXR1cm4gbW9kKHZhbHVlIC0gbWluLCBtYXggKyAxIC0gbWluKSArIG1pbjtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuLy8gdGhpcyBtb2R1bG8gaGFuZGxlcyBuZWdhdGl2ZXMgaG93IGl0J3Mgc3VwcG9zZWQgdG9cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDQ2NzUzOS9qYXZhc2NyaXB0LW1vZHVsby1naXZlcy1hLW5lZ2F0aXZlLXJlc3VsdC1mb3ItbmVnYXRpdmUtbnVtYmVyc1xyXG5mdW5jdGlvbiBtb2QobjogbnVtYmVyLCBtOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAoKG4gJSBtKSArIG0pICUgbTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbHVtblRvWChjb2x1bW46IG51bWJlciwgdG9wTGVmdENvbHVtbjogbnVtYmVyLCBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAoY29sdW1uIC0gdG9wTGVmdENvbHVtbikgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm93VG9ZKHJvdzogbnVtYmVyLCB0b3BMZWZ0Um93OiBudW1iZXIsIGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChyb3cgLSB0b3BMZWZ0Um93KSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb2xsaWRlQ2lyY2xlcyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCByMTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCByMjogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gTWF0aC5hYnMoeDEgLSB4MikgPCByMSArIHIyXHJcbiAgICAgICAgJiYgTWF0aC5hYnMoeTEgLSB5MikgPCByMSArIHIyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29sbGlzaW9uVmVsb2NpdHkoYzE6IFZlY3RvciwgYzI6IFZlY3RvciwgbTE6IG51bWJlciwgbTI6IG51bWJlciwgdjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICBsZXQgYzFNaW51c2MyOiBWZWN0b3IgPSBjMS5taW51cyhjMik7XHJcbiAgICByZXR1cm4gYzFNaW51c2MyXHJcbiAgICAgICAgLnNjYWxlKFxyXG4gICAgICAgICAgICAtMiAqIG0yIC8gKG0xICsgbTIpXHJcbiAgICAgICAgICAgICogVmVjdG9yLmlubmVyUHJvZHVjdCh2MS5taW51cyh2MiksIGMxTWludXNjMilcclxuICAgICAgICAgICAgLyBjMU1pbnVzYzIubm9ybVNxdWFyZWQoKVxyXG4gICAgICAgICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnZpcm9ubWVudENvbG9yKGtleTogRW52aXJvbm1lbnRLZXkpOiBDb2xvciB7XHJcbiAgICBzd2l0Y2goa2V5KSB7XHJcbiAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5ERUZBVUxUOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKDEwMCwgMjU1LCAxMDApO1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuRk9SRVNUOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKDAsIDIwMCwgMCk7XHJcbiAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5ERVNFUlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMjU1LCAyNTUsIDUwKTtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LldBVEVSOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKDAsIDAsIDI1NSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW50ZWRDb2xvcihrZXk6IEVudmlyb25tZW50S2V5KTogQ29sb3Ige1xyXG4gICAgbGV0IGNvbG9yOiBDb2xvciA9IGtleSA9PT0gRW52aXJvbm1lbnRLZXkuREVGQVVMVFxyXG4gICAgICAgID8gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpXHJcbiAgICAgICAgOiBnZXRFbnZpcm9ubWVudENvbG9yKGtleSk7XHJcbiAgICByZXR1cm4gQ29sb3IubGVycENvbG9ycyhcclxuICAgICAgICBjb2xvcixcclxuICAgICAgICBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSksXHJcbiAgICAgICAgMC4xNSxcclxuICAgICk7XHJcbn1cclxuXHJcbi8vIGEgaXMgYXNzdW1lZCB0byBiZSB0aGUgb3JpZ2luXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREaXN0YW5jZShhOiBudW1iZXIsIGI6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBsZXQgZGlzdDEgPSB3cmFwVmFsdWUobWluLCBiIC0gYSwgbWF4KTtcclxuICAgIGxldCBkaXN0MiA9IHdyYXBWYWx1ZShtaW4sIGEgLSBiLCBtYXgpO1xyXG4gICAgbGV0IG1pbkRpc3Q6IG51bWJlcjtcclxuICAgIGxldCBkaXJlY3Rpb24gPSAwO1xyXG4gICAgLy8gICAgICAgIGEgICBiXHJcbiAgICAvLyBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICBpZiAoYiA+PSBhICYmIGRpc3QxIDw9IGRpc3QyKSB7XHJcbiAgICAgICAgZGlyZWN0aW9uID0gMTtcclxuICAgICAgICBtaW5EaXN0ID0gZGlzdDE7XHJcbiAgICAvLyAgICBhICAgICAgICAgICBiXHJcbiAgICAvLyBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICB9IGVsc2UgaWYgKGIgPj0gYSAmJiBkaXN0MSA+IGRpc3QyKSB7XHJcbiAgICAgICAgZGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgbWluRGlzdCA9IGRpc3QyO1xyXG4gICAgLy8gICAgICAgIGIgICBhXHJcbiAgICAvLyBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICB9IGVsc2UgaWYgKGIgPCBhICYmIGRpc3QyIDw9IGRpc3QxKSB7XHJcbiAgICAgICAgZGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgbWluRGlzdCA9IGRpc3QyO1xyXG4gICAgLy8gICAgYiAgICAgICAgICAgYVxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgfSBlbHNlIGlmIChiIDwgYSAmJiBkaXN0MiA+IGRpc3QxKSB7XHJcbiAgICAgICAgZGlyZWN0aW9uID0gMTtcclxuICAgICAgICBtaW5EaXN0ID0gZGlzdDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlyZWN0aW9uICogbWluRGlzdDtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVmVjdG9yIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWludXModjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBsdXModjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbm5lclByb2R1Y3QodjE6IFZlY3RvciwgdjI6IFZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB2MS54ICogdjIueCArIHYxLnkgKiB2Mi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1TcXVhcmVkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUoc2NhbGFyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKiBzY2FsYXIsIHRoaXMueSAqIHNjYWxhcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCwgdGhpcy55KS5zY2FsZSgxIC8gdGhpcy5tYWduaXR1ZGUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpcmVjdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgbGV0IHdhdmVzOiBudW1iZXJbXVtdID0gW1xyXG4gICAgWzcsIDcsIDEwXSxcclxuICAgIFs3LCA3LCA3LCAxMCwgMTBdLFxyXG4gICAgWzcsIDgsIDksIDEwLCAxMCwgMTBdLFxyXG4gICAgWzcsIDcsIDcsIDgsIDksIDEwLCAxMCwgMTBdLFxyXG4gICAgWzcsIDcsIDcsIDgsIDksIDEwLCAxMCwgMTVdLFxyXG4gICAgWzcsIDcsIDcsIDcsIDgsIDksIDE1LCAxNSwgMTVdLFxyXG4gICAgWzcsIDcsIDcsIDcsIDgsIDksIDE1LCAxNSwgMjBdLFxyXG4gICAgWzcsIDcsIDcsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE1LCAyMCwgMjAsIDIwLCAyMF0sXHJcbl1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==