import { mapLinear } from "./util";

export class Color {
    public r: number;
    public g: number;
    public b: number;

    public constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public toString() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }

    public static toRGB(r: number, g: number, b: number) {
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    public static toRGBA(r: number, g: number, b: number, a: number) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }

    public static lerpColors(c1: Color, c2: Color, ratio: number) {
        return new Color(
            mapLinear(0, ratio, 1, c1.r, c2.r),
            mapLinear(0, ratio, 1, c1.g, c2.g),
            mapLinear(0, ratio, 1, c1.b, c2.b),
        );
    }
}
