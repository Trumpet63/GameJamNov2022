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
    constructor(row, column, text, color, size, currentTimeMillis) {
        this.row = row;
        this.column = column;
        this.text = text;
        this.color = color;
        this.size = size;
        this.lifetimeMillis = 1000;
        this.creationTimeMillis = currentTimeMillis;
        this.velocityRow = -0.001;
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
let isGameOver = false;
let gameOverTimeMillis;
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
                + (damageMultiplier === 3 ? " CRITICAL" : ""), "black", 20, currentTimeMillis));
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
                + (damageMultiplier === 3 ? " CRITICAL" : ""), "red", 20, currentTimeMillis));
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
    if (guyCurrentHealth <= 0) {
        isGameOver = true;
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
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
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
            spawnEnemies(currentWave);
            isInRestTime = false;
        }
        else {
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
    if (isGameOver) {
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
        console.log(textOpacity);
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
    ctx.fillStyle = (0,_util__WEBPACK_IMPORTED_MODULE_6__.getEnvironmentColor)(key).toString();
    ctx.fillRect(x, y, size, size);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBbUM7QUFFNUIsTUFBTSxLQUFLO0lBS2QsWUFBbUIsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQzlDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDL0QsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQy9DLE9BQU8sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2hELENBQUM7SUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDM0QsT0FBTyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUMzRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFTLEVBQUUsRUFBUyxFQUFFLEtBQWE7UUFDeEQsT0FBTyxJQUFJLEtBQUssQ0FDWixnREFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNsQyxnREFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNsQyxnREFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNyQyxDQUFDO0lBQ04sQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hDK0I7QUFDb0Q7QUFDbkQ7QUFDK0Q7QUFDOUQ7QUFFM0IsTUFBTSxLQUFLO0lBc0JkLFlBQ0ksR0FBVyxFQUNYLE1BQWMsRUFDZCxNQUFjLEVBQ2QsTUFBYyxFQUNkLE9BQXVCLEVBQ3ZCLFNBQWlCLEVBQ2pCLGlCQUF5QjtRQWhCdEIsOEJBQXlCLEdBQVcsR0FBRyxDQUFDO1FBa0IzQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxxREFBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxpQkFBaUIsQ0FBQztJQUMzRCxDQUFDO0lBRU0sTUFBTSxDQUNULG1CQUEyQixFQUMzQixnQkFBd0IsRUFDeEIsbUJBQTJCLEVBQzNCLGlCQUF5QjtRQUV6QixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDekMsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1NBQ3JFO1FBRUQsSUFBSSxpQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFDbEMsSUFBSSxjQUFjLEdBQVcsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLFNBQVMsRUFBRTtZQUN0QyxpQkFBaUIsR0FBRyxnREFBUyxDQUN6QixJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLGlCQUFpQixFQUNqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUN2RCxJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLENBQUMsQ0FDSixDQUFDO1lBRUYsY0FBYyxHQUFHLGdEQUFTLENBQ3RCLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsaUJBQWlCLEVBQ2pCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLEVBQ3ZELElBQUksQ0FBQyxjQUFjLEVBQ25CLENBQUMsQ0FDSixDQUFDO1NBQ0w7UUFFRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUU5RCxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztRQUV0RCxJQUFJLEVBQUUsR0FBRyxrREFBVyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLDREQUFrQixHQUFHLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBQ3hHLElBQUksRUFBRSxHQUFHLGtEQUFXLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUseURBQWUsR0FBRyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztRQUUvRixJQUFJLFlBQVksR0FBVyxJQUFJLDJDQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsQ0FBQyxHQUFHLGdEQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsQ0FBQyxHQUFHLGlEQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVoQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsaUJBQWlCLENBQUM7SUFDbEQsQ0FBQztJQUVNLElBQUksQ0FDUCxpQkFBeUIsRUFDekIsR0FBNkI7UUFFN0I7Ozs7Ozs7Ozs7Ozs7Ozs7VUFnQkU7UUFFRixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUUxQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFO1lBQ3RDLFVBQVUsR0FBRyxnREFBUyxDQUNsQixJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLGlCQUFpQixFQUNqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxFQUM3QixDQUFDLEVBQ0QsQ0FBQyxDQUNKLENBQUM7U0FDTDtRQUNELEdBQUcsQ0FBQyxTQUFTLEdBQUcsb0RBQWdCLENBQzVCLElBQUkseUNBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNwQixJQUFJLENBQUMsWUFBWSxFQUNqQixVQUFVLENBQ2IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUViLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZCxJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFDdkIsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMxQixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEYsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEIsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbks2QztBQUU5QyxJQUFZLGNBS1g7QUFMRCxXQUFZLGNBQWM7SUFDdEIseURBQU87SUFDUCx1REFBTTtJQUNOLHVEQUFNO0lBQ04scURBQUs7QUFDVCxDQUFDLEVBTFcsY0FBYyxLQUFkLGNBQWMsUUFLekI7QUFDTSxJQUFJLFdBQVcsR0FBdUIsRUFBRSxDQUFDO0FBQ3pDLElBQUksZUFBZSxHQUFXLEVBQUUsQ0FBQztBQUNqQyxJQUFJLGtCQUFrQixHQUFXLEVBQUUsQ0FBQztBQUUzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3RDLElBQUksR0FBRyxHQUFxQixFQUFFLENBQUM7SUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssRUFBRTtZQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxnREFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQW1CLENBQUMsQ0FBQztTQUMvQztLQUNKO0lBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN6QjtBQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDekIsSUFBSSxlQUFlLEdBQXVCLEVBQUUsQ0FBQztJQUM3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLElBQUksR0FBRyxHQUFxQixFQUFFLENBQUM7UUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7UUFDRCxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzdCO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssY0FBYyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO2dCQUN6RSxRQUFPLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO29CQUNwQixLQUFLLENBQUM7d0JBQ0YsV0FBVyxDQUFDLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzRSxNQUFNO29CQUNWLEtBQUssQ0FBQzt3QkFDRixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUUsTUFBTTtvQkFDVixLQUFLLENBQUM7d0JBQ0YsV0FBVyxDQUFDLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzRSxNQUFNO29CQUNWLEtBQUssQ0FBQzt3QkFDRixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUUsTUFBTTtpQkFDYjthQUNKO1NBQ0o7S0FDSjtDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RG1FO0FBQ25DO0FBQ0k7QUFFOUIsTUFBTSxZQUFZO0lBYXJCLFlBQ0ksR0FBVyxFQUNYLE1BQWMsRUFDZCxJQUFZLEVBQ1osS0FBYSxFQUNiLElBQVksRUFDWixpQkFBeUI7UUFFekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7UUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRU0sTUFBTSxDQUNULG1CQUEyQixFQUMzQixnQkFBd0IsRUFDeEIsbUJBQTJCLEVBQzNCLGlCQUF5QjtRQUV6QixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDekMsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1NBQ3JFO1FBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDO1FBRWpELElBQUksRUFBRSxHQUFHLGtEQUFXLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsNERBQWtCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUM7UUFDeEcsSUFBSSxFQUFFLEdBQUcsa0RBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSx5REFBZSxHQUFHLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBRS9GLElBQUksQ0FBQyxDQUFDLEdBQUcsZ0RBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsaURBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQztJQUNsRCxDQUFDO0lBRU0sSUFBSSxDQUNQLGlCQUF5QixFQUN6QixHQUE2QjtRQUU3QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMzQixHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25FK0I7QUFDQTtBQUNpRTtBQUNsRDtBQUNSO0FBQ0g7QUFDK0g7QUFDakk7QUFDRjtBQUVoQyxJQUFJLGtCQUEwQixDQUFDO0FBRXhCLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ25CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3BCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsWUFBWSxDQUFDO0FBQ3pCLElBQUksR0FBRyxHQUE2QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTVELElBQUksbUJBQW1CLEdBQVcsRUFBRSxDQUFDO0FBQ3JDLElBQUksU0FBUyxHQUFXLHlEQUFlLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0FBQ3JGLElBQUksWUFBWSxHQUFXLDREQUFrQixHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztBQUU1RixJQUFJLFlBQVksR0FBVyxLQUFLLENBQUM7QUFDakMsSUFBSSxZQUFZLEdBQVcsWUFBWSxDQUFDO0FBQ3hDLElBQUksMEJBQTBCLEdBQVcsR0FBRyxDQUFDO0FBQzdDLElBQUksbUJBQTJCLENBQUM7QUFFaEMsSUFBSSx3QkFBZ0MsQ0FBQztBQUVyQyxJQUFJLGVBQWUsR0FBVyxDQUFDLENBQUM7QUFDaEMsSUFBSSxvQkFBb0IsR0FBVyxLQUFLLENBQUM7QUFDekMsSUFBSSxvQkFBb0IsR0FBVyxvQkFBb0IsQ0FBQztBQUN4RCxJQUFJLDJCQUFtQyxDQUFDO0FBRXhDLElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztBQUUzQixJQUFJLFNBQVMsR0FBMEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqRCxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxtREFBVyxDQUFDLENBQUM7QUFDaEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsbURBQVcsQ0FBQyxDQUFDO0FBQ2hDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLG1EQUFXLENBQUMsQ0FBQztBQUNoQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxtREFBVyxDQUFDLENBQUM7QUFFaEMsSUFBSSxVQUFrQixDQUFDO0FBQ3ZCLElBQUksYUFBcUIsQ0FBQztBQUUxQixJQUFJLGVBQWUsR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUV0RCxJQUFJLFNBQVMsR0FBcUIsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakUsSUFBSSxpQkFBaUIsR0FBVyxDQUFDLENBQUM7QUFDbEMsSUFBSSxjQUFjLEdBQVcsQ0FBQyxDQUFDO0FBQy9CLElBQUksb0JBQW9CLEdBQVcsQ0FBQyxDQUFDO0FBQ3JDLElBQUksaUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0FBQ2xDLElBQUksb0JBQTRCLENBQUM7QUFDakMsSUFBSSw0QkFBNEIsR0FBVyxHQUFHLENBQUM7QUFDL0MsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO0FBQzlCLElBQUksWUFBWSxHQUFXLEVBQUUsQ0FBQztBQUM5QixJQUFJLGdCQUFnQixHQUFXLFlBQVksQ0FBQztBQUM1QyxJQUFJLHVCQUErQixDQUFDO0FBQ3BDLElBQUksWUFBWSxHQUFXLEdBQUcsQ0FBQztBQUMvQixJQUFJLGdCQUFnQixHQUFXLFlBQVksQ0FBQztBQUM1QyxJQUFJLHdCQUFnQyxDQUFDO0FBRXJDLElBQUksaUJBQWlCLEdBQTZDO0lBQzlELEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0lBQy9CLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0lBQy9CLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0lBQy9CLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0NBQ2xDLENBQUM7QUFDRixJQUFJLHFCQUFxQixHQUFXLENBQUMsQ0FBQztBQUN0QyxJQUFJLG9CQUFvQixHQUF3RDtJQUM1RSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDO0lBQ3BDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUM7SUFDcEMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQztJQUNwQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDO0NBQ3ZDLENBQUM7QUFFRixJQUFJLGNBQWMsR0FBVyxDQUFDLENBQUM7QUFDL0IsSUFBSSxjQUFjLEdBQVcsRUFBRSxDQUFDO0FBQ2hDLElBQUksT0FBTyxHQUFZLEVBQUUsQ0FBQztBQUUxQixJQUFJLFFBQVEsR0FBYyxFQUFFLENBQUM7QUFFN0IsSUFBSSxXQUFXLEdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDN0IsSUFBSSx5QkFBeUIsR0FBVyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUQsSUFBSSxrQkFBa0IsR0FBVyxJQUFJLENBQUM7QUFDdEMsSUFBSSxZQUFZLEdBQVksSUFBSSxDQUFDO0FBRWpDLElBQUksYUFBYSxHQUFtQixFQUFFLENBQUM7QUFFdkMsSUFBSSxVQUFVLEdBQVksS0FBSyxDQUFDO0FBQ2hDLElBQUksa0JBQTBCLENBQUM7QUFFL0IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFbEMsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQWdCLEVBQUUsRUFBRTtJQUN0QyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDVixPQUFPO0tBQ1Y7SUFDRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlCLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQixTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxREFBYSxDQUFDLENBQUM7S0FDckM7QUFDTCxDQUFDLENBQUM7QUFDRixRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxFQUFFO0lBQ3BDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNWLE9BQU87S0FDVjtJQUNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUIsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLG1EQUFXLENBQUMsQ0FBQztLQUNuQztBQUNMLENBQUMsQ0FBQztBQUNGLFFBQVEsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFhLEVBQUUsRUFBRTtJQUNyQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUN2QixhQUFhLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLENBQUM7QUFDRCxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBYSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUN6QixJQUFJLFdBQVcsR0FBVyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDNUMsSUFBSSxVQUFVLEdBQUcsaURBQVUsQ0FDdkIsQ0FBQyxFQUNELENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQyxFQUN2RCxFQUFFLENBQ0wsQ0FBQztJQUNGLHdCQUF3QixHQUFHLFdBQVcsQ0FBQztJQUN2QyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDakUsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDakYsdUJBQXVCLEdBQUcsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDdkYsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFDLGlCQUF5QjtJQUNuQyxJQUFJLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtRQUNsQyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztRQUN2QyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsT0FBTztLQUNWO0lBQ0QsSUFBSSxpQkFBaUIsR0FBRyxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQztJQUMvRCxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakQsSUFBSSxLQUFLLEdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLHFEQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDN0QsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLHFEQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBSSxLQUFLLEdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLHFEQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDN0QsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLHFEQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztJQUN6RCxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7UUFDZixLQUFLLEdBQUcsS0FBSyxHQUFHLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDekMsS0FBSyxHQUFHLEtBQUssR0FBRyxTQUFTLEdBQUcsWUFBWSxDQUFDO0tBQzVDO0lBRUQsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksSUFBSSxHQUFXLENBQUMsQ0FBQztJQUNyQixJQUFJLG9CQUFvQixLQUFLLFNBQVMsRUFBRTtRQUNwQyxJQUFJLEdBQUcsZ0RBQVMsQ0FDWixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLG9CQUFvQixHQUFHLDRCQUE0QixFQUNuRCxvQkFBb0IsRUFDcEIsQ0FBQyxDQUNKLENBQUM7UUFDRixJQUFJLEdBQUcsZ0RBQVMsQ0FDWixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLG9CQUFvQixHQUFHLDRCQUE0QixFQUNuRCxpQkFBaUIsRUFDakIsQ0FBQyxDQUNKLENBQUM7S0FDTDtJQUVELGlCQUFpQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDakMsY0FBYyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7SUFFOUIsWUFBWSxJQUFJLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0lBQ3RELFNBQVMsSUFBSSxjQUFjLEdBQUcsaUJBQWlCLENBQUM7SUFFaEQsZUFBZSxJQUFJLGlCQUFpQixHQUFHLG9CQUFvQixDQUFDO0lBRTVELElBQUksbUJBQW1CLEtBQUssU0FBUyxFQUFFO1FBQ25DLFlBQVksR0FBRyxnREFBUyxDQUNwQixDQUFDLEVBQ0QsaUJBQWlCLEdBQUcsd0JBQXdCLEVBQzVDLDBCQUEwQixFQUMxQixtQkFBbUIsRUFDbkIsWUFBWSxDQUNmLENBQUM7UUFDRixvQkFBb0IsR0FBRyxnREFBUyxDQUM1QixDQUFDLEVBQ0QsaUJBQWlCLEdBQUcsd0JBQXdCLEVBQzVDLDBCQUEwQixFQUMxQiwyQkFBMkIsRUFDM0Isb0JBQW9CLENBQ3ZCLENBQUM7UUFDRixnQkFBZ0IsR0FBRyxnREFBUyxDQUN4QixDQUFDLEVBQ0QsaUJBQWlCLEdBQUcsd0JBQXdCLEVBQzVDLDBCQUEwQixFQUMxQix1QkFBdUIsRUFDdkIsWUFBWSxDQUNmLENBQUM7S0FDTDtTQUFNO1FBQ0gsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUM1QixvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUM1QyxnQkFBZ0IsR0FBRyxZQUFZLENBQUM7S0FDbkM7SUFFRCxJQUFJLGFBQWEsR0FBVyxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0lBQ3BGLElBQUksVUFBVSxHQUFXLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUM7SUFDL0UsSUFBSSxVQUFVLEdBQUcsZ0RBQVMsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDN0UsSUFBSSxVQUFVLEdBQUcsNkNBQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFcEUsSUFBSSxvQkFBb0IsR0FBRyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRXRFLG1EQUFtRDtJQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztLQUN0RjtJQUVELHNCQUFzQjtJQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztLQUN2RjtJQUVELGdDQUFnQztJQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztLQUM1RjtJQUVELG1EQUFtRDtJQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxJQUFJLEtBQUssR0FBVSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxxREFBYyxDQUNkLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUNoQixNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDakIsZ0JBQWdCLEVBQ2hCLEtBQUssQ0FBQyxDQUFDLEVBQ1AsS0FBSyxDQUFDLENBQUMsRUFDUCxLQUFLLENBQUMsTUFBTSxDQUFDO2VBQ1YsQ0FDQyxLQUFLLENBQUMsaUJBQWlCLEtBQUssU0FBUzttQkFDbEMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxLQUFLLENBQUMseUJBQXlCLENBQ3JGO2VBQ0UsQ0FBQyxVQUFVLEVBQ2hCO1lBQ0UsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNyQyxJQUFJLE9BQU8sR0FBVyxnQkFBZ0IsQ0FBQztZQUN2QyxJQUFJLFNBQVMsR0FBVyxJQUFJLDJDQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzNELElBQUksV0FBVyxHQUFXLElBQUksMkNBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFJLFdBQVcsR0FBVyxJQUFJLDJDQUFNLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO2lCQUNsRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFJLGFBQWEsR0FBVyxJQUFJLDJDQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0RixJQUFJLGNBQWMsR0FBVywyREFBb0IsQ0FDN0MsU0FBUyxFQUNULFdBQVcsRUFDWCxPQUFPLEVBQ1AsU0FBUyxFQUNULFdBQVcsRUFDWCxhQUFhLENBQ2hCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2Isb0JBQW9CLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN4QyxpQkFBaUIsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDO1lBRXpDLElBQUksZ0JBQWdCLEdBQVcsMkRBQW9CLENBQy9DLFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxFQUNULE9BQU8sRUFDUCxhQUFhLEVBQ2IsV0FBVyxDQUNkLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsS0FBSyxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1lBQzVDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFFMUMsaUNBQWlDO1lBQ2pDLElBQUksZ0JBQWdCLEdBQVcsbUJBQW1CLENBQUMscUJBQXVDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNHLElBQUksV0FBVyxHQUFXLGdEQUFTLENBQy9CLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLENBQUMsRUFDRCxDQUFDLEVBQUUsR0FBRyxvQkFBb0IsQ0FBQyxxQkFBK0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FDNUYsQ0FBQztZQUNGLEtBQUssQ0FBQyxhQUFhLElBQUksV0FBVyxDQUFDO1lBRW5DLCtCQUErQjtZQUMvQixJQUFJLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxFQUFFO2dCQUMxQixJQUFJLE9BQU8sR0FBVyxnREFBUyxDQUMzQixjQUFjLEVBQ2QsS0FBSyxDQUFDLE1BQU0sRUFDWixjQUFjLEVBQ2QsRUFBRSxFQUNGLEdBQUcsQ0FDTixDQUFDO2dCQUNGLElBQUkscUJBQXFCLEtBQUssZ0VBQXNCLEVBQUU7b0JBQ2xELG9CQUFvQixDQUFDLHFCQUErQixDQUFDLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQztpQkFDeEU7Z0JBQ0Qsb0JBQW9CLENBQUMsZ0VBQWdDLENBQUMsQ0FBQyxHQUFHLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQzthQUMvRTtZQUVELHNCQUFzQjtZQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksd0RBQVksQ0FDL0IsS0FBSyxDQUFDLEdBQUcsRUFDVCxLQUFLLENBQUMsTUFBTSxFQUNaLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7a0JBQzlDLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNqRCxPQUFPLEVBQ1AsRUFBRSxFQUNGLGlCQUFpQixDQUNwQixDQUFDLENBQUM7U0FDTjtLQUNKO0lBRUQsMkJBQTJCO0lBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLElBQUksT0FBTyxHQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLHFEQUFjLENBQ2QsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQ2hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNqQixZQUFZLEVBQUUsdUNBQXVDO1FBQ3JELE9BQU8sQ0FBQyxDQUFDLEVBQ1QsT0FBTyxDQUFDLENBQUMsRUFDVCxPQUFPLENBQUMsTUFBTSxDQUFDO2VBQ1osQ0FBQyxVQUFVLEVBQ2hCO1lBQ0UsSUFBSSxnQkFBZ0IsR0FBVyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHFCQUF1QyxDQUFDLENBQUM7WUFDN0csSUFBSSxXQUFXLEdBQVcsZ0JBQWdCLEdBQUcsRUFBRTtZQUMvQyxnQkFBZ0IsSUFBSSxXQUFXLENBQUM7WUFDaEMsd0JBQXdCLEdBQUcsaUJBQWlCLENBQUM7WUFDN0MsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxFQUFFLENBQUM7WUFFSixzQkFBc0I7WUFDdEIsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLHdEQUFZLENBQy9CLFNBQVMsRUFDVCxZQUFZLEVBQ1osR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztrQkFDOUMsQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2pELEtBQUssRUFDTCxFQUFFLEVBQ0YsaUJBQWlCLENBQ3BCLENBQUMsQ0FBQztTQUNOO0tBQ0o7SUFFRCxzQkFBc0I7SUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsRUFBRTtZQUMvQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLEVBQUUsQ0FBQztTQUNQO0tBQ0o7SUFFRCwyQkFBMkI7SUFDM0IsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUN2Qyx5QkFBeUIsR0FBRyxpQkFBaUIsQ0FBQztRQUM5QyxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCO0lBRUQsc0JBQXNCO0lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLElBQUksT0FBTyxHQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3pFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDO1NBQ1A7S0FDSjtJQUVELDRCQUE0QjtJQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQyxJQUFJLFlBQVksR0FBaUIsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksaUJBQWlCLEdBQUcsWUFBWSxDQUFDLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxjQUFjLEVBQUU7WUFDbkYsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxFQUFFLENBQUM7U0FDUDtLQUNKO0lBRUQsbUJBQW1CO0lBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDM0M7SUFFRCxvQkFBb0I7SUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM1QztJQUVELDBCQUEwQjtJQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ2pEO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLEVBQUU7WUFDaEUsSUFBSSxXQUFXLEdBQUcsZ0RBQVMsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQVcsRUFBRTtnQkFDOUIsSUFBSSxTQUFTLEdBQUcsZ0RBQVMsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2RixJQUFJLFNBQVMsR0FBRyxnREFBUyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZGLElBQUksY0FBYyxHQUFHLGdEQUFTLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekYsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLDZDQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQzthQUNsSTtZQUNELEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxpQkFBaUIsQ0FBQztTQUMzRDtLQUNKO0lBRUQsNEJBQTRCO0lBQzVCLElBQUksa0JBQWtCLEdBQW1CLHFCQUFxQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsSUFBSSxrQkFBa0IsS0FBTSxxQkFBd0MsRUFBRTtZQUNsRSxJQUFJLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3pELFlBQVksQ0FBQyxXQUFXLElBQUksaUJBQWlCLENBQUM7WUFDOUMsSUFBSSxZQUFZLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pELFlBQVksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLE9BQU87YUFDbEQ7U0FDSjtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsSUFBSyxDQUFvQixLQUFLLGtCQUFrQixFQUFFO2dCQUM5QyxJQUFJLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsWUFBWSxDQUFDLFdBQVcsSUFBSSxpQkFBaUIsQ0FBQztnQkFDOUMsSUFBSSxZQUFZLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtvQkFDOUIsWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7aUJBQ2hDO2FBQ0o7U0FDSjtLQUNKO0lBRUQseUJBQXlCO0lBQ3pCLElBQUksa0JBQWtCLEtBQU0scUJBQXdDO1dBQzdELGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxLQUFLLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTztXQUNuRyxDQUFDLFVBQVUsRUFDaEI7UUFDRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7U0FDeEM7UUFDRCxxQkFBcUIsR0FBRyxrQkFBNEIsQ0FBQztLQUN4RDtJQUVELCtCQUErQjtJQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xELElBQUksY0FBYyxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksY0FBYyxDQUFDLEdBQUcsSUFBSSxjQUFjLENBQUMsV0FBVyxFQUFFO1lBQ2xELGNBQWMsQ0FBQyxHQUFHLElBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQztZQUNqRCxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkIsY0FBYyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUM7WUFFbEMsSUFBSSxDQUFtQixLQUFLLGdFQUFzQixFQUFFO2dCQUNoRCxZQUFZLElBQUksRUFBRSxDQUFDO2FBQ3RCO1NBQ0o7S0FDSjtJQUVELElBQUksZ0JBQWdCLElBQUksQ0FBQyxFQUFFO1FBQ3ZCLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7S0FDMUM7SUFFRCw4QkFBOEI7SUFDOUIsSUFBSSxLQUFLLEVBQUUsRUFPVjtJQUVELGVBQWU7SUFDZixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNqQjtJQUVELHVCQUF1QjtJQUN2QixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsSUFBSSxhQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLElBQUksZUFBZSxHQUFVLHFEQUFjLENBQUMscUJBQXVDLENBQUMsQ0FBQztRQUNyRixJQUFJLHdCQUF3QixLQUFLLFNBQVMsRUFBRTtZQUN4QyxhQUFhLEdBQUcsZ0RBQVMsQ0FDckIsd0JBQXdCLEVBQ3hCLGlCQUFpQixFQUNqQix3QkFBd0IsR0FBRyxJQUFJLEVBQy9CLENBQUMsRUFDRCxDQUFDLENBQ0osQ0FBQztTQUNMO1FBQ0QsSUFBSSxRQUFRLEdBQVUsb0RBQWdCLENBQ2xDLElBQUkseUNBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNwQixlQUFlLEVBQ2YsYUFBYSxDQUNoQixDQUFDO1FBQ0YsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkQsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNqQjtJQUVELHdCQUF3QjtJQUN4QixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDekIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQ0gsVUFBVSxFQUNWLFVBQVUsRUFDVixnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQUcsRUFBRSxFQUN0QixpQkFBaUIsR0FBRyxFQUFFLEdBQUcsZ0RBQVMsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekYsQ0FBQztRQUNGLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNqQjtJQUVELDRCQUE0QjtJQUM1QixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2IsSUFBSSxjQUFjLEdBQVcsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFJLGVBQWUsR0FBVyxDQUFDLENBQUM7UUFDaEMsSUFBSSxpQkFBaUIsR0FBVyxVQUFVLEdBQUcsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUNoRSxJQUFJLGlCQUFpQixHQUFXLFVBQVUsR0FBRyxZQUFZLEdBQUcsZUFBZSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEYsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDMUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN4SCxHQUFHLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN0RixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDakI7SUFFRCx3QkFBd0I7SUFDeEIsSUFBSSxrQkFBa0IsS0FBSyxxQkFBcUIsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUM3RCxJQUFJLFdBQVcsR0FBVyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQzFDLElBQUksV0FBVyxHQUFXLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDMUMsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLG1CQUFtQixDQUFDLFdBQVcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVkLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVkLElBQUksS0FBSyxHQUFXLEdBQUcsQ0FBQztRQUN4QixJQUFJLE1BQU0sR0FBVyxFQUFFLENBQUM7UUFDeEIsSUFBSSxRQUFRLEdBQVcsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUMvRCxJQUFJLFFBQVEsR0FBVyxXQUFXLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLHVCQUF1QixHQUEyQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVHLElBQUksU0FBUyxHQUFXLENBQUMsdUJBQXVCLENBQUMsV0FBVyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEdBQUcsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVELEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2pCO0lBRUQseUJBQXlCO0lBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVkLHVCQUF1QjtJQUN2QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUN4QixHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUN2QixHQUFHLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixHQUFHLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztJQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWQsMkNBQTJDO0lBQzNDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVkLHdEQUF3RDtJQUN4RCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLElBQUksdUJBQXVCLEdBQUcsa0JBQWtCLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ25HLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3ZCLFlBQVksRUFDWixnQkFBZ0IsR0FBRyxpQkFBaUIsR0FBRyxrQkFBa0IsR0FBRyxZQUFZLENBQzNFO1FBQ0QsSUFBSSx1QkFBdUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDN0MsV0FBVyxFQUFFLENBQUM7WUFDZCxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUIsWUFBWSxHQUFHLEtBQUssQ0FBQztTQUN4QjthQUFNO1lBQ0gsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1gsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDeEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDdkIsR0FBRyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDekIsR0FBRyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7WUFDeEIsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMvRCxHQUFHLENBQUMsUUFBUSxDQUNSLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsRUFDOUMsQ0FBQyxFQUNELEVBQUUsQ0FDTDtZQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqQjtLQUNKO0lBRUQseUNBQXlDO0lBQ3pDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRCx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsd0JBQXdCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0Msd0JBQXdCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFOUMsc0JBQXNCO0lBQ3RCLElBQUksVUFBVSxFQUFFO1FBQ1osSUFBSSx1QkFBdUIsR0FBVyxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQztRQUM3RSxJQUFJLFdBQVcsR0FBRyxnREFBUyxDQUFDLENBQUMsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsWUFBWTtRQUN2QixHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN4QixHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUN6QixHQUFHLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztRQUM1QixHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDNUI7SUFFRCxXQUFXO0lBQ1gsSUFBSSxLQUFLLEVBQUUsRUFTVjtJQUVELGtCQUFrQixHQUFHLGlCQUFpQixDQUFDO0lBQ3ZDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsV0FBbUI7SUFDbEMsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztLQUNwRjtJQUNELGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXhDLDBEQUEwRDtJQUMxRCxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQ3hCLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1FBQ2hCLGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxLQUFLLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQztJQUV4QixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxPQUFPO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRTtRQUN2QyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsT0FBTztTQUNWO0tBQ0o7SUFDRCxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLFdBQW1CO0lBQ3JDLElBQUksaUJBQWlCLEdBQVcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xELElBQUksSUFBSSxHQUFhLHlDQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbEMsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksTUFBTSxHQUFXLGdEQUFTLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hGLElBQUksS0FBSyxHQUFXLGdEQUFTLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JGLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSx5Q0FBSyxDQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsNERBQWtCLEVBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyx5REFBZSxFQUMvQixNQUFNLEVBQ04sTUFBTSxFQUNOLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBbUIsRUFDakMsS0FBSyxFQUNMLGlCQUFpQixDQUNwQixDQUFDLENBQUM7S0FDTjtBQUNMLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxhQUFxQixFQUFFLFVBQWtCO0lBQzlELElBQUksaUJBQWlCLEdBQVcsYUFBYSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsbUJBQW1CLENBQUM7SUFDbkYsSUFBSSxjQUFjLEdBQVcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUM7SUFDOUUsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsRCxJQUFJLFNBQVMsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQy9DLElBQUksb0JBQW9CLEdBQVcsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxJQUFJLFVBQVUsR0FBVyxnREFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUseURBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLGFBQWEsR0FBVyxnREFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsNERBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxHQUFHLEdBQW1CLHFEQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLEdBQUcsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLEdBQUcsNkNBQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDbkQsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTVFLDJCQUEyQjtZQUMzQiw0QkFBNEI7WUFDNUIsK0JBQStCO1lBQy9CLG9FQUFvRTtZQUNwRSwwQkFBMEI7U0FDN0I7S0FDSjtJQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNkLE9BQU8sb0JBQW9CLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZLEVBQUUsR0FBbUI7SUFDaEYsR0FBRyxDQUFDLFNBQVMsR0FBRywwREFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwRCxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFlBQW9CLEVBQUUsU0FBaUI7SUFDbEUsSUFBSSxVQUFVLEdBQVcsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSx5REFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLElBQUksYUFBYSxHQUFXLGdEQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsNERBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0YsT0FBTyxxREFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLFFBQXdCLEVBQUUsUUFBd0I7SUFDM0UsSUFBSSxRQUFRLEtBQUssZ0VBQXNCLElBQUksUUFBUSxLQUFLLGdFQUFzQixFQUFFO1FBQzVFLE9BQU8sQ0FBQyxDQUFDO0tBQ1o7SUFFRCxJQUFJLFFBQVEsS0FBSywrREFBcUIsRUFBRTtRQUNwQyxJQUFJLFFBQVEsS0FBSyw4REFBb0IsRUFBRTtZQUNuQyxPQUFPLENBQUMsQ0FBQztTQUNaO2FBQU0sSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7WUFDM0MsT0FBTyxHQUFHLENBQUM7U0FDZDthQUFNO1lBQ0gsT0FBTyxDQUFDLENBQUM7U0FDWjtLQUNKO0lBRUQsSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7UUFDcEMsSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7WUFDcEMsT0FBTyxDQUFDLENBQUM7U0FDWjthQUFNLElBQUksUUFBUSxLQUFLLDhEQUFvQixFQUFFO1lBQzFDLE9BQU8sR0FBRyxDQUFDO1NBQ2Q7YUFBTSxJQUFJLFFBQVEsS0FBSywrREFBcUIsRUFBRTtZQUMzQyxPQUFPLENBQUMsQ0FBQztTQUNaO0tBQ0o7SUFFRCxJQUFJLFFBQVEsS0FBSyw4REFBb0IsRUFBRTtRQUNuQyxJQUFJLFFBQVEsS0FBSywrREFBcUIsRUFBRTtZQUNwQyxPQUFPLENBQUMsQ0FBQztTQUNaO2FBQU0sSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7WUFDM0MsT0FBTyxHQUFHLENBQUM7U0FDZDthQUFNLElBQUksUUFBUSxLQUFLLDhEQUFvQixFQUFFO1lBQzFDLE9BQU8sQ0FBQyxDQUFDO1NBQ1o7S0FDSjtBQUNMLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUM3QixDQUFTLEVBQ1QsQ0FBUyxFQUNULFdBQTJCO0lBRTNCLElBQUksUUFBUSxHQUFXLEVBQUUsQ0FBQztJQUMxQixJQUFJLFdBQVcsR0FBVyxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEQsSUFBSSxXQUFXLEdBQVcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDM0MsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1gsbUJBQW1CLENBQUMsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25HLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVkLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVkLElBQUksS0FBSyxHQUFXLEdBQUcsQ0FBQztJQUN4QixJQUFJLE1BQU0sR0FBVyxFQUFFLENBQUM7SUFDeEIsSUFBSSxRQUFRLEdBQVcsV0FBVyxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUMvRCxJQUFJLFFBQVEsR0FBVyxXQUFXLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxJQUFJLGNBQWMsR0FBc0Qsb0JBQW9CLENBQUMsV0FBcUIsQ0FBQyxDQUFDO0lBQ3BILElBQUksU0FBUyxHQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1gsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDMUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7SUFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssR0FBRyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUQsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFZCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUN4QixHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUN4QixHQUFHLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUM1QixHQUFHLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztJQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLFdBQVcsR0FBRyxLQUFLLEdBQUcsUUFBUSxHQUFHLEVBQUUsRUFBRSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDanpCOUIsSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2hCLG1DQUFFO0lBQ0YsdUNBQUk7QUFDUixDQUFDLEVBSFcsUUFBUSxLQUFSLFFBQVEsUUFHbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGbUY7QUFDbkQ7QUFDb0I7QUFDbkI7QUFFM0IsTUFBTSxPQUFPO0lBbUJoQixZQUNJLEdBQVcsRUFDWCxNQUFjLEVBQ2QsTUFBYyxFQUNkLE9BQXVCLEVBQ3ZCLFNBQWlCLEVBQ2pCLFlBQW9CLEVBQ3BCLGNBQXNCLEVBQ3RCLGlCQUF5QjtRQVZyQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBWTNCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLHFEQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztJQUNoRCxDQUFDO0lBRU0sTUFBTSxDQUNULG1CQUEyQixFQUMzQixnQkFBd0IsRUFDeEIsbUJBQTJCLEVBQzNCLGlCQUF5QjtRQUV6QixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDekMsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1NBQ3JFO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUU3QyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztRQUV0RCxJQUFJLEVBQUUsR0FBRyxrREFBVyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLDREQUFrQixHQUFHLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBQ3hHLElBQUksRUFBRSxHQUFHLGtEQUFXLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUseURBQWUsR0FBRyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztRQUUvRixJQUFJLGtCQUFrQixHQUFXLElBQUksMkNBQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xFLElBQUksYUFBcUIsQ0FBQztRQUMxQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7WUFDekMsYUFBYSxHQUFHLGtCQUFrQixDQUFDO1NBQ3RDO2FBQU07WUFDSCxJQUFJLFVBQVUsR0FBVyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN4RCxJQUFJLFlBQVksR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDckYsSUFBSSxNQUFNLEdBQVcsQ0FBQyxrREFBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUUsSUFBSSxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDZCxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO1lBQ0QsSUFBSSxZQUFZLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztZQUM3RixJQUFJLFFBQVEsR0FBRyxZQUFZLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztZQUN2RCxhQUFhLEdBQUcsSUFBSSwyQ0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsSUFBSSxZQUFvQixDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLG9CQUFvQixLQUFLLFNBQVMsRUFBRTtZQUN6QyxZQUFZLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDLENBQUM7U0FDMUU7YUFBTTtZQUNILFlBQVksR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBR3RDLElBQUksQ0FBQyxDQUFDLEdBQUcsZ0RBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsaURBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQztJQUNsRCxDQUFDO0lBRU0sSUFBSSxDQUNQLGlCQUF5QixFQUN6QixHQUE2QjtRQUU3QixJQUFJLGFBQWEsR0FBVyxJQUFJLDJDQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDaEYsU0FBUyxFQUFFO2FBQ1gsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDMUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQ04sSUFBSSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxFQUN4QixJQUFJLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQzNCLENBQUM7UUFDRixHQUFHLENBQUMsTUFBTSxDQUNOLElBQUksQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsRUFDeEIsSUFBSSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUMzQixDQUFDO1FBQ0YsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVkLGFBQWEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMvQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FDTixJQUFJLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEVBQ3hCLElBQUksQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztRQUNGLEdBQUcsQ0FBQyxNQUFNLENBQ04sSUFBSSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxFQUN4QixJQUFJLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQzNCLENBQUM7UUFDRixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdJK0I7QUFDZTtBQUNiO0FBRWxDLDJFQUEyRTtBQUNwRSxTQUFTLFNBQVMsQ0FDckIsU0FBaUIsRUFDakIsU0FBaUIsRUFDakIsT0FBZSxFQUNmLE9BQWUsRUFDZixLQUFhO0lBRWIsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM5RixJQUFJLEtBQUssR0FBVyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQztJQUNwRSxPQUFPLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVNLFNBQVMsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsR0FBVztJQUM5RCxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7UUFDYixPQUFPLEdBQUcsQ0FBQztLQUNkO0lBQ0QsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO1FBQ2IsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxtSEFBbUg7QUFDbkgsd0RBQXdEO0FBQ2pELFNBQVMsU0FBUyxDQUFDLEdBQVcsRUFBRSxHQUFXO0lBQzlDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFFTSxTQUFTLFNBQVMsQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLEdBQVc7SUFDN0QsSUFBSSxLQUFLLEdBQUcsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7UUFDNUIsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUNoRDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxxREFBcUQ7QUFDckQsNkdBQTZHO0FBQzdHLFNBQVMsR0FBRyxDQUFDLENBQVMsRUFBRSxDQUFTO0lBQzdCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVNLFNBQVMsU0FBUyxDQUFDLE1BQWMsRUFBRSxhQUFxQixFQUFFLG1CQUEyQjtJQUN4RixPQUFPLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0FBQzFELENBQUM7QUFFTSxTQUFTLE1BQU0sQ0FBQyxHQUFXLEVBQUUsVUFBa0IsRUFBRSxtQkFBMkI7SUFDL0UsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztBQUNwRCxDQUFDO0FBRU0sU0FBUyxjQUFjLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO0lBQ2pHLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7V0FDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN2QyxDQUFDO0FBRU0sU0FBUyxvQkFBb0IsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7SUFDdkcsSUFBSSxTQUFTLEdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQyxPQUFPLFNBQVM7U0FDWCxLQUFLLENBQ0YsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztVQUNqQix3REFBbUIsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQztVQUM1QyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQzVCLENBQUM7QUFDVixDQUFDO0FBRU0sU0FBUyxtQkFBbUIsQ0FBQyxHQUFtQjtJQUNuRCxRQUFPLEdBQUcsRUFBRTtRQUNSLEtBQUssZ0VBQXNCO1lBQ3ZCLE9BQU8sSUFBSSx5Q0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEMsS0FBSywrREFBcUI7WUFDdEIsT0FBTyxJQUFJLHlDQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxLQUFLLCtEQUFxQjtZQUN0QixPQUFPLElBQUkseUNBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLEtBQUssOERBQW9CO1lBQ3JCLE9BQU8sSUFBSSx5Q0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbkM7QUFDTCxDQUFDO0FBRU0sU0FBUyxjQUFjLENBQUMsR0FBbUI7SUFDOUMsSUFBSSxLQUFLLEdBQVUsR0FBRyxLQUFLLGdFQUFzQjtRQUM3QyxDQUFDLENBQUMsSUFBSSx5Q0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixPQUFPLG9EQUFnQixDQUNuQixLQUFLLEVBQ0wsSUFBSSx5Q0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ3hCLElBQUksQ0FDUCxDQUFDO0FBQ04sQ0FBQztBQUVELGdDQUFnQztBQUN6QixTQUFTLFdBQVcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEdBQVcsRUFBRSxHQUFXO0lBQ3RFLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2QyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkMsSUFBSSxPQUFlLENBQUM7SUFDcEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLGVBQWU7SUFDZixzQkFBc0I7SUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUU7UUFDMUIsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEIsbUJBQW1CO1FBQ25CLHNCQUFzQjtLQUNyQjtTQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFFO1FBQ2hDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEIsZUFBZTtRQUNmLHNCQUFzQjtLQUNyQjtTQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1FBQ2hDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEIsbUJBQW1CO1FBQ25CLHNCQUFzQjtLQUNyQjtTQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFFO1FBQy9CLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQy9CLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzNITSxNQUFNLE1BQU07SUFJZixZQUFtQixDQUFTLEVBQUUsQ0FBUztRQUNuQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVNLEtBQUssQ0FBQyxDQUFTO1FBQ2xCLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxJQUFJLENBQUMsQ0FBUztRQUNqQixPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFVLEVBQUUsRUFBVTtRQUM3QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxXQUFXO1FBQ2QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBYztRQUN2QixPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUN4Q00sSUFBSSxLQUFLLEdBQWU7SUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0NBQ2pDOzs7Ozs7O1VDUkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2NvbG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvZW5lbXkudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9lbnZpcm9ubWVudC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2Zsb2F0aW5nX3RleHQudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2tleV9zdGF0ZS50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL21pc3NpbGUudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvd2F2ZXMudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYXBMaW5lYXIgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArIHRoaXMuciArIFwiLFwiICsgdGhpcy5nICsgXCIsXCIgKyB0aGlzLmIgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvUkdCKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0b1JHQkEocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHIgKyBcIixcIiArIGcgKyBcIixcIiArIGIgKyBcIixcIiArIGEgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnBDb2xvcnMoYzE6IENvbG9yLCBjMjogQ29sb3IsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKFxyXG4gICAgICAgICAgICBtYXBMaW5lYXIoMCwgcmF0aW8sIDEsIGMxLnIsIGMyLnIpLFxyXG4gICAgICAgICAgICBtYXBMaW5lYXIoMCwgcmF0aW8sIDEsIGMxLmcsIGMyLmcpLFxyXG4gICAgICAgICAgICBtYXBMaW5lYXIoMCwgcmF0aW8sIDEsIGMxLmIsIGMyLmIpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudENvbHVtbnMsIEVudmlyb25tZW50S2V5LCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBnZXREaXN0YW5jZSwgZ2V0RW52aXJvbm1lbnRDb2xvciwgZ2V0VGludGVkQ29sb3IsIG1hcExpbmVhciwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmVteSB7XHJcbiAgICBwdWJsaWMgcm93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyByYWRpdXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0SGl0VGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaGl0VmVsb2NpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlVmVsaWNpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0b3RhbFZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXM6IG51bWJlciA9IDUwMDtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIG1heEhlYWx0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRIZWFsdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbGVtZW50OiBFbnZpcm9ubWVudEtleTtcclxuICAgIHB1YmxpYyBkZWZhdWx0Q29sb3I6IENvbG9yO1xyXG4gICAgcHVibGljIG1vdmVTcGVlZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxhc3RNaXNzaWxlU3Bhd25BdHRlbXB0TWlsbGlzOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHJvdzogbnVtYmVyLFxyXG4gICAgICAgIGNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHJhZGl1czogbnVtYmVyLFxyXG4gICAgICAgIGhlYWx0aDogbnVtYmVyLFxyXG4gICAgICAgIGVsZW1lbnQ6IEVudmlyb25tZW50S2V5LFxyXG4gICAgICAgIG1vdmVTcGVlZDogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnJvdyA9IHJvdztcclxuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcclxuICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Q29sdW1uID0gMDtcclxuICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Um93ID0gMDtcclxuICAgICAgICB0aGlzLm1heEhlYWx0aCA9IGhlYWx0aDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRIZWFsdGggPSBoZWFsdGg7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDb2xvciA9IGdldFRpbnRlZENvbG9yKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4gPSAwO1xyXG4gICAgICAgIHRoaXMubW92ZVZlbGljaXR5Um93ID0gMDtcclxuICAgICAgICB0aGlzLm1vdmVTcGVlZCA9IG1vdmVTcGVlZDtcclxuICAgICAgICB0aGlzLmxhc3RNaXNzaWxlU3Bhd25BdHRlbXB0TWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShcclxuICAgICAgICB3cmFwcGVkQ2VudGVyQ29sdW1uOiBudW1iZXIsXHJcbiAgICAgICAgd3JhcHBlZENlbnRlclJvdzogbnVtYmVyLFxyXG4gICAgICAgIGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlcixcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IGVsYXBzZWRUaW1lTWlsbGlzID0gMDtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsYXBzZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXMgLSB0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgaGl0VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGhpdFZlbG9jaXR5Um93OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaGl0VmVsb2NpdHlDb2x1bW4gPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICsgdGhpcy5oaXRSZWNvdmVyeUR1cmF0aW9uTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRWZWxvY2l0eUNvbHVtbixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBoaXRWZWxvY2l0eVJvdyA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgKyB0aGlzLmhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Um93LFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG90YWxWZWxvY2l0eUNvbHVtbiA9IGhpdFZlbG9jaXR5Q29sdW1uICsgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW47XHJcbiAgICAgICAgdGhpcy50b3RhbFZlbG9jaXR5Um93ID0gaGl0VmVsb2NpdHlSb3cgKyB0aGlzLm1vdmVWZWxpY2l0eVJvdztcclxuXHJcbiAgICAgICAgdGhpcy5jb2x1bW4gKz0gdGhpcy50b3RhbFZlbG9jaXR5Q29sdW1uICogZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICAgICAgdGhpcy5yb3cgKz0gdGhpcy50b3RhbFZlbG9jaXR5Um93ICogZWxhcHNlZFRpbWVNaWxsaXM7XHJcblxyXG4gICAgICAgIGxldCBkeCA9IGdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJDb2x1bW4sIHRoaXMuY29sdW1uLCAwLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICAgICAgbGV0IGR5ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlclJvdywgdGhpcy5yb3csIDAsIGVudmlyb25tZW50Um93cyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuXHJcbiAgICAgICAgbGV0IG1vdmVWZWxvY2l0eTogVmVjdG9yID0gbmV3IFZlY3RvcigtZHgsIC1keSkubm9ybWFsaXplKCkuc2NhbGUodGhpcy5tb3ZlU3BlZWQpO1xyXG4gICAgICAgIHRoaXMubW92ZVZlbG9jaXR5Q29sdW1uID0gbW92ZVZlbG9jaXR5Lng7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsaWNpdHlSb3cgPSBtb3ZlVmVsb2NpdHkueTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gY2FudmFzLndpZHRoIC8gMiArIGR4O1xyXG4gICAgICAgIHRoaXMueSA9IGNhbnZhcy5oZWlnaHQgLyAyICsgZHk7XHJcblxyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICBhICAgICAgICAgICBiXHJcbiAgICAgICAgWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG5cclxuICAgICAgICBkaXN0MSA9IE1hdGguYWJzKGEgLSBiKTtcclxuICAgICAgICBkaXN0MiA9IChhIC0gbWluKSArIChtYXggLSBiKTtcclxuXHJcbiAgICAgICAgYSAtIGIgPSAtNiAobW9kIDkpID0+IDNcclxuXHJcblxyXG4gICAgICAgICAgICAgYiAgICAgICBhXHJcbiAgICAgICAgWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgICAgIFxyXG4gICAgICAgIGIgLSBhID0gLTQgKG1vZCA5KSA9IDVcclxuICAgICAgICBsZW4gKyAoMiArIDEpIC0gKDYgKyAxKSA9IGxlbiArIDMgLSA3ID0gbGVuIC0gNCA9IDVcclxuICAgICAgICAvLyDigItsZW4gKyAobWluKGEsYikgKyAxKSAtIChtYXgoYSxiKSArIDEpXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMztcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvbG9yUmF0aW8gPSAxO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RIaXRUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29sb3JSYXRpbyA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgKyAxMDAwLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBDb2xvci5sZXJwQ29sb3JzKFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMjU1LCAwLCAwKSxcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0Q29sb3IsXHJcbiAgICAgICAgICAgIGNvbG9yUmF0aW8sXHJcbiAgICAgICAgKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSB0aGlzLm1heEhlYWx0aCAvIDI7XHJcbiAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gNDtcclxuICAgICAgICBsZXQgdG9wTGVmdFg6IG51bWJlciA9IHRoaXMueCAtIHdpZHRoIC8gMjtcclxuICAgICAgICBsZXQgdG9wTGVmdFk6IG51bWJlciA9IHRoaXMueSAtIHRoaXMucmFkaXVzIC0gaGVpZ2h0IC8gMiAtIDg7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGggKiAodGhpcy5jdXJyZW50SGVhbHRoIC8gdGhpcy5tYXhIZWFsdGgpLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyByYW5kb21JbnQsIHdyYXBWYWx1ZSB9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEVudmlyb25tZW50S2V5IHtcclxuICAgIERFRkFVTFQsXHJcbiAgICBGT1JFU1QsXHJcbiAgICBERVNFUlQsXHJcbiAgICBXQVRFUixcclxufVxyXG5leHBvcnQgbGV0IGVudmlyb25tZW50OiBFbnZpcm9ubWVudEtleVtdW10gPSBbXTtcclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudFJvd3M6IG51bWJlciA9IDMwO1xyXG5leHBvcnQgbGV0IGVudmlyb25tZW50Q29sdW1uczogbnVtYmVyID0gMzA7XHJcblxyXG5mb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICBsZXQgcm93OiBFbnZpcm9ubWVudEtleVtdID0gW107XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjk5Nykge1xyXG4gICAgICAgICAgICByb3cucHVzaChFbnZpcm9ubWVudEtleS5ERUZBVUxUKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByb3cucHVzaChyYW5kb21JbnQoMSwgMykgYXMgRW52aXJvbm1lbnRLZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVudmlyb25tZW50LnB1c2gocm93KTtcclxufVxyXG5cclxuZm9yIChsZXQgayA9IDA7IGsgPCAxMDsgaysrKSB7XHJcbiAgICBsZXQgZW52aXJvbm1lbnRDb3B5OiBFbnZpcm9ubWVudEtleVtdW10gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgICAgICBsZXQgcm93OiBFbnZpcm9ubWVudEtleVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgICAgICByb3cucHVzaChlbnZpcm9ubWVudFtpXVtqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVudmlyb25tZW50Q29weS5wdXNoKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVudmlyb25tZW50Q29weVtpXVtqXSAhPT0gRW52aXJvbm1lbnRLZXkuREVGQVVMVCAmJiBNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2gocmFuZG9tSW50KDEsIDQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFt3cmFwVmFsdWUoMCwgaSsxLCBlbnZpcm9ubWVudFJvd3MgLSAxKV1bal0gPSBlbnZpcm9ubWVudFtpXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFtpXVt3cmFwVmFsdWUoMCwgaisxLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKV0gPSBlbnZpcm9ubWVudFtpXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFt3cmFwVmFsdWUoMCwgaS0xLCBlbnZpcm9ubWVudFJvd3MgLSAxKV1bal0gPSBlbnZpcm9ubWVudFtpXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFtpXVt3cmFwVmFsdWUoMCwgai0xLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKV0gPSBlbnZpcm9ubWVudFtpXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZW52aXJvbm1lbnRDb2x1bW5zLCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBnZXREaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGbG9hdGluZ1RleHQge1xyXG4gICAgcHVibGljIGNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIHJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sb3I6IHN0cmluZztcclxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdmVsb2NpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGxpZmV0aW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY3JlYXRpb25UaW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICByb3c6IG51bWJlcixcclxuICAgICAgICBjb2x1bW46IG51bWJlcixcclxuICAgICAgICB0ZXh0OiBzdHJpbmcsXHJcbiAgICAgICAgY29sb3I6IHN0cmluZyxcclxuICAgICAgICBzaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcm93O1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5saWZldGltZU1pbGxpcyA9IDEwMDA7XHJcbiAgICAgICAgdGhpcy5jcmVhdGlvblRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICB0aGlzLnZlbG9jaXR5Um93ID0gLTAuMDAxO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoXHJcbiAgICAgICAgd3JhcHBlZENlbnRlckNvbHVtbjogbnVtYmVyLFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJSb3c6IG51bWJlcixcclxuICAgICAgICBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucm93ICs9IHRoaXMudmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICAgICAgbGV0IGR4ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlckNvbHVtbiwgdGhpcy5jb2x1bW4sIDAsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgICAgICBsZXQgZHkgPSBnZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyUm93LCB0aGlzLnJvdywgMCwgZW52aXJvbm1lbnRSb3dzIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnggPSBjYW52YXMud2lkdGggLyAyICsgZHg7XHJcbiAgICAgICAgdGhpcy55ID0gY2FudmFzLmhlaWdodCAvIDIgKyBkeTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICAgICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5mb250ID0gdGhpcy5zaXplICsgXCJweCBBcmlhbFwiO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnRleHQsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBFbmVteSB9IGZyb20gXCIuL2VuZW15XCI7XHJcbmltcG9ydCB7IGVudmlyb25tZW50LCBlbnZpcm9ubWVudENvbHVtbnMsIEVudmlyb25tZW50S2V5LCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBGbG9hdGluZ1RleHQgfSBmcm9tIFwiLi9mbG9hdGluZ190ZXh0XCI7XHJcbmltcG9ydCB7IEtleVN0YXRlIH0gZnJvbSBcIi4va2V5X3N0YXRlXCI7XHJcbmltcG9ydCB7IE1pc3NpbGUgfSBmcm9tIFwiLi9taXNzaWxlXCI7XHJcbmltcG9ydCB7IGNsYW1wVmFsdWUsIGNvbGxpZGVDaXJjbGVzLCBjb2x1bW5Ub1gsIGdldENvbGxpc2lvblZlbG9jaXR5LCBnZXRFbnZpcm9ubWVudENvbG9yLCBnZXRUaW50ZWRDb2xvciwgbWFwTGluZWFyLCByYW5kb21JbnQsIHJvd1RvWSwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgd2F2ZXMgfSBmcm9tIFwiLi93YXZlc1wiO1xyXG5cclxubGV0IHByZXZpb3VzVGltZU1pbGxpczogbnVtYmVyO1xyXG5cclxuZXhwb3J0IGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuY2FudmFzLndpZHRoID0gODAwO1xyXG5jYW52YXMuaGVpZ2h0ID0gODAwO1xyXG5jYW52YXMuaWQgPSBcImdhbWVDYW52YXNcIjtcclxubGV0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbmxldCBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIgPSA1MDtcclxubGV0IGNlbnRlclJvdzogbnVtYmVyID0gZW52aXJvbm1lbnRSb3dzIC8gMiAtIGNhbnZhcy53aWR0aCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5sZXQgY2VudGVyQ29sdW1uOiBudW1iZXIgPSBlbnZpcm9ubWVudENvbHVtbnMgLyAyIC0gY2FudmFzLmhlaWdodCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxubGV0IG1pbmltdW1TcGVlZDogbnVtYmVyID0gMC4wMDM7XHJcbmxldCBjdXJyZW50U3BlZWQ6IG51bWJlciA9IG1pbmltdW1TcGVlZDtcclxubGV0IHNwZWVkRGVncmVkYXRpb25UaW1lTWlsbGlzOiBudW1iZXIgPSA3MDA7XHJcbmxldCBsYXN0U3BlZWRCb29zdFNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5sZXQgY3VycmVudFJvdGF0aW9uOiBudW1iZXIgPSAwO1xyXG5sZXQgbWluaW11bVJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IDAuMDA0O1xyXG5sZXQgY3VycmVudFJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IG1pbmltdW1Sb3RhdGlvblNwZWVkO1xyXG5sZXQgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbG9nQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbmxldCBrZXlTdGF0ZXM6IE1hcDxzdHJpbmcsIEtleVN0YXRlPiA9IG5ldyBNYXAoKTtcclxua2V5U3RhdGVzLnNldChcIldcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiQVwiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJTXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIkRcIiwgS2V5U3RhdGUuVVApO1xyXG5cclxubGV0IG1vdXNlRG93blk6IG51bWJlcjtcclxubGV0IG1vdXNlRG93blRpbWU6IG51bWJlcjtcclxuXHJcbmxldCBwcmVsb2FkUmVnaXN0cnk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGd1eVNwcml0ZTogSFRNTEltYWdlRWxlbWVudCA9IGxvYWRJbWFnZShcIi4uL2Fzc2V0cy9ndXkucG5nXCIpO1xyXG5sZXQgZ3V5VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbmxldCBndXlWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxubGV0IGd1eUhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXIgPSAwO1xyXG5sZXQgZ3V5SGl0VmVsb2NpdHlSb3c6IG51bWJlciA9IDA7XHJcbmxldCBndXlMYXN0SGl0VGltZU1pbGxpczogbnVtYmVyO1xyXG5sZXQgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpczogbnVtYmVyID0gODAwO1xyXG5sZXQgbWluR3V5UmFkaXVzOiBudW1iZXIgPSAxMDtcclxubGV0IG1heEd1eVJhZGl1czogbnVtYmVyID0gNDA7XHJcbmxldCBjdXJyZW50R3V5UmFkaXVzOiBudW1iZXIgPSBtaW5HdXlSYWRpdXM7XHJcbmxldCBsYXN0U3BlZWRCb29zdEd1eVJhZGl1czogbnVtYmVyO1xyXG5sZXQgZ3V5TWF4SGVhbHRoOiBudW1iZXIgPSAxMDA7XHJcbmxldCBndXlDdXJyZW50SGVhbHRoOiBudW1iZXIgPSBndXlNYXhIZWFsdGg7XHJcbmxldCBndXlMYXN0RGFtYWdlZFRpbWVNaWxsaXM6IG51bWJlcjtcclxuXHJcbmxldCBlbnZpcm9ubWVudFRpbWVyczoge2N1cnJlbnRUaW1lOiBudW1iZXIsIG1heFRpbWU6IG51bWJlcn1bXSA9IFtcclxuICAgIHtjdXJyZW50VGltZTogMCwgbWF4VGltZTogNzAwMH0sXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDM1MDB9LFxyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiAzNTAwfSxcclxuICAgIHtjdXJyZW50VGltZTogMCwgbWF4VGltZTogMzUwMH0sXHJcbl07XHJcbmxldCBjdXJyZW50VHJhbnNmb3JtYXRpb246IG51bWJlciA9IDA7XHJcbmxldCB0cmFuc2Zvcm1hdGlvbkxldmVsczoge2V4cDogbnVtYmVyLCB0b05leHRMZXZlbDogbnVtYmVyLCBsZXZlbDogbnVtYmVyfVtdID0gW1xyXG4gICAge2V4cDogMCwgdG9OZXh0TGV2ZWw6IDIwMCwgbGV2ZWw6IDF9LFxyXG4gICAge2V4cDogMCwgdG9OZXh0TGV2ZWw6IDEwMCwgbGV2ZWw6IDF9LFxyXG4gICAge2V4cDogMCwgdG9OZXh0TGV2ZWw6IDEwMCwgbGV2ZWw6IDF9LFxyXG4gICAge2V4cDogMCwgdG9OZXh0TGV2ZWw6IDEwMCwgbGV2ZWw6IDF9LFxyXG5dO1xyXG5cclxubGV0IG1pbkVuZW15UmFkaXVzOiBudW1iZXIgPSA3O1xyXG5sZXQgbWF4RW5lbXlSYWRpdXM6IG51bWJlciA9IDIwO1xyXG5sZXQgZW5lbWllczogRW5lbXlbXSA9IFtdO1xyXG5cclxubGV0IG1pc3NpbGVzOiBNaXNzaWxlW10gPSBbXTtcclxuXHJcbmxldCBjdXJyZW50V2F2ZTogbnVtYmVyID0gLTE7XHJcbmxldCBwcmV2aW91c1dhdmVFbmRUaW1lTWlsbGlzOiBudW1iZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxubGV0IHdhdmVSZXN0VGltZU1pbGxpczogbnVtYmVyID0gODAwMDtcclxubGV0IGlzSW5SZXN0VGltZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG5sZXQgZmxvYXRpbmdUZXh0czogRmxvYXRpbmdUZXh0W10gPSBbXTtcclxuXHJcbmxldCBpc0dhbWVPdmVyOiBib29sZWFuID0gZmFsc2U7XHJcbmxldCBnYW1lT3ZlclRpbWVNaWxsaXM6IG51bWJlcjtcclxuXHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuXHJcbmRvY3VtZW50Lm9ua2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuRE9XTik7XHJcbiAgICB9XHJcbn07XHJcbmRvY3VtZW50Lm9ua2V5dXAgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgaWYgKGUucmVwZWF0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGtleSA9IGUua2V5LnRvVXBwZXJDYXNlKCk7XHJcbiAgICBpZiAoa2V5U3RhdGVzLmhhcyhrZXkpKSB7XHJcbiAgICAgICAga2V5U3RhdGVzLnNldChrZXksIEtleVN0YXRlLlVQKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgbW91c2VEb3duWSA9IGUuY2xpZW50WTtcclxuICAgIG1vdXNlRG93blRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxufVxyXG5kb2N1bWVudC5vbm1vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgbGV0IG1vdXNlVXBZID0gZS5jbGllbnRZO1xyXG4gICAgbGV0IG1vdXNlVXBUaW1lOiBudW1iZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGxldCBzcGVlZEJvb3N0ID0gY2xhbXBWYWx1ZShcclxuICAgICAgICAwLFxyXG4gICAgICAgIChtb3VzZVVwWSAtIG1vdXNlRG93blkpIC8gKG1vdXNlVXBUaW1lIC0gbW91c2VEb3duVGltZSksXHJcbiAgICAgICAgMTAsXHJcbiAgICApO1xyXG4gICAgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzID0gbW91c2VVcFRpbWU7XHJcbiAgICBsYXN0U3BlZWRCb29zdFNwZWVkID0gTWF0aC5tYXgobWluaW11bVNwZWVkLCBzcGVlZEJvb3N0ICogMC4wMDMpO1xyXG4gICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkID0gTWF0aC5tYXgobWluaW11bVJvdGF0aW9uU3BlZWQsIHNwZWVkQm9vc3QgKiAwLjAwNSk7XHJcbiAgICBsYXN0U3BlZWRCb29zdEd1eVJhZGl1cyA9IG1hcExpbmVhcigwLCBzcGVlZEJvb3N0LCAxMCwgbWluR3V5UmFkaXVzLCBtYXhHdXlSYWRpdXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3KGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIpIHtcclxuICAgIGlmIChwcmV2aW91c1RpbWVNaWxsaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByZXZpb3VzVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGVsYXBzZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXMgLSBwcmV2aW91c1RpbWVNaWxsaXM7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgbGV0IG1vdmVYOiBudW1iZXIgPSAoa2V5U3RhdGVzLmdldChcIkFcIikgPT09IEtleVN0YXRlLkRPV04gPyAtMSA6IDApXHJcbiAgICAgICAgKyAoa2V5U3RhdGVzLmdldChcIkRcIikgPT09IEtleVN0YXRlLkRPV04gPyAxIDogMCk7XHJcbiAgICBsZXQgbW92ZVk6IG51bWJlciA9IChrZXlTdGF0ZXMuZ2V0KFwiV1wiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IC0xIDogMClcclxuICAgICAgICArIChrZXlTdGF0ZXMuZ2V0KFwiU1wiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IDEgOiAwKTtcclxuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQobW92ZVggKiBtb3ZlWCArIG1vdmVZICogbW92ZVkpO1xyXG4gICAgaWYgKG1hZ25pdHVkZSA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IG1vdmVYIC8gbWFnbml0dWRlICogY3VycmVudFNwZWVkO1xyXG4gICAgICAgIG1vdmVZID0gbW92ZVkgLyBtYWduaXR1ZGUgKiBjdXJyZW50U3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGhpdFg6IG51bWJlciA9IDA7XHJcbiAgICBsZXQgaGl0WTogbnVtYmVyID0gMDtcclxuICAgIGlmIChndXlMYXN0SGl0VGltZU1pbGxpcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaGl0WCA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgZ3V5TGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyArIGd1eUhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Q29sdW1uLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaGl0WSA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgZ3V5TGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyArIGd1eUhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Um93LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGd1eVZlbG9jaXR5Q29sdW1uID0gbW92ZVggKyBoaXRYO1xyXG4gICAgZ3V5VmVsb2NpdHlSb3cgPSBtb3ZlWSArIGhpdFk7XHJcblxyXG4gICAgY2VudGVyQ29sdW1uICs9IGd1eVZlbG9jaXR5Q29sdW1uICogZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICBjZW50ZXJSb3cgKz0gZ3V5VmVsb2NpdHlSb3cgKiBlbGFwc2VkVGltZU1pbGxpcztcclxuXHJcbiAgICBjdXJyZW50Um90YXRpb24gKz0gZWxhcHNlZFRpbWVNaWxsaXMgKiBjdXJyZW50Um90YXRpb25TcGVlZDtcclxuXHJcbiAgICBpZiAobGFzdFNwZWVkQm9vc3RTcGVlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY3VycmVudFNwZWVkID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAtIGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGxhc3RTcGVlZEJvb3N0U3BlZWQsXHJcbiAgICAgICAgICAgIG1pbmltdW1TcGVlZCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJlbnRSb3RhdGlvblNwZWVkID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAtIGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGxhc3RTcGVlZEJvb3N0Um90YXRpb25TcGVlZCxcclxuICAgICAgICAgICAgbWluaW11bVJvdGF0aW9uU3BlZWQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJyZW50R3V5UmFkaXVzID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAtIGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgc3BlZWREZWdyZWRhdGlvblRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBtaW5HdXlSYWRpdXMsXHJcbiAgICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3VycmVudFNwZWVkID0gbWluaW11bVNwZWVkO1xyXG4gICAgICAgIGN1cnJlbnRSb3RhdGlvblNwZWVkID0gbWluaW11bVJvdGF0aW9uU3BlZWQ7XHJcbiAgICAgICAgY3VycmVudEd1eVJhZGl1cyA9IG1pbkd1eVJhZGl1cztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdG9wTGVmdENvbHVtbjogbnVtYmVyID0gY2VudGVyQ29sdW1uIC0gKGNhbnZhcy53aWR0aCAvIDIpIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCB0b3BMZWZ0Um93OiBudW1iZXIgPSBjZW50ZXJSb3cgLSAoY2FudmFzLmhlaWdodCAvIDIpIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBndXlDZW50ZXJYID0gY29sdW1uVG9YKGNlbnRlckNvbHVtbiwgdG9wTGVmdENvbHVtbiwgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICBsZXQgZ3V5Q2VudGVyWSA9IHJvd1RvWShjZW50ZXJSb3csIHRvcExlZnRSb3csIGVudmlyb25tZW50VGlsZVNpemUpO1xyXG4gICAgXHJcbiAgICBsZXQgZW52aXJvbm1lbnREcmF3Q291bnQgPSBkcmF3RW52aXJvbm1lbnQodG9wTGVmdENvbHVtbiwgdG9wTGVmdFJvdyk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGFsbCBlbmVteSB4J3MgYW5kIHkncyBhbmQgbW92ZSB2ZWxvY2l0aWVzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlbmVtaWVzW2ldLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBhbGwgbWlzc2lsZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWlzc2lsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBtaXNzaWxlc1tpXS51cGRhdGUoY2VudGVyQ29sdW1uLCBjZW50ZXJSb3csIGVudmlyb25tZW50VGlsZVNpemUsIGN1cnJlbnRUaW1lTWlsbGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgYWxsIHRoZSBmbG9hdGluZyB0ZXh0c1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbG9hdGluZ1RleHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZmxvYXRpbmdUZXh0c1tpXS51cGRhdGUoY2VudGVyQ29sdW1uLCBjZW50ZXJSb3csIGVudmlyb25tZW50VGlsZVNpemUsIGN1cnJlbnRUaW1lTWlsbGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkbyBlbmVteS1ndXkgY29sbGlzaW9uIGFuZCBnYW1lIHNpbXVsYXRpb24gc3R1ZmZcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBlbmVteTogRW5lbXkgPSBlbmVtaWVzW2ldO1xyXG4gICAgICAgIGlmIChjb2xsaWRlQ2lyY2xlcyhcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIGN1cnJlbnRHdXlSYWRpdXMsXHJcbiAgICAgICAgICAgIGVuZW15LngsXHJcbiAgICAgICAgICAgIGVuZW15LnksXHJcbiAgICAgICAgICAgIGVuZW15LnJhZGl1cylcclxuICAgICAgICAgICAgJiYgKFxyXG4gICAgICAgICAgICAgICAgZW5lbXkubGFzdEhpdFRpbWVNaWxsaXMgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgfHwgKGN1cnJlbnRUaW1lTWlsbGlzIC0gZW5lbXkubGFzdEhpdFRpbWVNaWxsaXMpID4gZW5lbXkuaGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpc1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgICYmICFpc0dhbWVPdmVyXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBlbmVteU1hc3M6IG51bWJlciA9IGVuZW15LnJhZGl1cztcclxuICAgICAgICAgICAgbGV0IGd1eU1hc3M6IG51bWJlciA9IGN1cnJlbnRHdXlSYWRpdXM7XHJcbiAgICAgICAgICAgIGxldCBndXlDZW50ZXI6IFZlY3RvciA9IG5ldyBWZWN0b3IoZ3V5Q2VudGVyWCwgZ3V5Q2VudGVyWSk7XHJcbiAgICAgICAgICAgIGxldCBlbmVteUNlbnRlcjogVmVjdG9yID0gbmV3IFZlY3RvcihlbmVteS54LCBlbmVteS55KTtcclxuICAgICAgICAgICAgbGV0IGd1eVZlbG9jaXR5OiBWZWN0b3IgPSBuZXcgVmVjdG9yKGd1eVZlbG9jaXR5Q29sdW1uLCBndXlWZWxvY2l0eVJvdylcclxuICAgICAgICAgICAgICAgIC5wbHVzKGVuZW15Q2VudGVyLm1pbnVzKGd1eUNlbnRlcikubm9ybWFsaXplKCkuc2NhbGUoMC4wMSkpO1xyXG4gICAgICAgICAgICBsZXQgZW5lbXlWZWxvY2l0eTogVmVjdG9yID0gbmV3IFZlY3RvcihlbmVteS5oaXRWZWxvY2l0eUNvbHVtbiwgZW5lbXkuaGl0VmVsb2NpdHlSb3cpO1xyXG4gICAgICAgICAgICBsZXQgZ3V5SGl0VmVsb2NpdHk6IFZlY3RvciA9IGdldENvbGxpc2lvblZlbG9jaXR5KFxyXG4gICAgICAgICAgICAgICAgZ3V5Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlDZW50ZXIsXHJcbiAgICAgICAgICAgICAgICBndXlNYXNzLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlNYXNzLFxyXG4gICAgICAgICAgICAgICAgZ3V5VmVsb2NpdHksXHJcbiAgICAgICAgICAgICAgICBlbmVteVZlbG9jaXR5LFxyXG4gICAgICAgICAgICApLnNjYWxlKDAuMik7XHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Q29sdW1uID0gZ3V5SGl0VmVsb2NpdHkueDtcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlSb3cgPSBndXlIaXRWZWxvY2l0eS55O1xyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGVuZW15SGl0VmVsb2NpdHk6IFZlY3RvciA9IGdldENvbGxpc2lvblZlbG9jaXR5KFxyXG4gICAgICAgICAgICAgICAgZW5lbXlDZW50ZXIsXHJcbiAgICAgICAgICAgICAgICBndXlDZW50ZXIsXHJcbiAgICAgICAgICAgICAgICBlbmVteU1hc3MsXHJcbiAgICAgICAgICAgICAgICBndXlNYXNzLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgICAgIGd1eVZlbG9jaXR5LFxyXG4gICAgICAgICAgICApLnNjYWxlKDAuMyk7XHJcbiAgICAgICAgICAgIGVuZW15Lmxhc3RIaXRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgICAgIGVuZW15LmhpdFZlbG9jaXR5Q29sdW1uID0gZW5lbXlIaXRWZWxvY2l0eS54O1xyXG4gICAgICAgICAgICBlbmVteS5oaXRWZWxvY2l0eVJvdyA9IGVuZW15SGl0VmVsb2NpdHkueTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGRldGVybWluZSBkYW1hZ2UgZGVsdCB0byBlbmVteVxyXG4gICAgICAgICAgICBsZXQgZGFtYWdlTXVsdGlwbGllcjogbnVtYmVyID0gZ2V0RGFtYWdlTXVsdGlwbGllcihjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgRW52aXJvbm1lbnRLZXksIGVuZW15LmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBsZXQgZGFtYWdlRGVhbHQ6IG51bWJlciA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgIG1pbkd1eVJhZGl1cyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHdXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICBtYXhHdXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgKDEwICsgdHJhbnNmb3JtYXRpb25MZXZlbHNbY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIG51bWJlcl0ubGV2ZWwgLSAxKSAqIGRhbWFnZU11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGVuZW15LmN1cnJlbnRIZWFsdGggLT0gZGFtYWdlRGVhbHQ7XHJcblxyXG4gICAgICAgICAgICAvLyBhd2FyZCB4cCBpZiBlbmVteSB3YXMga2lsbGVkXHJcbiAgICAgICAgICAgIGlmIChlbmVteS5jdXJyZW50SGVhbHRoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBleHBHYWluOiBudW1iZXIgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICAgICAgbWluRW5lbXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5lbXkucmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heEVuZW15UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgICAgIDUwLFxyXG4gICAgICAgICAgICAgICAgICAgIDQwMCxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRyYW5zZm9ybWF0aW9uICE9PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtYXRpb25MZXZlbHNbY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIG51bWJlcl0uZXhwICs9IGV4cEdhaW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbkxldmVsc1tFbnZpcm9ubWVudEtleS5ERUZBVUxUIGFzIG51bWJlcl0uZXhwICs9IGV4cEdhaW4gKiAwLjM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNwYXduIGZsb2F0aW5nIHRleHRcclxuICAgICAgICAgICAgZmxvYXRpbmdUZXh0cy5wdXNoKG5ldyBGbG9hdGluZ1RleHQoXHJcbiAgICAgICAgICAgICAgICBlbmVteS5yb3csXHJcbiAgICAgICAgICAgICAgICBlbmVteS5jb2x1bW4sXHJcbiAgICAgICAgICAgICAgICBcIi1cIiArIChNYXRoLnJvdW5kKGRhbWFnZURlYWx0ICogMTApIC8gMTApLnRvRml4ZWQoMSlcclxuICAgICAgICAgICAgICAgICAgICArIChkYW1hZ2VNdWx0aXBsaWVyID09PSAzID8gXCIgQ1JJVElDQUxcIiA6IFwiXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJibGFja1wiLFxyXG4gICAgICAgICAgICAgICAgMjAsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvIG1pc3NpbGUtZ3V5IGNvbGxpc2lvblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBtaXNzaWxlOiBNaXNzaWxlID0gbWlzc2lsZXNbaV07XHJcbiAgICAgICAgaWYgKGNvbGxpZGVDaXJjbGVzKFxyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgbWluR3V5UmFkaXVzLCAvLyBEZWxpYmVyYXRlbHkgdXNlIG1pbiBndXkgcmFkaXVzIGhlcmVcclxuICAgICAgICAgICAgbWlzc2lsZS54LFxyXG4gICAgICAgICAgICBtaXNzaWxlLnksXHJcbiAgICAgICAgICAgIG1pc3NpbGUucmFkaXVzKVxyXG4gICAgICAgICAgICAmJiAhaXNHYW1lT3ZlclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgZGFtYWdlTXVsdGlwbGllcjogbnVtYmVyID0gZ2V0RGFtYWdlTXVsdGlwbGllcihtaXNzaWxlLmVsZW1lbnQsIGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSk7XHJcbiAgICAgICAgICAgIGxldCBkYW1hZ2VEZWFsdDogbnVtYmVyID0gZGFtYWdlTXVsdGlwbGllciAqIDEwXHJcbiAgICAgICAgICAgIGd1eUN1cnJlbnRIZWFsdGggLT0gZGFtYWdlRGVhbHQ7XHJcbiAgICAgICAgICAgIGd1eUxhc3REYW1hZ2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBtaXNzaWxlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGktLTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNwYXduIGZsb2F0aW5nIHRleHRcclxuICAgICAgICAgICAgZmxvYXRpbmdUZXh0cy5wdXNoKG5ldyBGbG9hdGluZ1RleHQoXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJSb3csXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICBcIi1cIiArIChNYXRoLnJvdW5kKGRhbWFnZURlYWx0ICogMTApIC8gMTApLnRvRml4ZWQoMSlcclxuICAgICAgICAgICAgICAgICAgICArIChkYW1hZ2VNdWx0aXBsaWVyID09PSAzID8gXCIgQ1JJVElDQUxcIiA6IFwiXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJyZWRcIixcclxuICAgICAgICAgICAgICAgIDIwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZW1vdmUgZGVhZCBlbmVtaWVzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZW5lbWllc1tpXS5jdXJyZW50SGVhbHRoIDw9IDApIHtcclxuICAgICAgICAgICAgZW5lbWllcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGV0ZWN0IHRoZSBlbmQgb2YgYSB3YXZlXHJcbiAgICBpZiAoZW5lbWllcy5sZW5ndGggPT09IDAgJiYgIWlzSW5SZXN0VGltZSkge1xyXG4gICAgICAgIHByZXZpb3VzV2F2ZUVuZFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICBpc0luUmVzdFRpbWUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSBvbGQgbWlzc2lsZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWlzc2lsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgbWlzc2lsZTogTWlzc2lsZSA9IG1pc3NpbGVzW2ldO1xyXG4gICAgICAgIGlmIChjdXJyZW50VGltZU1pbGxpcyAtIG1pc3NpbGUuY3JlYXRpb25UaW1lTWlsbGlzID4gbWlzc2lsZS5saWZldGltZU1pbGxpcykge1xyXG4gICAgICAgICAgICBtaXNzaWxlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIG9sZCBmbG9hdGluZyB0ZXh0c1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbG9hdGluZ1RleHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGZsb2F0aW5nVGV4dDogRmxvYXRpbmdUZXh0ID0gZmxvYXRpbmdUZXh0c1tpXTtcclxuICAgICAgICBpZiAoY3VycmVudFRpbWVNaWxsaXMgLSBmbG9hdGluZ1RleHQuY3JlYXRpb25UaW1lTWlsbGlzID4gZmxvYXRpbmdUZXh0LmxpZmV0aW1lTWlsbGlzKSB7XHJcbiAgICAgICAgICAgIGZsb2F0aW5nVGV4dHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBpLS07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgYWxsIGVuZW1pZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0uZHJhdyhjdXJyZW50VGltZU1pbGxpcywgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGFsbCBtaXNzaWxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG1pc3NpbGVzW2ldLmRyYXcoY3VycmVudFRpbWVNaWxsaXMsIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBhbGwgZmxvYXRpbmcgdGV4dHNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmxvYXRpbmdUZXh0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZsb2F0aW5nVGV4dHNbaV0uZHJhdyhjdXJyZW50VGltZU1pbGxpcywgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlbmVtaWVzIGNhbiBtYXliZSBzcGF3biBtaXNzaWxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGVuZW15ID0gZW5lbWllc1tpXTtcclxuICAgICAgICBpZiAoY3VycmVudFRpbWVNaWxsaXMgLSBlbmVteS5sYXN0TWlzc2lsZVNwYXduQXR0ZW1wdE1pbGxpcyA+IDEwMDApIHtcclxuICAgICAgICAgICAgbGV0IHNwYXduQ2hhbmNlID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCBlbmVteS5yYWRpdXMsIG1heEVuZW15UmFkaXVzLCAwLjIsIDEpO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8PSBzcGF3bkNoYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1vdmVTcGVlZCA9IG1hcExpbmVhcihtaW5FbmVteVJhZGl1cywgZW5lbXkucmFkaXVzLCBtYXhFbmVteVJhZGl1cywgMC4wMDAzLCAwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHVyblNwZWVkID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCBlbmVteS5yYWRpdXMsIG1heEVuZW15UmFkaXVzLCAwLjAwMSwgMC4wMDAxKTtcclxuICAgICAgICAgICAgICAgIGxldCBsaWZlVGltZU1pbGxpcyA9IG1hcExpbmVhcihtaW5FbmVteVJhZGl1cywgZW5lbXkucmFkaXVzLCBtYXhFbmVteVJhZGl1cywgMzAwMCwgODAwMCk7XHJcbiAgICAgICAgICAgICAgICBtaXNzaWxlcy5wdXNoKG5ldyBNaXNzaWxlKGVuZW15LnJvdywgZW5lbXkuY29sdW1uLCAzLCBlbmVteS5lbGVtZW50LCBtb3ZlU3BlZWQsIHR1cm5TcGVlZCwgbGlmZVRpbWVNaWxsaXMsIGN1cnJlbnRUaW1lTWlsbGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW5lbXkubGFzdE1pc3NpbGVTcGF3bkF0dGVtcHRNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGVudmlyb25tZW50IHRpbWVyc1xyXG4gICAgbGV0IGN1cnJlbnRFbnZpcm9ubWVudDogRW52aXJvbm1lbnRLZXkgPSBnZXRDdXJyZW50RW52aXJvbm1lbnQoY2VudGVyQ29sdW1uLCBjZW50ZXJSb3cpO1xyXG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRFbnZpcm9ubWVudCAhPT0gKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRUaW1lciA9IGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF07XHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSArPSBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA+IGN1cnJlbnRUaW1lci5tYXhUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZXIuY3VycmVudFRpbWUgPSBjdXJyZW50VGltZXIubWF4VGltZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRUaW1lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKChpIGFzIEVudmlyb25tZW50S2V5KSAhPT0gY3VycmVudEVudmlyb25tZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbWVyID0gZW52aXJvbm1lbnRUaW1lcnNbaV07XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZXIuY3VycmVudFRpbWUgLT0gZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdHJpZ2dlciB0cmFuc2Zvcm1hdGlvblxyXG4gICAgaWYgKGN1cnJlbnRFbnZpcm9ubWVudCAhPT0gKGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiBhcyBFbnZpcm9ubWVudEtleSlcclxuICAgICAgICAmJiBlbnZpcm9ubWVudFRpbWVyc1tjdXJyZW50RW52aXJvbm1lbnRdLmN1cnJlbnRUaW1lID09PSBlbnZpcm9ubWVudFRpbWVyc1tjdXJyZW50RW52aXJvbm1lbnRdLm1heFRpbWVcclxuICAgICAgICAmJiAhaXNHYW1lT3ZlclxyXG4gICAgKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFRpbWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBlbnZpcm9ubWVudFRpbWVyc1tpXS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiA9IGN1cnJlbnRFbnZpcm9ubWVudCBhcyBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIHRyYW5zZm9ybWF0aW9uIGxldmVsc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1hdGlvbkxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm1hdGlvbiA9IHRyYW5zZm9ybWF0aW9uTGV2ZWxzW2ldO1xyXG4gICAgICAgIGlmICh0cmFuc2Zvcm1hdGlvbi5leHAgPj0gdHJhbnNmb3JtYXRpb24udG9OZXh0TGV2ZWwpIHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtYXRpb24uZXhwIC09IHRyYW5zZm9ybWF0aW9uLnRvTmV4dExldmVsO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbi5sZXZlbCsrO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbi50b05leHRMZXZlbCAqPSAxLjE7XHJcblxyXG4gICAgICAgICAgICBpZiAoaSBhcyBFbnZpcm9ubWVudEtleSA9PT0gRW52aXJvbm1lbnRLZXkuREVGQVVMVCkge1xyXG4gICAgICAgICAgICAgICAgZ3V5TWF4SGVhbHRoICs9IDIwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChndXlDdXJyZW50SGVhbHRoIDw9IDApIHtcclxuICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICBnYW1lT3ZlclRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gZHJhdyBlbnZpcm9ubWVudCBkcmF3IGNvdW50XHJcbiAgICBpZiAoZmFsc2UpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoZW52aXJvbm1lbnREcmF3Q291bnQudG9TdHJpbmcoKSwgY2FudmFzLndpZHRoIC8gMiAtIDEwLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgdGhlIGd1eVxyXG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKGd1eUNlbnRlclgsIGd1eUNlbnRlclkpO1xyXG4gICAgICAgIGN0eC5yb3RhdGUoY3VycmVudFJvdGF0aW9uKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKC1ndXlDZW50ZXJYLCAtZ3V5Q2VudGVyWSk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShndXlTcHJpdGUsIGd1eUNlbnRlclggLSBndXlTcHJpdGUud2lkdGggLyAyLCBndXlDZW50ZXJZIC0gZ3V5U3ByaXRlLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29sb3IgdGhlIGd1eSdzIGhlYWRcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgbGV0IGd1eUNvbG9yUmF0aW86IG51bWJlciA9IDE7XHJcbiAgICAgICAgbGV0IGd1eURlZmF1bHRDb2xvcjogQ29sb3IgPSBnZXRUaW50ZWRDb2xvcihjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgRW52aXJvbm1lbnRLZXkpO1xyXG4gICAgICAgIGlmIChndXlMYXN0RGFtYWdlZFRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBndXlDb2xvclJhdGlvID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgZ3V5TGFzdERhbWFnZWRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBndXlMYXN0RGFtYWdlZFRpbWVNaWxsaXMgKyAxMDAwLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBndXlDb2xvcjogQ29sb3IgPSBDb2xvci5sZXJwQ29sb3JzKFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMjU1LCAwLCAwKSxcclxuICAgICAgICAgICAgZ3V5RGVmYXVsdENvbG9yLFxyXG4gICAgICAgICAgICBndXlDb2xvclJhdGlvLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGd1eUNvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmMoZ3V5Q2VudGVyWCwgZ3V5Q2VudGVyWSwgNiwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBndXkgc3dpcmx5IHRoaW5nXHJcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiZ3JheVwiO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICBndXlDZW50ZXJYLFxyXG4gICAgICAgICAgICBndXlDZW50ZXJZLFxyXG4gICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAvIDYwLFxyXG4gICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyAvIDYwICsgbWFwTGluZWFyKG1pbkd1eVJhZGl1cywgY3VycmVudEd1eVJhZGl1cywgbWF4R3V5UmFkaXVzLCAxLCAyKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgdGhlIGd1eSdzIGhlYWx0aCBiYXJcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIGxldCBndXlIZWFsdGhXaWR0aDogbnVtYmVyID0gZ3V5TWF4SGVhbHRoIC8gMjtcclxuICAgICAgICBsZXQgZ3V5SGVhbHRoSGVpZ2h0OiBudW1iZXIgPSA2O1xyXG4gICAgICAgIGxldCBndXlIZWFsdGhUb3BMZWZ0WDogbnVtYmVyID0gZ3V5Q2VudGVyWCAtIGd1eUhlYWx0aFdpZHRoIC8gMjtcclxuICAgICAgICBsZXQgZ3V5SGVhbHRoVG9wTGVmdFk6IG51bWJlciA9IGd1eUNlbnRlclkgLSBtYXhHdXlSYWRpdXMgLSBndXlIZWFsdGhIZWlnaHQgLyAyIC0gODtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoZ3V5SGVhbHRoVG9wTGVmdFgsIGd1eUhlYWx0aFRvcExlZnRZLCBndXlIZWFsdGhXaWR0aCAqIChndXlDdXJyZW50SGVhbHRoIC8gZ3V5TWF4SGVhbHRoKSwgZ3V5SGVhbHRoSGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdChndXlIZWFsdGhUb3BMZWZ0WCwgZ3V5SGVhbHRoVG9wTGVmdFksIGd1eUhlYWx0aFdpZHRoLCBndXlIZWFsdGhIZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0cmFuc2Zvcm0tdG8gYmFyXHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSBjdXJyZW50VHJhbnNmb3JtYXRpb24gJiYgIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICBsZXQgdGlsZUNlbnRlclg6IG51bWJlciA9IGd1eUNlbnRlclggKyA1MDtcclxuICAgICAgICBsZXQgdGlsZUNlbnRlclk6IG51bWJlciA9IGd1eUNlbnRlclkgLSA3MDtcclxuICAgICAgICBsZXQgdGlsZVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgZHJhd0Vudmlyb25tZW50VGlsZSh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCBjdXJyZW50RW52aXJvbm1lbnQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJncmF5XCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QodGlsZUNlbnRlclggLSB0aWxlU2l6ZSAvIDIsIHRpbGVDZW50ZXJZIC0gdGlsZVNpemUgLyAyLCB0aWxlU2l6ZSwgdGlsZVNpemUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gMTAwO1xyXG4gICAgICAgIGxldCBoZWlnaHQ6IG51bWJlciA9IDEwO1xyXG4gICAgICAgIGxldCB0b3BMZWZ0WDogbnVtYmVyID0gdGlsZUNlbnRlclggLSB0aWxlU2l6ZSAvIDIgLSB3aWR0aCAtIDEwO1xyXG4gICAgICAgIGxldCB0b3BMZWZ0WTogbnVtYmVyID0gdGlsZUNlbnRlclkgLSBoZWlnaHQgLyAyO1xyXG4gICAgICAgIGxldCBjdXJyZW50RW52aXJvbm1lbnRUaW1lcjoge2N1cnJlbnRUaW1lOiBudW1iZXIsIG1heFRpbWU6IG51bWJlcn0gPSBlbnZpcm9ubWVudFRpbWVyc1tjdXJyZW50RW52aXJvbm1lbnRdO1xyXG4gICAgICAgIGxldCBmaWxsUmF0aW86IG51bWJlciA9IChjdXJyZW50RW52aXJvbm1lbnRUaW1lci5jdXJyZW50VGltZSAvIGN1cnJlbnRFbnZpcm9ubWVudFRpbWVyLm1heFRpbWUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImdyYXlcIjtcclxuICAgICAgICBjdHguZmlsbFJlY3QodG9wTGVmdFgsIHRvcExlZnRZLCB3aWR0aCAqIGZpbGxSYXRpbywgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgVUkgYmFja2dyb3VuZFxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCA0MCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIC8vIGRyYXcgdGhlIHdhdmUgbnVtYmVyXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xyXG4gICAgY3R4LmZvbnQgPSBcIjIwcHggQXJpYWxcIjtcclxuICAgIGN0eC5maWxsVGV4dChcIldhdmUgXCIgKyAoY3VycmVudFdhdmUgKyAxKSwgMywgMCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIC8vIGRyYXcgdGhlIGN1cnJlbnQgbnVtYmVyIG9mIGVuZW1pZXMgYWxpdmVcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KGVuZW1pZXMubGVuZ3RoICsgXCIgRW5lbWllcyBMZWZ0XCIsIDEwMCwgMCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIC8vIGRyYXcgdGhlIHdhdmUgcmVzdCB0aW1lciBhbmQvb3IgdHJpZ2dlciB0aGUgbmV4dCB3YXZlXHJcbiAgICBpZiAoZW5lbWllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBsZXQgcmVzdFRpbWVSZW1haW5pbmdNaWxsaXMgPSB3YXZlUmVzdFRpbWVNaWxsaXMgLSAoY3VycmVudFRpbWVNaWxsaXMgLSBwcmV2aW91c1dhdmVFbmRUaW1lTWlsbGlzKTtcclxuICAgICAgICBndXlDdXJyZW50SGVhbHRoID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgIGd1eU1heEhlYWx0aCxcclxuICAgICAgICAgICAgZ3V5Q3VycmVudEhlYWx0aCArIGVsYXBzZWRUaW1lTWlsbGlzIC8gd2F2ZVJlc3RUaW1lTWlsbGlzICogZ3V5TWF4SGVhbHRoLFxyXG4gICAgICAgIClcclxuICAgICAgICBpZiAocmVzdFRpbWVSZW1haW5pbmdNaWxsaXMgPD0gMCAmJiAhaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICBjdXJyZW50V2F2ZSsrO1xyXG4gICAgICAgICAgICBzcGF3bkVuZW1pZXMoY3VycmVudFdhdmUpO1xyXG4gICAgICAgICAgICBpc0luUmVzdFRpbWUgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IFwiMjBweCBBcmlhbFwiO1xyXG4gICAgICAgICAgICBsZXQgdGVudGhzOiBudW1iZXIgPSBNYXRoLnJvdW5kKHJlc3RUaW1lUmVtYWluaW5nTWlsbGlzIC8gMTAwKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KFxyXG4gICAgICAgICAgICAgICAgKHRlbnRocyAvIDEwKS50b0ZpeGVkKDEpICsgXCJzIFVudGlsIE5leHQgV2F2ZVwiLFxyXG4gICAgICAgICAgICAgICAgMyxcclxuICAgICAgICAgICAgICAgIDIwLFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgdHJhbmZvcm1hdGlvbiBleHAgYmFycyBhbmQgbGV2ZWxzXHJcbiAgICBkcmF3VHJhbnNmb3JtYXRpb25FeHBCYXIoY2FudmFzLndpZHRoIC0gMjAwLCAzLCAwKTtcclxuICAgIGRyYXdUcmFuc2Zvcm1hdGlvbkV4cEJhcihjYW52YXMud2lkdGggLSAyMDAsIDIzLCAxKTtcclxuICAgIGRyYXdUcmFuc2Zvcm1hdGlvbkV4cEJhcihjYW52YXMud2lkdGgsIDMsIDIpO1xyXG4gICAgZHJhd1RyYW5zZm9ybWF0aW9uRXhwQmFyKGNhbnZhcy53aWR0aCwgMjMsIDMpO1xyXG5cclxuICAgIC8vIGRyYXcgZ2FtZSBvdmVyIHRleHRcclxuICAgIGlmIChpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgbGV0IHRpbWVTaW5jZUdhbWVPdmVyTWlsbGlzOiBudW1iZXIgPSBjdXJyZW50VGltZU1pbGxpcyAtIGdhbWVPdmVyVGltZU1pbGxpcztcclxuICAgICAgICBsZXQgdGV4dE9wYWNpdHkgPSBtYXBMaW5lYXIoMCwgdGltZVNpbmNlR2FtZU92ZXJNaWxsaXMsIDIwMDAsIDAsIDEpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGV4dE9wYWNpdHk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjQwcHggQXJpYWxcIlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsIGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRleHRPcGFjaXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGZwc1xyXG4gICAgaWYgKGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGZwczogbnVtYmVyID0gMTAwMCAvIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xyXG4gICAgICAgIGN0eC5mb250ID0gXCIzMHB4IEFyaWFsXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KE1hdGgucm91bmQoZnBzKS50b1N0cmluZygpICsgXCJGUFNcIiwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcmV2aW91c1RpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVNvdXJjZTogc3RyaW5nKTogSFRNTEltYWdlRWxlbWVudCB7XHJcbiAgICBpZiAocHJlbG9hZFJlZ2lzdHJ5LmhhcyhpbWFnZVNvdXJjZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgYXR0ZW1wdGVkIHRvIGxvYWQgdGhlIHNhbWUgaW1hZ2UgdHdpY2UgZHVyaW5nIHByZWxvYWRpbmcuXCIpO1xyXG4gICAgfVxyXG4gICAgcHJlbG9hZFJlZ2lzdHJ5LnNldChpbWFnZVNvdXJjZSwgZmFsc2UpO1xyXG5cclxuICAgIC8vIFRoZSBvcmRlciB0aGVzZSAzIHRoaW5ncyBhcmUgZG9uZSBpbiBpcyBWRVJZIGltcG9ydGFudCFcclxuICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIHByZWxvYWRSZWdpc3RyeS5zZXQoaW1hZ2VTb3VyY2UsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2Uuc3JjID0gaW1hZ2VTb3VyY2U7XHJcblxyXG4gICAgcmV0dXJuIGltYWdlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVsb2FkKCkge1xyXG4gICAgZm9yIChsZXQgW2tleSwgbG9hZGVkXSBvZiBwcmVsb2FkUmVnaXN0cnkpIHtcclxuICAgICAgICBpZiAoIWxvYWRlZCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChwcmVsb2FkLCAwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwYXduRW5lbWllcyhjdXJyZW50V2F2ZTogbnVtYmVyKSB7XHJcbiAgICBsZXQgY3VycmVudFRpbWVNaWxsaXM6IG51bWJlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgbGV0IHdhdmU6IG51bWJlcltdID0gd2F2ZXNbY3VycmVudFdhdmVdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3YXZlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJhZGl1czogbnVtYmVyID0gd2F2ZVtpXTtcclxuICAgICAgICBsZXQgaGVhbHRoOiBudW1iZXIgPSBtYXBMaW5lYXIobWluRW5lbXlSYWRpdXMsIHJhZGl1cywgbWF4RW5lbXlSYWRpdXMsIDUwLCAyMDApO1xyXG4gICAgICAgIGxldCBzcGVlZDogbnVtYmVyID0gbWFwTGluZWFyKG1pbkVuZW15UmFkaXVzLCByYWRpdXMsIG1heEVuZW15UmFkaXVzLCAwLjAwMSwgMC4wMDA1KTtcclxuICAgICAgICBlbmVtaWVzLnB1c2gobmV3IEVuZW15KFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogZW52aXJvbm1lbnRDb2x1bW5zLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogZW52aXJvbm1lbnRSb3dzLFxyXG4gICAgICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgICAgIGhlYWx0aCxcclxuICAgICAgICAgICAgcmFuZG9tSW50KDAsIDMpIGFzIEVudmlyb25tZW50S2V5LFxyXG4gICAgICAgICAgICBzcGVlZCxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdFbnZpcm9ubWVudCh0b3BMZWZ0Q29sdW1uOiBudW1iZXIsIHRvcExlZnRSb3c6IG51bWJlcikge1xyXG4gICAgbGV0IGJvdHRvbVJpZ2h0Q29sdW1uOiBudW1iZXIgPSB0b3BMZWZ0Q29sdW1uICsgY2FudmFzLndpZHRoIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBib3R0b21SaWdodFJvdzogbnVtYmVyID0gdG9wTGVmdFJvdyArIGNhbnZhcy5oZWlnaHQgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IG1pbkNvbHVtbjogbnVtYmVyID0gTWF0aC5mbG9vcih0b3BMZWZ0Q29sdW1uKTtcclxuICAgIGxldCBtYXhDb2x1bW46IG51bWJlciA9IE1hdGguY2VpbChib3R0b21SaWdodENvbHVtbik7XHJcbiAgICBsZXQgbWluUm93OiBudW1iZXIgPSBNYXRoLmZsb29yKHRvcExlZnRSb3cpO1xyXG4gICAgbGV0IG1heFJvdzogbnVtYmVyID0gTWF0aC5jZWlsKGJvdHRvbVJpZ2h0Um93KTtcclxuICAgIGxldCBlbnZpcm9ubWVudERyYXdDb3VudDogbnVtYmVyID0gMDtcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBmb3IgKGxldCBpID0gbWluUm93OyBpIDw9IG1heFJvdzsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IG1pbkNvbHVtbjsgaiA8PSBtYXhDb2x1bW47IGorKykge1xyXG4gICAgICAgICAgICBsZXQgd3JhcHBlZFJvdzogbnVtYmVyID0gd3JhcFZhbHVlKDAsIGksIGVudmlyb25tZW50Um93cyAtIDEpO1xyXG4gICAgICAgICAgICBsZXQgd3JhcHBlZENvbHVtbjogbnVtYmVyID0gd3JhcFZhbHVlKDAsIGosIGVudmlyb25tZW50Q29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBsZXQga2V5OiBFbnZpcm9ubWVudEtleSA9IGVudmlyb25tZW50W3dyYXBwZWRSb3ddW3dyYXBwZWRDb2x1bW5dO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGNvbHVtblRvWChqLCB0b3BMZWZ0Q29sdW1uLCBlbnZpcm9ubWVudFRpbGVTaXplKTtcclxuICAgICAgICAgICAgbGV0IHkgPSByb3dUb1koaSwgdG9wTGVmdFJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIGRyYXdFbnZpcm9ubWVudFRpbGUoTWF0aC5mbG9vcih4KSwgTWF0aC5mbG9vcih5KSwgZW52aXJvbm1lbnRUaWxlU2l6ZSwga2V5KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIC8vIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICAvLyBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICAgICAgLy8gY3R4LmZpbGxUZXh0KFwiKFwiICsgd3JhcHBlZFJvdyArIFwiLFwiICsgd3JhcHBlZENvbHVtbiArIFwiKVwiLCB4LCB5KTtcclxuICAgICAgICAgICAgLy8gZW52aXJvbm1lbnREcmF3Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgcmV0dXJuIGVudmlyb25tZW50RHJhd0NvdW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RW52aXJvbm1lbnRUaWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXplOiBudW1iZXIsIGtleTogRW52aXJvbm1lbnRLZXkpIHtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBnZXRFbnZpcm9ubWVudENvbG9yKGtleSkudG9TdHJpbmcoKTtcclxuICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzaXplLCBzaXplKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudEVudmlyb25tZW50KGNlbnRlckNvbHVtbjogbnVtYmVyLCBjZW50ZXJSb3c6IG51bWJlcik6IEVudmlyb25tZW50S2V5IHtcclxuICAgIGxldCB3cmFwcGVkUm93OiBudW1iZXIgPSB3cmFwVmFsdWUoMCwgTWF0aC5mbG9vcihjZW50ZXJSb3cpLCBlbnZpcm9ubWVudFJvd3MgLSAxKTtcclxuICAgIGxldCB3cmFwcGVkQ29sdW1uOiBudW1iZXIgPSB3cmFwVmFsdWUoMCwgTWF0aC5mbG9vcihjZW50ZXJDb2x1bW4pLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKTtcclxuICAgIHJldHVybiBlbnZpcm9ubWVudFt3cmFwcGVkUm93XVt3cmFwcGVkQ29sdW1uXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGFtYWdlTXVsdGlwbGllcihhdHRhY2tlcjogRW52aXJvbm1lbnRLZXksIGRlZmVuZGVyOiBFbnZpcm9ubWVudEtleSk6IG51bWJlciB7XHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQgfHwgZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5GT1JFU1QpIHtcclxuICAgICAgICBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuRk9SRVNUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuREVTRVJUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuRk9SRVNUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuV0FURVIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3VHJhbnNmb3JtYXRpb25FeHBCYXIoXHJcbiAgICB4OiBudW1iZXIsXHJcbiAgICB5OiBudW1iZXIsXHJcbiAgICBlbnZpcm9ubWVudDogRW52aXJvbm1lbnRLZXksXHJcbikge1xyXG4gICAgbGV0IHRpbGVTaXplOiBudW1iZXIgPSAxNTtcclxuICAgIGxldCB0aWxlQ2VudGVyWDogbnVtYmVyID0geCAtIHRpbGVTaXplIC8gMiAtIDEwO1xyXG4gICAgbGV0IHRpbGVDZW50ZXJZOiBudW1iZXIgPSB5ICsgdGlsZVNpemUgLyAyO1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGRyYXdFbnZpcm9ubWVudFRpbGUodGlsZUNlbnRlclggLSB0aWxlU2l6ZSAvIDIsIHRpbGVDZW50ZXJZIC0gdGlsZVNpemUgLyAyLCB0aWxlU2l6ZSwgZW52aXJvbm1lbnQpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJncmF5XCI7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMTtcclxuICAgIGN0eC5zdHJva2VSZWN0KHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyLCB0aWxlQ2VudGVyWSAtIHRpbGVTaXplIC8gMiwgdGlsZVNpemUsIHRpbGVTaXplKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgbGV0IHdpZHRoOiBudW1iZXIgPSAxMDA7XHJcbiAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSAxMDtcclxuICAgIGxldCB0b3BMZWZ0WDogbnVtYmVyID0gdGlsZUNlbnRlclggLSB0aWxlU2l6ZSAvIDIgLSB3aWR0aCAtIDEwO1xyXG4gICAgbGV0IHRvcExlZnRZOiBudW1iZXIgPSB0aWxlQ2VudGVyWSAtIGhlaWdodCAvIDI7XHJcbiAgICBsZXQgdHJhbnNmb3JtYXRpb246IHtleHA6IG51bWJlciwgdG9OZXh0TGV2ZWw6IG51bWJlciwgbGV2ZWw6IG51bWJlcn0gPSB0cmFuc2Zvcm1hdGlvbkxldmVsc1tlbnZpcm9ubWVudCBhcyBudW1iZXJdO1xyXG4gICAgbGV0IGZpbGxSYXRpbzogbnVtYmVyID0gKHRyYW5zZm9ybWF0aW9uLmV4cCAvIHRyYW5zZm9ybWF0aW9uLnRvTmV4dExldmVsKTtcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImdyYXlcIjtcclxuICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogZmlsbFJhdGlvLCBoZWlnaHQpO1xyXG4gICAgY3R4LnN0cm9rZVJlY3QodG9wTGVmdFgsIHRvcExlZnRZLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMTRweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KFwiTHYuIFwiICsgdHJhbnNmb3JtYXRpb24ubGV2ZWwsIHRpbGVDZW50ZXJYIC0gd2lkdGggLSB0aWxlU2l6ZSAtIDE1LCB0aWxlQ2VudGVyWSArIDEpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxud2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcblxyXG4iLCJleHBvcnQgZW51bSBLZXlTdGF0ZSB7XHJcbiAgICBVUCxcclxuICAgIERPV04sXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudENvbHVtbnMsIEVudmlyb25tZW50S2V5LCBlbnZpcm9ubWVudFJvd3MgfSBmcm9tIFwiLi9lbnZpcm9ubWVudFwiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBnZXREaXN0YW5jZSwgZ2V0VGludGVkQ29sb3IgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1pc3NpbGUge1xyXG4gICAgcHVibGljIHJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcmFkaXVzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbW92ZVZlbG9jaXR5Q29sdW1uOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbW92ZVZlbGljaXR5Um93OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdG90YWxWZWxvY2l0eUNvbHVtbjogbnVtYmVyO1xyXG4gICAgcHVibGljIHRvdGFsVmVsb2NpdHlSb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIGVsZW1lbnQ6IEVudmlyb25tZW50S2V5O1xyXG4gICAgcHVibGljIGRlZmF1bHRDb2xvcjogQ29sb3I7XHJcbiAgICBwdWJsaWMgbW92ZVNwZWVkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbGlmZXRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjcmVhdGlvblRpbWVNaWxsaXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0dXJuaW5nU3BlZWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbG9nQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcm93OiBudW1iZXIsXHJcbiAgICAgICAgY29sdW1uOiBudW1iZXIsXHJcbiAgICAgICAgcmFkaXVzOiBudW1iZXIsXHJcbiAgICAgICAgZWxlbWVudDogRW52aXJvbm1lbnRLZXksXHJcbiAgICAgICAgbW92ZVNwZWVkOiBudW1iZXIsXHJcbiAgICAgICAgdHVybmluZ1NwZWVkOiBudW1iZXIsXHJcbiAgICAgICAgbGlmZVRpbWVNaWxsaXM6IG51bWJlcixcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5yb3cgPSByb3c7XHJcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLm1vdmVTcGVlZCA9IG1vdmVTcGVlZDtcclxuICAgICAgICB0aGlzLnR1cm5pbmdTcGVlZCA9IHR1cm5pbmdTcGVlZDtcclxuICAgICAgICB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbiA9IDA7XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsaWNpdHlSb3cgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdENvbG9yID0gZ2V0VGludGVkQ29sb3IodGhpcy5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLmxpZmV0aW1lTWlsbGlzID0gbGlmZVRpbWVNaWxsaXM7XHJcbiAgICAgICAgdGhpcy5jcmVhdGlvblRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJDb2x1bW46IG51bWJlcixcclxuICAgICAgICB3cmFwcGVkQ2VudGVyUm93OiBudW1iZXIsXHJcbiAgICAgICAgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgZWxhcHNlZFRpbWVNaWxsaXMgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGVUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWxhcHNlZFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcyAtIHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRvdGFsVmVsb2NpdHlDb2x1bW4gPSB0aGlzLm1vdmVWZWxvY2l0eUNvbHVtbjtcclxuICAgICAgICB0aGlzLnRvdGFsVmVsb2NpdHlSb3cgPSB0aGlzLm1vdmVWZWxpY2l0eVJvdztcclxuXHJcbiAgICAgICAgdGhpcy5jb2x1bW4gKz0gdGhpcy50b3RhbFZlbG9jaXR5Q29sdW1uICogZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICAgICAgdGhpcy5yb3cgKz0gdGhpcy50b3RhbFZlbG9jaXR5Um93ICogZWxhcHNlZFRpbWVNaWxsaXM7XHJcblxyXG4gICAgICAgIGxldCBkeCA9IGdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJDb2x1bW4sIHRoaXMuY29sdW1uLCAwLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICAgICAgbGV0IGR5ID0gZ2V0RGlzdGFuY2Uod3JhcHBlZENlbnRlclJvdywgdGhpcy5yb3csIDAsIGVudmlyb25tZW50Um93cyAtIDEpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuXHJcbiAgICAgICAgbGV0IGlkZWFsTW92ZURpcmVjdGlvbjogVmVjdG9yID0gbmV3IFZlY3RvcigtZHgsIC1keSkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgbGV0IG1vdmVEaXJlY3Rpb246IFZlY3RvcjtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG1vdmVEaXJlY3Rpb24gPSBpZGVhbE1vdmVEaXJlY3Rpb247XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGlkZWFsQW5nbGU6IG51bWJlciA9IGlkZWFsTW92ZURpcmVjdGlvbi5kaXJlY3Rpb24oKTtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRBbmdsZTogbnVtYmVyID0gTWF0aC5hdGFuMih0aGlzLm1vdmVWZWxpY2l0eVJvdywgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4pO1xyXG4gICAgICAgICAgICBsZXQgZEFuZ2xlOiBudW1iZXIgPSAtZ2V0RGlzdGFuY2UoaWRlYWxBbmdsZSwgY3VycmVudEFuZ2xlLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIGxldCBhbmdsZVNpZ24gPSBkQW5nbGUgLyBNYXRoLnNxcnQoZEFuZ2xlICogZEFuZ2xlKTtcclxuICAgICAgICAgICAgaWYgKGRBbmdsZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYW5nbGVTaWduID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbWF4VHVyblNwZWVkOiBudW1iZXIgPSBNYXRoLm1pbihNYXRoLmFicyhkQW5nbGUpLCB0aGlzLnR1cm5pbmdTcGVlZCAqIGVsYXBzZWRUaW1lTWlsbGlzKTtcclxuICAgICAgICAgICAgbGV0IG5ld0FuZ2xlID0gY3VycmVudEFuZ2xlICsgbWF4VHVyblNwZWVkICogYW5nbGVTaWduO1xyXG4gICAgICAgICAgICBtb3ZlRGlyZWN0aW9uID0gbmV3IFZlY3RvcihNYXRoLmNvcyhuZXdBbmdsZSksIE1hdGguc2luKG5ld0FuZ2xlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbW92ZVZlbG9jaXR5OiBWZWN0b3I7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBtb3ZlVmVsb2NpdHkgPSBtb3ZlRGlyZWN0aW9uLnNjYWxlKHRoaXMubW92ZVNwZWVkICogZWxhcHNlZFRpbWVNaWxsaXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1vdmVWZWxvY2l0eSA9IG1vdmVEaXJlY3Rpb24uc2NhbGUoMC4wMDAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4gPSBtb3ZlVmVsb2NpdHkueDtcclxuICAgICAgICB0aGlzLm1vdmVWZWxpY2l0eVJvdyA9IG1vdmVWZWxvY2l0eS55O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy54ID0gY2FudmFzLndpZHRoIC8gMiArIGR4O1xyXG4gICAgICAgIHRoaXMueSA9IGNhbnZhcy5oZWlnaHQgLyAyICsgZHk7XHJcblxyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhcclxuICAgICAgICBjdXJyZW50VGltZU1pbGxpczogbnVtYmVyLFxyXG4gICAgICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IG1vdmVEaXJlY3Rpb246IFZlY3RvciA9IG5ldyBWZWN0b3IodGhpcy5tb3ZlVmVsb2NpdHlDb2x1bW4sIHRoaXMubW92ZVZlbGljaXR5Um93KVxyXG4gICAgICAgICAgICAubm9ybWFsaXplKClcclxuICAgICAgICAgICAgLnNjYWxlKDkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA4O1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgICAgICB0aGlzLnggLSBtb3ZlRGlyZWN0aW9uLngsXHJcbiAgICAgICAgICAgIHRoaXMueSAtIG1vdmVEaXJlY3Rpb24ueSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgICAgIHRoaXMueCArIG1vdmVEaXJlY3Rpb24ueCxcclxuICAgICAgICAgICAgdGhpcy55ICsgbW92ZURpcmVjdGlvbi55LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBtb3ZlRGlyZWN0aW9uID0gbW92ZURpcmVjdGlvbi5zY2FsZSgwLjkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5kZWZhdWx0Q29sb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gNDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICAgICAgdGhpcy54IC0gbW92ZURpcmVjdGlvbi54LFxyXG4gICAgICAgICAgICB0aGlzLnkgLSBtb3ZlRGlyZWN0aW9uLnksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgICAgICB0aGlzLnggKyBtb3ZlRGlyZWN0aW9uLngsXHJcbiAgICAgICAgICAgIHRoaXMueSArIG1vdmVEaXJlY3Rpb24ueSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XHJcbmltcG9ydCB7IEVudmlyb25tZW50S2V5IH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG4vLyBub3RlOiBhc3N1bWVzIGZyb21TdGFydCBpcyBsZXNzIHRoYW4gZnJvbUVuZCwgdG9TdGFydCBpcyBsZXNzIHRoYW4gdG9FbmRcclxuZXhwb3J0IGZ1bmN0aW9uIG1hcExpbmVhcihcclxuICAgIGZyb21TdGFydDogbnVtYmVyLFxyXG4gICAgZnJvbVZhbHVlOiBudW1iZXIsXHJcbiAgICBmcm9tRW5kOiBudW1iZXIsXHJcbiAgICB0b1N0YXJ0OiBudW1iZXIsXHJcbiAgICB0b0VuZDogbnVtYmVyXHJcbikge1xyXG4gICAgZnJvbVZhbHVlID0gY2xhbXBWYWx1ZShNYXRoLm1pbihmcm9tU3RhcnQsIGZyb21FbmQpLCBmcm9tVmFsdWUsIE1hdGgubWF4KGZyb21TdGFydCwgZnJvbUVuZCkpO1xyXG4gICAgbGV0IHJhdGlvOiBudW1iZXIgPSAoZnJvbVZhbHVlIC0gZnJvbVN0YXJ0KSAvIChmcm9tRW5kIC0gZnJvbVN0YXJ0KTtcclxuICAgIHJldHVybiB0b1N0YXJ0ICsgcmF0aW8gKiAodG9FbmQgLSB0b1N0YXJ0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wVmFsdWUobWluOiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4pIHtcclxuICAgICAgICByZXR1cm4gbWluO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlID4gbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1heDtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gdGFrZW4gZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL3JhbmRvbVxyXG4vLyBUaGUgbWF4aW11bSBpcyBpbmNsdXNpdmUgYW5kIHRoZSBtaW5pbXVtIGlzIGluY2x1c2l2ZVxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBWYWx1ZShtaW46IG51bWJlciwgdmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIGlmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkge1xyXG4gICAgICAgIHJldHVybiBtb2QodmFsdWUgLSBtaW4sIG1heCArIDEgLSBtaW4pICsgbWluO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG4vLyB0aGlzIG1vZHVsbyBoYW5kbGVzIG5lZ2F0aXZlcyBob3cgaXQncyBzdXBwb3NlZCB0b1xyXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NDY3NTM5L2phdmFzY3JpcHQtbW9kdWxvLWdpdmVzLWEtbmVnYXRpdmUtcmVzdWx0LWZvci1uZWdhdGl2ZS1udW1iZXJzXHJcbmZ1bmN0aW9uIG1vZChuOiBudW1iZXIsIG06IG51bWJlcikge1xyXG4gICAgcmV0dXJuICgobiAlIG0pICsgbSkgJSBtO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sdW1uVG9YKGNvbHVtbjogbnVtYmVyLCB0b3BMZWZ0Q29sdW1uOiBudW1iZXIsIGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChjb2x1bW4gLSB0b3BMZWZ0Q29sdW1uKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3dUb1kocm93OiBudW1iZXIsIHRvcExlZnRSb3c6IG51bWJlciwgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKHJvdyAtIHRvcExlZnRSb3cpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxpZGVDaXJjbGVzKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHIxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHIyOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBNYXRoLmFicyh4MSAtIHgyKSA8IHIxICsgcjJcclxuICAgICAgICAmJiBNYXRoLmFicyh5MSAtIHkyKSA8IHIxICsgcjI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xsaXNpb25WZWxvY2l0eShjMTogVmVjdG9yLCBjMjogVmVjdG9yLCBtMTogbnVtYmVyLCBtMjogbnVtYmVyLCB2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgIGxldCBjMU1pbnVzYzI6IFZlY3RvciA9IGMxLm1pbnVzKGMyKTtcclxuICAgIHJldHVybiBjMU1pbnVzYzJcclxuICAgICAgICAuc2NhbGUoXHJcbiAgICAgICAgICAgIC0yICogbTIgLyAobTEgKyBtMilcclxuICAgICAgICAgICAgKiBWZWN0b3IuaW5uZXJQcm9kdWN0KHYxLm1pbnVzKHYyKSwgYzFNaW51c2MyKVxyXG4gICAgICAgICAgICAvIGMxTWludXNjMi5ub3JtU3F1YXJlZCgpXHJcbiAgICAgICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudmlyb25tZW50Q29sb3Ioa2V5OiBFbnZpcm9ubWVudEtleSk6IENvbG9yIHtcclxuICAgIHN3aXRjaChrZXkpIHtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkRFRkFVTFQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMTAwLCAyNTUsIDEwMCk7XHJcbiAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5GT1JFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMjAwLCAwKTtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkRFU0VSVDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDI1NSwgNTApO1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuV0FURVI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMjU1KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbnRlZENvbG9yKGtleTogRW52aXJvbm1lbnRLZXkpOiBDb2xvciB7XHJcbiAgICBsZXQgY29sb3I6IENvbG9yID0ga2V5ID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUXHJcbiAgICAgICAgPyBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSlcclxuICAgICAgICA6IGdldEVudmlyb25tZW50Q29sb3Ioa2V5KTtcclxuICAgIHJldHVybiBDb2xvci5sZXJwQ29sb3JzKFxyXG4gICAgICAgIGNvbG9yLFxyXG4gICAgICAgIG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KSxcclxuICAgICAgICAwLjE1LFxyXG4gICAgKTtcclxufVxyXG5cclxuLy8gYSBpcyBhc3N1bWVkIHRvIGJlIHRoZSBvcmlnaW5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERpc3RhbmNlKGE6IG51bWJlciwgYjogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIGxldCBkaXN0MSA9IHdyYXBWYWx1ZShtaW4sIGIgLSBhLCBtYXgpO1xyXG4gICAgbGV0IGRpc3QyID0gd3JhcFZhbHVlKG1pbiwgYSAtIGIsIG1heCk7XHJcbiAgICBsZXQgbWluRGlzdDogbnVtYmVyO1xyXG4gICAgbGV0IGRpcmVjdGlvbiA9IDA7XHJcbiAgICAvLyAgICAgICAgYSAgIGJcclxuICAgIC8vIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgIGlmIChiID49IGEgJiYgZGlzdDEgPD0gZGlzdDIpIHtcclxuICAgICAgICBkaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgIG1pbkRpc3QgPSBkaXN0MTtcclxuICAgIC8vICAgIGEgICAgICAgICAgIGJcclxuICAgIC8vIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgIH0gZWxzZSBpZiAoYiA+PSBhICYmIGRpc3QxID4gZGlzdDIpIHtcclxuICAgICAgICBkaXJlY3Rpb24gPSAtMTtcclxuICAgICAgICBtaW5EaXN0ID0gZGlzdDI7XHJcbiAgICAvLyAgICAgICAgYiAgIGFcclxuICAgIC8vIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgIH0gZWxzZSBpZiAoYiA8IGEgJiYgZGlzdDIgPD0gZGlzdDEpIHtcclxuICAgICAgICBkaXJlY3Rpb24gPSAtMTtcclxuICAgICAgICBtaW5EaXN0ID0gZGlzdDI7XHJcbiAgICAvLyAgICBiICAgICAgICAgICBhXHJcbiAgICAvLyBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICB9IGVsc2UgaWYgKGIgPCBhICYmIGRpc3QyID4gZGlzdDEpIHtcclxuICAgICAgICBkaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgIG1pbkRpc3QgPSBkaXN0MTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaXJlY3Rpb24gKiBtaW5EaXN0O1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBWZWN0b3Ige1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtaW51cyh2OiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGx1cyh2OiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCArIHYueCwgdGhpcy55ICsgdi55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGlubmVyUHJvZHVjdCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1hZ25pdHVkZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybVNxdWFyZWQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY2FsZShzY2FsYXI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAqIHNjYWxhciwgdGhpcy55ICogc2NhbGFyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LCB0aGlzLnkpLnNjYWxlKDEgLyB0aGlzLm1hZ25pdHVkZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlyZWN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBsZXQgd2F2ZXM6IG51bWJlcltdW10gPSBbXHJcbiAgICBbNywgNywgMTBdLFxyXG4gICAgWzcsIDcsIDcsIDEwLCAxMF0sXHJcbiAgICBbNywgOCwgOSwgMTAsIDEwLCAxMF0sXHJcbiAgICBbNywgNywgNywgOCwgOSwgMTAsIDEwLCAxMF0sXHJcbiAgICBbNywgNywgNywgOCwgOSwgMTAsIDEwLCAxNV0sXHJcbiAgICBbNywgNywgNywgNywgOCwgOSwgMTUsIDE1LCAxNV0sXHJcbiAgICBbNywgNywgNywgNywgOCwgOSwgMTUsIDE1LCAyMF0sXHJcbl1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==