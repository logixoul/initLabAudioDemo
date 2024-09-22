import { AudioThreadManager } from "./AudioThreadManager.js";

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
        }
        if(e.code == "KeyN") {
            audioThreadManager.postMessage({
                name: "playNote",
                value: 440
            });
        }
    });

    document.add
}