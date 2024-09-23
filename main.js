import { AudioThreadManager } from "./AudioThreadManager.js";
import { SineOscillator } from "./SineOscillator.js";
import { SquareOscillator } from "./SquareOscillator.js";

function characterToNoteIndex(char) {
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

class Configuration {
    sineShaping = 1;
    oscillatorClass = "SineOscillator";
}

export function main() {
    let audioThreadRunning = false;
    let audioThreadManager = new AudioThreadManager();
    let configuration = new Configuration();
    
    document.getElementById("shapingSlider").onchange = (e) => {
        configuration.sineShaping = e.target.value
        audioThreadManager.postMessage({
            name: "setConfiguration",
            value: configuration
        });
    };

    document.addEventListener("keydown", async (e) => {
        if(!audioThreadRunning) {
            await audioThreadManager.launchThread();
            //let sineOscFactory = (sampleRate, frequency) => new SineOscillator(sampleRate, frequency, 1);
            audioThreadManager.postMessage({
                name: "setConfiguration",
                value: configuration
            });
        
            audioThreadRunning = true;
            console.log("launched")
        }
        const noteIndex = characterToNoteIndex(e.key)
        if(noteIndex != null) {
            const powerBase = Math.pow(2, 1/12);
            audioThreadManager.postMessage({
                name: "playNote",
                frequency: 440 * Math.pow(powerBase, noteIndex)
            });
        }
    });
}