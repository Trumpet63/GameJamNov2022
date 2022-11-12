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
