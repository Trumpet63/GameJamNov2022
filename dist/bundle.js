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
let environmentRows = 500;
let environmentColumns = 500;
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
            ctx.fillRect(Math.floor(x), Math.floor(y), environmentTileSize, environmentTileSize);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN2QyxDQUFDO0FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2NvbG9yLnRzIiwid2VicGFjazovL2V4cG9ydHMvLi9zcmMvZW52aXJvbm1lbnQudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy9rZXlfc3RhdGUudHMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXhwb3J0cy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V4cG9ydHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leHBvcnRzLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRvUkdCKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2IoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0b1JHQkEocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHIgKyBcIixcIiArIGcgKyBcIixcIiArIGIgKyBcIixcIiArIGEgKyBcIilcIjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyByYW5kb21JbnQsIHdyYXBWYWx1ZSB9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEVudmlyb25tZW50S2V5IHtcclxuICAgIERFRkFVTFQsXHJcbiAgICBGT1JFU1QsXHJcbiAgICBERVNFUlQsXHJcbiAgICBXQVRFUixcclxufVxyXG5leHBvcnQgbGV0IGVudmlyb25tZW50OiBFbnZpcm9ubWVudEtleVtdW10gPSBbXTtcclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudFJvd3M6IG51bWJlciA9IDUwMDtcclxuZXhwb3J0IGxldCBlbnZpcm9ubWVudENvbHVtbnM6IG51bWJlciA9IDUwMDtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgZW52aXJvbm1lbnRSb3dzOyBpKyspIHtcclxuICAgIGxldCByb3c6IEVudmlyb25tZW50S2V5W10gPSBbXTtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW52aXJvbm1lbnRDb2x1bW5zOyBqKyspIHtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuOTk3KSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKEVudmlyb25tZW50S2V5LkRFRkFVTFQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKHJhbmRvbUludCgxLCAzKSBhcyBFbnZpcm9ubWVudEtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZW52aXJvbm1lbnQucHVzaChyb3cpO1xyXG59XHJcblxyXG5mb3IgKGxldCBrID0gMDsgayA8IDEwOyBrKyspIHtcclxuICAgIGxldCBlbnZpcm9ubWVudENvcHk6IEVudmlyb25tZW50S2V5W11bXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnZpcm9ubWVudFJvd3M7IGkrKykge1xyXG4gICAgICAgIGxldCByb3c6IEVudmlyb25tZW50S2V5W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudmlyb25tZW50Q29sdW1uczsgaisrKSB7XHJcbiAgICAgICAgICAgIHJvdy5wdXNoKGVudmlyb25tZW50W2ldW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZW52aXJvbm1lbnRDb3B5LnB1c2gocm93KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudmlyb25tZW50Um93czsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnZpcm9ubWVudENvbHVtbnM7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZW52aXJvbm1lbnRDb3B5W2ldW2pdICE9PSBFbnZpcm9ubWVudEtleS5ERUZBVUxUICYmIE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChyYW5kb21JbnQoMSwgNCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W3dyYXBWYWx1ZSgwLCBpKzEsIGVudmlyb25tZW50Um93cyAtIDEpXVtqXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W2ldW3dyYXBWYWx1ZSgwLCBqKzEsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W3dyYXBWYWx1ZSgwLCBpLTEsIGVudmlyb25tZW50Um93cyAtIDEpXVtqXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50W2ldW3dyYXBWYWx1ZSgwLCBqLTEsIGVudmlyb25tZW50Q29sdW1ucyAtIDEpXSA9IGVudmlyb25tZW50W2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZW51bSBLZXlTdGF0ZSB7XHJcbiAgICBVUCxcclxuICAgIERPV04sXHJcbn1cclxuIiwiLy8gbm90ZTogYXNzdW1lcyBmcm9tU3RhcnQgaXMgbGVzcyB0aGFuIGZyb21FbmQsIHRvU3RhcnQgaXMgbGVzcyB0aGFuIHRvRW5kXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXBMaW5lYXIoXHJcbiAgICBmcm9tU3RhcnQ6IG51bWJlcixcclxuICAgIGZyb21WYWx1ZTogbnVtYmVyLFxyXG4gICAgZnJvbUVuZDogbnVtYmVyLFxyXG4gICAgdG9TdGFydDogbnVtYmVyLFxyXG4gICAgdG9FbmQ6IG51bWJlclxyXG4pIHtcclxuICAgIGZyb21WYWx1ZSA9IGNsYW1wVmFsdWUoTWF0aC5taW4oZnJvbVN0YXJ0LCBmcm9tRW5kKSwgZnJvbVZhbHVlLCBNYXRoLm1heChmcm9tU3RhcnQsIGZyb21FbmQpKTtcclxuICAgIGxldCByYXRpbzogbnVtYmVyID0gKGZyb21WYWx1ZSAtIGZyb21TdGFydCkgLyAoZnJvbUVuZCAtIGZyb21TdGFydCk7XHJcbiAgICByZXR1cm4gdG9TdGFydCArIHJhdGlvICogKHRvRW5kIC0gdG9TdGFydCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcFZhbHVlKG1pbjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgaWYgKHZhbHVlIDwgbWluKSB7XHJcbiAgICAgICAgcmV0dXJuIG1pbjtcclxuICAgIH1cclxuICAgIGlmICh2YWx1ZSA+IG1heCkge1xyXG4gICAgICAgIHJldHVybiBtYXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIHRha2VuIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9yYW5kb21cclxuLy8gVGhlIG1heGltdW0gaXMgaW5jbHVzaXZlIGFuZCB0aGUgbWluaW11bSBpcyBpbmNsdXNpdmVcclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cmFwVmFsdWUobWluOiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4gfHwgdmFsdWUgPiBtYXgpIHtcclxuICAgICAgICByZXR1cm4gbW9kKHZhbHVlIC0gbWluLCBtYXggKyAxIC0gbWluKSArIG1pbjtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuLy8gdGhpcyBtb2R1bG8gaGFuZGxlcyBuZWdhdGl2ZXMgaG93IGl0J3Mgc3VwcG9zZWQgdG9cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDQ2NzUzOS9qYXZhc2NyaXB0LW1vZHVsby1naXZlcy1hLW5lZ2F0aXZlLXJlc3VsdC1mb3ItbmVnYXRpdmUtbnVtYmVyc1xyXG5mdW5jdGlvbiBtb2QobjogbnVtYmVyLCBtOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAoKG4gJSBtKSArIG0pICUgbTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vY29sb3JcIjtcclxuaW1wb3J0IHsgZW52aXJvbm1lbnQsIGVudmlyb25tZW50Q29sdW1ucywgRW52aXJvbm1lbnRLZXksIGVudmlyb25tZW50Um93cyB9IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XHJcbmltcG9ydCB7IEtleVN0YXRlIH0gZnJvbSBcIi4va2V5X3N0YXRlXCI7XHJcbmltcG9ydCB7IGNsYW1wVmFsdWUsIG1hcExpbmVhciwgd3JhcFZhbHVlIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxubGV0IHByZXZpb3VzVGltZU1pbGxpczogbnVtYmVyO1xyXG5cclxubGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5jYW52YXMud2lkdGggPSA4MDA7XHJcbmNhbnZhcy5oZWlnaHQgPSA4MDA7XHJcbmNhbnZhcy5pZCA9IFwiZ2FtZUNhbnZhc1wiO1xyXG5sZXQgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxubGV0IGVudmlyb25tZW50VGlsZVNpemU6IG51bWJlciA9IDUwO1xyXG5sZXQgdG9wTGVmdFJvdzogbnVtYmVyID0gTWF0aC5mbG9vcihlbnZpcm9ubWVudFJvd3MgLyAyIC0gY2FudmFzLndpZHRoIC8gMiAvIGVudmlyb25tZW50VGlsZVNpemUpIC0gMC41O1xyXG5sZXQgdG9wTGVmdENvbHVtbjogbnVtYmVyID0gTWF0aC5mbG9vcihlbnZpcm9ubWVudENvbHVtbnMgLyAyIC0gY2FudmFzLmhlaWdodCAvIDIgLyBlbnZpcm9ubWVudFRpbGVTaXplKSAtIDAuNTtcclxuXHJcbmxldCBtaW5pbXVtU3BlZWQ6IG51bWJlciA9IDAuMDAzO1xyXG5sZXQgY3VycmVudFNwZWVkOiBudW1iZXIgPSBtaW5pbXVtU3BlZWQ7XHJcbmxldCBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpczogbnVtYmVyID0gNzAwO1xyXG5sZXQgbGFzdFNwZWVkQm9vc3RTcGVlZDogbnVtYmVyO1xyXG5cclxubGV0IGxhc3RTcGVlZEJvb3N0VGltZU1pbGxpczogbnVtYmVyO1xyXG5cclxubGV0IGN1cnJlbnRSb3RhdGlvbjogbnVtYmVyID0gMDtcclxubGV0IG1pbmltdW1Sb3RhdGlvblNwZWVkOiBudW1iZXIgPSAwLjAwNDtcclxubGV0IGN1cnJlbnRSb3RhdGlvblNwZWVkOiBudW1iZXIgPSBtaW5pbXVtUm90YXRpb25TcGVlZDtcclxubGV0IGxhc3RTcGVlZEJvb3N0Um90YXRpb25TcGVlZDogbnVtYmVyO1xyXG5cclxubGV0IGxvZ0NvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG5sZXQga2V5U3RhdGVzOiBNYXA8c3RyaW5nLCBLZXlTdGF0ZT4gPSBuZXcgTWFwKCk7XHJcbmtleVN0YXRlcy5zZXQoXCJXXCIsIEtleVN0YXRlLlVQKTtcclxua2V5U3RhdGVzLnNldChcIkFcIiwgS2V5U3RhdGUuVVApO1xyXG5rZXlTdGF0ZXMuc2V0KFwiU1wiLCBLZXlTdGF0ZS5VUCk7XHJcbmtleVN0YXRlcy5zZXQoXCJEXCIsIEtleVN0YXRlLlVQKTtcclxuXHJcbmxldCBtb3VzZURvd25ZOiBudW1iZXI7XHJcbmxldCBtb3VzZURvd25UaW1lOiBudW1iZXI7XHJcblxyXG5sZXQgcHJlbG9hZFJlZ2lzdHJ5OiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoKTtcclxuXHJcbmxldCBndXlTcHJpdGU6IEhUTUxJbWFnZUVsZW1lbnQgPSBsb2FkSW1hZ2UoXCIuLi9hc3NldHMvZ3V5LnBuZ1wiKTtcclxuXHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuXHJcbmRvY3VtZW50Lm9ua2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5yZXBlYXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gZS5rZXkudG9VcHBlckNhc2UoKTtcclxuICAgIGlmIChrZXlTdGF0ZXMuaGFzKGtleSkpIHtcclxuICAgICAgICBrZXlTdGF0ZXMuc2V0KGtleSwgS2V5U3RhdGUuRE9XTik7XHJcbiAgICB9XHJcbn07XHJcbmRvY3VtZW50Lm9ua2V5dXAgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgaWYgKGUucmVwZWF0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGtleSA9IGUua2V5LnRvVXBwZXJDYXNlKCk7XHJcbiAgICBpZiAoa2V5U3RhdGVzLmhhcyhrZXkpKSB7XHJcbiAgICAgICAga2V5U3RhdGVzLnNldChrZXksIEtleVN0YXRlLlVQKTtcclxuICAgIH1cclxufTtcclxuZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgbW91c2VEb3duWSA9IGUuY2xpZW50WTtcclxuICAgIG1vdXNlRG93blRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxufVxyXG5kb2N1bWVudC5vbm1vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgbGV0IG1vdXNlVXBZID0gZS5jbGllbnRZO1xyXG4gICAgbGV0IG1vdXNlVXBUaW1lOiBudW1iZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGxldCBzcGVlZEJvb3N0ID0gY2xhbXBWYWx1ZShcclxuICAgICAgICAwLFxyXG4gICAgICAgIChtb3VzZVVwWSAtIG1vdXNlRG93blkpIC8gKG1vdXNlVXBUaW1lIC0gbW91c2VEb3duVGltZSksXHJcbiAgICAgICAgMTAsXHJcbiAgICApO1xyXG4gICAgbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzID0gbW91c2VVcFRpbWU7XHJcbiAgICBsYXN0U3BlZWRCb29zdFNwZWVkID0gc3BlZWRCb29zdCAqIDAuMDA0O1xyXG4gICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkID0gc3BlZWRCb29zdCAqIDAuMDA1O1xyXG59XHJcblxyXG5mb3IgKGxldCBpID0gMTA7IGkgPiAtMjAwOyBpLS0pIHtcclxuICAgIGNvbnNvbGUubG9nKGksIHdyYXBWYWx1ZSgxMCwgaSwgMjApKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhdyhjdXJyZW50VGltZU1pbGxpczogbnVtYmVyKSB7XHJcbiAgICBpZiAocHJldmlvdXNUaW1lTWlsbGlzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwcmV2aW91c1RpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBlbGFwc2VkVGltZU1pbGxpcyA9IGN1cnJlbnRUaW1lTWlsbGlzIC0gcHJldmlvdXNUaW1lTWlsbGlzO1xyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIGxldCBtb3ZlWDogbnVtYmVyID0gKGtleVN0YXRlcy5nZXQoXCJBXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gLTEgOiAwKVxyXG4gICAgICAgICsgKGtleVN0YXRlcy5nZXQoXCJEXCIpID09PSBLZXlTdGF0ZS5ET1dOID8gMSA6IDApO1xyXG4gICAgbGV0IG1vdmVZOiBudW1iZXIgPSAoa2V5U3RhdGVzLmdldChcIldcIikgPT09IEtleVN0YXRlLkRPV04gPyAtMSA6IDApXHJcbiAgICAgICAgKyAoa2V5U3RhdGVzLmdldChcIlNcIikgPT09IEtleVN0YXRlLkRPV04gPyAxIDogMCk7XHJcbiAgICBsZXQgbWFnbml0dWRlID0gTWF0aC5zcXJ0KG1vdmVYICogbW92ZVggKyBtb3ZlWSAqIG1vdmVZKTtcclxuICAgIGlmIChtYWduaXR1ZGUgPiAwKSB7XHJcbiAgICAgICAgbW92ZVggPSBtb3ZlWCAvIG1hZ25pdHVkZSAqIGVsYXBzZWRUaW1lTWlsbGlzICogY3VycmVudFNwZWVkO1xyXG4gICAgICAgIG1vdmVZID0gbW92ZVkgLyBtYWduaXR1ZGUgKiBlbGFwc2VkVGltZU1pbGxpcyAqIGN1cnJlbnRTcGVlZDtcclxuICAgICAgICB0b3BMZWZ0Q29sdW1uICs9IG1vdmVYO1xyXG4gICAgICAgIHRvcExlZnRSb3cgKz0gbW92ZVk7XHJcblxyXG4gICAgICAgIGN1cnJlbnRSb3RhdGlvbiArPSBlbGFwc2VkVGltZU1pbGxpcyAqIGN1cnJlbnRSb3RhdGlvblNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsYXN0U3BlZWRCb29zdFNwZWVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RTcGVlZCxcclxuICAgICAgICAgICAgbWluaW11bVNwZWVkLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtYXBMaW5lYXIoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzIC0gbGFzdFNwZWVkQm9vc3RUaW1lTWlsbGlzLFxyXG4gICAgICAgICAgICBzcGVlZERlZ3JlZGF0aW9uVGltZU1pbGxpcyxcclxuICAgICAgICAgICAgbGFzdFNwZWVkQm9vc3RSb3RhdGlvblNwZWVkLFxyXG4gICAgICAgICAgICBtaW5pbXVtUm90YXRpb25TcGVlZCxcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50U3BlZWQgPSBtaW5pbXVtU3BlZWQ7XHJcbiAgICAgICAgY3VycmVudFJvdGF0aW9uU3BlZWQgPSBtaW5pbXVtUm90YXRpb25TcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYm90dG9tUmlnaHRDb2x1bW46IG51bWJlciA9IHRvcExlZnRDb2x1bW4gKyBjYW52YXMud2lkdGggLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IGJvdHRvbVJpZ2h0Um93OiBudW1iZXIgPSB0b3BMZWZ0Um93ICsgY2FudmFzLmhlaWdodCAvIGVudmlyb25tZW50VGlsZVNpemU7XHJcbiAgICBsZXQgbWluQ29sdW1uOiBudW1iZXIgPSBNYXRoLmZsb29yKHRvcExlZnRDb2x1bW4pO1xyXG4gICAgbGV0IG1heENvbHVtbjogbnVtYmVyID0gTWF0aC5jZWlsKGJvdHRvbVJpZ2h0Q29sdW1uKTtcclxuICAgIGxldCBtaW5Sb3c6IG51bWJlciA9IE1hdGguZmxvb3IodG9wTGVmdFJvdyk7XHJcbiAgICBsZXQgbWF4Um93OiBudW1iZXIgPSBNYXRoLmNlaWwoYm90dG9tUmlnaHRSb3cpO1xyXG4gICAgbGV0IGVudmlyb25tZW50RHJhd0NvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGZvciAobGV0IGkgPSBtaW5Sb3c7IGkgPD0gbWF4Um93OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gbWluQ29sdW1uOyBqIDw9IG1heENvbHVtbjsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCB3cmFwcGVkUm93OiBudW1iZXIgPSB3cmFwVmFsdWUoMCwgaSwgZW52aXJvbm1lbnRSb3dzIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCB3cmFwcGVkQ29sdW1uOiBudW1iZXIgPSB3cmFwVmFsdWUoMCwgaiwgZW52aXJvbm1lbnRDb2x1bW5zIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCBrZXk6IEVudmlyb25tZW50S2V5ID0gZW52aXJvbm1lbnRbd3JhcHBlZFJvd11bd3JhcHBlZENvbHVtbl07XHJcbiAgICAgICAgICAgIGxldCBjb2xvcjogc3RyaW5nO1xyXG4gICAgICAgICAgICBzd2l0Y2goa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEVudmlyb25tZW50S2V5LkRFRkFVTFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci50b1JHQigxMDAsIDI1NSwgMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuRk9SRVNUOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gQ29sb3IudG9SR0IoMCwgMjAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuREVTRVJUOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gQ29sb3IudG9SR0IoMjU1LCAyNTUsIDUwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRW52aXJvbm1lbnRLZXkuV0FURVI6XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci50b1JHQigwLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgbGV0IHggPSBjb2x1bW5Ub1goaik7XHJcbiAgICAgICAgICAgIGxldCB5ID0gcm93VG9ZKGkpO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KE1hdGguZmxvb3IoeCksIE1hdGguZmxvb3IoeSksIGVudmlyb25tZW50VGlsZVNpemUsIGVudmlyb25tZW50VGlsZVNpemUpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChcIihcIiArIHdyYXBwZWRSb3cgKyBcIixcIiArIHdyYXBwZWRDb2x1bW4gKyBcIilcIiwgeCwgeSk7XHJcbiAgICAgICAgICAgIGVudmlyb25tZW50RHJhd0NvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIFxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgIGN0eC5mb250ID0gXCIzMHB4IEFyaWFsXCI7XHJcbiAgICBjdHguZmlsbFRleHQoZW52aXJvbm1lbnREcmF3Q291bnQudG9TdHJpbmcoKSwgY2FudmFzLndpZHRoIC8gMiAtIDEwLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgbGV0IGNlbnRlckNvbHVtbiA9IHRvcExlZnRDb2x1bW4gKyAoY2FudmFzLndpZHRoIC8gMikgLyBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG4gICAgbGV0IGNlbnRlclJvdyA9IHRvcExlZnRSb3cgKyAoY2FudmFzLmhlaWdodCAvIDIpIC8gZW52aXJvbm1lbnRUaWxlU2l6ZTtcclxuICAgIGxldCBjZW50ZXJYID0gY29sdW1uVG9YKGNlbnRlckNvbHVtbik7XHJcbiAgICBsZXQgY2VudGVyWSA9IHJvd1RvWShjZW50ZXJSb3cpO1xyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBjdHgudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xyXG4gICAgY3R4LnJvdGF0ZShjdXJyZW50Um90YXRpb24pO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSgtY2VudGVyWCwgLWNlbnRlclkpO1xyXG4gICAgY3R4LmRyYXdJbWFnZShndXlTcHJpdGUsIGNlbnRlclggLSBndXlTcHJpdGUud2lkdGggLyAyLCBjZW50ZXJZIC0gZ3V5U3ByaXRlLmhlaWdodCAvIDIpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBsZXQgZnBzOiBudW1iZXIgPSAxMDAwIC8gZWxhcHNlZFRpbWVNaWxsaXM7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcclxuICAgIGN0eC5mb250ID0gXCIzMHB4IEFyaWFsXCI7XHJcbiAgICBjdHguZmlsbFRleHQoTWF0aC5yb3VuZChmcHMpLnRvU3RyaW5nKCkgKyBcIkZQU1wiLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBwcmV2aW91c1RpbWVNaWxsaXMgPSBjdXJyZW50VGltZU1pbGxpcztcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVNvdXJjZTogc3RyaW5nKTogSFRNTEltYWdlRWxlbWVudCB7XHJcbiAgICBpZiAocHJlbG9hZFJlZ2lzdHJ5LmhhcyhpbWFnZVNvdXJjZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgYXR0ZW1wdGVkIHRvIGxvYWQgdGhlIHNhbWUgaW1hZ2UgdHdpY2UgZHVyaW5nIHByZWxvYWRpbmcuXCIpO1xyXG4gICAgfVxyXG4gICAgcHJlbG9hZFJlZ2lzdHJ5LnNldChpbWFnZVNvdXJjZSwgZmFsc2UpO1xyXG5cclxuICAgIC8vIFRoZSBvcmRlciB0aGVzZSAzIHRoaW5ncyBhcmUgZG9uZSBpbiBpcyBWRVJZIGltcG9ydGFudCFcclxuICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIHByZWxvYWRSZWdpc3RyeS5zZXQoaW1hZ2VTb3VyY2UsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2Uuc3JjID0gaW1hZ2VTb3VyY2U7XHJcblxyXG4gICAgcmV0dXJuIGltYWdlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb2x1bW5Ub1goY29sdW1uOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAoY29sdW1uIC0gdG9wTGVmdENvbHVtbikgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG59XHJcblxyXG5mdW5jdGlvbiByb3dUb1kocm93OiBudW1iZXIpIHtcclxuICAgIHJldHVybiAocm93IC0gdG9wTGVmdFJvdykgKiBlbnZpcm9ubWVudFRpbGVTaXplO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVsb2FkKCkge1xyXG4gICAgZm9yIChsZXQgW2tleSwgbG9hZGVkXSBvZiBwcmVsb2FkUmVnaXN0cnkpIHtcclxuICAgICAgICBpZiAoIWxvYWRlZCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChwcmVsb2FkLCAwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbn1cclxuXHJcbndpbmRvdy5zZXRUaW1lb3V0KHByZWxvYWQsIDApO1xyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9