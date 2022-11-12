export class Color {
    public static toRGB(r: number, g: number, b: number) {
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    public static toRGBA(r: number, g: number, b: number, a: number) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}
