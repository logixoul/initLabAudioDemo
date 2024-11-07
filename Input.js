import * as Midi from './Midi.js';

export class Input {
    app;

    constructor(app) {
        this.app = app;

        document.getElementById("filterCutoff").oninput = (e) => {
            app.configuration.filterCutoff = Number(e.target.value);
            app.onConfigurationChanged();
        };
        document.getElementById("echoDelay").oninput = (e) => {
            app.configuration.echoDelay = Number(e.target.value);
            app.onConfigurationChanged();
        };

        document.getElementById("oscillatorSelection").onchange = (e) => {
            app.configuration.oscillatorClassName = e.target.value;
            app.onConfigurationChanged();
        };
        document.getElementById("filterSelection").onchange = (e) => {
            app.configuration.filterClassName = e.target.value;
            app.onConfigurationChanged();
        };

        document.addEventListener("keydown", async (e) => {
            if(e.repeat)
                return;
            if(e.key === " ") {
                await app.launchAudioThread();
            }
            
            const noteIndex = this.keyCodeToNoteIndex(e.code)
            if(noteIndex != null) {
                app.audioThreadManager.postMessage({
                    name: "notePressed",
                    noteIndex: noteIndex,
                    hardwareKeyCode: e.code
                });
            }
        });

        document.addEventListener("keyup", async (e) => {
            if(e.key === " ") {
                await app.launchAudioThread();

                const midiAccess = await navigator.requestMIDIAccess();

                midiAccess.inputs.forEach(input => {
                    input.addEventListener('midimessage', e => {
                        this.handleMidiMessage(Midi.parseMessage(e.data));
                    });
                });
            }
            
            const noteIndex = this.keyCodeToNoteIndex(e.code)
            if(noteIndex != null) {
                app.audioThreadManager.postMessage({
                    name: "noteReleased",
                    noteIndex: noteIndex,
                    hardwareKeyCode: e.code
                });
            }
        });
    }

    noteIndexToFrequency(noteIndex) {
        return 440 * Math.pow(2, (noteIndex - 69) / 12);
    }

    handleMidiMessage(msg) {
        if (msg.type !== Midi.TIMING_CLOCK) {
            console.log('MIDI', msg.name, msg);
        }

        if (msg.type === Midi.NOTE_ON && msg.velocity > 0) {
            if (msg.channel === Midi.DRUM_CHANNEL_NUMBER) {
                if (msg.key === 59) {
                    this.app.audioThreadManager.postMessage({
                        name: "playSnare"
                    });
                }
                else {
                    this.app.audioThreadManager.postMessage({
                        name: "playDrum",
                        frequency: this.noteIndexToFrequency(msg.key),
                    });
                }
            }
            else {
                this.app.audioThreadManager.postMessage({
                    name: "notePressed",
                    noteIndex: msg.key,
                    hardwareKeyCode: msg.key - 60,
                });
            }
        }

        if (msg.type === Midi.NOTE_OFF || (msg.type === Midi.NOTE_ON && msg.velocity === 0)) {
            if (msg.channel === Midi.DRUM_CHANNEL_NUMBER) {
                // drums don't finish when key is released
            }
            else {
                this.app.audioThreadManager.postMessage({
                    name: "noteReleased",
                    noteIndex: msg.key,
                    hardwareKeyCode: msg.key - 60,
                });
            }
        }

        if (msg.type === Midi.CONTROL_CHANGE) {
            switch (msg.number) {
                case 1:
                    // modulation
                    this.app.configuration.filterCutoff = msg.value / 127;
                    this.app.onConfigurationChanged();
                    break;
            }
        }
    }

    keyCodeToNoteIndex(keyCode) {
        const mapping = {
            KeyZ: 0,
            KeyS: 1,
            KeyX: 2,
            KeyD: 3,
            KeyC: 4,
            KeyV: 5,
            KeyG: 6,
            KeyB: 7,
            KeyH: 8,
            KeyN: 9,
            KeyJ: 10,
            KeyM: 11,
            Comma: 12,
            KeyL: 13,
            Period: 14,
            Semicolon: 15,
            Slash: 16,
            KeyQ: 12,
            Digit2: 13,
            KeyW: 14,
            Digit3: 15,
            KeyE: 16,
            KeyR: 17,
            Digit5: 18,
            KeyT: 19,
            Digit6: 20,
            KeyY: 21,
            Digit7: 22,
            KeyU: 23,
            KeyI: 24,
            Digit9: 25,
            KeyO: 26,
            Digit0: 27,
            KeyP: 28,
            BracketLeft: 29,
            Equal: 30,
            BracketRight: 31
        };
        if(keyCode in mapping) {
            return mapping[keyCode] + 60;
        }
        return null;
    }
}
