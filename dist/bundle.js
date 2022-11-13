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




class Enemy {
    constructor(row, column, radius, health, element) {
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
    }
    update(wrappedCenterColumn, wrappedCenterRow, environmentTileSize, currentTimeMillis) {
        let hitVelocityColumn = 0;
        let hitVelocityRow = 0;
        let elapsedTimeMillis = 0;
        if (this.lastUpdateTimeMillis !== undefined) {
            elapsedTimeMillis = currentTimeMillis - this.lastUpdateTimeMillis;
        }
        if (this.lastHitTimeMillis !== undefined) {
            hitVelocityColumn = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(this.lastHitTimeMillis, currentTimeMillis, this.lastHitTimeMillis + this.hitRecoveryDurationMillis, this.hitVelocityColumn, 0);
            hitVelocityRow = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(this.lastHitTimeMillis, currentTimeMillis, this.lastHitTimeMillis + this.hitRecoveryDurationMillis, this.hitVelocityRow, 0);
        }
        this.column += hitVelocityColumn * elapsedTimeMillis;
        this.row += hitVelocityRow * elapsedTimeMillis;
        let dx = this.getDistance(wrappedCenterColumn, this.column, 0, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns - 1) * environmentTileSize;
        let dy = this.getDistance(wrappedCenterRow, this.row, 0, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows - 1) * environmentTileSize;
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
            let colorRatio = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(this.lastHitTimeMillis, currentTimeMillis, this.lastHitTimeMillis + 1000, 0, 1);
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
    // a is assumed to be the origin
    getDistance(a, b, min, max) {
        let dist1 = (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(min, b - a, max);
        let dist2 = (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(min, a - b, max);
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./vector */ "./src/vector.ts");





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
spawnEnemies();
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
    let speedBoost = (0,_util__WEBPACK_IMPORTED_MODULE_3__.clampValue)(0, (mouseUpY - mouseDownY) / (mouseUpTime - mouseDownTime), 10);
    lastSpeedBoostTimeMillis = mouseUpTime;
    lastSpeedBoostSpeed = Math.max(minimumSpeed, speedBoost * 0.004);
    lastSpeedBoostRotationSpeed = Math.max(minimumRotationSpeed, speedBoost * 0.005);
    lastSpeedBoostGuyRadius = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(0, speedBoost, 10, minGuyRadius, maxGuyRadius);
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
        hitX = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(guyLastHitTimeMillis, currentTimeMillis, guyLastHitTimeMillis + guyHitRecoveryDurationMillis, guyHitVelocityColumn, 0);
        hitY = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(guyLastHitTimeMillis, currentTimeMillis, guyLastHitTimeMillis + guyHitRecoveryDurationMillis, guyHitVelocityRow, 0);
    }
    guyVelocityColumn = moveX + hitX;
    guyVelocityRow = moveY + hitY;
    centerColumn += guyVelocityColumn * elapsedTimeMillis;
    centerRow += guyVelocityRow * elapsedTimeMillis;
    currentRotation += elapsedTimeMillis * currentRotationSpeed;
    if (lastSpeedBoostSpeed !== undefined) {
        currentSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostSpeed, minimumSpeed);
        currentRotationSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostRotationSpeed, minimumRotationSpeed);
        currentGuyRadius = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostGuyRadius, minGuyRadius);
    }
    else {
        currentSpeed = minimumSpeed;
        currentRotationSpeed = minimumRotationSpeed;
        currentGuyRadius = minGuyRadius;
    }
    let topLeftColumn = centerColumn - (canvas.width / 2) / environmentTileSize;
    let topLeftRow = centerRow - (canvas.height / 2) / environmentTileSize;
    let guyCenterX = (0,_util__WEBPACK_IMPORTED_MODULE_3__.columnToX)(centerColumn, topLeftColumn, environmentTileSize);
    let guyCenterY = (0,_util__WEBPACK_IMPORTED_MODULE_3__.rowToY)(centerRow, topLeftRow, environmentTileSize);
    let environmentDrawCount = drawEnvironment(topLeftColumn, topLeftRow);
    // update all enemy x's and y's
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(centerColumn, centerRow, environmentTileSize, currentTimeMillis);
    }
    // do collision and game simulation stuff
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if ((0,_util__WEBPACK_IMPORTED_MODULE_3__.collideCircles)(canvas.width / 2, canvas.height / 2, currentGuyRadius, enemy.x, enemy.y, enemy.radius)
            && (enemy.lastHitTimeMillis === undefined
                || (currentTimeMillis - enemy.lastHitTimeMillis) > enemy.hitRecoveryDurationMillis)) {
            let enemyMass = enemy.radius;
            let guyMass = currentGuyRadius;
            let guyCenter = new _vector__WEBPACK_IMPORTED_MODULE_4__.Vector(guyCenterX, guyCenterY);
            let enemyCenter = new _vector__WEBPACK_IMPORTED_MODULE_4__.Vector(enemy.x, enemy.y);
            let guyVelocity = new _vector__WEBPACK_IMPORTED_MODULE_4__.Vector(guyVelocityColumn, guyVelocityRow)
                .plus(enemyCenter.minus(guyCenter).normalize().scale(0.01));
            let enemyVelocity = new _vector__WEBPACK_IMPORTED_MODULE_4__.Vector(enemy.hitVelocityColumn, enemy.hitVelocityRow);
            let guyHitVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCollisionVelocity)(guyCenter, enemyCenter, guyMass, enemyMass, guyVelocity, enemyVelocity).scale(0.2);
            guyHitVelocityColumn = guyHitVelocity.x;
            guyHitVelocityRow = guyHitVelocity.y;
            guyLastHitTimeMillis = currentTimeMillis;
            let enemyHitVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCollisionVelocity)(enemyCenter, guyCenter, enemyMass, guyMass, enemyVelocity, guyVelocity).scale(0.3);
            enemy.lastHitTimeMillis = currentTimeMillis;
            enemy.hitVelocityColumn = enemyHitVelocity.x;
            enemy.hitVelocityRow = enemyHitVelocity.y;
            let damageMultiplier = getDamageMultiplier(currentTransformation, enemy.element);
            console.log(damageMultiplier);
            enemy.currentHealth -= (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(minGuyRadius, currentGuyRadius, maxGuyRadius, 0, 10 * damageMultiplier);
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
    // TODO: on transformation, set the transformed-to timer to zero
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
        let radius = (0,_util__WEBPACK_IMPORTED_MODULE_3__.randomInt)(minRadius, maxRadius);
        let health = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(minRadius, radius, maxRadius, 50, 200);
        enemies.push(new _enemy__WEBPACK_IMPORTED_MODULE_0__.Enemy(Math.random() * _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns, Math.random() * _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows, radius, health, (0,_util__WEBPACK_IMPORTED_MODULE_3__.randomInt)(0, 3)));
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
            let wrappedRow = (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(0, i, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows - 1);
            let wrappedColumn = (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(0, j, _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns - 1);
            let key = _environment__WEBPACK_IMPORTED_MODULE_1__.environment[wrappedRow][wrappedColumn];
            let x = (0,_util__WEBPACK_IMPORTED_MODULE_3__.columnToX)(j, topLeftColumn, environmentTileSize);
            let y = (0,_util__WEBPACK_IMPORTED_MODULE_3__.rowToY)(i, topLeftRow, environmentTileSize);
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
    ctx.fillStyle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEnvironmentColor)(key).toString();
    ctx.fillRect(x, y, size, size);
}
function getCurrentEnvironment(centerColumn, centerRow) {
    let wrappedRow = (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(0, Math.floor(centerRow), _environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows - 1);
    let wrappedColumn = (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(0, Math.floor(centerColumn), _environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns - 1);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBbUM7QUFFNUIsTUFBTSxLQUFLO0lBS2QsWUFBbUIsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQzlDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDL0QsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQy9DLE9BQU8sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2hELENBQUM7SUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDM0QsT0FBTyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUMzRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFTLEVBQUUsRUFBUyxFQUFFLEtBQWE7UUFDeEQsT0FBTyxJQUFJLEtBQUssQ0FDWixnREFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNsQyxnREFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNsQyxnREFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNyQyxDQUFDO0lBQ04sQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEMrQjtBQUNvRDtBQUNuRDtBQUNrQztBQUU1RCxNQUFNLEtBQUs7SUFnQmQsWUFDSSxHQUFXLEVBQ1gsTUFBYyxFQUNkLE1BQWMsRUFDZCxNQUFjLEVBQ2QsT0FBdUI7UUFacEIsOEJBQXlCLEdBQVcsR0FBRyxDQUFDO1FBYzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sS0FBSyxnRUFBc0I7WUFDbkQsQ0FBQyxDQUFDLElBQUkseUNBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsMERBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsb0RBQWdCLENBQ2hDLFNBQVMsRUFDVCxJQUFJLHlDQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFDeEIsSUFBSSxDQUNQLENBQUM7SUFDTixDQUFDO0lBRU0sTUFBTSxDQUNULG1CQUEyQixFQUMzQixnQkFBd0IsRUFDeEIsbUJBQTJCLEVBQzNCLGlCQUF5QjtRQUV6QixJQUFJLGlCQUFpQixHQUFXLENBQUMsQ0FBQztRQUNsQyxJQUFJLGNBQWMsR0FBVyxDQUFDLENBQUM7UUFDL0IsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEtBQUssU0FBUyxFQUFFO1lBQ3pDLGlCQUFpQixHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztTQUNyRTtRQUNELElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLFNBQVMsRUFBRTtZQUN0QyxpQkFBaUIsR0FBRyxnREFBUyxDQUN6QixJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLGlCQUFpQixFQUNqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUN2RCxJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLENBQUMsQ0FDSixDQUFDO1lBRUYsY0FBYyxHQUFHLGdEQUFTLENBQ3RCLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsaUJBQWlCLEVBQ2pCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLEVBQ3ZELElBQUksQ0FBQyxjQUFjLEVBQ25CLENBQUMsQ0FDSixDQUFDO1NBQ0w7UUFFRCxJQUFJLENBQUMsTUFBTSxJQUFJLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQ3JELElBQUksQ0FBQyxHQUFHLElBQUksY0FBYyxHQUFHLGlCQUFpQixDQUFDO1FBRS9DLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsNERBQWtCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUM7UUFDN0csSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSx5REFBZSxHQUFHLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO1FBRXBHLElBQUksQ0FBQyxDQUFDLEdBQUcsZ0RBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsaURBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQztJQUNsRCxDQUFDO0lBRU0sSUFBSSxDQUNQLGlCQUF5QixFQUN6QixHQUE2QjtRQUU3Qjs7Ozs7Ozs7Ozs7Ozs7OztVQWdCRTtRQUVGLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1FBRTFCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7WUFDdEMsSUFBSSxVQUFVLEdBQUcsZ0RBQVMsQ0FDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUN0QixpQkFBaUIsRUFDakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksRUFDN0IsQ0FBQyxFQUNELENBQUMsQ0FDSixDQUFDO1NBQ0w7UUFDRCxHQUFHLENBQUMsU0FBUyxHQUFHLG9EQUFnQixDQUM1QixJQUFJLHlDQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDcEIsSUFBSSxDQUFDLFlBQVksRUFDakIsVUFBVSxDQUNiLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFYixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWQsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLFFBQVEsR0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDMUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hGLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxnQ0FBZ0M7SUFDeEIsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsR0FBVyxFQUFFLEdBQVc7UUFDOUQsSUFBSSxLQUFLLEdBQUcsZ0RBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssR0FBRyxnREFBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksT0FBZSxDQUFDO1FBQ3BCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixlQUFlO1FBQ2Ysc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1lBQzFCLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDZCxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLG1CQUFtQjtZQUNuQixzQkFBc0I7U0FDckI7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEtBQUssRUFBRTtZQUNoQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLGVBQWU7WUFDZixzQkFBc0I7U0FDckI7YUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtZQUNoQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLG1CQUFtQjtZQUNuQixzQkFBc0I7U0FDckI7YUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLEtBQUssRUFBRTtZQUMvQixTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsT0FBTyxHQUFHLEtBQUssQ0FBQztTQUNuQjtRQUNELE9BQU8sU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUMvQixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuTDZDO0FBRTlDLElBQVksY0FLWDtBQUxELFdBQVksY0FBYztJQUN0Qix5REFBTztJQUNQLHVEQUFNO0lBQ04sdURBQU07SUFDTixxREFBSztBQUNULENBQUMsRUFMVyxjQUFjLEtBQWQsY0FBYyxRQUt6QjtBQUNNLElBQUksV0FBVyxHQUF1QixFQUFFLENBQUM7QUFDekMsSUFBSSxlQUFlLEdBQVcsRUFBRSxDQUFDO0FBQ2pDLElBQUksa0JBQWtCLEdBQVcsRUFBRSxDQUFDO0FBRTNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdEMsSUFBSSxHQUFHLEdBQXFCLEVBQUUsQ0FBQztJQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxFQUFFO1lBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBbUIsQ0FBQyxDQUFDO1NBQy9DO0tBQ0o7SUFDRCxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3pCO0FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN6QixJQUFJLGVBQWUsR0FBdUIsRUFBRSxDQUFDO0lBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsSUFBSSxHQUFHLEdBQXFCLEVBQUUsQ0FBQztRQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQjtRQUNELGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDN0I7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxrQkFBa0IsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxjQUFjLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7Z0JBQ3pFLFFBQU8sZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7b0JBQ3BCLEtBQUssQ0FBQzt3QkFDRixXQUFXLENBQUMsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNFLE1BQU07b0JBQ1YsS0FBSyxDQUFDO3dCQUNGLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnREFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5RSxNQUFNO29CQUNWLEtBQUssQ0FBQzt3QkFDRixXQUFXLENBQUMsZ0RBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNFLE1BQU07b0JBQ1YsS0FBSyxDQUFDO3dCQUNGLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnREFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5RSxNQUFNO2lCQUNiO2FBQ0o7U0FDSjtLQUNKO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckQrQjtBQUNpRTtBQUMxRDtBQUM0RztBQUNqSDtBQUVsQyxJQUFJLGtCQUEwQixDQUFDO0FBRXhCLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ25CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3BCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsWUFBWSxDQUFDO0FBQ3pCLElBQUksR0FBRyxHQUE2QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTVELElBQUksbUJBQW1CLEdBQVcsRUFBRSxDQUFDO0FBQ3JDLElBQUksU0FBUyxHQUFXLHlEQUFlLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0FBQ3JGLElBQUksWUFBWSxHQUFXLDREQUFrQixHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztBQUU1RixJQUFJLFlBQVksR0FBVyxLQUFLLENBQUM7QUFDakMsSUFBSSxZQUFZLEdBQVcsWUFBWSxDQUFDO0FBQ3hDLElBQUksMEJBQTBCLEdBQVcsR0FBRyxDQUFDO0FBQzdDLElBQUksbUJBQTJCLENBQUM7QUFFaEMsSUFBSSx3QkFBZ0MsQ0FBQztBQUVyQyxJQUFJLGVBQWUsR0FBVyxDQUFDLENBQUM7QUFDaEMsSUFBSSxvQkFBb0IsR0FBVyxLQUFLLENBQUM7QUFDekMsSUFBSSxvQkFBb0IsR0FBVyxvQkFBb0IsQ0FBQztBQUN4RCxJQUFJLDJCQUFtQyxDQUFDO0FBRXhDLElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztBQUUzQixJQUFJLFNBQVMsR0FBMEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqRCxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxtREFBVyxDQUFDLENBQUM7QUFDaEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsbURBQVcsQ0FBQyxDQUFDO0FBQ2hDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLG1EQUFXLENBQUMsQ0FBQztBQUNoQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxtREFBVyxDQUFDLENBQUM7QUFFaEMsSUFBSSxVQUFrQixDQUFDO0FBQ3ZCLElBQUksYUFBcUIsQ0FBQztBQUUxQixJQUFJLGVBQWUsR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUV0RCxJQUFJLFNBQVMsR0FBcUIsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakUsSUFBSSxpQkFBaUIsR0FBVyxDQUFDLENBQUM7QUFDbEMsSUFBSSxjQUFjLEdBQVcsQ0FBQyxDQUFDO0FBQy9CLElBQUksb0JBQW9CLEdBQVcsQ0FBQyxDQUFDO0FBQ3JDLElBQUksaUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0FBQ2xDLElBQUksb0JBQTRCLENBQUM7QUFDakMsSUFBSSw0QkFBNEIsR0FBVyxHQUFHLENBQUM7QUFDL0MsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO0FBQzlCLElBQUksWUFBWSxHQUFXLEVBQUUsQ0FBQztBQUM5QixJQUFJLGdCQUFnQixHQUFXLFlBQVksQ0FBQztBQUM1QyxJQUFJLHVCQUErQixDQUFDO0FBRXBDLElBQUksaUJBQWlCLEdBQTZDO0lBQzlELEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0lBQy9CLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0lBQy9CLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0lBQy9CLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDO0NBQ2xDLENBQUM7QUFDRixJQUFJLHFCQUFxQixHQUFXLENBQUMsQ0FBQztBQUV0QyxJQUFJLE9BQU8sR0FBWSxFQUFFLENBQUM7QUFDMUIsWUFBWSxFQUFFLENBQUM7QUFFZixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVsQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxFQUFFO0lBQ3RDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNWLE9BQU87S0FDVjtJQUNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUIsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFEQUFhLENBQUMsQ0FBQztLQUNyQztBQUNMLENBQUMsQ0FBQztBQUNGLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFnQixFQUFFLEVBQUU7SUFDcEMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5QixJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDcEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsbURBQVcsQ0FBQyxDQUFDO0tBQ25DO0FBQ0wsQ0FBQyxDQUFDO0FBQ0YsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQWEsRUFBRSxFQUFFO0lBQ3JDLFVBQVUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLGFBQWEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEMsQ0FBQztBQUNELFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFhLEVBQUUsRUFBRTtJQUNuQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3pCLElBQUksV0FBVyxHQUFXLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM1QyxJQUFJLFVBQVUsR0FBRyxpREFBVSxDQUN2QixDQUFDLEVBQ0QsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLEVBQ3ZELEVBQUUsQ0FDTCxDQUFDO0lBQ0Ysd0JBQXdCLEdBQUcsV0FBVyxDQUFDO0lBQ3ZDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNqRSwyQkFBMkIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNqRix1QkFBdUIsR0FBRyxnREFBUyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsaUJBQXlCO0lBQ25DLElBQUksa0JBQWtCLEtBQUssU0FBUyxFQUFFO1FBQ2xDLGtCQUFrQixHQUFHLGlCQUFpQixDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxPQUFPO0tBQ1Y7SUFDRCxJQUFJLGlCQUFpQixHQUFHLGlCQUFpQixHQUFHLGtCQUFrQixDQUFDO0lBQy9ELEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVqRCxJQUFJLEtBQUssR0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUsscURBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUM3RCxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUsscURBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxJQUFJLEtBQUssR0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUsscURBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUM3RCxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUsscURBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3pELElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtRQUNmLEtBQUssR0FBRyxLQUFLLEdBQUcsU0FBUyxHQUFHLFlBQVksQ0FBQztRQUN6QyxLQUFLLEdBQUcsS0FBSyxHQUFHLFNBQVMsR0FBRyxZQUFZLENBQUM7S0FDNUM7SUFFRCxJQUFJLElBQUksR0FBVyxDQUFDLENBQUM7SUFDckIsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksb0JBQW9CLEtBQUssU0FBUyxFQUFFO1FBQ3BDLElBQUksR0FBRyxnREFBUyxDQUNaLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsb0JBQW9CLEdBQUcsNEJBQTRCLEVBQ25ELG9CQUFvQixFQUNwQixDQUFDLENBQ0osQ0FBQztRQUNGLElBQUksR0FBRyxnREFBUyxDQUNaLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsb0JBQW9CLEdBQUcsNEJBQTRCLEVBQ25ELGlCQUFpQixFQUNqQixDQUFDLENBQ0osQ0FBQztLQUNMO0lBRUQsaUJBQWlCLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNqQyxjQUFjLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztJQUU5QixZQUFZLElBQUksaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7SUFDdEQsU0FBUyxJQUFJLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztJQUVoRCxlQUFlLElBQUksaUJBQWlCLEdBQUcsb0JBQW9CLENBQUM7SUFFNUQsSUFBSSxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7UUFDbkMsWUFBWSxHQUFHLGdEQUFTLENBQ3BCLENBQUMsRUFDRCxpQkFBaUIsR0FBRyx3QkFBd0IsRUFDNUMsMEJBQTBCLEVBQzFCLG1CQUFtQixFQUNuQixZQUFZLENBQ2YsQ0FBQztRQUNGLG9CQUFvQixHQUFHLGdEQUFTLENBQzVCLENBQUMsRUFDRCxpQkFBaUIsR0FBRyx3QkFBd0IsRUFDNUMsMEJBQTBCLEVBQzFCLDJCQUEyQixFQUMzQixvQkFBb0IsQ0FDdkIsQ0FBQztRQUNGLGdCQUFnQixHQUFHLGdEQUFTLENBQ3hCLENBQUMsRUFDRCxpQkFBaUIsR0FBRyx3QkFBd0IsRUFDNUMsMEJBQTBCLEVBQzFCLHVCQUF1QixFQUN2QixZQUFZLENBQ2YsQ0FBQztLQUNMO1NBQU07UUFDSCxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQzVCLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO1FBQzVDLGdCQUFnQixHQUFHLFlBQVksQ0FBQztLQUNuQztJQUVELElBQUksYUFBYSxHQUFXLFlBQVksR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUM7SUFDcEYsSUFBSSxVQUFVLEdBQVcsU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztJQUMvRSxJQUFJLFVBQVUsR0FBRyxnREFBUyxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM3RSxJQUFJLFVBQVUsR0FBRyw2Q0FBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUVwRSxJQUFJLG9CQUFvQixHQUFHLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFdEUsK0JBQStCO0lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3RGO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQUksS0FBSyxHQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLHFEQUFjLENBQ2QsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQ2hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNqQixnQkFBZ0IsRUFDaEIsS0FBSyxDQUFDLENBQUMsRUFDUCxLQUFLLENBQUMsQ0FBQyxFQUNQLEtBQUssQ0FBQyxNQUFNLENBQUM7ZUFDVixDQUNDLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxTQUFTO21CQUNsQyxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEtBQUssQ0FBQyx5QkFBeUIsQ0FDckYsRUFDSDtZQUNFLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDckMsSUFBSSxPQUFPLEdBQVcsZ0JBQWdCLENBQUM7WUFDdkMsSUFBSSxTQUFTLEdBQVcsSUFBSSwyQ0FBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLFdBQVcsR0FBVyxJQUFJLDJDQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxXQUFXLEdBQVcsSUFBSSwyQ0FBTSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztpQkFDbEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxhQUFhLEdBQVcsSUFBSSwyQ0FBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdEYsSUFBSSxjQUFjLEdBQVcsMkRBQW9CLENBQzdDLFNBQVMsRUFDVCxXQUFXLEVBQ1gsT0FBTyxFQUNQLFNBQVMsRUFDVCxXQUFXLEVBQ1gsYUFBYSxDQUNoQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNyQyxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQztZQUV6QyxJQUFJLGdCQUFnQixHQUFXLDJEQUFvQixDQUMvQyxXQUFXLEVBQ1gsU0FBUyxFQUNULFNBQVMsRUFDVCxPQUFPLEVBQ1AsYUFBYSxFQUNiLFdBQVcsQ0FDZCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztZQUM1QyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBRTFDLElBQUksZ0JBQWdCLEdBQVcsbUJBQW1CLENBQUMscUJBQXVDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixLQUFLLENBQUMsYUFBYSxJQUFJLGdEQUFTLENBQzVCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLENBQUMsRUFDRCxFQUFFLEdBQUcsZ0JBQWdCLENBQ3hCLENBQUM7U0FDTDtLQUNKO0lBRUQsc0JBQXNCO0lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUU7WUFDL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxFQUFFLENBQUM7U0FDUDtLQUNKO0lBRUQsbUJBQW1CO0lBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDM0M7SUFFRCw0QkFBNEI7SUFDNUIsSUFBSSxrQkFBa0IsR0FBbUIscUJBQXFCLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hGLElBQUksa0JBQWtCLEtBQU0scUJBQXdDLEVBQUU7UUFDbEUsSUFBSSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6RCxZQUFZLENBQUMsV0FBVyxJQUFJLGlCQUFpQixDQUFDO1FBQzlDLElBQUksWUFBWSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFO1lBQ2pELFlBQVksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLE9BQU87U0FDbEQ7S0FDSjtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsSUFBSyxDQUFvQixLQUFLLGtCQUFrQixFQUFFO1lBQzlDLElBQUksWUFBWSxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLFlBQVksQ0FBQyxXQUFXLElBQUksaUJBQWlCLENBQUM7WUFDOUMsSUFBSSxZQUFZLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtnQkFDOUIsWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7YUFDaEM7U0FDSjtLQUNKO0lBRUQseUJBQXlCO0lBQ3pCLElBQUksa0JBQWtCLEtBQU0scUJBQXdDO1dBQzdELGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxLQUFLLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxFQUN4RztRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QscUJBQXFCLEdBQUcsa0JBQTRCLENBQUM7S0FDeEQ7SUFFRCw4QkFBOEI7SUFDOUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1gsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7SUFDeEIsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDNUIsR0FBRyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7SUFDeEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVkLGVBQWU7SUFDZixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUYsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWQsZ0NBQWdDO0lBQ2hDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEUsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVkLElBQUksa0JBQWtCLEtBQUsscUJBQXFCLEVBQUU7UUFDOUMsSUFBSSxXQUFXLEdBQVcsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUMxQyxJQUFJLFdBQVcsR0FBVyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQzFDLElBQUksUUFBUSxHQUFXLEVBQUUsQ0FBQztRQUMxQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxtQkFBbUIsQ0FBQyxXQUFXLEdBQUcsUUFBUSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMxRyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUN6QixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzRixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZCxJQUFJLEtBQUssR0FBVyxHQUFHLENBQUM7UUFDeEIsSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLElBQUksUUFBUSxHQUFXLFdBQVcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDL0QsSUFBSSxRQUFRLEdBQVcsV0FBVyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSx1QkFBdUIsR0FBMkMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM1RyxJQUFJLFNBQVMsR0FBVyxDQUFDLHVCQUF1QixDQUFDLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMxQixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUN2QixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxHQUFHLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RCxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNqQjtJQUNELGdFQUFnRTtJQUVoRSxXQUFXO0lBQ1gsSUFBSSxHQUFHLEdBQVcsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0lBQzNDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWQsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7SUFDdkMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxXQUFtQjtJQUNsQyxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDO0tBQ3BGO0lBQ0QsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFeEMsMERBQTBEO0lBQzFELElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFDeEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7UUFDaEIsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELEtBQUssQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDO0lBRXhCLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLE9BQU87SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksZUFBZSxFQUFFO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QixPQUFPO1NBQ1Y7S0FDSjtJQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsU0FBUyxZQUFZO0lBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekIsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztRQUMzQixJQUFJLE1BQU0sR0FBVyxnREFBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxJQUFJLE1BQU0sR0FBVyxnREFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUkseUNBQUssQ0FDbEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLDREQUFrQixFQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcseURBQWUsRUFDL0IsTUFBTSxFQUNOLE1BQU0sRUFDTixnREFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQW1CLENBQ3BDLENBQUMsQ0FBQztLQUNOO0FBQ0wsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLGFBQXFCLEVBQUUsVUFBa0I7SUFDOUQsSUFBSSxpQkFBaUIsR0FBVyxhQUFhLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxtQkFBbUIsQ0FBQztJQUNuRixJQUFJLGNBQWMsR0FBVyxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztJQUM5RSxJQUFJLFNBQVMsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2xELElBQUksU0FBUyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyRCxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0MsSUFBSSxvQkFBb0IsR0FBVyxDQUFDLENBQUM7SUFDckMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQUksVUFBVSxHQUFXLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSx5REFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksYUFBYSxHQUFXLGdEQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSw0REFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRSxJQUFJLEdBQUcsR0FBbUIscURBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsR0FBRyxnREFBUyxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsR0FBRyw2Q0FBTSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNuRCxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFNUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDeEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDekIsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7WUFDNUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUcsR0FBRyxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRSxvQkFBb0IsRUFBRSxDQUFDO1NBQzFCO0tBQ0o7SUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZCxPQUFPLG9CQUFvQixDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWSxFQUFFLEdBQW1CO0lBQ2hGLEdBQUcsQ0FBQyxTQUFTLEdBQUcsMERBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxZQUFvQixFQUFFLFNBQWlCO0lBQ2xFLElBQUksVUFBVSxHQUFXLGdEQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUseURBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRixJQUFJLGFBQWEsR0FBVyxnREFBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLDREQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNGLE9BQU8scURBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxRQUF3QixFQUFFLFFBQXdCO0lBQzNFLElBQUksUUFBUSxLQUFLLGdFQUFzQixJQUFJLFFBQVEsS0FBSyxnRUFBc0IsRUFBRTtRQUM1RSxPQUFPLENBQUMsQ0FBQztLQUNaO0lBRUQsSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7UUFDcEMsSUFBSSxRQUFRLEtBQUssOERBQW9CLEVBQUU7WUFDbkMsT0FBTyxDQUFDLENBQUM7U0FDWjthQUFNLElBQUksUUFBUSxLQUFLLCtEQUFxQixFQUFFO1lBQzNDLE9BQU8sR0FBRyxDQUFDO1NBQ2Q7YUFBTTtZQUNILE9BQU8sQ0FBQyxDQUFDO1NBQ1o7S0FDSjtJQUVELElBQUksUUFBUSxLQUFLLCtEQUFxQixFQUFFO1FBQ3BDLElBQUksUUFBUSxLQUFLLCtEQUFxQixFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxDQUFDO1NBQ1o7YUFBTSxJQUFJLFFBQVEsS0FBSyw4REFBb0IsRUFBRTtZQUMxQyxPQUFPLEdBQUcsQ0FBQztTQUNkO2FBQU0sSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7WUFDM0MsT0FBTyxDQUFDLENBQUM7U0FDWjtLQUNKO0lBRUQsSUFBSSxRQUFRLEtBQUssOERBQW9CLEVBQUU7UUFDbkMsSUFBSSxRQUFRLEtBQUssK0RBQXFCLEVBQUU7WUFDcEMsT0FBTyxDQUFDLENBQUM7U0FDWjthQUFNLElBQUksUUFBUSxLQUFLLCtEQUFxQixFQUFFO1lBQzNDLE9BQU8sR0FBRyxDQUFDO1NBQ2Q7YUFBTSxJQUFJLFFBQVEsS0FBSyw4REFBb0IsRUFBRTtZQUMxQyxPQUFPLENBQUMsQ0FBQztTQUNaO0tBQ0o7QUFDTCxDQUFDO0FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2hlOUIsSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2hCLG1DQUFFO0lBQ0YsdUNBQUk7QUFDUixDQUFDLEVBSFcsUUFBUSxLQUFSLFFBQVEsUUFHbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSCtCO0FBQ2U7QUFDYjtBQUVsQywyRUFBMkU7QUFDcEUsU0FBUyxTQUFTLENBQ3JCLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLE9BQWUsRUFDZixPQUFlLEVBQ2YsS0FBYTtJQUViLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUYsSUFBSSxLQUFLLEdBQVcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFDcEUsT0FBTyxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFTSxTQUFTLFVBQVUsQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLEdBQVc7SUFDOUQsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO1FBQ2IsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUNELElBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtRQUNiLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsbUhBQW1IO0FBQ25ILHdEQUF3RDtBQUNqRCxTQUFTLFNBQVMsQ0FBQyxHQUFXLEVBQUUsR0FBVztJQUM5QyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRU0sU0FBUyxTQUFTLENBQUMsR0FBVyxFQUFFLEtBQWEsRUFBRSxHQUFXO0lBQzdELElBQUksS0FBSyxHQUFHLEdBQUcsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO1FBQzVCLE9BQU8sR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDaEQ7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQscURBQXFEO0FBQ3JELDZHQUE2RztBQUM3RyxTQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFTSxTQUFTLFNBQVMsQ0FBQyxNQUFjLEVBQUUsYUFBcUIsRUFBRSxtQkFBMkI7SUFDeEYsT0FBTyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztBQUMxRCxDQUFDO0FBRU0sU0FBUyxNQUFNLENBQUMsR0FBVyxFQUFFLFVBQWtCLEVBQUUsbUJBQTJCO0lBQy9FLE9BQU8sQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsbUJBQW1CLENBQUM7QUFDcEQsQ0FBQztBQUVNLFNBQVMsY0FBYyxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtJQUNqRyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO1dBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDdkMsQ0FBQztBQUVNLFNBQVMsb0JBQW9CLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO0lBQ3ZHLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsT0FBTyxTQUFTO1NBQ1gsS0FBSyxDQUNGLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7VUFDakIsd0RBQW1CLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUM7VUFDNUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUM1QixDQUFDO0FBQ1YsQ0FBQztBQUVNLFNBQVMsbUJBQW1CLENBQUMsR0FBbUI7SUFDbkQsUUFBTyxHQUFHLEVBQUU7UUFDUixLQUFLLGdFQUFzQjtZQUN2QixPQUFPLElBQUkseUNBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssK0RBQXFCO1lBQ3RCLE9BQU8sSUFBSSx5Q0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEMsS0FBSywrREFBcUI7WUFDdEIsT0FBTyxJQUFJLHlDQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuQyxLQUFLLDhEQUFvQjtZQUNyQixPQUFPLElBQUkseUNBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ25DO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDbEZNLE1BQU0sTUFBTTtJQUlmLFlBQW1CLENBQVMsRUFBRSxDQUFTO1FBQ25DLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRU0sS0FBSyxDQUFDLENBQVM7UUFDbEIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVNLElBQUksQ0FBQyxDQUFTO1FBQ2pCLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQVUsRUFBRSxFQUFVO1FBQzdDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU0sU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFjO1FBQ3ZCLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sU0FBUztRQUNaLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0o7Ozs7Ozs7VUNwQ0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2NvbG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvZW5lbXkudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9lbnZpcm9ubWVudC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMva2V5X3N0YXRlLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hcExpbmVhciB9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9SR0IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArIHIgKyBcIixcIiArIGcgKyBcIixcIiArIGIgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvUkdCQShyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgciArIFwiLFwiICsgZyArIFwiLFwiICsgYiArIFwiLFwiICsgYSArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycENvbG9ycyhjMTogQ29sb3IsIGMyOiBDb2xvciwgcmF0aW86IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoXHJcbiAgICAgICAgICAgIG1hcExpbmVhcigwLCByYXRpbywgMSwgYzEuciwgYzIuciksXHJcbiAgICAgICAgICAgIG1hcExpbmVhcigwLCByYXRpbywgMSwgYzEuZywgYzIuZyksXHJcbiAgICAgICAgICAgIG1hcExpbmVhcigwLCByYXRpbywgMSwgYzEuYiwgYzIuYiksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XHJcbmltcG9ydCB7IGVudmlyb25tZW50Q29sdW1ucywgRW52aXJvbm1lbnRLZXksIGVudmlyb25tZW50Um93cyB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IGNhbnZhcyB9IGZyb20gXCIuL2luZGV4XCI7XHJcbmltcG9ydCB7IGdldEVudmlyb25tZW50Q29sb3IsIG1hcExpbmVhciwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuZW15IHtcclxuICAgIHB1YmxpYyByb3c6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHJhZGl1czogbnVtYmVyO1xyXG4gICAgcHVibGljIGxhc3RIaXRUaW1lTWlsbGlzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaGl0VmVsb2NpdHlDb2x1bW46IG51bWJlcjtcclxuICAgIHB1YmxpYyBoaXRWZWxvY2l0eVJvdzogbnVtYmVyO1xyXG4gICAgcHVibGljIGhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXM6IG51bWJlciA9IDUwMDtcclxuICAgIHB1YmxpYyBsYXN0VXBkYXRlVGltZU1pbGxpczogbnVtYmVyO1xyXG4gICAgcHVibGljIG1heEhlYWx0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRIZWFsdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbGVtZW50OiBFbnZpcm9ubWVudEtleTtcclxuICAgIHB1YmxpYyBkZWZhdWx0Q29sb3I6IENvbG9yO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICByb3c6IG51bWJlcixcclxuICAgICAgICBjb2x1bW46IG51bWJlcixcclxuICAgICAgICByYWRpdXM6IG51bWJlcixcclxuICAgICAgICBoZWFsdGg6IG51bWJlcixcclxuICAgICAgICBlbGVtZW50OiBFbnZpcm9ubWVudEtleSxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcm93O1xyXG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMuaGl0VmVsb2NpdHlDb2x1bW4gPSAwO1xyXG4gICAgICAgIHRoaXMuaGl0VmVsb2NpdHlSb3cgPSAwO1xyXG4gICAgICAgIHRoaXMubWF4SGVhbHRoID0gaGVhbHRoO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEhlYWx0aCA9IGhlYWx0aCAqIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICBsZXQgdGVtcENvbG9yID0gdGhpcy5lbGVtZW50ID09PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUXHJcbiAgICAgICAgICAgID8gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUpXHJcbiAgICAgICAgICAgIDogZ2V0RW52aXJvbm1lbnRDb2xvcih0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdENvbG9yID0gQ29sb3IubGVycENvbG9ycyhcclxuICAgICAgICAgICAgdGVtcENvbG9yLFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSksXHJcbiAgICAgICAgICAgIDAuMTUsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKFxyXG4gICAgICAgIHdyYXBwZWRDZW50ZXJDb2x1bW46IG51bWJlcixcclxuICAgICAgICB3cmFwcGVkQ2VudGVyUm93OiBudW1iZXIsXHJcbiAgICAgICAgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgaGl0VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGhpdFZlbG9jaXR5Um93OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZVRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBoaXRWZWxvY2l0eUNvbHVtbiA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgKyB0aGlzLmhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpdFZlbG9jaXR5Q29sdW1uLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGhpdFZlbG9jaXR5Um93ID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0VGltZU1pbGxpcyArIHRoaXMuaGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGl0VmVsb2NpdHlSb3csXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb2x1bW4gKz0gaGl0VmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICB0aGlzLnJvdyArPSBoaXRWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgICAgICBsZXQgZHggPSB0aGlzLmdldERpc3RhbmNlKHdyYXBwZWRDZW50ZXJDb2x1bW4sIHRoaXMuY29sdW1uLCAwLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICAgICAgbGV0IGR5ID0gdGhpcy5nZXREaXN0YW5jZSh3cmFwcGVkQ2VudGVyUm93LCB0aGlzLnJvdywgMCwgZW52aXJvbm1lbnRSb3dzIC0gMSkgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnggPSBjYW52YXMud2lkdGggLyAyICsgZHg7XHJcbiAgICAgICAgdGhpcy55ID0gY2FudmFzLmhlaWdodCAvIDIgKyBkeTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KFxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIsXHJcbiAgICAgICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgIGEgICAgICAgICAgIGJcclxuICAgICAgICBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcblxyXG4gICAgICAgIGRpc3QxID0gTWF0aC5hYnMoYSAtIGIpO1xyXG4gICAgICAgIGRpc3QyID0gKGEgLSBtaW4pICsgKG1heCAtIGIpO1xyXG5cclxuICAgICAgICBhIC0gYiA9IC02IChtb2QgOSkgPT4gM1xyXG5cclxuXHJcbiAgICAgICAgICAgICBiICAgICAgIGFcclxuICAgICAgICBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICAgICAgXHJcbiAgICAgICAgYiAtIGEgPSAtNCAobW9kIDkpID0gNVxyXG4gICAgICAgIGxlbiArICgyICsgMSkgLSAoNiArIDEpID0gbGVuICsgMyAtIDcgPSBsZW4gLSA0ID0gNVxyXG4gICAgICAgIC8vIOKAi2xlbiArIChtaW4oYSxiKSArIDEpIC0gKG1heChhLGIpICsgMSlcclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29sb3JSYXRpbyA9IDE7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgY29sb3JSYXRpbyA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdFRpbWVNaWxsaXMgKyAxMDAwLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBDb2xvci5sZXJwQ29sb3JzKFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMjU1LCAwLCAwKSxcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0Q29sb3IsXHJcbiAgICAgICAgICAgIGNvbG9yUmF0aW8sXHJcbiAgICAgICAgKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSB0aGlzLm1heEhlYWx0aCAvIDI7XHJcbiAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gNDtcclxuICAgICAgICBsZXQgdG9wTGVmdFg6IG51bWJlciA9IHRoaXMueCAtIHdpZHRoIC8gMjtcclxuICAgICAgICBsZXQgdG9wTGVmdFk6IG51bWJlciA9IHRoaXMueSAtIHRoaXMucmFkaXVzIC0gaGVpZ2h0IC8gMiAtIDg7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGggKiAodGhpcy5jdXJyZW50SGVhbHRoIC8gdGhpcy5tYXhIZWFsdGgpLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhIGlzIGFzc3VtZWQgdG8gYmUgdGhlIG9yaWdpblxyXG4gICAgcHJpdmF0ZSBnZXREaXN0YW5jZShhOiBudW1iZXIsIGI6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGRpc3QxID0gd3JhcFZhbHVlKG1pbiwgYiAtIGEsIG1heCk7XHJcbiAgICAgICAgbGV0IGRpc3QyID0gd3JhcFZhbHVlKG1pbiwgYSAtIGIsIG1heCk7XHJcbiAgICAgICAgbGV0IG1pbkRpc3Q6IG51bWJlcjtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gMDtcclxuICAgICAgICAvLyAgICAgICAgYSAgIGJcclxuICAgICAgICAvLyBbMCAxIDIgMyA0IDUgNiA3IDhdXHJcbiAgICAgICAgaWYgKGIgPj0gYSAmJiBkaXN0MSA8PSBkaXN0Mikge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDE7XHJcbiAgICAgICAgLy8gICAgYSAgICAgICAgICAgYlxyXG4gICAgICAgIC8vIFswIDEgMiAzIDQgNSA2IDcgOF1cclxuICAgICAgICB9IGVsc2UgaWYgKGIgPj0gYSAmJiBkaXN0MSA+IGRpc3QyKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDI7XHJcbiAgICAgICAgLy8gICAgICAgIGIgICBhXHJcbiAgICAgICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYiA8IGEgJiYgZGlzdDIgPD0gZGlzdDEpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgICAgIG1pbkRpc3QgPSBkaXN0MjtcclxuICAgICAgICAvLyAgICBiICAgICAgICAgICBhXHJcbiAgICAgICAgLy8gWzAgMSAyIDMgNCA1IDYgNyA4XVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYiA8IGEgJiYgZGlzdDIgPiBkaXN0MSkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb24gKiBtaW5EaXN0O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHJhbmRvbUludCwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGVudW0gRW52aXJvbm1lbnRLZXkge1xyXG4gICAgREVGQVVMVCxcclxuICAgIEZPUkVTVCxcclxuICAgIERFU0VSVCxcclxuICAgIFdBVEVSLFxyXG59XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50S2V5W11bXSA9IFtdO1xyXG5leHBvcnQgbGV0IGVudmlyb25tZW50Um93czogbnVtYmVyID0gMzA7XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnRDb2x1bW5zOiBudW1iZXIgPSAzMDtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgIGxldCByb3c6IEVudmlyb25tZW50S2V5W10gPSBbXTtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuOTk3KSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKEVudmlyb25tZW50S2V5LkRFRkFVTFQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKHJhbmRvbUludCgxLCAzKSBhcyBFbnZpcm9ubWVudEtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZW52aXJvbm1lbnQucHVzaChyb3cpO1xyXG59XHJcblxyXG5mb3IgKGxldCBrID0gMDsgayA8IDEwOyBrKyspIHtcclxuICAgIGxldCBlbnZpcm9ubWVudENvcHk6IEVudmlyb25tZW50S2V5W11bXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgICAgIGxldCByb3c6IEVudmlyb25tZW50S2V5W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKGVudmlyb25tZW50W2ldW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZW52aXJvbm1lbnRDb3B5LnB1c2gocm93KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZW52aXJvbm1lbnRDb3B5W2ldW2pdICE9PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUICYmIE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChyYW5kb21JbnQoMSwgNCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W3dyYXBWYWx1ZSgwLCBpKzEsIGVudmlyb25tZW50Um93cyAtIDEpXVtqXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W2ldW3dyYXBWYWx1ZSgwLCBqKzEsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W3dyYXBWYWx1ZSgwLCBpLTEsIGVudmlyb25tZW50Um93cyAtIDEpXVtqXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W2ldW3dyYXBWYWx1ZSgwLCBqLTEsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XHJcbmltcG9ydCB7IEVuZW15IH0gZnJvbSBcIi4vZW5lbXlcIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQsIGVudmlyb25tZW50Q29sdW1ucywgRW52aXJvbm1lbnRLZXksIGVudmlyb25tZW50Um93cyB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IEtleVN0YXRlIH0gZnJvbSBcIi4va2V5X3N0YXRlXCI7XHJcbmltcG9ydCB7IGNsYW1wVmFsdWUsIGNvbGxpZGVDaXJjbGVzLCBjb2x1bW5Ub1gsIGdldENvbGxpc2lvblZlbG9jaXR5LCBnZXRFbnZpcm9ubWVudENvbG9yLCBtYXBMaW5lYXIsIHJhbmRvbUludCwgcm93VG9ZLCB3cmFwVmFsdWUgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxubGV0IHByZXZpb3VzVGltZU1pbGxpczogbnVtYmVyO1xyXG5cclxuZXhwb3J0IGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuY2FudmFzLndpZHRoID0gODAwO1xyXG5jYW52YXMuaGVpZ2h0ID0gODAwO1xyXG5jYW52YXMuaWQgPSBcImdhbWVDYW52YXNcIjtcclxubGV0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbmxldCBlbnZpcm9ubWVudFRpbGVTaXplOiBudW1iZXIgPSA1MDtcclxubGV0IGNlbnRlclJvdzogbnVtYmVyID0gZW52aXJvbm1lbnRSb3dzIC8gMiAtIGNhbnZhcy53aWR0aCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5sZXQgY2VudGVyQ29sdW1uOiBudW1iZXIgPSBlbnZpcm9ubWVudENvbHVtbnMgLyAyIC0gY2FudmFzLmhlaWdodCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG5cclxubGV0IG1pbmltdW1TcGVlZDogbnVtYmVyID0gMC4wMDM7XHJcbmxldCBjdXJyZW50U3BlZWQ6IG51bWJlciA9IG1pbmltdW1TcGVlZDtcclxubGV0IHNwZWVkRGVncmVkYXRpb25UaW1lTWlsbGlzOiBudW1iZXIgPSA3MDA7XHJcbmxldCBsYXN0U3BlZWRCb29zdFNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5sZXQgY3VycmVudFJvdGF0aW9uOiBudW1iZXIgPSAwO1xyXG5sZXQgbWluaW11bVJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IDAuMDA0O1xyXG5sZXQgY3VycmVudFJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IG1pbmltdW1Sb3RhdGlvblNwZWVkO1xyXG5sZXQgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbG9nQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbmxldCBrZXlTdGF0ZXM6IE1hcDxzdHJpbmcsIEtleVN0YXRlPiA9IG5ldyBNYXAoKTtcclxua2V5U3RhdGVzLnNldChcIldcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiQVwiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJTXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIkRcIiwgS2V5U3RhdGUuVVApO1xyXG5cclxubGV0IG1vdXNlRG93blk6IG51bWJlcjtcclxubGV0IG1vdXNlRG93blRpbWU6IG51bWJlcjtcclxuXHJcbmxldCBwcmVsb2FkUmVnaXN0cnk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGd1eVNwcml0ZTogSFRNTEltYWdlRWxlbWVudCA9IGxvYWRJbWFnZShcIi4uL2Fzc2V0cy9ndXkucG5nXCIpO1xyXG5sZXQgZ3V5VmVsb2NpdHlDb2x1bW46IG51bWJlciA9IDA7XHJcbmxldCBndXlWZWxvY2l0eVJvdzogbnVtYmVyID0gMDtcclxubGV0IGd1eUhpdFZlbG9jaXR5Q29sdW1uOiBudW1iZXIgPSAwO1xyXG5sZXQgZ3V5SGl0VmVsb2NpdHlSb3c6IG51bWJlciA9IDA7XHJcbmxldCBndXlMYXN0SGl0VGltZU1pbGxpczogbnVtYmVyO1xyXG5sZXQgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpczogbnVtYmVyID0gODAwO1xyXG5sZXQgbWluR3V5UmFkaXVzOiBudW1iZXIgPSAxMDtcclxubGV0IG1heEd1eVJhZGl1czogbnVtYmVyID0gNDA7XHJcbmxldCBjdXJyZW50R3V5UmFkaXVzOiBudW1iZXIgPSBtaW5HdXlSYWRpdXM7XHJcbmxldCBsYXN0U3BlZWRCb29zdEd1eVJhZGl1czogbnVtYmVyO1xyXG5cclxubGV0IGVudmlyb25tZW50VGltZXJzOiB7Y3VycmVudFRpbWU6IG51bWJlciwgbWF4VGltZTogbnVtYmVyfVtdID0gW1xyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiA3MDAwfSxcclxuICAgIHtjdXJyZW50VGltZTogMCwgbWF4VGltZTogMzUwMH0sXHJcbiAgICB7Y3VycmVudFRpbWU6IDAsIG1heFRpbWU6IDM1MDB9LFxyXG4gICAge2N1cnJlbnRUaW1lOiAwLCBtYXhUaW1lOiAzNTAwfSxcclxuXTtcclxubGV0IGN1cnJlbnRUcmFuc2Zvcm1hdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbmxldCBlbmVtaWVzOiBFbmVteVtdID0gW107XHJcbnNwYXduRW5lbWllcygpO1xyXG5cclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG5cclxuZG9jdW1lbnQub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgIGlmIChlLnJlcGVhdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBrZXkgPSBlLmtleS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgaWYgKGtleVN0YXRlcy5oYXMoa2V5KSkge1xyXG4gICAgICAgIGtleVN0YXRlcy5zZXQoa2V5LCBLZXlTdGF0ZS5ET1dOKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25rZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuVVApO1xyXG4gICAgfVxyXG59O1xyXG5kb2N1bWVudC5vbm1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBtb3VzZURvd25ZID0gZS5jbGllbnRZO1xyXG4gICAgbW91c2VEb3duVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG59XHJcbmRvY3VtZW50Lm9ubW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgbW91c2VVcFkgPSBlLmNsaWVudFk7XHJcbiAgICBsZXQgbW91c2VVcFRpbWU6IG51bWJlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgbGV0IHNwZWVkQm9vc3QgPSBjbGFtcFZhbHVlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgKG1vdXNlVXBZIC0gbW91c2VEb3duWSkgLyAobW91c2VVcFRpbWUgLSBtb3VzZURvd25UaW1lKSxcclxuICAgICAgICAxMCxcclxuICAgICk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXMgPSBtb3VzZVVwVGltZTtcclxuICAgIGxhc3RTcGVlZEJvb3N0U3BlZWQgPSBNYXRoLm1heChtaW5pbXVtU3BlZWQsIHNwZWVkQm9vc3QgKiAwLjAwNCk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQgPSBNYXRoLm1heChtaW5pbXVtUm90YXRpb25TcGVlZCwgc3BlZWRCb29zdCAqIDAuMDA1KTtcclxuICAgIGxhc3RTcGVlZEJvb3N0R3V5UmFkaXVzID0gbWFwTGluZWFyKDAsIHNwZWVkQm9vc3QsIDEwLCBtaW5HdXlSYWRpdXMsIG1heEd1eVJhZGl1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXcoY3VycmVudFRpbWVNaWxsaXM6IG51bWJlcikge1xyXG4gICAgaWYgKHByZXZpb3VzVGltZU1pbGxpcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgZWxhcHNlZFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcyAtIHByZXZpb3VzVGltZU1pbGxpcztcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICBsZXQgbW92ZVg6IG51bWJlciA9IChrZXlTdGF0ZXMuZ2V0KFwiQVwiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IC0xIDogMClcclxuICAgICAgICArIChrZXlTdGF0ZXMuZ2V0KFwiRFwiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IDEgOiAwKTtcclxuICAgIGxldCBtb3ZlWTogbnVtYmVyID0gKGtleVN0YXRlcy5nZXQoXCJXXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gLTEgOiAwKVxyXG4gICAgICAgICsgKGtleVN0YXRlcy5nZXQoXCJTXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gMSA6IDApO1xyXG4gICAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydChtb3ZlWCAqIG1vdmVYICsgbW92ZVkgKiBtb3ZlWSk7XHJcbiAgICBpZiAobWFnbml0dWRlID4gMCkge1xyXG4gICAgICAgIG1vdmVYID0gbW92ZVggLyBtYWduaXR1ZGUgKiBjdXJyZW50U3BlZWQ7XHJcbiAgICAgICAgbW92ZVkgPSBtb3ZlWSAvIG1hZ25pdHVkZSAqIGN1cnJlbnRTcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaGl0WDogbnVtYmVyID0gMDtcclxuICAgIGxldCBoaXRZOiBudW1iZXIgPSAwO1xyXG4gICAgaWYgKGd1eUxhc3RIaXRUaW1lTWlsbGlzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBoaXRYID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzICsgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlDb2x1bW4sXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBoaXRZID0gbWFwTGluZWFyKFxyXG4gICAgICAgICAgICBndXlMYXN0SGl0VGltZU1pbGxpcyxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIGd1eUxhc3RIaXRUaW1lTWlsbGlzICsgZ3V5SGl0UmVjb3ZlcnlEdXJhdGlvbk1pbGxpcyxcclxuICAgICAgICAgICAgZ3V5SGl0VmVsb2NpdHlSb3csXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ3V5VmVsb2NpdHlDb2x1bW4gPSBtb3ZlWCArIGhpdFg7XHJcbiAgICBndXlWZWxvY2l0eVJvdyA9IG1vdmVZICsgaGl0WTtcclxuXHJcbiAgICBjZW50ZXJDb2x1bW4gKz0gZ3V5VmVsb2NpdHlDb2x1bW4gKiBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgIGNlbnRlclJvdyArPSBndXlWZWxvY2l0eVJvdyAqIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG5cclxuICAgIGN1cnJlbnRSb3RhdGlvbiArPSBlbGFwc2VkVGltZU1pbGxpcyAqIGN1cnJlbnRSb3RhdGlvblNwZWVkO1xyXG5cclxuICAgIGlmIChsYXN0U3BlZWRCb29zdFNwZWVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RTcGVlZCxcclxuICAgICAgICAgICAgbWluaW11bVNwZWVkLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkLFxyXG4gICAgICAgICAgICBtaW5pbXVtUm90YXRpb25TcGVlZCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnJlbnRHdXlSYWRpdXMgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RHdXlSYWRpdXMsXHJcbiAgICAgICAgICAgIG1pbkd1eVJhZGl1cyxcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtaW5pbXVtU3BlZWQ7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtaW5pbXVtUm90YXRpb25TcGVlZDtcclxuICAgICAgICBjdXJyZW50R3V5UmFkaXVzID0gbWluR3V5UmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0b3BMZWZ0Q29sdW1uOiBudW1iZXIgPSBjZW50ZXJDb2x1bW4gLSAoY2FudmFzLndpZHRoIC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IHRvcExlZnRSb3c6IG51bWJlciA9IGNlbnRlclJvdyAtIChjYW52YXMuaGVpZ2h0IC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IGd1eUNlbnRlclggPSBjb2x1bW5Ub1goY2VudGVyQ29sdW1uLCB0b3BMZWZ0Q29sdW1uLCBlbnZpcm9ubWVudFRpbGVTaXplKTtcclxuICAgIGxldCBndXlDZW50ZXJZID0gcm93VG9ZKGNlbnRlclJvdywgdG9wTGVmdFJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICBcclxuICAgIGxldCBlbnZpcm9ubWVudERyYXdDb3VudCA9IGRyYXdFbnZpcm9ubWVudCh0b3BMZWZ0Q29sdW1uLCB0b3BMZWZ0Um93KTtcclxuXHJcbiAgICAvLyB1cGRhdGUgYWxsIGVuZW15IHgncyBhbmQgeSdzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlbmVtaWVzW2ldLnVwZGF0ZShjZW50ZXJDb2x1bW4sIGNlbnRlclJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSwgY3VycmVudFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvIGNvbGxpc2lvbiBhbmQgZ2FtZSBzaW11bGF0aW9uIHN0dWZmXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZW5lbXk6IEVuZW15ID0gZW5lbWllc1tpXTtcclxuICAgICAgICBpZiAoY29sbGlkZUNpcmNsZXMoXHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICBlbmVteS54LFxyXG4gICAgICAgICAgICBlbmVteS55LFxyXG4gICAgICAgICAgICBlbmVteS5yYWRpdXMpXHJcbiAgICAgICAgICAgICYmIChcclxuICAgICAgICAgICAgICAgIGVuZW15Lmxhc3RIaXRUaW1lTWlsbGlzID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgIHx8IChjdXJyZW50VGltZU1pbGxpcyAtIGVuZW15Lmxhc3RIaXRUaW1lTWlsbGlzKSA+IGVuZW15LmhpdFJlY292ZXJ5RHVyYXRpb25NaWxsaXNcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgZW5lbXlNYXNzOiBudW1iZXIgPSBlbmVteS5yYWRpdXM7XHJcbiAgICAgICAgICAgIGxldCBndXlNYXNzOiBudW1iZXIgPSBjdXJyZW50R3V5UmFkaXVzO1xyXG4gICAgICAgICAgICBsZXQgZ3V5Q2VudGVyOiBWZWN0b3IgPSBuZXcgVmVjdG9yKGd1eUNlbnRlclgsIGd1eUNlbnRlclkpO1xyXG4gICAgICAgICAgICBsZXQgZW5lbXlDZW50ZXI6IFZlY3RvciA9IG5ldyBWZWN0b3IoZW5lbXkueCwgZW5lbXkueSk7XHJcbiAgICAgICAgICAgIGxldCBndXlWZWxvY2l0eTogVmVjdG9yID0gbmV3IFZlY3RvcihndXlWZWxvY2l0eUNvbHVtbiwgZ3V5VmVsb2NpdHlSb3cpXHJcbiAgICAgICAgICAgICAgICAucGx1cyhlbmVteUNlbnRlci5taW51cyhndXlDZW50ZXIpLm5vcm1hbGl6ZSgpLnNjYWxlKDAuMDEpKTtcclxuICAgICAgICAgICAgbGV0IGVuZW15VmVsb2NpdHk6IFZlY3RvciA9IG5ldyBWZWN0b3IoZW5lbXkuaGl0VmVsb2NpdHlDb2x1bW4sIGVuZW15LmhpdFZlbG9jaXR5Um93KTtcclxuICAgICAgICAgICAgbGV0IGd1eUhpdFZlbG9jaXR5OiBWZWN0b3IgPSBnZXRDb2xsaXNpb25WZWxvY2l0eShcclxuICAgICAgICAgICAgICAgIGd1eUNlbnRlcixcclxuICAgICAgICAgICAgICAgIGVuZW15Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZ3V5TWFzcyxcclxuICAgICAgICAgICAgICAgIGVuZW15TWFzcyxcclxuICAgICAgICAgICAgICAgIGd1eVZlbG9jaXR5LFxyXG4gICAgICAgICAgICAgICAgZW5lbXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgKS5zY2FsZSgwLjIpO1xyXG4gICAgICAgICAgICBndXlIaXRWZWxvY2l0eUNvbHVtbiA9IGd1eUhpdFZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgIGd1eUhpdFZlbG9jaXR5Um93ID0gZ3V5SGl0VmVsb2NpdHkueTtcclxuICAgICAgICAgICAgZ3V5TGFzdEhpdFRpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBlbmVteUhpdFZlbG9jaXR5OiBWZWN0b3IgPSBnZXRDb2xsaXNpb25WZWxvY2l0eShcclxuICAgICAgICAgICAgICAgIGVuZW15Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZ3V5Q2VudGVyLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlNYXNzLFxyXG4gICAgICAgICAgICAgICAgZ3V5TWFzcyxcclxuICAgICAgICAgICAgICAgIGVuZW15VmVsb2NpdHksXHJcbiAgICAgICAgICAgICAgICBndXlWZWxvY2l0eSxcclxuICAgICAgICAgICAgKS5zY2FsZSgwLjMpO1xyXG4gICAgICAgICAgICBlbmVteS5sYXN0SGl0VGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBlbmVteS5oaXRWZWxvY2l0eUNvbHVtbiA9IGVuZW15SGl0VmVsb2NpdHkueDtcclxuICAgICAgICAgICAgZW5lbXkuaGl0VmVsb2NpdHlSb3cgPSBlbmVteUhpdFZlbG9jaXR5Lnk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgZGFtYWdlTXVsdGlwbGllcjogbnVtYmVyID0gZ2V0RGFtYWdlTXVsdGlwbGllcihjdXJyZW50VHJhbnNmb3JtYXRpb24gYXMgRW52aXJvbm1lbnRLZXksIGVuZW15LmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYW1hZ2VNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgZW5lbXkuY3VycmVudEhlYWx0aCAtPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgICAgICBtaW5HdXlSYWRpdXMsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgbWF4R3V5UmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDEwICogZGFtYWdlTXVsdGlwbGllcixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIGRlYWQgZW5lbWllc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGVuZW1pZXNbaV0uY3VycmVudEhlYWx0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGVuZW1pZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBpLS07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgYWxsIGVuZW1pZXNcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0uZHJhdyhjdXJyZW50VGltZU1pbGxpcywgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZW52aXJvbm1lbnQgdGltZXJzXHJcbiAgICBsZXQgY3VycmVudEVudmlyb25tZW50OiBFbnZpcm9ubWVudEtleSA9IGdldEN1cnJlbnRFbnZpcm9ubWVudChjZW50ZXJDb2x1bW4sIGNlbnRlclJvdyk7XHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSAoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KSkge1xyXG4gICAgICAgIGxldCBjdXJyZW50VGltZXIgPSBlbnZpcm9ubWVudFRpbWVyc1tjdXJyZW50RW52aXJvbm1lbnRdO1xyXG4gICAgICAgIGN1cnJlbnRUaW1lci5jdXJyZW50VGltZSArPSBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgICAgICBpZiAoY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID4gY3VycmVudFRpbWVyLm1heFRpbWUpIHtcclxuICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWVyLm1heFRpbWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50VGltZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKChpIGFzIEVudmlyb25tZW50S2V5KSAhPT0gY3VycmVudEVudmlyb25tZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50VGltZXIgPSBlbnZpcm9ubWVudFRpbWVyc1tpXTtcclxuICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lIC09IGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVyLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB0cmlnZ2VyIHRyYW5zZm9ybWF0aW9uXHJcbiAgICBpZiAoY3VycmVudEVudmlyb25tZW50ICE9PSAoY3VycmVudFRyYW5zZm9ybWF0aW9uIGFzIEVudmlyb25tZW50S2V5KVxyXG4gICAgICAgICYmIGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF0uY3VycmVudFRpbWUgPT09IGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF0ubWF4VGltZVxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUUkFOU0ZPUk0hISFcIik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFRpbWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBlbnZpcm9ubWVudFRpbWVyc1tpXS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRUcmFuc2Zvcm1hdGlvbiA9IGN1cnJlbnRFbnZpcm9ubWVudCBhcyBudW1iZXI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIGRyYXcgZW52aXJvbm1lbnQgZHJhdyBjb3VudFxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgIGN0eC5mb250ID0gXCIzMHB4IEFyaWFsXCI7XHJcbiAgICBjdHguZmlsbFRleHQoZW52aXJvbm1lbnREcmF3Q291bnQudG9TdHJpbmcoKSwgY2FudmFzLndpZHRoIC8gMiAtIDEwLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyB0aGUgZ3V5XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LnRyYW5zbGF0ZShndXlDZW50ZXJYLCBndXlDZW50ZXJZKTtcclxuICAgIGN0eC5yb3RhdGUoY3VycmVudFJvdGF0aW9uKTtcclxuICAgIGN0eC50cmFuc2xhdGUoLWd1eUNlbnRlclgsIC1ndXlDZW50ZXJZKTtcclxuICAgIGN0eC5kcmF3SW1hZ2UoZ3V5U3ByaXRlLCBndXlDZW50ZXJYIC0gZ3V5U3ByaXRlLndpZHRoIC8gMiwgZ3V5Q2VudGVyWSAtIGd1eVNwcml0ZS5oZWlnaHQgLyAyKTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgLy8gZHJhdyBndXkgcmFkaXVzIChmb3IgdGVzdGluZylcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiZ3JheVwiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhndXlDZW50ZXJYLCBndXlDZW50ZXJZLCBjdXJyZW50R3V5UmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGlmIChjdXJyZW50RW52aXJvbm1lbnQgIT09IGN1cnJlbnRUcmFuc2Zvcm1hdGlvbikge1xyXG4gICAgICAgIGxldCB0aWxlQ2VudGVyWDogbnVtYmVyID0gZ3V5Q2VudGVyWCArIDUwO1xyXG4gICAgICAgIGxldCB0aWxlQ2VudGVyWTogbnVtYmVyID0gZ3V5Q2VudGVyWSAtIDcwO1xyXG4gICAgICAgIGxldCB0aWxlU2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBkcmF3RW52aXJvbm1lbnRUaWxlKHRpbGVDZW50ZXJYIC0gdGlsZVNpemUgLyAyLCB0aWxlQ2VudGVyWSAtIHRpbGVTaXplIC8gMiwgdGlsZVNpemUsIGN1cnJlbnRFbnZpcm9ubWVudCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIjtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCh0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiwgdGlsZUNlbnRlclkgLSB0aWxlU2l6ZSAvIDIsIHRpbGVTaXplLCB0aWxlU2l6ZSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSAxMDA7XHJcbiAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gMTA7XHJcbiAgICAgICAgbGV0IHRvcExlZnRYOiBudW1iZXIgPSB0aWxlQ2VudGVyWCAtIHRpbGVTaXplIC8gMiAtIHdpZHRoIC0gMTA7XHJcbiAgICAgICAgbGV0IHRvcExlZnRZOiBudW1iZXIgPSB0aWxlQ2VudGVyWSAtIGhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRFbnZpcm9ubWVudFRpbWVyOiB7Y3VycmVudFRpbWU6IG51bWJlciwgbWF4VGltZTogbnVtYmVyfSA9IGVudmlyb25tZW50VGltZXJzW2N1cnJlbnRFbnZpcm9ubWVudF07XHJcbiAgICAgICAgbGV0IGZpbGxSYXRpbzogbnVtYmVyID0gKGN1cnJlbnRFbnZpcm9ubWVudFRpbWVyLmN1cnJlbnRUaW1lIC8gY3VycmVudEVudmlyb25tZW50VGltZXIubWF4VGltZSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JheVwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0b3BMZWZ0WCwgdG9wTGVmdFksIHdpZHRoICogZmlsbFJhdGlvLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRvcExlZnRYLCB0b3BMZWZ0WSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuICAgIC8vIFRPRE86IG9uIHRyYW5zZm9ybWF0aW9uLCBzZXQgdGhlIHRyYW5zZm9ybWVkLXRvIHRpbWVyIHRvIHplcm9cclxuXHJcbiAgICAvLyBkcmF3IGZwc1xyXG4gICAgbGV0IGZwczogbnVtYmVyID0gMTAwMCAvIGVsYXBzZWRUaW1lTWlsbGlzO1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMzBweCBBcmlhbFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KE1hdGgucm91bmQoZnBzKS50b1N0cmluZygpICsgXCJGUFNcIiwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgcHJldmlvdXNUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2VTb3VyY2U6IHN0cmluZyk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgaWYgKHByZWxvYWRSZWdpc3RyeS5oYXMoaW1hZ2VTb3VyY2UpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGF0dGVtcHRlZCB0byBsb2FkIHRoZSBzYW1lIGltYWdlIHR3aWNlIGR1cmluZyBwcmVsb2FkaW5nLlwiKTtcclxuICAgIH1cclxuICAgIHByZWxvYWRSZWdpc3RyeS5zZXQoaW1hZ2VTb3VyY2UsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBUaGUgb3JkZXIgdGhlc2UgMyB0aGluZ3MgYXJlIGRvbmUgaW4gaXMgVkVSWSBpbXBvcnRhbnQhXHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICBwcmVsb2FkUmVnaXN0cnkuc2V0KGltYWdlU291cmNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGltYWdlLnNyYyA9IGltYWdlU291cmNlO1xyXG5cclxuICAgIHJldHVybiBpbWFnZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlbG9hZCgpIHtcclxuICAgIGZvciAobGV0IFtrZXksIGxvYWRlZF0gb2YgcHJlbG9hZFJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgaWYgKCFsb2FkZWQpIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGF3bkVuZW1pZXMoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBsZXQgbWluUmFkaXVzOiBudW1iZXIgPSA3O1xyXG4gICAgICAgIGxldCBtYXhSYWRpdXM6IG51bWJlciA9IDIwO1xyXG4gICAgICAgIGxldCByYWRpdXM6IG51bWJlciA9IHJhbmRvbUludChtaW5SYWRpdXMsIG1heFJhZGl1cyk7XHJcbiAgICAgICAgbGV0IGhlYWx0aDogbnVtYmVyID0gbWFwTGluZWFyKG1pblJhZGl1cywgcmFkaXVzLCBtYXhSYWRpdXMsIDUwLCAyMDApO1xyXG4gICAgICAgIGVuZW1pZXMucHVzaChuZXcgRW5lbXkoXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBlbnZpcm9ubWVudENvbHVtbnMsXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBlbnZpcm9ubWVudFJvd3MsXHJcbiAgICAgICAgICAgIHJhZGl1cyxcclxuICAgICAgICAgICAgaGVhbHRoLFxyXG4gICAgICAgICAgICByYW5kb21JbnQoMCwgMykgYXMgRW52aXJvbm1lbnRLZXksXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdFbnZpcm9ubWVudCh0b3BMZWZ0Q29sdW1uOiBudW1iZXIsIHRvcExlZnRSb3c6IG51bWJlcikge1xyXG4gICAgbGV0IGJvdHRvbVJpZ2h0Q29sdW1uOiBudW1iZXIgPSB0b3BMZWZ0Q29sdW1uICsgY2FudmFzLndpZHRoIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBib3R0b21SaWdodFJvdzogbnVtYmVyID0gdG9wTGVmdFJvdyArIGNhbnZhcy5oZWlnaHQgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IG1pbkNvbHVtbjogbnVtYmVyID0gTWF0aC5mbG9vcih0b3BMZWZ0Q29sdW1uKTtcclxuICAgIGxldCBtYXhDb2x1bW46IG51bWJlciA9IE1hdGguY2VpbChib3R0b21SaWdodENvbHVtbik7XHJcbiAgICBsZXQgbWluUm93OiBudW1iZXIgPSBNYXRoLmZsb29yKHRvcExlZnRSb3cpO1xyXG4gICAgbGV0IG1heFJvdzogbnVtYmVyID0gTWF0aC5jZWlsKGJvdHRvbVJpZ2h0Um93KTtcclxuICAgIGxldCBlbnZpcm9ubWVudERyYXdDb3VudDogbnVtYmVyID0gMDtcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBmb3IgKGxldCBpID0gbWluUm93OyBpIDw9IG1heFJvdzsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IG1pbkNvbHVtbjsgaiA8PSBtYXhDb2x1bW47IGorKykge1xyXG4gICAgICAgICAgICBsZXQgd3JhcHBlZFJvdzogbnVtYmVyID0gd3JhcFZhbHVlKDAsIGksIGVudmlyb25tZW50Um93cyAtIDEpO1xyXG4gICAgICAgICAgICBsZXQgd3JhcHBlZENvbHVtbjogbnVtYmVyID0gd3JhcFZhbHVlKDAsIGosIGVudmlyb25tZW50Q29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBsZXQga2V5OiBFbnZpcm9ubWVudEtleSA9IGVudmlyb25tZW50W3dyYXBwZWRSb3ddW3dyYXBwZWRDb2x1bW5dO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGNvbHVtblRvWChqLCB0b3BMZWZ0Q29sdW1uLCBlbnZpcm9ubWVudFRpbGVTaXplKTtcclxuICAgICAgICAgICAgbGV0IHkgPSByb3dUb1koaSwgdG9wTGVmdFJvdywgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIGRyYXdFbnZpcm9ubWVudFRpbGUoTWF0aC5mbG9vcih4KSwgTWF0aC5mbG9vcih5KSwgZW52aXJvbm1lbnRUaWxlU2l6ZSwga2V5KTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KFwiKFwiICsgd3JhcHBlZFJvdyArIFwiLFwiICsgd3JhcHBlZENvbHVtbiArIFwiKVwiLCB4LCB5KTtcclxuICAgICAgICAgICAgZW52aXJvbm1lbnREcmF3Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgcmV0dXJuIGVudmlyb25tZW50RHJhd0NvdW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RW52aXJvbm1lbnRUaWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXplOiBudW1iZXIsIGtleTogRW52aXJvbm1lbnRLZXkpIHtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBnZXRFbnZpcm9ubWVudENvbG9yKGtleSkudG9TdHJpbmcoKTtcclxuICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzaXplLCBzaXplKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudEVudmlyb25tZW50KGNlbnRlckNvbHVtbjogbnVtYmVyLCBjZW50ZXJSb3c6IG51bWJlcik6IEVudmlyb25tZW50S2V5IHtcclxuICAgIGxldCB3cmFwcGVkUm93OiBudW1iZXIgPSB3cmFwVmFsdWUoMCwgTWF0aC5mbG9vcihjZW50ZXJSb3cpLCBlbnZpcm9ubWVudFJvd3MgLSAxKTtcclxuICAgIGxldCB3cmFwcGVkQ29sdW1uOiBudW1iZXIgPSB3cmFwVmFsdWUoMCwgTWF0aC5mbG9vcihjZW50ZXJDb2x1bW4pLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKTtcclxuICAgIHJldHVybiBlbnZpcm9ubWVudFt3cmFwcGVkUm93XVt3cmFwcGVkQ29sdW1uXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGFtYWdlTXVsdGlwbGllcihhdHRhY2tlcjogRW52aXJvbm1lbnRLZXksIGRlZmVuZGVyOiBFbnZpcm9ubWVudEtleSk6IG51bWJlciB7XHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQgfHwgZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGF0dGFja2VyID09PSBFbnZpcm9ubWVudEtleS5GT1JFU1QpIHtcclxuICAgICAgICBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LkRFU0VSVCkge1xyXG4gICAgICAgIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuRk9SRVNUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVmZW5kZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuREVTRVJUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXR0YWNrZXIgPT09IEVudmlyb25tZW50S2V5LldBVEVSKSB7XHJcbiAgICAgICAgaWYgKGRlZmVuZGVyID09PSBFbnZpcm9ubWVudEtleS5ERVNFUlQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuRk9SRVNUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwLjU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWZlbmRlciA9PT0gRW52aXJvbm1lbnRLZXkuV0FURVIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuc2V0VGltZW91dChwcmVsb2FkLCAwKTtcclxuXHJcbiIsImV4cG9ydCBlbnVtIEtleVN0YXRlIHtcclxuICAgIFVQLFxyXG4gICAgRE9XTixcclxufVxyXG4iLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuL2NvbG9yXCI7XHJcbmltcG9ydCB7IEVudmlyb25tZW50S2V5IH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4vdmVjdG9yXCI7XHJcblxyXG4vLyBub3RlOiBhc3N1bWVzIGZyb21TdGFydCBpcyBsZXNzIHRoYW4gZnJvbUVuZCwgdG9TdGFydCBpcyBsZXNzIHRoYW4gdG9FbmRcclxuZXhwb3J0IGZ1bmN0aW9uIG1hcExpbmVhcihcclxuICAgIGZyb21TdGFydDogbnVtYmVyLFxyXG4gICAgZnJvbVZhbHVlOiBudW1iZXIsXHJcbiAgICBmcm9tRW5kOiBudW1iZXIsXHJcbiAgICB0b1N0YXJ0OiBudW1iZXIsXHJcbiAgICB0b0VuZDogbnVtYmVyXHJcbikge1xyXG4gICAgZnJvbVZhbHVlID0gY2xhbXBWYWx1ZShNYXRoLm1pbihmcm9tU3RhcnQsIGZyb21FbmQpLCBmcm9tVmFsdWUsIE1hdGgubWF4KGZyb21TdGFydCwgZnJvbUVuZCkpO1xyXG4gICAgbGV0IHJhdGlvOiBudW1iZXIgPSAoZnJvbVZhbHVlIC0gZnJvbVN0YXJ0KSAvIChmcm9tRW5kIC0gZnJvbVN0YXJ0KTtcclxuICAgIHJldHVybiB0b1N0YXJ0ICsgcmF0aW8gKiAodG9FbmQgLSB0b1N0YXJ0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wVmFsdWUobWluOiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4pIHtcclxuICAgICAgICByZXR1cm4gbWluO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlID4gbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1heDtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gdGFrZW4gZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL3JhbmRvbVxyXG4vLyBUaGUgbWF4aW11bSBpcyBpbmNsdXNpdmUgYW5kIHRoZSBtaW5pbXVtIGlzIGluY2x1c2l2ZVxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBWYWx1ZShtaW46IG51bWJlciwgdmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIGlmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkge1xyXG4gICAgICAgIHJldHVybiBtb2QodmFsdWUgLSBtaW4sIG1heCArIDEgLSBtaW4pICsgbWluO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG4vLyB0aGlzIG1vZHVsbyBoYW5kbGVzIG5lZ2F0aXZlcyBob3cgaXQncyBzdXBwb3NlZCB0b1xyXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NDY3NTM5L2phdmFzY3JpcHQtbW9kdWxvLWdpdmVzLWEtbmVnYXRpdmUtcmVzdWx0LWZvci1uZWdhdGl2ZS1udW1iZXJzXHJcbmZ1bmN0aW9uIG1vZChuOiBudW1iZXIsIG06IG51bWJlcikge1xyXG4gICAgcmV0dXJuICgobiAlIG0pICsgbSkgJSBtO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sdW1uVG9YKGNvbHVtbjogbnVtYmVyLCB0b3BMZWZ0Q29sdW1uOiBudW1iZXIsIGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChjb2x1bW4gLSB0b3BMZWZ0Q29sdW1uKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3dUb1kocm93OiBudW1iZXIsIHRvcExlZnRSb3c6IG51bWJlciwgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKHJvdyAtIHRvcExlZnRSb3cpICogZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxpZGVDaXJjbGVzKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHIxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHIyOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBNYXRoLmFicyh4MSAtIHgyKSA8IHIxICsgcjJcclxuICAgICAgICAmJiBNYXRoLmFicyh5MSAtIHkyKSA8IHIxICsgcjI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xsaXNpb25WZWxvY2l0eShjMTogVmVjdG9yLCBjMjogVmVjdG9yLCBtMTogbnVtYmVyLCBtMjogbnVtYmVyLCB2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgIGxldCBjMU1pbnVzYzI6IFZlY3RvciA9IGMxLm1pbnVzKGMyKTtcclxuICAgIHJldHVybiBjMU1pbnVzYzJcclxuICAgICAgICAuc2NhbGUoXHJcbiAgICAgICAgICAgIC0yICogbTIgLyAobTEgKyBtMilcclxuICAgICAgICAgICAgKiBWZWN0b3IuaW5uZXJQcm9kdWN0KHYxLm1pbnVzKHYyKSwgYzFNaW51c2MyKVxyXG4gICAgICAgICAgICAvIGMxTWludXNjMi5ub3JtU3F1YXJlZCgpXHJcbiAgICAgICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudmlyb25tZW50Q29sb3Ioa2V5OiBFbnZpcm9ubWVudEtleSk6IENvbG9yIHtcclxuICAgIHN3aXRjaChrZXkpIHtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkRFRkFVTFQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMTAwLCAyNTUsIDEwMCk7XHJcbiAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5GT1JFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMjAwLCAwKTtcclxuICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkRFU0VSVDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDI1NSwgNTApO1xyXG4gICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuV0FURVI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMjU1KTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVmVjdG9yIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWludXModjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBsdXModjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbm5lclByb2R1Y3QodjE6IFZlY3RvciwgdjI6IFZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB2MS54ICogdjIueCArIHYxLnkgKiB2Mi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtYWduaXR1ZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1TcXVhcmVkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGUoc2NhbGFyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKiBzY2FsYXIsIHRoaXMueSAqIHNjYWxhcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZSgpOiBWZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCwgdGhpcy55KS5zY2FsZSgxIC8gdGhpcy5tYWduaXR1ZGUoKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==