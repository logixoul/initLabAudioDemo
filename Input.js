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
            if(e.key === " ") {
                await app.launchAudioThread();
            }
            
            const noteIndex = this.keyCodeToNoteIndex(e.code)
            if(noteIndex != null) {
                const powerBase = Math.pow(2, 1/12);
                app.audioThreadManager.postMessage({
                    name: "playNote",
                    frequency: 220 * Math.pow(powerBase, noteIndex)
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
            Slash: 16
        };
        if(keyCode in mapping) {
            return mapping[keyCode];
        }
        return null;
    }
}
