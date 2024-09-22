import { SineOscillator } from "./SineOscillator.js"

class MyAudioProcessor extends AudioWorkletProcessor {
    osc;
    constructor() {
        super();
        this.osc = new SineOscillator(sampleRate);
        //this.phase = 0;
        this.time = 0;
    }

    process(inputs, outputs, parameters) {
        const outputChannels = outputs[0];
        //if(currentTime > 3)
        //    return true;
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = this.osc.nextSample();
            this.time++;
            sample *= Math.pow(0.999, this.time);
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
