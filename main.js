import { SystemAudioInitializer } from "./SystemAudioInitializer.js";

export function main() {
    let initter = null;

    document.addEventListener("keydown", () => {
        if(initter != null)
            return;
        initter = new SystemAudioInitializer();
        initter.runAudioWorklet();
    });
}