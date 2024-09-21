import { SystemAudioGlue } from "./SystemAudioGlue.js";

document.addEventListener("keydown", () => {
    let glue = new SystemAudioGlue();
    glue.runAudioWorklet();
});
