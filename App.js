import { AudioThreadManager } from "./AudioThreadManager.js";
import { Input } from "./Input.js"

class Configuration {
    filterCutoff = 1;
    oscillatorClassName = "SineOscillator";
    filterClassName = "ExpLowPassFilter"
    sampleRate;
    echoDelay = 0.5;
}

// https://stackoverflow.com/questions/951021
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class App {
    audioThreadRunning = false;
    audioThreadManager = new AudioThreadManager();
    configuration = new Configuration();
    input = new Input(this);

    async launchAudioThread() {
        if(!this.audioThreadRunning) {
            await this.audioThreadManager.launchThread();
            this.configuration.sampleRate = this.audioThreadManager.sampleRate();
            this.onConfigurationChanged();
        
            this.audioThreadRunning = true;

            //this.runDrumLoop();
            document.getElementById("instructions").innerText = "Play with the z/s/x etc keys";
        }
    }

    sendDrum(frequency) {
        this.audioThreadManager.postMessage({
            name: "playDrum",
            frequency: frequency
        });
    }

    async runDrumLoop() {
        while(true) {
            this.sendDrum(120);
            await sleep(250);
            this.audioThreadManager.postMessage({name: "playSnare"});
            await sleep(250);
            this.sendDrum(480);
            await sleep(250);
            this.audioThreadManager.postMessage({name: "playSnare"});
            await sleep(250);

            this.audioThreadManager.postMessage({name: "playSnare"});
            await sleep(250);
            this.sendDrum(120);
            await sleep(250);
            this.sendDrum(480);
            await sleep(250);
            this.audioThreadManager.postMessage({name: "playSnare"});
            await sleep(250);
        }
    }
    
    onConfigurationChanged() {
        this.audioThreadManager.postMessage({
            name: "setConfiguration",
            value: this.configuration
        });
    }
}
