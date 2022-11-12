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
class Color {
    static toRGB(r, g, b) {
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    static toRGBA(r, g, b, a) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
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
let environmentRows = 50;
let environmentColumns = 50;
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
/* harmony export */   "mapLinear": () => (/* binding */ mapLinear),
/* harmony export */   "randomInt": () => (/* binding */ randomInt),
/* harmony export */   "wrapValue": () => (/* binding */ wrapValue)
/* harmony export */ });
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color */ "./src/color.ts");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment */ "./src/environment.ts");
/* harmony import */ var _key_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./key_state */ "./src/key_state.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");




let previousTimeMillis;
let canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
canvas.id = "gameCanvas";
let ctx = canvas.getContext("2d");
let environmentTileSize = 50;
let topLeftRow = Math.floor(_environment__WEBPACK_IMPORTED_MODULE_1__.environmentRows / 2 - canvas.width / 2 / environmentTileSize) - 0.5;
let topLeftColumn = Math.floor(_environment__WEBPACK_IMPORTED_MODULE_1__.environmentColumns / 2 - canvas.height / 2 / environmentTileSize) - 0.5;
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
    lastSpeedBoostSpeed = speedBoost * 0.004;
    lastSpeedBoostRotationSpeed = speedBoost * 0.005;
};
for (let i = 10; i > -200; i--) {
    console.log(i, (0,_util__WEBPACK_IMPORTED_MODULE_3__.wrapValue)(10, i, 20));
}
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
        moveX = moveX / magnitude * elapsedTimeMillis * currentSpeed;
        moveY = moveY / magnitude * elapsedTimeMillis * currentSpeed;
        topLeftColumn += moveX;
        topLeftRow += moveY;
        currentRotation += elapsedTimeMillis * currentRotationSpeed;
    }
    if (lastSpeedBoostSpeed !== undefined) {
        currentSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostSpeed, minimumSpeed);
        currentRotationSpeed = (0,_util__WEBPACK_IMPORTED_MODULE_3__.mapLinear)(0, currentTimeMillis - lastSpeedBoostTimeMillis, speedDegredationTimeMillis, lastSpeedBoostRotationSpeed, minimumRotationSpeed);
    }
    else {
        currentSpeed = minimumSpeed;
        currentRotationSpeed = minimumRotationSpeed;
    }
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
            let color;
            switch (key) {
                case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DEFAULT:
                    color = _color__WEBPACK_IMPORTED_MODULE_0__.Color.toRGB(100, 255, 100);
                    break;
                case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.FOREST:
                    color = _color__WEBPACK_IMPORTED_MODULE_0__.Color.toRGB(0, 200, 0);
                    break;
                case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.DESERT:
                    color = _color__WEBPACK_IMPORTED_MODULE_0__.Color.toRGB(255, 255, 50);
                    break;
                case _environment__WEBPACK_IMPORTED_MODULE_1__.EnvironmentKey.WATER:
                    color = _color__WEBPACK_IMPORTED_MODULE_0__.Color.toRGB(0, 0, 255);
                    break;
            }
            ctx.fillStyle = color;
            let x = columnToX(j);
            let y = rowToY(i);
            ctx.fillRect(x, y, environmentTileSize, environmentTileSize);
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("(" + wrappedRow + "," + wrappedColumn + ")", x, y);
            environmentDrawCount++;
        }
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "black";
    ctx.textBaseline = "bottom";
    ctx.font = "30px Arial";
    ctx.fillText(environmentDrawCount.toString(), canvas.width / 2 - 10, canvas.height);
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
function columnToX(column) {
    return (column - topLeftColumn) * environmentTileSize;
}
function rowToY(row) {
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

})();

exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9jb2xvci50cyIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2Vudmlyb25tZW50LnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMva2V5X3N0YXRlLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leHBvcnRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyB0b1JHQihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICsgciArIFwiLFwiICsgZyArIFwiLFwiICsgYiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9SR0JBKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBcInJnYmEoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIsXCIgKyBhICsgXCIpXCI7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcmFuZG9tSW50LCB3cmFwVmFsdWUgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5leHBvcnQgZW51bSBFbnZpcm9ubWVudEtleSB7XHJcbiAgICBERUZBVUxULFxyXG4gICAgRk9SRVNULFxyXG4gICAgREVTRVJULFxyXG4gICAgV0FURVIsXHJcbn1cclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudDogRW52aXJvbm1lbnRLZXlbXVtdID0gW107XHJcbmV4cG9ydCBsZXQgZW52aXJvbm1lbnRSb3dzOiBudW1iZXIgPSA1MDtcclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudENvbHVtbnM6IG51bWJlciA9IDUwO1xyXG5cclxuZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgbGV0IHJvdzogRW52aXJvbm1lbnRLZXlbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC45OTcpIHtcclxuICAgICAgICAgICAgcm93LnB1c2goRW52aXJvbm1lbnRLZXkuREVGQVVMVCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcm93LnB1c2gocmFuZG9tSW50KDEsIDMpIGFzIEVudmlyb25tZW50S2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbnZpcm9ubWVudC5wdXNoKHJvdyk7XHJcbn1cclxuXHJcbmZvciAobGV0IGsgPSAwOyBrIDwgMTA7IGsrKykge1xyXG4gICAgbGV0IGVudmlyb25tZW50Q29weTogRW52aXJvbm1lbnRLZXlbXVtdID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJvdzogRW52aXJvbm1lbnRLZXlbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICAgICAgcm93LnB1c2goZW52aXJvbm1lbnRbaV1bal0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbnZpcm9ubWVudENvcHkucHVzaChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChlbnZpcm9ubWVudENvcHlbaV1bal0gIT09IEVudmlyb25tZW50S2V5LkRFRkFVTFQgJiYgTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHJhbmRvbUludCgxLCA0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbd3JhcFZhbHVlKDAsIGkrMSwgZW52aXJvbm1lbnRSb3dzIC0gMSldW2pdID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbaV1bd3JhcFZhbHVlKDAsIGorMSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSldID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbd3JhcFZhbHVlKDAsIGktMSwgZW52aXJvbm1lbnRSb3dzIC0gMSldW2pdID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRbaV1bd3JhcFZhbHVlKDAsIGotMSwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSldID0gZW52aXJvbm1lbnRbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBlbnVtIEtleVN0YXRlIHtcclxuICAgIFVQLFxyXG4gICAgRE9XTixcclxufVxyXG4iLCIvLyBub3RlOiBhc3N1bWVzIGZyb21TdGFydCBpcyBsZXNzIHRoYW4gZnJvbUVuZCwgdG9TdGFydCBpcyBsZXNzIHRoYW4gdG9FbmRcclxuZXhwb3J0IGZ1bmN0aW9uIG1hcExpbmVhcihcclxuICAgIGZyb21TdGFydDogbnVtYmVyLFxyXG4gICAgZnJvbVZhbHVlOiBudW1iZXIsXHJcbiAgICBmcm9tRW5kOiBudW1iZXIsXHJcbiAgICB0b1N0YXJ0OiBudW1iZXIsXHJcbiAgICB0b0VuZDogbnVtYmVyXHJcbikge1xyXG4gICAgZnJvbVZhbHVlID0gY2xhbXBWYWx1ZShNYXRoLm1pbihmcm9tU3RhcnQsIGZyb21FbmQpLCBmcm9tVmFsdWUsIE1hdGgubWF4KGZyb21TdGFydCwgZnJvbUVuZCkpO1xyXG4gICAgbGV0IHJhdGlvOiBudW1iZXIgPSAoZnJvbVZhbHVlIC0gZnJvbVN0YXJ0KSAvIChmcm9tRW5kIC0gZnJvbVN0YXJ0KTtcclxuICAgIHJldHVybiB0b1N0YXJ0ICsgcmF0aW8gKiAodG9FbmQgLSB0b1N0YXJ0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wVmFsdWUobWluOiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4pIHtcclxuICAgICAgICByZXR1cm4gbWluO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlID4gbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1heDtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gdGFrZW4gZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL3JhbmRvbVxyXG4vLyBUaGUgbWF4aW11bSBpcyBpbmNsdXNpdmUgYW5kIHRoZSBtaW5pbXVtIGlzIGluY2x1c2l2ZVxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBWYWx1ZShtaW46IG51bWJlciwgdmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIGlmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkge1xyXG4gICAgICAgIHJldHVybiBtb2QodmFsdWUgLSBtaW4sIG1heCArIDEgLSBtaW4pICsgbWluO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG4vLyB0aGlzIG1vZHVsbyBoYW5kbGVzIG5lZ2F0aXZlcyBob3cgaXQncyBzdXBwb3NlZCB0b1xyXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NDY3NTM5L2phdmFzY3JpcHQtbW9kdWxvLWdpdmVzLWEtbmVnYXRpdmUtcmVzdWx0LWZvci1uZWdhdGl2ZS1udW1iZXJzXHJcbmZ1bmN0aW9uIG1vZChuOiBudW1iZXIsIG06IG51bWJlcikge1xyXG4gICAgcmV0dXJuICgobiAlIG0pICsgbSkgJSBtO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9jb2xvclwiO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudCwgZW52aXJvbm1lbnRDb2x1bW5zLCBFbnZpcm9ubWVudEtleSwgZW52aXJvbm1lbnRSb3dzIH0gZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcclxuaW1wb3J0IHsgS2V5U3RhdGUgfSBmcm9tIFwiLi9rZXlfc3RhdGVcIjtcclxuaW1wb3J0IHsgY2xhbXBWYWx1ZSwgbWFwTGluZWFyLCB3cmFwVmFsdWUgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG5sZXQgcHJldmlvdXNUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5sZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbmNhbnZhcy53aWR0aCA9IDgwMDtcclxuY2FudmFzLmhlaWdodCA9IDgwMDtcclxuY2FudmFzLmlkID0gXCJnYW1lQ2FudmFzXCI7XHJcbmxldCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5sZXQgZW52aXJvbm1lbnRUaWxlU2l6ZTogbnVtYmVyID0gNTA7XHJcbmxldCB0b3BMZWZ0Um93OiBudW1iZXIgPSBNYXRoLmZsb29yKGVudmlyb25tZW50Um93cyAvIDIgLSBjYW52YXMud2lkdGggLyAyIC8gZW52aXJvbm1lbnRUaWxlU2l6ZSkgLSAwLjU7XHJcbmxldCB0b3BMZWZ0Q29sdW1uOiBudW1iZXIgPSBNYXRoLmZsb29yKGVudmlyb25tZW50Q29sdW1ucyAvIDIgLSBjYW52YXMuaGVpZ2h0IC8gMiAvIGVudmlyb25tZW50VGlsZVNpemUpIC0gMC41O1xyXG5cclxubGV0IG1pbmltdW1TcGVlZDogbnVtYmVyID0gMC4wMDM7XHJcbmxldCBjdXJyZW50U3BlZWQ6IG51bWJlciA9IG1pbmltdW1TcGVlZDtcclxubGV0IHNwZWVkRGVncmVkYXRpb25UaW1lTWlsbGlzOiBudW1iZXIgPSA3MDA7XHJcbmxldCBsYXN0U3BlZWRCb29zdFNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzOiBudW1iZXI7XHJcblxyXG5sZXQgY3VycmVudFJvdGF0aW9uOiBudW1iZXIgPSAwO1xyXG5sZXQgbWluaW11bVJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IDAuMDA0O1xyXG5sZXQgY3VycmVudFJvdGF0aW9uU3BlZWQ6IG51bWJlciA9IG1pbmltdW1Sb3RhdGlvblNwZWVkO1xyXG5sZXQgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkOiBudW1iZXI7XHJcblxyXG5sZXQgbG9nQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbmxldCBrZXlTdGF0ZXM6IE1hcDxzdHJpbmcsIEtleVN0YXRlPiA9IG5ldyBNYXAoKTtcclxua2V5U3RhdGVzLnNldChcIldcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiQVwiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJTXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIkRcIiwgS2V5U3RhdGUuVVApO1xyXG5cclxubGV0IG1vdXNlRG93blk6IG51bWJlcjtcclxubGV0IG1vdXNlRG93blRpbWU6IG51bWJlcjtcclxuXHJcbmxldCBwcmVsb2FkUmVnaXN0cnk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGd1eVNwcml0ZTogSFRNTEltYWdlRWxlbWVudCA9IGxvYWRJbWFnZShcIi4uL2Fzc2V0cy9ndXkucG5nXCIpO1xyXG5cclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG5cclxuZG9jdW1lbnQub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgIGlmIChlLnJlcGVhdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBrZXkgPSBlLmtleS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgaWYgKGtleVN0YXRlcy5oYXMoa2V5KSkge1xyXG4gICAgICAgIGtleVN0YXRlcy5zZXQoa2V5LCBLZXlTdGF0ZS5ET1dOKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25rZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuVVApO1xyXG4gICAgfVxyXG59O1xyXG5kb2N1bWVudC5vbm1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBtb3VzZURvd25ZID0gZS5jbGllbnRZO1xyXG4gICAgbW91c2VEb3duVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG59XHJcbmRvY3VtZW50Lm9ubW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgbW91c2VVcFkgPSBlLmNsaWVudFk7XHJcbiAgICBsZXQgbW91c2VVcFRpbWU6IG51bWJlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgbGV0IHNwZWVkQm9vc3QgPSBjbGFtcFZhbHVlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgKG1vdXNlVXBZIC0gbW91c2VEb3duWSkgLyAobW91c2VVcFRpbWUgLSBtb3VzZURvd25UaW1lKSxcclxuICAgICAgICAxMCxcclxuICAgICk7XHJcbiAgICBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXMgPSBtb3VzZVVwVGltZTtcclxuICAgIGxhc3RTcGVlZEJvb3N0U3BlZWQgPSBzcGVlZEJvb3N0ICogMC4wMDQ7XHJcbiAgICBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQgPSBzcGVlZEJvb3N0ICogMC4wMDU7XHJcbn1cclxuXHJcbmZvciAobGV0IGkgPSAxMDsgaSA+IC0yMDA7IGktLSkge1xyXG4gICAgY29uc29sZS5sb2coaSwgd3JhcFZhbHVlKDEwLCBpLCAyMCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3KGN1cnJlbnRUaW1lTWlsbGlzOiBudW1iZXIpIHtcclxuICAgIGlmIChwcmV2aW91c1RpbWVNaWxsaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByZXZpb3VzVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGVsYXBzZWRUaW1lTWlsbGlzID0gY3VycmVudFRpbWVNaWxsaXMgLSBwcmV2aW91c1RpbWVNaWxsaXM7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgbGV0IG1vdmVYOiBudW1iZXIgPSAoa2V5U3RhdGVzLmdldChcIkFcIikgPT09IEtleVN0YXRlLkRPV04gPyAtMSA6IDApXHJcbiAgICAgICAgKyAoa2V5U3RhdGVzLmdldChcIkRcIikgPT09IEtleVN0YXRlLkRPV04gPyAxIDogMCk7XHJcbiAgICBsZXQgbW92ZVk6IG51bWJlciA9IChrZXlTdGF0ZXMuZ2V0KFwiV1wiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IC0xIDogMClcclxuICAgICAgICArIChrZXlTdGF0ZXMuZ2V0KFwiU1wiKSA9PT0gS2V5U3RhdGUuRE9XTiA/IDEgOiAwKTtcclxuICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQobW92ZVggKiBtb3ZlWCArIG1vdmVZICogbW92ZVkpO1xyXG4gICAgaWYgKG1hZ25pdHVkZSA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IG1vdmVYIC8gbWFnbml0dWRlICogZWxhcHNlZFRpbWVNaWxsaXMgKiBjdXJyZW50U3BlZWQ7XHJcbiAgICAgICAgbW92ZVkgPSBtb3ZlWSAvIG1hZ25pdHVkZSAqIGVsYXBzZWRUaW1lTWlsbGlzICogY3VycmVudFNwZWVkO1xyXG4gICAgICAgIHRvcExlZnRDb2x1bW4gKz0gbW92ZVg7XHJcbiAgICAgICAgdG9wTGVmdFJvdyArPSBtb3ZlWTtcclxuXHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uICs9IGVsYXBzZWRUaW1lTWlsbGlzICogY3VycmVudFJvdGF0aW9uU3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxhc3RTcGVlZEJvb3N0U3BlZWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGN1cnJlbnRTcGVlZCA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMgLSBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIHNwZWVkRGVncmVkYXRpb25UaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBsYXN0U3BlZWRCb29zdFNwZWVkLFxyXG4gICAgICAgICAgICBtaW5pbXVtU3BlZWQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJyZW50Um90YXRpb25TcGVlZCA9IG1hcExpbmVhcihcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgY3VycmVudFRpbWVNaWxsaXMgLSBsYXN0U3BlZWRCb29zdFRpbWVNaWxsaXMsXHJcbiAgICAgICAgICAgIHNwZWVkRGVncmVkYXRpb25UaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBsYXN0U3BlZWRCb29zdFJvdGF0aW9uU3BlZWQsXHJcbiAgICAgICAgICAgIG1pbmltdW1Sb3RhdGlvblNwZWVkLFxyXG4gICAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN1cnJlbnRTcGVlZCA9IG1pbmltdW1TcGVlZDtcclxuICAgICAgICBjdXJyZW50Um90YXRpb25TcGVlZCA9IG1pbmltdW1Sb3RhdGlvblNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBib3R0b21SaWdodENvbHVtbjogbnVtYmVyID0gdG9wTGVmdENvbHVtbiArIGNhbnZhcy53aWR0aCAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICBsZXQgYm90dG9tUmlnaHRSb3c6IG51bWJlciA9IHRvcExlZnRSb3cgKyBjYW52YXMuaGVpZ2h0IC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBtaW5Db2x1bW46IG51bWJlciA9IE1hdGguZmxvb3IodG9wTGVmdENvbHVtbik7XHJcbiAgICBsZXQgbWF4Q29sdW1uOiBudW1iZXIgPSBNYXRoLmNlaWwoYm90dG9tUmlnaHRDb2x1bW4pO1xyXG4gICAgbGV0IG1pblJvdzogbnVtYmVyID0gTWF0aC5mbG9vcih0b3BMZWZ0Um93KTtcclxuICAgIGxldCBtYXhSb3c6IG51bWJlciA9IE1hdGguY2VpbChib3R0b21SaWdodFJvdyk7XHJcbiAgICBsZXQgZW52aXJvbm1lbnREcmF3Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgZm9yIChsZXQgaSA9IG1pblJvdzsgaSA8PSBtYXhSb3c7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSBtaW5Db2x1bW47IGogPD0gbWF4Q29sdW1uOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IHdyYXBwZWRSb3c6IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBpLCBlbnZpcm9ubWVudFJvd3MgLSAxKTtcclxuICAgICAgICAgICAgbGV0IHdyYXBwZWRDb2x1bW46IG51bWJlciA9IHdyYXBWYWx1ZSgwLCBqLCBlbnZpcm9ubWVudENvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgbGV0IGtleTogRW52aXJvbm1lbnRLZXkgPSBlbnZpcm9ubWVudFt3cmFwcGVkUm93XVt3cmFwcGVkQ29sdW1uXTtcclxuICAgICAgICAgICAgbGV0IGNvbG9yOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIHN3aXRjaChrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuREVGQVVMVDpcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLnRvUkdCKDEwMCwgMjU1LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5GT1JFU1Q6XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci50b1JHQigwLCAyMDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5ERVNFUlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci50b1JHQigyNTUsIDI1NSwgNTApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBFbnZpcm9ubWVudEtleS5XQVRFUjpcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLnRvUkdCKDAsIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGNvbHVtblRvWChqKTtcclxuICAgICAgICAgICAgbGV0IHkgPSByb3dUb1koaSk7XHJcblxyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZW52aXJvbm1lbnRUaWxlU2l6ZSwgZW52aXJvbm1lbnRUaWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KFwiKFwiICsgd3JhcHBlZFJvdyArIFwiLFwiICsgd3JhcHBlZENvbHVtbiArIFwiKVwiLCB4LCB5KTtcclxuICAgICAgICAgICAgZW52aXJvbm1lbnREcmF3Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xyXG4gICAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcclxuICAgIGN0eC5maWxsVGV4dChlbnZpcm9ubWVudERyYXdDb3VudC50b1N0cmluZygpLCBjYW52YXMud2lkdGggLyAyIC0gMTAsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBsZXQgY2VudGVyQ29sdW1uID0gdG9wTGVmdENvbHVtbiArIChjYW52YXMud2lkdGggLyAyKSAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICBsZXQgY2VudGVyUm93ID0gdG9wTGVmdFJvdyArIChjYW52YXMuaGVpZ2h0IC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IGNlbnRlclggPSBjb2x1bW5Ub1goY2VudGVyQ29sdW1uKTtcclxuICAgIGxldCBjZW50ZXJZID0gcm93VG9ZKGNlbnRlclJvdyk7XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC50cmFuc2xhdGUoY2VudGVyWCwgY2VudGVyWSk7XHJcbiAgICBjdHgucm90YXRlKGN1cnJlbnRSb3RhdGlvbik7XHJcbiAgICBjdHgudHJhbnNsYXRlKC1jZW50ZXJYLCAtY2VudGVyWSk7XHJcbiAgICBjdHguZHJhd0ltYWdlKGd1eVNwcml0ZSwgY2VudGVyWCAtIGd1eVNwcml0ZS53aWR0aCAvIDIsIGNlbnRlclkgLSBndXlTcHJpdGUuaGVpZ2h0IC8gMik7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGxldCBmcHM6IG51bWJlciA9IDEwMDAgLyBlbGFwc2VkVGltZU1pbGxpcztcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xyXG4gICAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcclxuICAgIGN0eC5maWxsVGV4dChNYXRoLnJvdW5kKGZwcykudG9TdHJpbmcoKSArIFwiRlBTXCIsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIHByZXZpb3VzVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEltYWdlKGltYWdlU291cmNlOiBzdHJpbmcpOiBIVE1MSW1hZ2VFbGVtZW50IHtcclxuICAgIGlmIChwcmVsb2FkUmVnaXN0cnkuaGFzKGltYWdlU291cmNlKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBhdHRlbXB0ZWQgdG8gbG9hZCB0aGUgc2FtZSBpbWFnZSB0d2ljZSBkdXJpbmcgcHJlbG9hZGluZy5cIik7XHJcbiAgICB9XHJcbiAgICBwcmVsb2FkUmVnaXN0cnkuc2V0KGltYWdlU291cmNlLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gVGhlIG9yZGVyIHRoZXNlIDMgdGhpbmdzIGFyZSBkb25lIGluIGlzIFZFUlkgaW1wb3J0YW50IVxyXG4gICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgcHJlbG9hZFJlZ2lzdHJ5LnNldChpbWFnZVNvdXJjZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBpbWFnZS5zcmMgPSBpbWFnZVNvdXJjZTtcclxuXHJcbiAgICByZXR1cm4gaW1hZ2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbHVtblRvWChjb2x1bW46IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChjb2x1bW4gLSB0b3BMZWZ0Q29sdW1uKSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvd1RvWShyb3c6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChyb3cgLSB0b3BMZWZ0Um93KSAqIGVudmlyb25tZW50VGlsZVNpemU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZWxvYWQoKSB7XHJcbiAgICBmb3IgKGxldCBba2V5LCBsb2FkZWRdIG9mIHByZWxvYWRSZWdpc3RyeSkge1xyXG4gICAgICAgIGlmICghbG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHByZWxvYWQsIDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxufVxyXG5cclxud2luZG93LnNldFRpbWVvdXQocHJlbG9hZCwgMCk7XHJcblxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=