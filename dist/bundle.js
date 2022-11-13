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
    constructor(row, column, radius, health, element, moveSpeed, currentTimeMillis) {
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
                transformationLevels[_environment__WEBPACK_IMPORTED_MODULE_2__.EnvironmentKey.DEFAULT].exp += expGain * 0.3;
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
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (currentTimeMillis - enemy.lastMissileSpawnAttemptMillis > 1000) {
            let spawnChance = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.2, 1);
            if (Math.random() <= spawnChance) {
                let moveSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.0003, 0.001);
                let turnSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 0.001, 0.0001);
                let lifeTimeMillis = (0,_util__WEBPACK_IMPORTED_MODULE_6__.mapLinear)(minEnemyRadius, enemy.radius, maxEnemyRadius, 3000, 8000);
                missiles.push(new _missile__WEBPACK_IMPORTED_MODULE_5__.Missile(enemy.row, enemy.column, 3, enemy.element, moveSpeed, turnSpeed, lifeTimeMillis, currentTimeMillis));
            }
            enemy.lastMissileSpawnAttemptMillis = currentTimeMillis;
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
        enemies.push(new _enemy__WEBPACK_IMPORTED_MODULE_1__.Enemy(Math.random() * _environment__WEBPACK_IMPORTED_MODULE_2__.environmentColumns, Math.random() * _environment__WEBPACK_IMPORTED_MODULE_2__.environmentRows, radius, health, (0,_util__WEBPACK_IMPORTED_MODULE_6__.randomInt)(0, 3), speed, currentTimeMillis));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUN4Q00sSUFBSSxLQUFLLEdBQWU7SUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzlCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztDQUNqRTs7Ozs7OztVQ1REO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9jb2xvci50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2VuZW15LnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvZW52aXJvbm1lbnQudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9mbG9hdGluZ190ZXh0LnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9rZXlfc3RhdGUudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9taXNzaWxlLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL3dhdmVzLnRzIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWFwTGluZWFyIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyB0aGlzLnIgKyBcIixcIiArIHRoaXMuZyArIFwiLFwiICsgdGhpcy5iICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0b1JHQihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICsgciArIFwiLFwiICsgZyArIFwiLFwiICsgYiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9SR0JBKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBcInJnYmEoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIsXCIgKyBhICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsZXJwQ29sb3JzKGMxOiBDb2xvciwgYzI6IENvbG9yLCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgbWFwTGluZWFyKDAsIHJhdGlvLCAxLCBjMS5yLCBjMi5yKSxcclxuICAgICAgICAgICAgbWFwTGluZWFyKDAsIHJhdGlvLCAxLCBjMS5nLCBjMi5nKSxcclxuICAgICAgICAgICAgbWFwTGluZWFyKDAsIHJhdGlvLCAxLCBjMS5iLCBjMi5iKSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnRDb2x1bW5zLCBFbnZpcm9ubWVudEtleSwgZW52aXJvbm1lbnRSb3dzIH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHsgZ2V0RGlzdGFuY2UsIGdldEVudmlyb25tZW50Q29sb3IsIGdldFRpbnRlZENvbG9yLCBtYXBMaW5lYXIsIHdyYXBWYWx1ZSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5lbXkge1xyXG4gICAgcHVibGljIHJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcmFkaXVzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbGFzdEhpdFRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBoaXRWZWxvY2l0eUNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFZlbG9jaXR5Um93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbW92ZVZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbW92ZVZlbGljaXR5Um93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eUNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIHRvdGFsVmVsb2NpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBoaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzOiBudW1iZXIgPSA1MDA7XHJcbiAgICBwdWJsaWMgbGFzdFVwZGF0ZVRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtYXhIZWFsdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjdXJyZW50SGVhbHRoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZWxlbWVudDogRW52aXJvbm1lbnRLZXk7XHJcbiAgICBwdWJsaWMgZGVmYXVsdENvbG9yOiBDb2xvcjtcclxuICAgIHB1YmxpYyBtb3ZlU3BlZWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0TWlzc2lsZVNwYXduQXR0ZW1wdE1pbGxpczogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICByb3c6IG51bWJlcixcclxuICAgICAgICBjb2x1bW46IG51bWJlcixcclxuICAgICAgICByYWRpdXM6IG51bWJlcixcclxuICAgICAgICBoZWFsdGg6IG51bWJlcixcclxuICAgICAgICBlbGVtZW50OiBFbnZpcm9ubWVudEtleSxcclxuICAgICAgICBtb3ZlU3BlZWQ6IG51bWJlcixcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5yb3cgPSByb3c7XHJcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XHJcbiAgICAgICAgdGhpcy5oaXRWZWxvY2l0eUNvbHVtbiA9IDA7XHJcbiAgICAgICAgdGhpcy5oaXRWZWxvY2l0eVJvdyA9IDA7XHJcbiAgICAgICAgdGhpcy5tYXhIZWFsdGggPSBoZWFsdGg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SGVhbHRoID0gaGVhbHRoO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0Q29sb3IgPSBnZXRUaW50ZWRDb2xvcih0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uID0gMDtcclxuICAgICAgICB0aGlzLm1vdmVWZWxpY2l0eVJvdyA9IDA7XHJcbiAgICAgICAgdGhpcy5tb3ZlU3BlZWQgPSBtb3ZlU3BlZWQ7XHJcbiAgICAgICAgdGhpcy5sYXN0TWlzc2lsZVNwYXduQXR0ZW1wdE1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoXHJcbiAgICAgICAgd3JhcHBlZENlbnRlckNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJSb3c6IG51bWJlcixcclxuICAgICAgICBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBoaXRWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxuICAgICAgICBpZiAodGhpcy5sYXN0SGl0VGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGhpdFZlbG9jaXR5Q29sdW1uID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyArIHRoaXMuaGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGl0VmVsb2NpdHlDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaGl0VmVsb2NpdHlSb3cgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICsgdGhpcy5oaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRWZWxvY2l0eVJvdyxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRvdGFsVmVsb2NpdHlDb2x1bW4gPSBoaXRWZWxvY2l0eUNvbHVtbiArIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uO1xyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eVJvdyA9IGhpdFZlbG9jaXR5Um93ICsgdGhpcy5tb3ZlVmVsaWNpdHlSb3c7XHJcblxyXG4gICAgICAgIHRoaXMuY29sdW1uICs9IHRoaXMudG90YWxWZWxvY2l0eUNvbHVtbiAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHRoaXMucm93ICs9IHRoaXMudG90YWxWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgICAgICBsZXQgZHggPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyQ29sdW1uLCB0aGlzLmNvbHVtbiwgMCwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgICAgIGxldCBkeSA9IGdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJSb3csIHRoaXMucm93LCAwLCBlbnZpcm9ubWVudFJvd3MgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcblxyXG4gICAgICAgIGxldCBtb3ZlVmVsb2NpdHk6IFZlY3RvciA9IG5ldyBWZWN0b3IoLWR4LCAtZHkpLm5vcm1hbGl6ZSgpLnNjYWxlKHRoaXMubW92ZVNwZWVkKTtcclxuICAgICAgICB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiA9IG1vdmVWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMubW92ZVZlbGljaXR5Um93ID0gbW92ZVZlbG9jaXR5Lnk7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IGNhbnZhcy53aWR0aCAvIDIgKyBkeDtcclxuICAgICAgICB0aGlzLnkgPSBjYW52YXMuaGVpZ2h0IC8gMiArIGR5O1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcoXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgYSAgICAgICAgICAgYlxyXG4gICAgICAgIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuXHJcbiAgICAgICAgZGlzdDEgPSBNYXRoLmFicyhhIC0gYik7XHJcbiAgICAgICAgZGlzdDIgPSAoYSAtIG1pbikgKyAobWF4IC0gYik7XHJcblxyXG4gICAgICAgIGEgLSBiID0gLTYgKG1vZCA5KSA9PiAzXHJcblxyXG5cclxuICAgICAgICAgICAgIGIgICAgICAgYVxyXG4gICAgICAgIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgICAgICBcclxuICAgICAgICBiIC0gYSA9IC00IChtb2QgOSkgPSA1XHJcbiAgICAgICAgbGVuICsgKDIgKyAxKSAtICg2ICsgMSkgPSBsZW4gKyAzIC0gNyA9IGxlbiAtIDQgPSA1XHJcbiAgICAgICAgLy8g4oCLbGVuICsgKG1pbihhLGIpICsgMSkgLSAobWF4KGEsYikgKyAxKVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb2xvclJhdGlvID0gMTtcclxuICAgICAgICBpZiAodGhpcy5sYXN0SGl0VGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbG9yUmF0aW8gPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICsgMTAwMCxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gQ29sb3IubGVycENvbG9ycyhcclxuICAgICAgICAgICAgbmV3IENvbG9yKDI1NSwgMCwgMCksXHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbG9yLFxyXG4gICAgICAgICAgICBjb2xvclJhdGlvLFxyXG4gICAgICAgICkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gdGhpcy5tYXhIZWFsdGggLyAyO1xyXG4gICAgICAgIGxldCBoZWlnaHQ6IG51bWJlciA9IDQ7XHJcbiAgICAgICAgbGV0IHRvcExlZnRYOiBudW1iZXIgPSB0aGlzLnggLSB3aWR0aCAvIDI7XHJcbiAgICAgICAgbGV0IHRvcExlZnRZOiBudW1iZXIgPSB0aGlzLnkgLSB0aGlzLnJhZGl1cyAtIGhlaWdodCAvIDIgLSA4O1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogKHRoaXMuY3VycmVudEhlYWx0aCAvIHRoaXMubWF4SGVhbHRoKSwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcmFuZG9tSW50LCB3cmFwVmFsdWUgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5leHBvcnQgZW51bSBFbnZpcm9ubWVudEtleSB7XHJcbiAgICBERUZBVUxULFxyXG4gICAgRk9SRVNULFxyXG4gICAgREVTRVJULFxyXG4gICAgV0FURVIsXHJcbn1cclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudDogRW52aXJvbm1lbnRLZXlbXVtdID0gW107XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnRSb3dzOiBudW1iZXIgPSAzMDtcclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudENvbHVtbnM6IG51bWJlciA9IDMwO1xyXG5cclxuZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgbGV0IHJvdzogRW52aXJvbm1lbnRLZXlbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC45OTcpIHtcclxuICAgICAgICAgICAgcm93LnB1c2goRW52aXJvbm1lbnRLZXkuREVGQVVMVCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcm93LnB1c2gocmFuZG9tSW50KDEsIDMpIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbnZpcm9ubWVudC5wdXNoKHJvdyk7XHJcbn1cclxuXHJcbmZvciAobGV0IGsgPSAwOyBrIDwgMTA7IGsrKykge1xyXG4gICAgbGV0IGVudmlyb25tZW50Q29weTogRW52aXJvbm1lbnRLZXlbXVtdID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJvdzogRW52aXJvbm1lbnRLZXlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICAgICAgcm93LnB1c2goZW52aXJvbm1lbnRbaV1bal0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbnZpcm9ubWVudENvcHkucHVzaChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChlbnZpcm9ubWVudENvcHlbaV1bal0gIT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQgJiYgTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHJhbmRvbUludCgxLCA0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbd3JhcFZhbHVlKDAsIGkrMSwgZW52aXJvbm1lbnRSb3dzIC0gMSldW2pdID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbaV1bd3JhcFZhbHVlKDAsIGorMSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSldID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbd3JhcFZhbHVlKDAsIGktMSwgZW52aXJvbm1lbnRSb3dzIC0gMSldW2pdID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbaV1bd3JhcFZhbHVlKDAsIGotMSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSldID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGVudmlyb25tZW50Q29sdW1ucywgZW52aXJvbm1lbnRSb3dzIH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHsgZ2V0RGlzdGFuY2UgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmxvYXRpbmdUZXh0IHtcclxuICAgIHB1YmxpYyBjb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyByb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gICAgcHVibGljIHZlbG9jaXR5Um93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbGFzdFVwZGF0ZVRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsaWZldGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGNyZWF0aW9uVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIHNpemU6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcm93OiBudW1iZXIsXHJcbiAgICAgICAgY29sdW1uOiBudW1iZXIsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXHJcbiAgICAgICAgc2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIHZlbG9jaXR5Um93OiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcm93O1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eVJvdyA9IHZlbG9jaXR5Um93O1xyXG4gICAgICAgIHRoaXMubGlmZXRpbWVNaWxsaXMgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuY3JlYXRpb25UaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShcclxuICAgICAgICB3cmFwcGVkQ2VudGVyQ29sdW1uOiBudW1iZXIsXHJcbiAgICAgICAgd3JhcHBlZENlbnRlclJvdzogbnVtYmVyLFxyXG4gICAgICAgIGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlcixcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IGVsYXBzZWRUaW1lTWlsbGlzID0gMDtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsYXBzZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXMgLSB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yb3cgKz0gdGhpcy52ZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgICAgICBsZXQgZHggPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyQ29sdW1uLCB0aGlzLmNvbHVtbiwgMCwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgICAgIGxldCBkeSA9IGdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJSb3csIHRoaXMucm93LCAwLCBlbnZpcm9ubWVudFJvd3MgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IGNhbnZhcy53aWR0aCAvIDIgKyBkeDtcclxuICAgICAgICB0aGlzLnkgPSBjYW52YXMuaGVpZ2h0IC8gMiArIGR5O1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcoXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSB0aGlzLnNpemUgKyBcInB4IEFyaWFsXCI7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMudGV4dCwgdGhpcy54LCB0aGlzLnkpXHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XHJcbmltcG9ydCB7IEVuZW15IH0gZnJvbSBcIi4vZW5lbXlcIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQsIGVudmlyb25tZW50Q29sdW1ucywgRW52aXJvbm1lbnRLZXksIGVudmlyb25tZW50Um93cyB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IEZsb2F0aW5nVGV4dCB9IGZyb20gXCIuL2Zsb2F0aW5nX3RleHRcIjtcclxuaW1wb3J0IHsgS2V5U3RhdGUgfSBmcm9tIFwiLi9rZXlfc3RhdGVcIjtcclxuaW1wb3J0IHsgTWlzc2lsZSB9IGZyb20gXCIuL21pc3NpbGVcIjtcclxuaW1wb3J0IHsgY2xhbXBWYWx1ZSwgY29sbGlkZUNpcmNsZXMsIGNvbHVtblRvWCwgZ2V0Q29sbGlzaW9uVmVsb2NpdHksIGdldEVudmlyb25tZW50Q29sb3IsIGdldFRpbnRlZENvbG9yLCBtYXBMaW5lYXIsIHJhbmRvbUludCwgcm93VG9ZLCB3cmFwVmFsdWUgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyB3YXZlcyB9IGZyb20gXCIuL3dhdmVzXCI7XHJcblxyXG5sZXQgcHJldmlvdXNUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5leHBvcnQgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5jYW52YXMud2lkdGggPSA4MDA7XHJcbmNhbnZhcy5oZWlnaHQgPSA4MDA7XHJcbmNhbnZhcy5pZCA9IFwiZ2FtZUNhbnZhc1wiO1xyXG5sZXQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxubGV0IGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlciA9IDUwO1xyXG5sZXQgY2VudGVyUm93OiBudW1iZXIgPSBlbnZpcm9ubWVudFJvd3MgLyAyIC0gY2FudmFzLndpZHRoIC8gMiAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbmxldCBjZW50ZXJDb2x1bW46IG51bWJlciA9IGVudmlyb25tZW50Q29sdW1ucyAvIDIgLSBjYW52YXMuaGVpZ2h0IC8gMiAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcblxyXG5sZXQgbWluaW11bVNwZWVkOiBudW1iZXIgPSAwLjAwMztcclxubGV0IGN1cnJlbnRTcGVlZDogbnVtYmVyID0gbWluaW11bVNwZWVkO1xyXG5sZXQgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXM6IG51bWJlciA9IDcwMDtcclxubGV0IGxhc3RTcGVlZEJvb3N0U3BlZWQ6IG51bWJlcjtcclxuXHJcbmxldCBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXM6IG51bWJlcjtcclxuXHJcbmxldCBjdXJyZW50Um90YXRpb246IG51bWJlciA9IDA7XHJcbmxldCBtaW5pbXVtUm90YXRpb25TcGVlZDogbnVtYmVyID0gMC4wMDQ7XHJcbmxldCBjdXJyZW50Um90YXRpb25TcGVlZDogbnVtYmVyID0gbWluaW11bVJvdGF0aW9uU3BlZWQ7XHJcbmxldCBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQ6IG51bWJlcjtcclxuXHJcbmxldCBsb2dDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxubGV0IGtleVN0YXRlczogTWFwPHN0cmluZywgS2V5U3RhdGU+ID0gbmV3IE1hcCgpO1xyXG5rZXlTdGF0ZXMuc2V0KFwiV1wiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJBXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIlNcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiRFwiLCBLZXlTdGF0ZS5VUCk7XHJcblxyXG5sZXQgbW91c2VEb3duWTogbnVtYmVyO1xyXG5sZXQgbW91c2VEb3duVGltZTogbnVtYmVyO1xyXG5cclxubGV0IHByZWxvYWRSZWdpc3RyeTogTWFwPHN0cmluZywgYm9vbGVhbj4gPSBuZXcgTWFwKCk7XHJcblxyXG5sZXQgZ3V5U3ByaXRlOiBIVE1MSW1hZ2VFbGVtZW50ID0gbG9hZEltYWdlKFwiLi4vYXNzZXRzL2d1eS5wbmdcIik7XHJcbmxldCBndXlWZWxvY2l0eUNvbHVtbjogbnVtYmVyID0gMDtcclxubGV0IGd1eVZlbG9jaXR5Um93OiBudW1iZXIgPSAwO1xyXG5sZXQgZ3V5SGl0VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbmxldCBndXlIaXRWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxubGV0IGd1eUxhc3RIaXRUaW1lTWlsbGlzOiBudW1iZXI7XHJcbmxldCBndXlIaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzOiBudW1iZXIgPSA4MDA7XHJcbmxldCBtaW5HdXlSYWRpdXM6IG51bWJlciA9IDEwO1xyXG5sZXQgbWF4R3V5UmFkaXVzOiBudW1iZXIgPSA0MDtcclxubGV0IGN1cnJlbnRHdXlSYWRpdXM6IG51bWJlciA9IG1pbkd1eVJhZGl1cztcclxubGV0IGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzOiBudW1iZXI7XHJcbmxldCBndXlNYXhIZWFsdGg6IG51bWJlciA9IDEwMDtcclxubGV0IGd1eUN1cnJlbnRIZWFsdGg6IG51bWJlciA9IGd1eU1heEhlYWx0aDtcclxubGV0IGd1eUxhc3REYW1hZ2VkVGltZU1pbGxpczogbnVtYmVyO1xyXG5cclxubGV0IGVudmlyb25tZW50U3ByaXRlczogSFRNTEltYWdlRWxlbWVudFtdID0gW1xyXG4gICAgbG9hZEltYWdlKFwiLi4vYXNzZXRzL2RlZmF1bHQucG5nXCIpLFxyXG4gICAgbG9hZEltYWdlKFwiLi4vYXNzZXRzL2ZvcmVzdC5wbmdcIiksXHJcbiAgICBsb2FkSW1hZ2UoXCIuLi9hc3NldHMvZGVzZXJ0LnBuZ1wiKSxcclxuICAgIGxvYWRJbWFnZShcIi4uL2Fzc2V0cy93YXRlci5wbmdcIiksXHJcbl07XHJcblxyXG5sZXQgZW52aXJvbm1lbnRUaW1lcnM6IHtjdXJyZW50VGltZTogbnVtYmVyLCBtYXhUaW1lOiBudW1iZXJ9W10gPSBbXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDcwMDB9LFxyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiAzNTAwfSxcclxuICAgIHtjdXJyZW50VGltZTogMCwgbWF4VGltZTogMzUwMH0sXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDM1MDB9LFxyXG5dO1xyXG5sZXQgY3VycmVudFRyYW5zZm9ybWF0aW9uOiBudW1iZXIgPSAwO1xyXG5sZXQgdHJhbnNmb3JtYXRpb25MZXZlbHM6IHtleHA6IG51bWJlciwgdG9OZXh0TGV2ZWw6IG51bWJlciwgbGV2ZWw6IG51bWJlcn1bXSA9IFtcclxuICAgIHtleHA6IDAsIHRvTmV4dExldmVsOiAyMDAsIGxldmVsOiAxfSxcclxuICAgIHtleHA6IDAsIHRvTmV4dExldmVsOiAxMDAsIGxldmVsOiAxfSxcclxuICAgIHtleHA6IDAsIHRvTmV4dExldmVsOiAxMDAsIGxldmVsOiAxfSxcclxuICAgIHtleHA6IDAsIHRvTmV4dExldmVsOiAxMDAsIGxldmVsOiAxfSxcclxuXTtcclxuXHJcbmxldCBtaW5FbmVteVJhZGl1czogbnVtYmVyID0gNztcclxubGV0IG1heEVuZW15UmFkaXVzOiBudW1iZXIgPSAyMDtcclxubGV0IGVuZW1pZXM6IEVuZW15W10gPSBbXTtcclxuXHJcbmxldCBtaXNzaWxlczogTWlzc2lsZVtdID0gW107XHJcblxyXG5sZXQgY3VycmVudFdhdmU6IG51bWJlciA9IC0xO1xyXG5sZXQgcHJldmlvdXNXYXZlRW5kVGltZU1pbGxpczogbnVtYmVyID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbmxldCB3YXZlUmVzdFRpbWVNaWxsaXM6IG51bWJlciA9IDgwMDA7XHJcbmxldCBpc0luUmVzdFRpbWU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxubGV0IGZsb2F0aW5nVGV4dHM6IEZsb2F0aW5nVGV4dFtdID0gW107XHJcblxyXG5sZXQgbnVtVHV0b3JpYWxzVG9TaG93OiBudW1iZXIgPSAzO1xyXG5sZXQgbnVtVHV0b3JpYWxzU2hvd246IG51bWJlciA9IDA7XHJcblxyXG5sZXQgaXNHYW1lT3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5sZXQgZ2FtZU92ZXJUaW1lTWlsbGlzOiBudW1iZXI7XHJcbmxldCBpc0dhbWVXb246IGJvb2xlYW47XHJcblxyXG5cclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG5cclxuZG9jdW1lbnQub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgIGlmIChlLnJlcGVhdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBrZXkgPSBlLmtleS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgaWYgKGtleVN0YXRlcy5oYXMoa2V5KSkge1xyXG4gICAgICAgIGtleVN0YXRlcy5zZXQoa2V5LCBLZXlTdGF0ZS5ET1dOKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25rZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuVVApO1xyXG4gICAgfVxyXG59O1xyXG5kb2N1bWVudC5vbm1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBtb3VzZURvd25ZID0gZS5jbGllbnRZO1xyXG4gICAgbW91c2VEb3duVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG59XHJcbmRvY3VtZW50Lm9ubW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgbW91c2VVcFkgPSBlLmNsaWVudFk7XHJcbiAgICBsZXQgbW91c2VVcFRpbWU6IG51bWJlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgbGV0IHNwZWVkQm9vc3QgPSBjbGFtcFZhbHVlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgKG1vdXNlVXBZIC0gbW91c2VEb3duWSkgLyAobW91c2VVcFRpbWUgLSBtb3VzZURvd25UaW1lKSxcclxuICAgICAgICAxMCxcclxuICAgICk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXMgPSBtb3VzZVVwVGltZTtcclxuICAgIGxhc3RTcGVlZEJvb3N0U3BlZWQgPSBNYXRoLm1heChtaW5pbXVtU3BlZWQsIHNwZWVkQm9vc3QgKiAwLjAwMyk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQgPSBNYXRoLm1heChtaW5pbXVtUm90YXRpb25TcGVlZCwgc3BlZWRCb29zdCAqIDAuMDA1KTtcclxuICAgIGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzID0gbWFwTGluZWFyKDAsIHNwZWVkQm9vc3QsIDEwLCBtaW5HdXlSYWRpdXMsIG1heEd1eVJhZGl1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXcoY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcikge1xyXG4gICAgaWYgKHByZXZpb3VzVGltZU1pbGxpcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgZWxhcHNlZFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcyAtIHByZXZpb3VzVGltZU1pbGxpcztcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICBsZXQgbW92ZVg6IG51bWJlciA9IChrZXlTdGF0ZXMuZ2V0KFwiQVwiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IC0xIDogMClcclxuICAgICAgICArIChrZXlTdGF0ZXMuZ2V0KFwiRFwiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IDEgOiAwKTtcclxuICAgIGxldCBtb3ZlWTogbnVtYmVyID0gKGtleVN0YXRlcy5nZXQoXCJXXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gLTEgOiAwKVxyXG4gICAgICAgICsgKGtleVN0YXRlcy5nZXQoXCJTXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gMSA6IDApO1xyXG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydChtb3ZlWCAqIG1vdmVYICsgbW92ZVkgKiBtb3ZlWSk7XHJcbiAgICBpZiAobWFnbml0dWRlID4gMCkge1xyXG4gICAgICAgIG1vdmVYID0gbW92ZVggLyBtYWduaXR1ZGUgKiBjdXJyZW50U3BlZWQ7XHJcbiAgICAgICAgbW92ZVkgPSBtb3ZlWSAvIG1hZ25pdHVkZSAqIGN1cnJlbnRTcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaGl0WDogbnVtYmVyID0gMDtcclxuICAgIGxldCBoaXRZOiBudW1iZXIgPSAwO1xyXG4gICAgaWYgKGd1eUxhc3RIaXRUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBoaXRYID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzICsgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlDb2x1bW4sXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBoaXRZID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzICsgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlSb3csXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ3V5VmVsb2NpdHlDb2x1bW4gPSBtb3ZlWCArIGhpdFg7XHJcbiAgICBndXlWZWxvY2l0eVJvdyA9IG1vdmVZICsgaGl0WTtcclxuXHJcbiAgICBjZW50ZXJDb2x1bW4gKz0gZ3V5VmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgIGNlbnRlclJvdyArPSBndXlWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgIGN1cnJlbnRSb3RhdGlvbiArPSBlbGFwc2VkVGltZU1pbGxpcyAqIGN1cnJlbnRSb3RhdGlvblNwZWVkO1xyXG5cclxuICAgIGlmIChsYXN0U3BlZWRCb29zdFNwZWVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RTcGVlZCxcclxuICAgICAgICAgICAgbWluaW11bVNwZWVkLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkLFxyXG4gICAgICAgICAgICBtaW5pbXVtUm90YXRpb25TcGVlZCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJlbnRHdXlSYWRpdXMgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RHdXlSYWRpdXMsXHJcbiAgICAgICAgICAgIG1pbkd1eVJhZGl1cyxcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtaW5pbXVtU3BlZWQ7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtaW5pbXVtUm90YXRpb25TcGVlZDtcclxuICAgICAgICBjdXJyZW50R3V5UmFkaXVzID0gbWluR3V5UmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0b3BMZWZ0Q29sdW1uOiBudW1iZXIgPSBjZW50ZXJDb2x1bW4gLSAoY2FudmFzLndpZHRoIC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IHRvcExlZnRSb3c6IG51bWJlciA9IGNlbnRlclJvdyAtIChjYW52YXMuaGVpZ2h0IC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IGd1eUNlbnRlclggPSBjb2x1bW5Ub1goY2VudGVyQ29sdW1uLCB0b3BMZWZ0Q29sdW1uLCBlbnZpcm9ubWVudFRpbGVTaXplKTtcclxuICAgIGxldCBndXlDZW50ZXJZID0gcm93VG9ZKGNlbnRlclJvdywgdG9wTGVmdFJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICBcclxuICAgIGxldCBlbnZpcm9ubWVudERyYXdDb3VudCA9IGRyYXdFbnZpcm9ubWVudCh0b3BMZWZ0Q29sdW1uLCB0b3BMZWZ0Um93KTtcclxuXHJcbiAgICAvLyB1cGRhdGUgYWxsIGVuZW15IHgncyBhbmQgeSdzIGFuZCBtb3ZlIHZlbG9jaXRpZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0udXBkYXRlKGNlbnRlckNvbHVtbiwgY2VudGVyUm93LCBlbnZpcm9ubWVudFRpbGVTaXplLCBjdXJyZW50VGltZU1pbGxpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGFsbCBtaXNzaWxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG1pc3NpbGVzW2ldLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBhbGwgdGhlIGZsb2F0aW5nIHRleHRzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZsb2F0aW5nVGV4dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmbG9hdGluZ1RleHRzW2ldLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvIGVuZW15LWd1eSBjb2xsaXNpb24gYW5kIGdhbWUgc2ltdWxhdGlvbiBzdHVmZlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGVuZW15OiBFbmVteSA9IGVuZW1pZXNbaV07XHJcbiAgICAgICAgaWYgKGNvbGxpZGVDaXJjbGVzKFxyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgY3VycmVudEd1eVJhZGl1cyxcclxuICAgICAgICAgICAgZW5lbXkueCxcclxuICAgICAgICAgICAgZW5lbXkueSxcclxuICAgICAgICAgICAgZW5lbXkucmFkaXVzKVxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICBlbmVteS5sYXN0SGl0VGltZU1pbGxpcyA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICB8fCAoY3VycmVudFRpbWVNaWxsaXMgLSBlbmVteS5sYXN0SGl0VGltZU1pbGxpcykgPiBlbmVteS5oaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgJiYgIWlzR2FtZU92ZXJcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbGV0IGVuZW15TWFzczogbnVtYmVyID0gZW5lbXkucmFkaXVzO1xyXG4gICAgICAgICAgICBsZXQgZ3V5TWFzczogbnVtYmVyID0gY3VycmVudEd1eVJhZGl1cztcclxuICAgICAgICAgICAgbGV0IGd1eUNlbnRlcjogVmVjdG9yID0gbmV3IFZlY3RvcihndXlDZW50ZXJYLCBndXlDZW50ZXJZKTtcclxuICAgICAgICAgICAgbGV0IGVuZW15Q2VudGVyOiBWZWN0b3IgPSBuZXcgVmVjdG9yKGVuZW15LngsIGVuZW15LnkpO1xyXG4gICAgICAgICAgICBsZXQgZ3V5VmVsb2NpdHk6IFZlY3RvciA9IG5ldyBWZWN0b3IoZ3V5VmVsb2NpdHlDb2x1bW4sIGd1eVZlbG9jaXR5Um93KVxyXG4gICAgICAgICAgICAgICAgLnBsdXMoZW5lbXlDZW50ZXIubWludXMoZ3V5Q2VudGVyKS5ub3JtYWxpemUoKS5zY2FsZSgwLjAxKSk7XHJcbiAgICAgICAgICAgIGxldCBlbmVteVZlbG9jaXR5OiBWZWN0b3IgPSBuZXcgVmVjdG9yKGVuZW15LmhpdFZlbG9jaXR5Q29sdW1uLCBlbmVteS5oaXRWZWxvY2l0eVJvdyk7XHJcbiAgICAgICAgICAgIGxldCBndXlIaXRWZWxvY2l0eTogVmVjdG9yID0gZ2V0Q29sbGlzaW9uVmVsb2NpdHkoXHJcbiAgICAgICAgICAgICAgICBndXlDZW50ZXIsXHJcbiAgICAgICAgICAgICAgICBlbmVteUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGd1eU1hc3MsXHJcbiAgICAgICAgICAgICAgICBlbmVteU1hc3MsXHJcbiAgICAgICAgICAgICAgICBndXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgICAgIGVuZW15VmVsb2NpdHksXHJcbiAgICAgICAgICAgICkuc2NhbGUoMC4yKTtcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlDb2x1bW4gPSBndXlIaXRWZWxvY2l0eS54O1xyXG4gICAgICAgICAgICBndXlIaXRWZWxvY2l0eVJvdyA9IGd1eUhpdFZlbG9jaXR5Lnk7XHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgZW5lbXlIaXRWZWxvY2l0eTogVmVjdG9yID0gZ2V0Q29sbGlzaW9uVmVsb2NpdHkoXHJcbiAgICAgICAgICAgICAgICBlbmVteUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGd1eUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGVuZW15TWFzcyxcclxuICAgICAgICAgICAgICAgIGd1eU1hc3MsXHJcbiAgICAgICAgICAgICAgICBlbmVteVZlbG9jaXR5LFxyXG4gICAgICAgICAgICAgICAgZ3V5VmVsb2NpdHksXHJcbiAgICAgICAgICAgICkuc2NhbGUoMC4zKTtcclxuICAgICAgICAgICAgZW5lbXkubGFzdEhpdFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgZW5lbXkuaGl0VmVsb2NpdHlDb2x1bW4gPSBlbmVteUhpdFZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgIGVuZW15LmhpdFZlbG9jaXR5Um93ID0gZW5lbXlIaXRWZWxvY2l0eS55O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gZGV0ZXJtaW5lIGRhbWFnZSBkZWx0IHRvIGVuZW15XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VNdWx0aXBsaWVyOiBudW1iZXIgPSBnZXREYW1hZ2VNdWx0aXBsaWVyKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSwgZW5lbXkuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VEZWFsdDogbnVtYmVyID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgbWluR3V5UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEd1eVJhZGl1cyxcclxuICAgICAgICAgICAgICAgIG1heEd1eVJhZGl1cyxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAoMTAgKyB0cmFuc2Zvcm1hdGlvbkxldmVsc1tjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgbnVtYmVyXS5sZXZlbCAtIDEpICogZGFtYWdlTXVsdGlwbGllcixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZW5lbXkuY3VycmVudEhlYWx0aCAtPSBkYW1hZ2VEZWFsdDtcclxuXHJcbiAgICAgICAgICAgIC8vIGF3YXJkIHhwIGlmIGVuZW15IHdhcyBraWxsZWRcclxuICAgICAgICAgICAgaWYgKGVuZW15LmN1cnJlbnRIZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4cEdhaW46IG51bWJlciA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgICAgICBtaW5FbmVteVJhZGl1cyxcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5yYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4RW5lbXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgNDAwLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VHJhbnNmb3JtYXRpb24gIT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbkxldmVsc1tjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgbnVtYmVyXS5leHAgKz0gZXhwR2FpbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uTGV2ZWxzW0Vudmlyb25tZW50S2V5LkRFRkFVTFQgYXMgbnVtYmVyXS5leHAgKz0gZXhwR2FpbiAqIDAuMztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc3Bhd24gZmxvYXRpbmcgdGV4dFxyXG4gICAgICAgICAgICBmbG9hdGluZ1RleHRzLnB1c2gobmV3IEZsb2F0aW5nVGV4dChcclxuICAgICAgICAgICAgICAgIGVuZW15LnJvdyxcclxuICAgICAgICAgICAgICAgIGVuZW15LmNvbHVtbixcclxuICAgICAgICAgICAgICAgIFwiLVwiICsgKE1hdGgucm91bmQoZGFtYWdlRGVhbHQgKiAxMCkgLyAxMCkudG9GaXhlZCgxKVxyXG4gICAgICAgICAgICAgICAgICAgICsgKGRhbWFnZU11bHRpcGxpZXIgPT09IDMgPyBcIiBDUklUSUNBTFwiIDogXCJcIiksXHJcbiAgICAgICAgICAgICAgICBcImJsYWNrXCIsXHJcbiAgICAgICAgICAgICAgICAyMCxcclxuICAgICAgICAgICAgICAgIC0wLjAwMSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG8gbWlzc2lsZS1ndXkgY29sbGlzaW9uXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pc3NpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG1pc3NpbGU6IE1pc3NpbGUgPSBtaXNzaWxlc1tpXTtcclxuICAgICAgICBpZiAoY29sbGlkZUNpcmNsZXMoXHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICBtaW5HdXlSYWRpdXMsIC8vIERlbGliZXJhdGVseSB1c2UgbWluIGd1eSByYWRpdXMgaGVyZVxyXG4gICAgICAgICAgICBtaXNzaWxlLngsXHJcbiAgICAgICAgICAgIG1pc3NpbGUueSxcclxuICAgICAgICAgICAgbWlzc2lsZS5yYWRpdXMpXHJcbiAgICAgICAgICAgICYmICFpc0dhbWVPdmVyXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VNdWx0aXBsaWVyOiBudW1iZXIgPSBnZXREYW1hZ2VNdWx0aXBsaWVyKG1pc3NpbGUuZWxlbWVudCwgY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICAgICAgbGV0IGRhbWFnZURlYWx0OiBudW1iZXIgPSBkYW1hZ2VNdWx0aXBsaWVyICogMTBcclxuICAgICAgICAgICAgZ3V5Q3VycmVudEhlYWx0aCAtPSBkYW1hZ2VEZWFsdDtcclxuICAgICAgICAgICAgZ3V5TGFzdERhbWFnZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgICAgIG1pc3NpbGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgaS0tO1xyXG5cclxuICAgICAgICAgICAgLy8gc3Bhd24gZmxvYXRpbmcgdGV4dFxyXG4gICAgICAgICAgICBmbG9hdGluZ1RleHRzLnB1c2gobmV3IEZsb2F0aW5nVGV4dChcclxuICAgICAgICAgICAgICAgIGNlbnRlclJvdyxcclxuICAgICAgICAgICAgICAgIGNlbnRlckNvbHVtbixcclxuICAgICAgICAgICAgICAgIFwiLVwiICsgKE1hdGgucm91bmQoZGFtYWdlRGVhbHQgKiAxMCkgLyAxMCkudG9GaXhlZCgxKVxyXG4gICAgICAgICAgICAgICAgICAgICsgKGRhbWFnZU11bHRpcGxpZXIgPT09IDMgPyBcIiBDUklUSUNBTFwiIDogXCJcIiksXHJcbiAgICAgICAgICAgICAgICBcInJlZFwiLFxyXG4gICAgICAgICAgICAgICAgMjAsXHJcbiAgICAgICAgICAgICAgICAtMC4wMDEsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSBkZWFkIGVuZW1pZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlbmVtaWVzW2ldLmN1cnJlbnRIZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICBlbmVtaWVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlY3QgdGhlIGVuZCBvZiBhIHdhdmVcclxuICAgIGlmIChlbmVtaWVzLmxlbmd0aCA9PT0gMCAmJiAhaXNJblJlc3RUaW1lKSB7XHJcbiAgICAgICAgcHJldmlvdXNXYXZlRW5kVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIGlzSW5SZXN0VGltZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIG9sZCBtaXNzaWxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBtaXNzaWxlOiBNaXNzaWxlID0gbWlzc2lsZXNbaV07XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUaW1lTWlsbGlzIC0gbWlzc2lsZS5jcmVhdGlvblRpbWVNaWxsaXMgPiBtaXNzaWxlLmxpZmV0aW1lTWlsbGlzKSB7XHJcbiAgICAgICAgICAgIG1pc3NpbGVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZW1vdmUgb2xkIGZsb2F0aW5nIHRleHRzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZsb2F0aW5nVGV4dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZmxvYXRpbmdUZXh0OiBGbG9hdGluZ1RleHQgPSBmbG9hdGluZ1RleHRzW2ldO1xyXG4gICAgICAgIGlmIChjdXJyZW50VGltZU1pbGxpcyAtIGZsb2F0aW5nVGV4dC5jcmVhdGlvblRpbWVNaWxsaXMgPiBmbG9hdGluZ1RleHQubGlmZXRpbWVNaWxsaXMpIHtcclxuICAgICAgICAgICAgZmxvYXRpbmdUZXh0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBhbGwgZW5lbWllc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZW5lbWllc1tpXS5kcmF3KGN1cnJlbnRUaW1lTWlsbGlzLCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgYWxsIG1pc3NpbGVzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pc3NpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbWlzc2lsZXNbaV0uZHJhdyhjdXJyZW50VGltZU1pbGxpcywgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGFsbCBmbG9hdGluZyB0ZXh0c1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbG9hdGluZ1RleHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZmxvYXRpbmdUZXh0c1tpXS5kcmF3KGN1cnJlbnRUaW1lTWlsbGlzLCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGVuZW1pZXMgY2FuIG1heWJlIHNwYXduIG1pc3NpbGVzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZW5lbXkgPSBlbmVtaWVzW2ldO1xyXG4gICAgICAgIGlmIChjdXJyZW50VGltZU1pbGxpcyAtIGVuZW15Lmxhc3RNaXNzaWxlU3Bhd25BdHRlbXB0TWlsbGlzID4gMTAwMCkge1xyXG4gICAgICAgICAgICBsZXQgc3Bhd25DaGFuY2UgPSBtYXBMaW5lYXIobWluRW5lbXlSYWRpdXMsIGVuZW15LnJhZGl1cywgbWF4RW5lbXlSYWRpdXMsIDAuMiwgMSk7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDw9IHNwYXduQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVNwZWVkID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCBlbmVteS5yYWRpdXMsIG1heEVuZW15UmFkaXVzLCAwLjAwMDMsIDAuMDAxKTtcclxuICAgICAgICAgICAgICAgIGxldCB0dXJuU3BlZWQgPSBtYXBMaW5lYXIobWluRW5lbXlSYWRpdXMsIGVuZW15LnJhZGl1cywgbWF4RW5lbXlSYWRpdXMsIDAuMDAxLCAwLjAwMDEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpZmVUaW1lTWlsbGlzID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCBlbmVteS5yYWRpdXMsIG1heEVuZW15UmFkaXVzLCAzMDAwLCA4MDAwKTtcclxuICAgICAgICAgICAgICAgIG1pc3NpbGVzLnB1c2gobmV3IE1pc3NpbGUoZW5lbXkucm93LCBlbmVteS5jb2x1bW4sIDMsIGVuZW15LmVsZW1lbnQsIG1vdmVTcGVlZCwgdHVyblNwZWVkLCBsaWZlVGltZU1pbGxpcywgY3VycmVudFRpbWVNaWxsaXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbmVteS5sYXN0TWlzc2lsZVNwYXduQXR0ZW1wdE1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZW52aXJvbm1lbnQgdGltZXJzXHJcbiAgICBsZXQgY3VycmVudEVudmlyb25tZW50OiBFbnZpcm9ubWVudEtleSA9IGdldEN1cnJlbnRFbnZpcm9ubWVudChjZW50ZXJDb2x1bW4sIGNlbnRlclJvdyk7XHJcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSAoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFRpbWVyID0gZW52aXJvbm1lbnRUaW1lcnNbY3VycmVudEVudmlyb25tZW50XTtcclxuICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lICs9IGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID4gY3VycmVudFRpbWVyLm1heFRpbWUpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA9IGN1cnJlbnRUaW1lci5tYXhUaW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFRpbWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoKGkgYXMgRW52aXJvbm1lbnRLZXkpICE9PSBjdXJyZW50RW52aXJvbm1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGltZXIgPSBlbnZpcm9ubWVudFRpbWVyc1tpXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSAtPSBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGltZXIuY3VycmVudFRpbWUgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB0cmlnZ2VyIHRyYW5zZm9ybWF0aW9uXHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSAoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KVxyXG4gICAgICAgICYmIGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF0uY3VycmVudFRpbWUgPT09IGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF0ubWF4VGltZVxyXG4gICAgICAgICYmICFpc0dhbWVPdmVyXHJcbiAgICApIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50VGltZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVudmlyb25tZW50VGltZXJzW2ldLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFRyYW5zZm9ybWF0aW9uID0gY3VycmVudEVudmlyb25tZW50IGFzIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgdHJhbnNmb3JtYXRpb24gbGV2ZWxzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybWF0aW9uTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybWF0aW9uID0gdHJhbnNmb3JtYXRpb25MZXZlbHNbaV07XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybWF0aW9uLmV4cCA+PSB0cmFuc2Zvcm1hdGlvbi50b05leHRMZXZlbCkge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbi5leHAgLT0gdHJhbnNmb3JtYXRpb24udG9OZXh0TGV2ZWw7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uLmxldmVsKys7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uLnRvTmV4dExldmVsICo9IDEuMTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpIGFzIEVudmlyb25tZW50S2V5ID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUKSB7XHJcbiAgICAgICAgICAgICAgICBndXlNYXhIZWFsdGggKz0gMjA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGd1eUN1cnJlbnRIZWFsdGggPD0gMCAmJiAhaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgIGlzR2FtZVdvbiA9IGZhbHNlO1xyXG4gICAgICAgIGdhbWVPdmVyVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBkcmF3IGVudmlyb25tZW50IGRyYXcgY291bnRcclxuICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChlbnZpcm9ubWVudERyYXdDb3VudC50b1N0cmluZygpLCBjYW52YXMud2lkdGggLyAyIC0gMTAsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgZ3V5XHJcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoZ3V5Q2VudGVyWCwgZ3V5Q2VudGVyWSk7XHJcbiAgICAgICAgY3R4LnJvdGF0ZShjdXJyZW50Um90YXRpb24pO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLWd1eUNlbnRlclgsIC1ndXlDZW50ZXJZKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGd1eVNwcml0ZSwgZ3V5Q2VudGVyWCAtIGd1eVNwcml0ZS53aWR0aCAvIDIsIGd1eUNlbnRlclkgLSBndXlTcHJpdGUuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb2xvciB0aGUgZ3V5J3MgaGVhZFxyXG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBsZXQgZ3V5Q29sb3JSYXRpbzogbnVtYmVyID0gMTtcclxuICAgICAgICBsZXQgZ3V5RGVmYXVsdENvbG9yOiBDb2xvciA9IGdldFRpbnRlZENvbG9yKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSk7XHJcbiAgICAgICAgaWYgKGd1eUxhc3REYW1hZ2VkVGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGd1eUNvbG9yUmF0aW8gPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICBndXlMYXN0RGFtYWdlZFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGd1eUxhc3REYW1hZ2VkVGltZU1pbGxpcyArIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGd1eUNvbG9yOiBDb2xvciA9IENvbG9yLmxlcnBDb2xvcnMoXHJcbiAgICAgICAgICAgIG5ldyBDb2xvcigyNTUsIDAsIDApLFxyXG4gICAgICAgICAgICBndXlEZWZhdWx0Q29sb3IsXHJcbiAgICAgICAgICAgIGd1eUNvbG9yUmF0aW8sXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3V5Q29sb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyhndXlDZW50ZXJYLCBndXlDZW50ZXJZLCA2LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGd1eSBzd2lybHkgdGhpbmdcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGxldCBndXlEZWZhdWx0Q29sb3I6IENvbG9yID0gZ2V0VGludGVkQ29sb3IoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGd1eURlZmF1bHRDb2xvci50b1N0cmluZygpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICBndXlDZW50ZXJYLFxyXG4gICAgICAgICAgICBndXlDZW50ZXJZLFxyXG4gICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAvIDYwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAvIDYwICsgbWFwTGluZWFyKG1pbkd1eVJhZGl1cywgY3VycmVudEd1eVJhZGl1cywgbWF4R3V5UmFkaXVzLCAxLCAyKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgdGhlIGd1eSdzIGhlYWx0aCBiYXJcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGxldCBndXlIZWFsdGhXaWR0aDogbnVtYmVyID0gZ3V5TWF4SGVhbHRoIC8gMjtcclxuICAgICAgICBsZXQgZ3V5SGVhbHRoSGVpZ2h0OiBudW1iZXIgPSA2O1xyXG4gICAgICAgIGxldCBndXlIZWFsdGhUb3BMZWZ0WDogbnVtYmVyID0gZ3V5Q2VudGVyWCAtIGd1eUhlYWx0aFdpZHRoIC8gMjtcclxuICAgICAgICBsZXQgZ3V5SGVhbHRoVG9wTGVmdFk6IG51bWJlciA9IGd1eUNlbnRlclkgLSBtYXhHdXlSYWRpdXMgLSBndXlIZWFsdGhIZWlnaHQgLyAyIC0gODtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoZ3V5SGVhbHRoVG9wTGVmdFgsIGd1eUhlYWx0aFRvcExlZnRZLCBndXlIZWFsdGhXaWR0aCAqIChndXlDdXJyZW50SGVhbHRoIC8gZ3V5TWF4SGVhbHRoKSwgZ3V5SGVhbHRoSGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdChndXlIZWFsdGhUb3BMZWZ0WCwgZ3V5SGVhbHRoVG9wTGVmdFksIGd1eUhlYWx0aFdpZHRoLCBndXlIZWFsdGhIZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0cmFuc2Zvcm0tdG8gYmFyXHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSBjdXJyZW50VHJhbnNmb3JtYXRpb24gJiYgIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBsZXQgdGlsZUNlbnRlclg6IG51bWJlciA9IGd1eUNlbnRlclggKyA1MDtcclxuICAgICAgICBsZXQgdGlsZUNlbnRlclk6IG51bWJlciA9IGd1eUNlbnRlclkgLSA3MDtcclxuICAgICAgICBsZXQgdGlsZVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgZHJhd0Vudmlyb25tZW50VGlsZSh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCBjdXJyZW50RW52aXJvbm1lbnQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyLCB0aWxlQ2VudGVyWSAtIHRpbGVTaXplIC8gMiwgdGlsZVNpemUsIHRpbGVTaXplKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBsZXQgd2lkdGg6IG51bWJlciA9IDEwMDtcclxuICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSAxMDtcclxuICAgICAgICBsZXQgdG9wTGVmdFg6IG51bWJlciA9IHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyIC0gd2lkdGggLSAxMDtcclxuICAgICAgICBsZXQgdG9wTGVmdFk6IG51bWJlciA9IHRpbGVDZW50ZXJZIC0gaGVpZ2h0IC8gMjtcclxuICAgICAgICBsZXQgY3VycmVudEVudmlyb25tZW50VGltZXI6IHtjdXJyZW50VGltZTogbnVtYmVyLCBtYXhUaW1lOiBudW1iZXJ9ID0gZW52aXJvbm1lbnRUaW1lcnNbY3VycmVudEVudmlyb25tZW50XTtcclxuICAgICAgICBsZXQgZmlsbFJhdGlvOiBudW1iZXIgPSAoY3VycmVudEVudmlyb25tZW50VGltZXIuY3VycmVudFRpbWUgLyBjdXJyZW50RW52aXJvbm1lbnRUaW1lci5tYXhUaW1lKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogZmlsbFJhdGlvLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IHRoZSBVSSBiYWNrZ3JvdW5kXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMC41O1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIDQwKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgd2F2ZSBudW1iZXJcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KFwiV2F2ZSBcIiArIChjdXJyZW50V2F2ZSArIDEpLCAzLCAwKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgY3VycmVudCBudW1iZXIgb2YgZW5lbWllcyBhbGl2ZVxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgIGN0eC5mb250ID0gXCIyMHB4IEFyaWFsXCI7XHJcbiAgICBjdHguZmlsbFRleHQoZW5lbWllcy5sZW5ndGggKyBcIiBFbmVtaWVzIExlZnRcIiwgMTAwLCAwKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgd2F2ZSByZXN0IHRpbWVyIGFuZC9vciB0cmlnZ2VyIHRoZSBuZXh0IHdhdmVcclxuICAgIGlmIChlbmVtaWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGxldCByZXN0VGltZVJlbWFpbmluZ01pbGxpcyA9IHdhdmVSZXN0VGltZU1pbGxpcyAtIChjdXJyZW50VGltZU1pbGxpcyAtIHByZXZpb3VzV2F2ZUVuZFRpbWVNaWxsaXMpO1xyXG4gICAgICAgIGd1eUN1cnJlbnRIZWFsdGggPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgZ3V5TWF4SGVhbHRoLFxyXG4gICAgICAgICAgICBndXlDdXJyZW50SGVhbHRoICsgZWxhcHNlZFRpbWVNaWxsaXMgLyB3YXZlUmVzdFRpbWVNaWxsaXMgKiBndXlNYXhIZWFsdGgsXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGlmIChyZXN0VGltZVJlbWFpbmluZ01pbGxpcyA8PSAwICYmICFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRXYXZlKys7XHJcbiAgICAgICAgICAgIGlzSW5SZXN0VGltZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFdhdmUgPj0gd2F2ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlzR2FtZVdvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBnYW1lT3ZlclRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNwYXduRW5lbWllcyhjdXJyZW50V2F2ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBcIjIwcHggQXJpYWxcIjtcclxuICAgICAgICAgICAgbGV0IHRlbnRoczogbnVtYmVyID0gTWF0aC5yb3VuZChyZXN0VGltZVJlbWFpbmluZ01pbGxpcyAvIDEwMCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChcclxuICAgICAgICAgICAgICAgICh0ZW50aHMgLyAxMCkudG9GaXhlZCgxKSArIFwicyBVbnRpbCBOZXh0IFdhdmVcIixcclxuICAgICAgICAgICAgICAgIDMsXHJcbiAgICAgICAgICAgICAgICAyMCxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IHRyYW5mb3JtYXRpb24gZXhwIGJhcnMgYW5kIGxldmVsc1xyXG4gICAgZHJhd1RyYW5zZm9ybWF0aW9uRXhwQmFyKGNhbnZhcy53aWR0aCAtIDIwMCwgMywgMCk7XHJcbiAgICBkcmF3VHJhbnNmb3JtYXRpb25FeHBCYXIoY2FudmFzLndpZHRoIC0gMjAwLCAyMywgMSk7XHJcbiAgICBkcmF3VHJhbnNmb3JtYXRpb25FeHBCYXIoY2FudmFzLndpZHRoLCAzLCAyKTtcclxuICAgIGRyYXdUcmFuc2Zvcm1hdGlvbkV4cEJhcihjYW52YXMud2lkdGgsIDIzLCAzKTtcclxuXHJcbiAgICAvLyBkcmF3IGdhbWUgb3ZlciB0ZXh0XHJcbiAgICBpZiAoaXNHYW1lT3ZlciAmJiAhaXNHYW1lV29uKSB7XHJcbiAgICAgICAgbGV0IHRpbWVTaW5jZUdhbWVPdmVyTWlsbGlzOiBudW1iZXIgPSBjdXJyZW50VGltZU1pbGxpcyAtIGdhbWVPdmVyVGltZU1pbGxpcztcclxuICAgICAgICBsZXQgdGV4dE9wYWNpdHkgPSBtYXBMaW5lYXIoMCwgdGltZVNpbmNlR2FtZU92ZXJNaWxsaXMsIDIwMDAsIDAsIDEpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGV4dE9wYWNpdHk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjQwcHggQXJpYWxcIlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsIGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfSBlbHNlIGlmKGlzR2FtZU92ZXIgJiYgaXNHYW1lV29uKSB7XHJcbiAgICAgICAgbGV0IHRpbWVTaW5jZUdhbWVPdmVyTWlsbGlzOiBudW1iZXIgPSBjdXJyZW50VGltZU1pbGxpcyAtIGdhbWVPdmVyVGltZU1pbGxpcztcclxuICAgICAgICBsZXQgdGV4dE9wYWNpdHkgPSBtYXBMaW5lYXIoMCwgdGltZVNpbmNlR2FtZU92ZXJNaWxsaXMsIDIwMDAsIDAsIDEpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGV4dE9wYWNpdHk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjQwcHggQXJpYWxcIlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiWW91IFdpbiFcIiwgY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgZHJhZyB0dXRvcmlhbCB0ZXh0XHJcbiAgICBpZiAobnVtVHV0b3JpYWxzU2hvd24gPCBudW1UdXRvcmlhbHNUb1Nob3dcclxuICAgICAgICAmJiBjdXJyZW50VGltZU1pbGxpcyA+IDIwMDAgKyAyMDAwICogbnVtVHV0b3JpYWxzU2hvd24pIHtcclxuICAgICAgICBmbG9hdGluZ1RleHRzLnB1c2gobmV3IEZsb2F0aW5nVGV4dChcclxuICAgICAgICAgICAgY2VudGVyUm93IC0gMyxcclxuICAgICAgICAgICAgY2VudGVyQ29sdW1uIC0gNSxcclxuICAgICAgICAgICAgXCJ2diBDbGljaywgRHJhZywgUmVsZWFzZSEgdnZcIixcclxuICAgICAgICAgICAgXCJibGFja1wiLFxyXG4gICAgICAgICAgICA0MCxcclxuICAgICAgICAgICAgMC4wMDYsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIG51bVR1dG9yaWFsc1Nob3duKys7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBmcHNcclxuICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgIGxldCBmcHM6IG51bWJlciA9IDEwMDAgLyBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChNYXRoLnJvdW5kKGZwcykudG9TdHJpbmcoKSArIFwiRlBTXCIsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2VTb3VyY2U6IHN0cmluZyk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgaWYgKHByZWxvYWRSZWdpc3RyeS5oYXMoaW1hZ2VTb3VyY2UpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGF0dGVtcHRlZCB0byBsb2FkIHRoZSBzYW1lIGltYWdlIHR3aWNlIGR1cmluZyBwcmVsb2FkaW5nLlwiKTtcclxuICAgIH1cclxuICAgIHByZWxvYWRSZWdpc3RyeS5zZXQoaW1hZ2VTb3VyY2UsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBUaGUgb3JkZXIgdGhlc2UgMyB0aGluZ3MgYXJlIGRvbmUgaW4gaXMgVkVSWSBpbXBvcnRhbnQhXHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICBwcmVsb2FkUmVnaXN0cnkuc2V0KGltYWdlU291cmNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGltYWdlLnNyYyA9IGltYWdlU291cmNlO1xyXG5cclxuICAgIHJldHVybiBpbWFnZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlbG9hZCgpIHtcclxuICAgIGZvciAobGV0IFtrZXksIGxvYWRlZF0gb2YgcHJlbG9hZFJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgaWYgKCFsb2FkZWQpIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGF3bkVuZW1pZXMoY3VycmVudFdhdmU6IG51bWJlcikge1xyXG4gICAgbGV0IGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGxldCB3YXZlOiBudW1iZXJbXSA9IHdhdmVzW2N1cnJlbnRXYXZlXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2F2ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCByYWRpdXM6IG51bWJlciA9IHdhdmVbaV07XHJcbiAgICAgICAgbGV0IGhlYWx0aDogbnVtYmVyID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCByYWRpdXMsIG1heEVuZW15UmFkaXVzLCA1MCwgMjAwKTtcclxuICAgICAgICBsZXQgc3BlZWQ6IG51bWJlciA9IG1hcExpbmVhcihtaW5FbmVteVJhZGl1cywgcmFkaXVzLCBtYXhFbmVteVJhZGl1cywgMC4wMDEsIDAuMDAwNSk7XHJcbiAgICAgICAgZW5lbWllcy5wdXNoKG5ldyBFbmVteShcclxuICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIGVudmlyb25tZW50Q29sdW1ucyxcclxuICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIGVudmlyb25tZW50Um93cyxcclxuICAgICAgICAgICAgcmFkaXVzLFxyXG4gICAgICAgICAgICBoZWFsdGgsXHJcbiAgICAgICAgICAgIHJhbmRvbUludCgwLCAzKSBhcyBFbnZpcm9ubWVudEtleSxcclxuICAgICAgICAgICAgc3BlZWQsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RW52aXJvbm1lbnQodG9wTGVmdENvbHVtbjogbnVtYmVyLCB0b3BMZWZ0Um93OiBudW1iZXIpIHtcclxuICAgIGxldCBib3R0b21SaWdodENvbHVtbjogbnVtYmVyID0gdG9wTGVmdENvbHVtbiArIGNhbnZhcy53aWR0aCAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICBsZXQgYm90dG9tUmlnaHRSb3c6IG51bWJlciA9IHRvcExlZnRSb3cgKyBjYW52YXMuaGVpZ2h0IC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBtaW5Db2x1bW46IG51bWJlciA9IE1hdGguZmxvb3IodG9wTGVmdENvbHVtbik7XHJcbiAgICBsZXQgbWF4Q29sdW1uOiBudW1iZXIgPSBNYXRoLmNlaWwoYm90dG9tUmlnaHRDb2x1bW4pO1xyXG4gICAgbGV0IG1pblJvdzogbnVtYmVyID0gTWF0aC5mbG9vcih0b3BMZWZ0Um93KTtcclxuICAgIGxldCBtYXhSb3c6IG51bWJlciA9IE1hdGguY2VpbChib3R0b21SaWdodFJvdyk7XHJcbiAgICBsZXQgZW52aXJvbm1lbnREcmF3Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgZm9yIChsZXQgaSA9IG1pblJvdzsgaSA8PSBtYXhSb3c7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSBtaW5Db2x1bW47IGogPD0gbWF4Q29sdW1uOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IHdyYXBwZWRSb3c6IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBpLCBlbnZpcm9ubWVudFJvd3MgLSAxKTtcclxuICAgICAgICAgICAgbGV0IHdyYXBwZWRDb2x1bW46IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBqLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgbGV0IGtleTogRW52aXJvbm1lbnRLZXkgPSBlbnZpcm9ubWVudFt3cmFwcGVkUm93XVt3cmFwcGVkQ29sdW1uXTtcclxuICAgICAgICAgICAgbGV0IHggPSBjb2x1bW5Ub1goaiwgdG9wTGVmdENvbHVtbiwgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIGxldCB5ID0gcm93VG9ZKGksIHRvcExlZnRSb3csIGVudmlyb25tZW50VGlsZVNpemUpO1xyXG4gICAgICAgICAgICBkcmF3RW52aXJvbm1lbnRUaWxlKE1hdGguZmxvb3IoeCksIE1hdGguZmxvb3IoeSksIGVudmlyb25tZW50VGlsZVNpemUsIGtleSk7XHJcblxyXG4gICAgICAgICAgICAvLyBtYXJrIGVhY2ggdGlsZSB3aXRoIGl0cyByb3cgYW5kIGNvbHVtblxyXG4gICAgICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAvLyBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICAgICAgLy8gY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgICAgIC8vIGN0eC5maWxsVGV4dChcIihcIiArIHdyYXBwZWRSb3cgKyBcIixcIiArIHdyYXBwZWRDb2x1bW4gKyBcIilcIiwgeCwgeSk7XHJcbiAgICAgICAgICAgIC8vIGVudmlyb25tZW50RHJhd0NvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIHJldHVybiBlbnZpcm9ubWVudERyYXdDb3VudDtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0Vudmlyb25tZW50VGlsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6ZTogbnVtYmVyLCBrZXk6IEVudmlyb25tZW50S2V5KSB7XHJcbiAgICBsZXQgZW52aXJvbm1lbnRTcHJpdGU6IEhUTUxJbWFnZUVsZW1lbnQgPSBlbnZpcm9ubWVudFNwcml0ZXNba2V5IGFzIG51bWJlcl07XHJcbiAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgIGVudmlyb25tZW50U3ByaXRlLFxyXG4gICAgICAgIHgsXHJcbiAgICAgICAgeSxcclxuICAgICAgICBzaXplLFxyXG4gICAgICAgIHNpemUsXHJcbiAgICApO1xyXG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9IGdldEVudmlyb25tZW50Q29sb3Ioa2V5KS50b1N0cmluZygpO1xyXG4gICAgLy8gY3R4LmZpbGxSZWN0KHgsIHksIHNpemUsIHNpemUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDdXJyZW50RW52aXJvbm1lbnQoY2VudGVyQ29sdW1uOiBudW1iZXIsIGNlbnRlclJvdzogbnVtYmVyKTogRW52aXJvbm1lbnRLZXkge1xyXG4gICAgbGV0IHdyYXBwZWRSb3c6IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBNYXRoLmZsb29yKGNlbnRlclJvdyksIGVudmlyb25tZW50Um93cyAtIDEpO1xyXG4gICAgbGV0IHdyYXBwZWRDb2x1bW46IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBNYXRoLmZsb29yKGNlbnRlckNvbHVtbiksIGVudmlyb25tZW50Q29sdW1ucyAtIDEpO1xyXG4gICAgcmV0dXJuIGVudmlyb25tZW50W3dyYXBwZWRSb3ddW3dyYXBwZWRDb2x1bW5dO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYW1hZ2VNdWx0aXBsaWVyKGF0dGFja2VyOiBFbnZpcm9ubWVudEtleSwgZGVmZW5kZXI6IEVudmlyb25tZW50S2V5KTogbnVtYmVyIHtcclxuICAgIGlmIChhdHRhY2tlciA9PT0gRW52aXJvbm1lbnRLZXkuREVGQVVMVCB8fCBkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuREVGQVVMVCkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LkZPUkVTVCkge1xyXG4gICAgICAgIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuV0FURVIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuREVTRVJUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhdHRhY2tlciA9PT0gRW52aXJvbm1lbnRLZXkuREVTRVJUKSB7XHJcbiAgICAgICAgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5GT1JFU1QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuV0FURVIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhdHRhY2tlciA9PT0gRW52aXJvbm1lbnRLZXkuV0FURVIpIHtcclxuICAgICAgICBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5GT1JFU1QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDAuNTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5XQVRFUikge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdUcmFuc2Zvcm1hdGlvbkV4cEJhcihcclxuICAgIHg6IG51bWJlcixcclxuICAgIHk6IG51bWJlcixcclxuICAgIGVudmlyb25tZW50OiBFbnZpcm9ubWVudEtleSxcclxuKSB7XHJcbiAgICBsZXQgdGlsZVNpemU6IG51bWJlciA9IDE1O1xyXG4gICAgbGV0IHRpbGVDZW50ZXJYOiBudW1iZXIgPSB4IC0gdGlsZVNpemUgLyAyIC0gMTA7XHJcbiAgICBsZXQgdGlsZUNlbnRlclk6IG51bWJlciA9IHkgKyB0aWxlU2l6ZSAvIDI7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgZHJhd0Vudmlyb25tZW50VGlsZSh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCBlbnZpcm9ubWVudCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIjtcclxuICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgY3R4LnN0cm9rZVJlY3QodGlsZUNlbnRlclggLSB0aWxlU2l6ZSAvIDIsIHRpbGVDZW50ZXJZIC0gdGlsZVNpemUgLyAyLCB0aWxlU2l6ZSwgdGlsZVNpemUpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBsZXQgd2lkdGg6IG51bWJlciA9IDEwMDtcclxuICAgIGxldCBoZWlnaHQ6IG51bWJlciA9IDEwO1xyXG4gICAgbGV0IHRvcExlZnRYOiBudW1iZXIgPSB0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiAtIHdpZHRoIC0gMTA7XHJcbiAgICBsZXQgdG9wTGVmdFk6IG51bWJlciA9IHRpbGVDZW50ZXJZIC0gaGVpZ2h0IC8gMjtcclxuICAgIGxldCB0cmFuc2Zvcm1hdGlvbjoge2V4cDogbnVtYmVyLCB0b05leHRMZXZlbDogbnVtYmVyLCBsZXZlbDogbnVtYmVyfSA9IHRyYW5zZm9ybWF0aW9uTGV2ZWxzW2Vudmlyb25tZW50IGFzIG51bWJlcl07XHJcbiAgICBsZXQgZmlsbFJhdGlvOiBudW1iZXIgPSAodHJhbnNmb3JtYXRpb24uZXhwIC8gdHJhbnNmb3JtYXRpb24udG9OZXh0TGV2ZWwpO1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JheVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGggKiBmaWxsUmF0aW8sIGhlaWdodCk7XHJcbiAgICBjdHguc3Ryb2tlUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgIGN0eC5mb250ID0gXCIxNHB4IEFyaWFsXCI7XHJcbiAgICBjdHguZmlsbFRleHQoXCJMdi4gXCIgKyB0cmFuc2Zvcm1hdGlvbi5sZXZlbCwgdGlsZUNlbnRlclggLSB3aWR0aCAtIHRpbGVTaXplIC0gMTUsIHRpbGVDZW50ZXJZICsgMSk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59XHJcblxyXG53aW5kb3cuc2V0VGltZW91dChwcmVsb2FkLCAwKTtcclxuXHJcbiIsImV4cG9ydCBlbnVtIEtleVN0YXRlIHtcclxuICAgIFVQLFxyXG4gICAgRE9XTixcclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XHJcbmltcG9ydCB7IGVudmlyb25tZW50Q29sdW1ucywgRW52aXJvbm1lbnRLZXksIGVudmlyb25tZW50Um93cyB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IGNhbnZhcyB9IGZyb20gXCIuL2luZGV4XCI7XHJcbmltcG9ydCB7IGdldERpc3RhbmNlLCBnZXRUaW50ZWRDb2xvciB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWlzc2lsZSB7XHJcbiAgICBwdWJsaWMgcm93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyByYWRpdXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsaWNpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGxhc3RVcGRhdGVUaW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZWxlbWVudDogRW52aXJvbm1lbnRLZXk7XHJcbiAgICBwdWJsaWMgZGVmYXVsdENvbG9yOiBDb2xvcjtcclxuICAgIHB1YmxpYyBtb3ZlU3BlZWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsaWZldGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGNyZWF0aW9uVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIHR1cm5pbmdTcGVlZDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsb2dDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICByb3c6IG51bWJlcixcclxuICAgICAgICBjb2x1bW46IG51bWJlcixcclxuICAgICAgICByYWRpdXM6IG51bWJlcixcclxuICAgICAgICBlbGVtZW50OiBFbnZpcm9ubWVudEtleSxcclxuICAgICAgICBtb3ZlU3BlZWQ6IG51bWJlcixcclxuICAgICAgICB0dXJuaW5nU3BlZWQ6IG51bWJlcixcclxuICAgICAgICBsaWZlVGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnJvdyA9IHJvdztcclxuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMubW92ZVNwZWVkID0gbW92ZVNwZWVkO1xyXG4gICAgICAgIHRoaXMudHVybmluZ1NwZWVkID0gdHVybmluZ1NwZWVkO1xyXG4gICAgICAgIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uID0gMDtcclxuICAgICAgICB0aGlzLm1vdmVWZWxpY2l0eVJvdyA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0Q29sb3IgPSBnZXRUaW50ZWRDb2xvcih0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMubGlmZXRpbWVNaWxsaXMgPSBsaWZlVGltZU1pbGxpcztcclxuICAgICAgICB0aGlzLmNyZWF0aW9uVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoXHJcbiAgICAgICAgd3JhcHBlZENlbnRlckNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJSb3c6IG51bWJlcixcclxuICAgICAgICBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eUNvbHVtbiA9IHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uO1xyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eVJvdyA9IHRoaXMubW92ZVZlbGljaXR5Um93O1xyXG5cclxuICAgICAgICB0aGlzLmNvbHVtbiArPSB0aGlzLnRvdGFsVmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICB0aGlzLnJvdyArPSB0aGlzLnRvdGFsVmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICAgICAgbGV0IGR4ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlckNvbHVtbiwgdGhpcy5jb2x1bW4sIDAsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgICAgICBsZXQgZHkgPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyUm93LCB0aGlzLnJvdywgMCwgZW52aXJvbm1lbnRSb3dzIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxuICAgICAgICBsZXQgaWRlYWxNb3ZlRGlyZWN0aW9uOiBWZWN0b3IgPSBuZXcgVmVjdG9yKC1keCwgLWR5KS5ub3JtYWxpemUoKTtcclxuICAgICAgICBsZXQgbW92ZURpcmVjdGlvbjogVmVjdG9yO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbW92ZURpcmVjdGlvbiA9IGlkZWFsTW92ZURpcmVjdGlvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaWRlYWxBbmdsZTogbnVtYmVyID0gaWRlYWxNb3ZlRGlyZWN0aW9uLmRpcmVjdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudEFuZ2xlOiBudW1iZXIgPSBNYXRoLmF0YW4yKHRoaXMubW92ZVZlbGljaXR5Um93LCB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbik7XHJcbiAgICAgICAgICAgIGxldCBkQW5nbGU6IG51bWJlciA9IC1nZXREaXN0YW5jZShpZGVhbEFuZ2xlLCBjdXJyZW50QW5nbGUsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgbGV0IGFuZ2xlU2lnbiA9IGRBbmdsZSAvIE1hdGguc3FydChkQW5nbGUgKiBkQW5nbGUpO1xyXG4gICAgICAgICAgICBpZiAoZEFuZ2xlID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhbmdsZVNpZ24gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBtYXhUdXJuU3BlZWQ6IG51bWJlciA9IE1hdGgubWluKE1hdGguYWJzKGRBbmdsZSksIHRoaXMudHVybmluZ1NwZWVkICogZWxhcHNlZFRpbWVNaWxsaXMpO1xyXG4gICAgICAgICAgICBsZXQgbmV3QW5nbGUgPSBjdXJyZW50QW5nbGUgKyBtYXhUdXJuU3BlZWQgKiBhbmdsZVNpZ247XHJcbiAgICAgICAgICAgIG1vdmVEaXJlY3Rpb24gPSBuZXcgVmVjdG9yKE1hdGguY29zKG5ld0FuZ2xlKSwgTWF0aC5zaW4obmV3QW5nbGUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtb3ZlVmVsb2NpdHk6IFZlY3RvcjtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG1vdmVWZWxvY2l0eSA9IG1vdmVEaXJlY3Rpb24uc2NhbGUodGhpcy5tb3ZlU3BlZWQgKiBlbGFwc2VkVGltZU1pbGxpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbW92ZVZlbG9jaXR5ID0gbW92ZURpcmVjdGlvbi5zY2FsZSgwLjAwMDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiA9IG1vdmVWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMubW92ZVZlbGljaXR5Um93ID0gbW92ZVZlbG9jaXR5Lnk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnggPSBjYW52YXMud2lkdGggLyAyICsgZHg7XHJcbiAgICAgICAgdGhpcy55ID0gY2FudmFzLmhlaWdodCAvIDIgKyBkeTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICAgICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgbW92ZURpcmVjdGlvbjogVmVjdG9yID0gbmV3IFZlY3Rvcih0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiwgdGhpcy5tb3ZlVmVsaWNpdHlSb3cpXHJcbiAgICAgICAgICAgIC5ub3JtYWxpemUoKVxyXG4gICAgICAgICAgICAuc2NhbGUoOSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDg7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgIHRoaXMueCAtIG1vdmVEaXJlY3Rpb24ueCxcclxuICAgICAgICAgICAgdGhpcy55IC0gbW92ZURpcmVjdGlvbi55LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhcclxuICAgICAgICAgICAgdGhpcy54ICsgbW92ZURpcmVjdGlvbi54LFxyXG4gICAgICAgICAgICB0aGlzLnkgKyBtb3ZlRGlyZWN0aW9uLnksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIG1vdmVEaXJlY3Rpb24gPSBtb3ZlRGlyZWN0aW9uLnNjYWxlKDAuOSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmRlZmF1bHRDb2xvci50b1N0cmluZygpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA0O1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgICAgICB0aGlzLnggLSBtb3ZlRGlyZWN0aW9uLngsXHJcbiAgICAgICAgICAgIHRoaXMueSAtIG1vdmVEaXJlY3Rpb24ueSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgICAgIHRoaXMueCArIG1vdmVEaXJlY3Rpb24ueCxcclxuICAgICAgICAgICAgdGhpcy55ICsgbW92ZURpcmVjdGlvbi55LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRLZXkgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbi8vIG5vdGU6IGFzc3VtZXMgZnJvbVN0YXJ0IGlzIGxlc3MgdGhhbiBmcm9tRW5kLCB0b1N0YXJ0IGlzIGxlc3MgdGhhbiB0b0VuZFxyXG5leHBvcnQgZnVuY3Rpb24gbWFwTGluZWFyKFxyXG4gICAgZnJvbVN0YXJ0OiBudW1iZXIsXHJcbiAgICBmcm9tVmFsdWU6IG51bWJlcixcclxuICAgIGZyb21FbmQ6IG51bWJlcixcclxuICAgIHRvU3RhcnQ6IG51bWJlcixcclxuICAgIHRvRW5kOiBudW1iZXJcclxuKSB7XHJcbiAgICBmcm9tVmFsdWUgPSBjbGFtcFZhbHVlKE1hdGgubWluKGZyb21TdGFydCwgZnJvbUVuZCksIGZyb21WYWx1ZSwgTWF0aC5tYXgoZnJvbVN0YXJ0LCBmcm9tRW5kKSk7XHJcbiAgICBsZXQgcmF0aW86IG51bWJlciA9IChmcm9tVmFsdWUgLSBmcm9tU3RhcnQpIC8gKGZyb21FbmQgLSBmcm9tU3RhcnQpO1xyXG4gICAgcmV0dXJuIHRvU3RhcnQgKyByYXRpbyAqICh0b0VuZCAtIHRvU3RhcnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXBWYWx1ZShtaW46IG51bWJlciwgdmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIGlmICh2YWx1ZSA8IG1pbikge1xyXG4gICAgICAgIHJldHVybiBtaW47XHJcbiAgICB9XHJcbiAgICBpZiAodmFsdWUgPiBtYXgpIHtcclxuICAgICAgICByZXR1cm4gbWF4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG4vLyBmdW5jdGlvbiB0YWtlbiBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hdGgvcmFuZG9tXHJcbi8vIFRoZSBtYXhpbXVtIGlzIGluY2x1c2l2ZSBhbmQgdGhlIG1pbmltdW0gaXMgaW5jbHVzaXZlXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JhcFZhbHVlKG1pbjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgaWYgKHZhbHVlIDwgbWluIHx8IHZhbHVlID4gbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1vZCh2YWx1ZSAtIG1pbiwgbWF4ICsgMSAtIG1pbikgKyBtaW47XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbi8vIHRoaXMgbW9kdWxvIGhhbmRsZXMgbmVnYXRpdmVzIGhvdyBpdCdzIHN1cHBvc2VkIHRvXHJcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ0Njc1MzkvamF2YXNjcmlwdC1tb2R1bG8tZ2l2ZXMtYS1uZWdhdGl2ZS1yZXN1bHQtZm9yLW5lZ2F0aXZlLW51bWJlcnNcclxuZnVuY3Rpb24gbW9kKG46IG51bWJlciwgbTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKChuICUgbSkgKyBtKSAlIG07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb2x1bW5Ub1goY29sdW1uOiBudW1iZXIsIHRvcExlZnRDb2x1bW46IG51bWJlciwgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKGNvbHVtbiAtIHRvcExlZnRDb2x1bW4pICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvd1RvWShyb3c6IG51bWJlciwgdG9wTGVmdFJvdzogbnVtYmVyLCBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAocm93IC0gdG9wTGVmdFJvdykgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sbGlkZUNpcmNsZXMoeDE6IG51bWJlciwgeTE6IG51bWJlciwgcjE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgcjI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKHgxIC0geDIpIDwgcjEgKyByMlxyXG4gICAgICAgICYmIE1hdGguYWJzKHkxIC0geTIpIDwgcjEgKyByMjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbGxpc2lvblZlbG9jaXR5KGMxOiBWZWN0b3IsIGMyOiBWZWN0b3IsIG0xOiBudW1iZXIsIG0yOiBudW1iZXIsIHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgbGV0IGMxTWludXNjMjogVmVjdG9yID0gYzEubWludXMoYzIpO1xyXG4gICAgcmV0dXJuIGMxTWludXNjMlxyXG4gICAgICAgIC5zY2FsZShcclxuICAgICAgICAgICAgLTIgKiBtMiAvIChtMSArIG0yKVxyXG4gICAgICAgICAgICAqIFZlY3Rvci5pbm5lclByb2R1Y3QodjEubWludXModjIpLCBjMU1pbnVzYzIpXHJcbiAgICAgICAgICAgIC8gYzFNaW51c2MyLm5vcm1TcXVhcmVkKClcclxuICAgICAgICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW52aXJvbm1lbnRDb2xvcihrZXk6IEVudmlyb25tZW50S2V5KTogQ29sb3Ige1xyXG4gICAgc3dpdGNoKGtleSkge1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuREVGQVVMVDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigxMDAsIDI1NSwgMTAwKTtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkZPUkVTVDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAyMDAsIDApO1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuREVTRVJUOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKDI1NSwgMjU1LCA1MCk7XHJcbiAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5XQVRFUjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAyNTUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGludGVkQ29sb3Ioa2V5OiBFbnZpcm9ubWVudEtleSk6IENvbG9yIHtcclxuICAgIGxldCBjb2xvcjogQ29sb3IgPSBrZXkgPT09IEVudmlyb25tZW50S2V5LkRFRkFVTFRcclxuICAgICAgICA/IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KVxyXG4gICAgICAgIDogZ2V0RW52aXJvbm1lbnRDb2xvcihrZXkpO1xyXG4gICAgcmV0dXJuIENvbG9yLmxlcnBDb2xvcnMoXHJcbiAgICAgICAgY29sb3IsXHJcbiAgICAgICAgbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpLFxyXG4gICAgICAgIDAuMTUsXHJcbiAgICApO1xyXG59XHJcblxyXG4vLyBhIGlzIGFzc3VtZWQgdG8gYmUgdGhlIG9yaWdpblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzdGFuY2UoYTogbnVtYmVyLCBiOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgbGV0IGRpc3QxID0gd3JhcFZhbHVlKG1pbiwgYiAtIGEsIG1heCk7XHJcbiAgICBsZXQgZGlzdDIgPSB3cmFwVmFsdWUobWluLCBhIC0gYiwgbWF4KTtcclxuICAgIGxldCBtaW5EaXN0OiBudW1iZXI7XHJcbiAgICBsZXQgZGlyZWN0aW9uID0gMDtcclxuICAgIC8vICAgICAgICBhICAgYlxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgaWYgKGIgPj0gYSAmJiBkaXN0MSA8PSBkaXN0Mikge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgbWluRGlzdCA9IGRpc3QxO1xyXG4gICAgLy8gICAgYSAgICAgICAgICAgYlxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgfSBlbHNlIGlmIChiID49IGEgJiYgZGlzdDEgPiBkaXN0Mikge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgIG1pbkRpc3QgPSBkaXN0MjtcclxuICAgIC8vICAgICAgICBiICAgYVxyXG4gICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgfSBlbHNlIGlmIChiIDwgYSAmJiBkaXN0MiA8PSBkaXN0MSkge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgIG1pbkRpc3QgPSBkaXN0MjtcclxuICAgIC8vICAgIGIgICAgICAgICAgIGFcclxuICAgIC8vIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgIH0gZWxzZSBpZiAoYiA8IGEgJiYgZGlzdDIgPiBkaXN0MSkge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgbWluRGlzdCA9IGRpc3QxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpcmVjdGlvbiAqIG1pbkRpc3Q7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFZlY3RvciB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1pbnVzKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbHVzKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5uZXJQcm9kdWN0KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gdjEueCAqIHYyLnggKyB2MS55ICogdjIueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWFnbml0dWRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtU3F1YXJlZCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlKHNjYWxhcjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54ICogc2NhbGFyLCB0aGlzLnkgKiBzY2FsYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTogVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngsIHRoaXMueSkuc2NhbGUoMSAvIHRoaXMubWFnbml0dWRlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXJlY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGxldCB3YXZlczogbnVtYmVyW11bXSA9IFtcclxuICAgIFs3LCA3LCAxMF0sXHJcbiAgICBbNywgNywgNywgMTAsIDEwXSxcclxuICAgIFs3LCA4LCA5LCAxMCwgMTAsIDEwXSxcclxuICAgIFs3LCA3LCA3LCA4LCA5LCAxMCwgMTAsIDEwXSxcclxuICAgIFs3LCA3LCA3LCA4LCA5LCAxMCwgMTAsIDE1XSxcclxuICAgIFs3LCA3LCA3LCA3LCA4LCA5LCAxNSwgMTUsIDE1XSxcclxuICAgIFs3LCA3LCA3LCA3LCA4LCA5LCAxNSwgMTUsIDIwXSxcclxuICAgIFs3LCA3LCA3LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNSwgMjAsIDIwLCAyMCwgMjBdLFxyXG5dXHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=