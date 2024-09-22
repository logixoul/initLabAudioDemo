import { SineOscillator } from "./SineOscillator.js"

class MyAudioProcessor extends AudioWorkletProcessor {
    osc;
    constructor() {
        super();
        this.osc = new SineOscillator(sampleRate);
    }

    process(inputs, outputs, parameters) {
        const outputChannels = outputs[0];
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = this.osc.nextSample();
            sample *= Math.pow(0.5, currentTime);
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
