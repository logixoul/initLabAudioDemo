import * as Midi from './Midi.js';
import * as MusicTheory from './MusicTheory.js'

export class Input {
    app;
    // this map is needed because sometimes (for some reason)
    // we get a second keyDown event BEFORE we get a keyUp event.
    // To repro: hold 'z', hold 'x', release 'z', release 'x'. In this order.
    // Same happens with MIDI sometimes.
    keysHeld = {};
    

    constructor(app) {
        this.app = app;

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
            if(this.keysHeld[e.key])
                return;
            this.keysHeld[e.key] = true;
            if(e.key === " ") {
                // we use the space key both for toggling drumloop and for
                // initting the audio system.
                if(app.audioThreadRunning)
                {
                    app.configuration.drumLoopEnabled = !app.configuration.drumLoopEnabled;
                    app.onConfigurationChanged();
                }
                else {
                    await app.launchAudioThread();
                }
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
            this.keysHeld[e.key] = false;
            if(e.key === " ") {
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

        this.addSlider("filterCutoff");
    }
    // https://stackoverflow.com/a/35385518/122687
    htmlToNodes(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
    addSlider(id) {
        const defaultValue = this.app.configuration[id];
        const tagId = `slider-${id}`;
        const sliderContainer = this.htmlToNodes(`
            <p>
            <label for="${tagId}">${id}:</label>
		    <input type="range" id="${tagId}" min="0" max="1" step="any" value="${defaultValue}"/>
            </p>
            `);
        const slider = sliderContainer.querySelector("#" + tagId);
        slider.oninput = (e) => {
            this.app.configuration[id] = Number(e.target.value);
            this.app.onConfigurationChanged();
            console.log("slider moved ", e)
        };
        document.getElementsByTagName("body")[0].appendChild(sliderContainer);
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
                        frequency: MusicTheory.noteIndexToFrequency(msg.key),
                    });
                }
            }
            else {
                if(this.keysHeld[msg.key - 60])
                    return;
                this.keysHeld[msg.key - 60] = true;
    
                this.app.audioThreadManager.postMessage({
                    name: "notePressed",
                    noteIndex: msg.key,
                    hardwareKeyCode: msg.key - 60,
                    volume: msg.velocity / 127,
                });
            }
        }

        if (msg.type === Midi.NOTE_OFF || (msg.type === Midi.NOTE_ON && msg.velocity === 0)) {
            if (msg.channel === Midi.DRUM_CHANNEL_NUMBER) {
                // drums don't finish when key is released
            }
            else {
                if(!this.keysHeld[msg.key - 60])
                    return;
                this.keysHeld[msg.key - 60] = false;
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
