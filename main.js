import { AudioThreadManager } from "./AudioThreadManager.js";

export function main() {
    let audioThreadRunning = false;
    let audioThreadManager = new AudioThreadManager();

    document.getElementById("powerSlider").onchange = (e) => {
        console.log(e.target.value);
        audioThreadManager.setPower(e.target.value)
    };

    document.addEventListener("keydown", (e) => {
        if(!audioThreadRunning) {
            audioThreadManager.launchThread();
            audioThreadRunning = true;
        }
        if(e.code == "KeyN") {
            audioThreadManager.playNote();
        }
    });

    document.add
}