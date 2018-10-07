
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.adafruit.com/blocks/custom
 */
namespace custom {
    export interface Hue {
        h: number;
        s: number;
        v: number;
    }


    export enum State {
        Fuzzy,
        Normal,
        Rainbow,
        Off
    }

    export function printState(state: State) {
        switch (state) {
            case State.Fuzzy:
                console.log("fuzzy")
                break
            case State.Normal:
                console.log("normal")
                break
            case State.Off:
                console.log("off")
                break
        }
    }
}
