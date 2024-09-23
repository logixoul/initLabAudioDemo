import { AudioThreadManager } from "./AudioThreadManager.js";
import { SineOscillator } from "./SineOscillator.js";
import { SquareOscillator } from "./SquareOscillator.js";

class Configuration {
    sineShaping = 1;
    oscillatorClass = "SineOscillator";
}

export class App {
    audioThreadRunning = false;
    audioThreadManager = new AudioThreadManager();
    configuration = new Configuration();

    constructor() {
        document.getElementById("shapingSlider").onchange = (e) => {
            this.configuration.sineShaping = e.target.value
            this.audioThreadManager.postMessage({
                name: "setConfiguration",
                value: this.configuration
            });
        };

        document.addEventListener("keydown", async (e) => {
            if(!this.audioThreadRunning) {
                await this.audioThreadManager.launchThread();
                //let sineOscFactory = (sampleRate, frequency) => new SineOscillator(sampleRate, frequency, 1);
                this.audioThreadManager.postMessage({
                    name: "setConfiguration",
                    value: this.configuration
                });
            
                this.audioThreadRunning = true;
                console.log("launched")
            }
            const noteIndex = this.characterToNoteIndex(e.key)
            if(noteIndex != null) {
                const powerBase = Math.pow(2, 1/12);
                this.audioThreadManager.postMessage({
                    name: "playNote",
                    frequency: 440 * Math.pow(powerBase, noteIndex)
                });
            }
        });
    }

    characterToNoteIndex(char) {
        const mapping = {
            z: 0,
            s: 1,
            x: 2,
            d: 3,
            c: 4,
            v: 5,
            g: 6,
            b: 7,
            h: 8,
            n: 9,
            j: 10,
            m: 11        
        };
        if(char in mapping) {
            return mapping[char];
        }
        return null;
    }
}

export function main() {
    

}