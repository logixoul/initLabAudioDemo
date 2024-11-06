export class Input {
    constructor(app) {
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
            return mapping[keyCode];
        }
        return null;
    }
}
