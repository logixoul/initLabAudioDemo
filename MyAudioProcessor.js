import { SineOscillator } from "./SineOscillator.js"
import { SquareOscillator } from "./SquareOscillator.js";
import { SawOscillator } from "./SawOscillator.js";
import * as NoteTypes from "./NoteTypes.js";
import * as FilterTypes from "./FilterTypes.js";

class MyAudioProcessor extends AudioWorkletProcessor {
    configuration = null;
    notes = [];
    filter;
    constructor() {
        super();

        this.port.onmessage = (e) => {
            if(e.data.name == "setConfiguration") {
                this.configuration = e.data.value;
                this.filter = new FilterTypes.HighPassFilter(this.configuration); // reset the filter with the new config
            }
            console.log(e.data);
            //this.port.postMessage("pong");
            if(e.data.name == "playNote") {
                const osc = new (eval(this.configuration.oscillatorClass))(e.data.frequency, this.configuration);
                this.notes.push(new NoteTypes.Note(osc));
            }
            if(e.data.name == "playDrum") {
                this.notes.push(new NoteTypes.DrumHit(e.data.frequency, this.configuration));
            }
            if(e.data.name == "playSnare") {
                this.notes.push(new NoteTypes.SnareHit());
            }
        };

        //this.filterState = 0;
    }

    process(inputs, outputs, parameters) {
        this.removeFinishedNotes();

        const outputChannels = outputs[0];
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = 0;
            for(const note of this.notes)
                sample += note.nextSample();
            sample = this.filter.processSample(sample);
            //this.filterState = sample;
            //this.filterState += (sample-this.filterState)*.009;
            for (let channel = 0; channel < outputChannels.length; channel++) {
                const outputChannel = outputChannels[channel];
                outputChannel[i] = sample;
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
