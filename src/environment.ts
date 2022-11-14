import { randomInt, wrapValue } from "./util";

export enum EnvironmentKey {
    DEFAULT,
    FOREST,
    DESERT,
    WATER,
}
export let environment: EnvironmentKey[][] = [];
export let environmentRows: number = 60;
export let environmentColumns: number = 60;

for (let i = 0; i < environmentRows; i++) {
    let row: EnvironmentKey[] = [];
    for (let j = 0; j < environmentColumns; j++) {
        if (Math.random() < 0.997) {
            row.push(EnvironmentKey.DEFAULT);
        } else {
            row.push(randomInt(1, 3) as EnvironmentKey);
        }
    }
    environment.push(row);
}

for (let k = 0; k < 10; k++) {
    let environmentCopy: EnvironmentKey[][] = [];
    for (let i = 0; i < environmentRows; i++) {
        let row: EnvironmentKey[] = [];
        for (let j = 0; j < environmentColumns; j++) {
            row.push(environment[i][j]);
        }
        environmentCopy.push(row);
    }

    for (let i = 0; i < environmentRows; i++) {
        for (let j = 0; j < environmentColumns; j++) {
            if (environmentCopy[i][j] !== EnvironmentKey.DEFAULT && Math.random() > 0.5) {
                switch(randomInt(1, 4)) {
                    case 1:
                        environment[wrapValue(0, i+1, environmentRows - 1)][j] = environment[i][j];
                        break;
                    case 2:
                        environment[i][wrapValue(0, j+1, environmentColumns - 1)] = environment[i][j];
                        break;
                    case 3:
                        environment[wrapValue(0, i-1, environmentRows - 1)][j] = environment[i][j];
                        break;
                    case 4:
                        environment[i][wrapValue(0, j-1, environmentColumns - 1)] = environment[i][j];
                        break;
                }
            }
        }
    }
}
