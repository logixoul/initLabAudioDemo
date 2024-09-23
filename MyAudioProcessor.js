import { SineOscillator } from "./SineOscillator.js"

class Note {
    osc;
    constructor(frequency, shaping) {
        this.osc = new SineOscillator(sampleRate, frequency, shaping);
        this.sampleIndex = 0;
    }
    nextSample() {
        this.sampleIndex++;
        return this.osc.nextSample()*Math.pow(0.9999, this.sampleIndex)
    }
}

class MyAudioProcessor extends AudioWorkletProcessor {
    shaping = 1;
    constructor() {
        super();
        this.notes = []

        this.port.onmessage = (e) => {
            if(e.data.name == "setShaping")
                this.shaping = e.data.value;
            console.log(e.data);
            //this.port.postMessage("pong");
            if(e.data.name == "playNote") {
                this.notes.push(new Note(e.data.value, this.shaping))
            }
        };

        this.filterState = 0;
    }

    process(inputs, outputs, parameters) {
        const outputChannels = outputs[0];
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = 0;
            for(const note of this.notes)
                sample += note.nextSample();
            this.filterState = sample;
            //this.filterState += (sample-this.filterState)*.0009;
            for (let channel = 0; channel < outputChannels.length; channel++) {
                const outputChannel = outputChannels[channel];
                outputChannel[i] = this.filterState;
            }
        }
    
        // Keep the processor alive
        return true;
    }
}

registerProcessor('MyAudioProcessor', MyAudioProcessor);
