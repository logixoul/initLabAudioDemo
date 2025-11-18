export class AudioThreadManager {
    audioContext;
    sampleRate() {
        return this.audioContext.sampleRate;
    }

    async launchThread() {
        // An AudioContext is a graph of audio modules (nodes)
        this.audioContext = new AudioContext();

        // AudioWorklet may be unavailable in some contexts (file://) or
        // in browsers that don't support it. Check and give a clear error.
        if (!this.audioContext.audioWorklet || !this.audioContext.audioWorklet.addModule) {
            throw new Error("AudioWorklet is not available. Serve the page over http(s) or localhost and use a browser that supports AudioWorklet.");
        }

        // Use a robust module URL relative to this module (works when served).
        await this.audioContext.audioWorklet.addModule(new URL('./MyAudioProcessor.js', import.meta.url));
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'MyAudioProcessor');
        // Connect the node to the audio context's output
        this.audioWorkletNode.connect(this.audioContext.destination);
    }
    postMessage(data) {
        this.audioWorkletNode.port.postMessage(data);
    }
}