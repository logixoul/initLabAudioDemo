import { SineOscillator } from "./SineOscillator.js"

class Note {
    
}

class MyAudioProcessor extends AudioWorkletProcessor {
    osc;
    constructor() {
        super();
        this.osc = new SineOscillator(sampleRate);
        this.tmp = 0;

        this.port.onmessage = (e) => {
            if(e.data.name == "setPower")
                this.osc.power = e.data.value;
            console.log(e.data);
            //this.port.postMessage("pong");
            this.tmp = 0;
          };
    }

    process(inputs, outputs, parameters) {
        const outputChannels = outputs[0];
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = this.osc.nextSample();
            this.tmp++;
            sample *= Math.pow(0.9999, this.tmp);
            for (let channel = 0; channel < outputChannels.length; channel++) {
                const outputChannel = outputChannels[channel];
                outputChannel[i] = sample;
            }
        }
    
        // Keep the processor alive
        return true;
    }
}

registerProcessor('MyAudioProcessor', MyAudioProcessor);
