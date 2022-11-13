import { Color } from "./color";
import { EnvironmentKey } from "./environment";
import { Vector } from "./vector";

// note: assumes fromStart is less than fromEnd, toStart is less than toEnd
export function mapLinear(
    fromStart: number,
    fromValue: number,
    fromEnd: number,
    toStart: number,
    toEnd: number
) {
    fromValue = clampValue(Math.min(fromStart, fromEnd), fromValue, Math.max(fromStart, fromEnd));
    let ratio: number = (fromValue - fromStart) / (fromEnd - fromStart);
    return toStart + ratio * (toEnd - toStart);
}

export function clampValue(min: number, value: number, max: number) {
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
export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function wrapValue(min: number, value: number, max: number) {
    if (value < min || value > max) {
        return mod(value - min, max + 1 - min) + min;
    }
    return value;
}

// this modulo handles negatives how it's supposed to
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export function columnToX(column: number, topLeftColumn: number, environmentTileSize: number) {
    return (column - topLeftColumn) * environmentTileSize;
}

export function rowToY(row: number, topLeftRow: number, environmentTileSize: number) {
    return (row - topLeftRow) * environmentTileSize;
}

export function collideCircles(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) {
    return Math.abs(x1 - x2) < r1 + r2
        && Math.abs(y1 - y2) < r1 + r2;
}

export function getCollisionVelocity(c1: Vector, c2: Vector, m1: number, m2: number, v1: Vector, v2: Vector): Vector {
    let c1Minusc2: Vector = c1.minus(c2);
    return c1Minusc2
        .scale(
            -2 * m2 / (m1 + m2)
            * Vector.innerProduct(v1.minus(v2), c1Minusc2)
            / c1Minusc2.normSquared()
        );
}

export function getEnvironmentColor(key: EnvironmentKey): Color {
    switch(key) {
        case EnvironmentKey.DEFAULT:
            return new Color(100, 255, 100);
        case EnvironmentKey.FOREST:
            return new Color(0, 200, 0);
        case EnvironmentKey.DESERT:
            return new Color(255, 255, 50);
        case EnvironmentKey.WATER:
            return new Color(0, 0, 255);
    }
}

export function getTintedColor(key: EnvironmentKey): Color {
    let color: Color = key === EnvironmentKey.DEFAULT
        ? new Color(255, 255, 255)
        : getEnvironmentColor(key);
    return Color.lerpColors(
        color,
        new Color(255, 255, 255),
        0.15,
    );
}

// a is assumed to be the origin
export function getDistance(a: number, b: number, min: number, max: number) {
    let dist1 = wrapValue(min, b - a, max);
    let dist2 = wrapValue(min, a - b, max);
    let minDist: number;
    let direction = 0;
    //        a   b
    // [0 1 2 3 4 5 6 7 8]
    if (b >= a && dist1 <= dist2) {
        direction = 1;
        minDist = dist1;
    //    a           b
    // [0 1 2 3 4 5 6 7 8]
    } else if (b >= a && dist1 > dist2) {
        direction = -1;
        minDist = dist2;
    //        b   a
    // [0 1 2 3 4 5 6 7 8]
    } else if (b < a && dist2 <= dist1) {
        direction = -1;
        minDist = dist2;
    //    b           a
    // [0 1 2 3 4 5 6 7 8]
    } else if (b < a && dist2 > dist1) {
        direction = 1;
        minDist = dist1;
    }
    return direction * minDist;
}
