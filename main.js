import { SystemAudioInitializer } from "./SystemAudioInitializer.js";

export function main() {
    let initter = null;

    document.addEventListener("keydown", () => {
        initter = new SystemAudioInitializer();
        initter.runAudioWorklet();
    });
}