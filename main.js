import { SystemAudioInitializer } from "./SystemAudioInitializer.js";

document.addEventListener("keydown", () => {
    let initter = new SystemAudioInitializer();
    initter.runAudioWorklet();
});
