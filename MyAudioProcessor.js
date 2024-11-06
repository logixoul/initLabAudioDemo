import * as OscillatorTypes from "./OscillatorTypes.js";
import * as NoteTypes from "./NoteTypes.js";
import * as EffectTypes from "./EffectTypes.js";

class MyAudioProcessor extends AudioWorkletProcessor {
    configuration = null;
    noteInstances = [];
    filter;
    echo;
    constructor() {
        super();
        this.noteInstanceThatIsCurrentlyPressed = { };

        this.port.onmessage = (e) => {
            if(e.data.name === "setConfiguration") {
                this.configuration = e.data.value;
                const filterClass = EffectTypes[this.configuration.filterClassName];
                this.filter = new filterClass(this.configuration); // reset the filter with the new config

                this.echo = new EffectTypes.Reverb(this.configuration); // reset the echo with the new config
            }
            console.log(e.data);
            if(e.data.name === "notePressed") {
                const oscillatorClass = OscillatorTypes[this.configuration.oscillatorClassName];
                const frequency = this.noteIndexToFrequency(e.data.noteIndex);
                const osc = new oscillatorClass(frequency, this.configuration);
                const newNote = new NoteTypes.Note(osc);
                this.noteInstances.push(newNote);
                this.noteInstanceThatIsCurrentlyPressed[e.data.hardwareKeyCode] = newNote;
            }
            if(e.data.name === "noteReleased") {
                let toNotify = this.noteInstanceThatIsCurrentlyPressed[e.data.hardwareKeyCode];
                if(toNotify) {
                    toNotify.handleNoteRelease();
                    this.noteInstanceThatIsCurrentlyPressed[e.data.hardwareKeyCode] = null;
                }
            }
            if(e.data.name === "playDrum") {
                this.noteInstances.push(new NoteTypes.DrumHit(e.data.frequency, this.configuration));
            }
            if(e.data.name === "playSnare") {
                this.noteInstances.push(new NoteTypes.SnareHit());
            }
        };
    }

    noteIndexToFrequency(noteIndex) {
        const powerBase = Math.pow(2, 1/12);
        return 220 * Math.pow(powerBase, noteIndex)
    }

    nextSample() {
        let sample = 0;
        for(const noteInstance of this.noteInstances)
            sample += noteInstance.nextSample();
        sample = this.filter.processSample(sample);
        sample = this.echo.processSample(sample);
        sample *= .3;
        return sample;
    }

    process(inputs, outputs) {
        this.removeFinishedNotes();

        const outputChannels = outputs[0];
        for (let i = 0; i < outputChannels[0].length; i++) {
            let sample = this.nextSample();
            for (let channel = 0; channel < outputChannels.length; channel++) {
                const outputChannel = outputChannels[channel];
                outputChannel[i] = sample;
            }
        }
    
        // Keep the processor alive
        return true;
    }
    removeFinishedNotes() {
        this.noteInstances = this.noteInstances.filter(note => !note.isFinished())
    }
}

registerProcessor('MyAudioProcessor', MyAudioProcessor);
