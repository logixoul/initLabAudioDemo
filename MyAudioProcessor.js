import { SineOscillator } from "./SineOscillator.js"
import { SquareOscillator } from "./SquareOscillator.js";
import { SawOscillator } from "./SawOscillator.js";

class Note {
    osc;
    _isFinished = false;
    constructor(oscillator) {
        this.osc = oscillator;
        this.sampleIndex = 0;
    }
    nextSample() {
        this.sampleIndex++;
        const envelopeValue = Math.pow(0.9999, this.sampleIndex);
        if(envelopeValue < 0.0001)
            this._isFinished = true;
        return this.osc.nextSample()*envelopeValue;
    }
    isFinished() {
        return this._isFinished;
    }
}

class MyAudioProcessor extends AudioWorkletProcessor {
    configuration = null;
    notes = [];
    constructor() {
        super();

        this.port.onmessage = (e) => {
            if(e.data.name == "setConfiguration")
                this.configuration = e.data.value;
            console.log(e.data);
            //this.port.postMessage("pong");
            if(e.data.name == "playNote") {
                const osc = new (eval(this.configuration.oscillatorClass))(sampleRate, e.data.frequency, this.configuration);
                this.notes.push(new Note(osc));
            }
        };

        this.filterState = 0;
    }

    process(inputs, outputs, parameters) {
        this.removeFinishedNotes();

        const outputChannels = outputs[0];
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = 0;
            for(const note of this.notes)
                sample += note.nextSample();
            this.filterState = sample;
            //this.filterState += (sample-this.filterState)*.009;
            for (let channel = 0; channel < outputChannels.length; channel++) {
                const outputChannel = outputChannels[channel];
                outputChannel[i] = this.filterState;
            }
        }
    
        // Keep the processor alive
        return true;
    }
    removeFinishedNotes() {
        this.notes = this.notes.filter(note => !note.isFinished())
    }
}

registerProcessor('MyAudioProcessor', MyAudioProcessor);
