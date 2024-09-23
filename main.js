import { AudioThreadManager } from "./AudioThreadManager.js";

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

export function main() {
    let audioThreadRunning = false;
    let audioThreadManager = new AudioThreadManager();

    document.getElementById("shapingSlider").onchange = (e) => {
        audioThreadManager.postMessage({
            name: "setShaping",
            value: e.target.value
        });
    };

    document.addEventListener("keydown", (e) => {
        if(!audioThreadRunning) {
            audioThreadManager.launchThread();
            audioThreadRunning = true;
            console.log("launched")
        }
        const noteIndex = characterToNoteIndex(e.key)
        if(noteIndex != null) {
            const powerBase = Math.pow(2, 1/12);
            audioThreadManager.postMessage({
                name: "playNote",
                value: 440 * Math.pow(powerBase, noteIndex)
            });
        }
    });

    document.add
}