import { AudioThreadManager } from "./AudioThreadManager.js";
import { Input } from "./Input.js"

class Configuration {
    filterCutoff = .2;
    oscillatorClassName = "SineOscillator";
    filterClassName = "ExpLowPassFilter"
    sampleRate;
    echoDelay = 0.5;
    drumLoopEnabled = false;
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

    async tryAutoEnableAudio() {
        // no idea why I need to query for microphone input rather
        // than for audio outpuit, but hey, it works.
        navigator.permissions.query({ name: "microphone" }).then(async (result) => {
            if (result.state === "granted") {
                console.log("Cool! The user has manually enabled microphone access, so we can launch the audio thread without waiting for user interaction.")
                await this.launchAudioThread();
            } else if (result.state === "prompt") {
            } else {
                // Don't do anything if the permission was denied.
            }
        });
    }

    async launchAudioThread() {
        if(!this.audioThreadRunning) {
            await this.audioThreadManager.launchThread();
            this.configuration.sampleRate = this.audioThreadManager.sampleRate();
            this.onConfigurationChanged();

            this.audioThreadRunning = true;
            document.getElementById("instructions").innerText = "Play with the z/s/x etc keys. Press space to toggle DRUMLOOP.";
        }
    }

    sendDrum(frequency) {
        this.audioThreadManager.postMessage({
            name: "playDrum",
            frequency: frequency
        });
    }

    // noinspection JSUnusedGlobalSymbols
    async runDrumLoop() {
        // noinspection InfiniteLoopJS
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
