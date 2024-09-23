export class AudioThreadManager {
    constructor() {
        this.audioContext = new AudioContext();
    }
    sampleRate() {
        return this.audioContext.sampleRate;
    }

    async launchThread() {
        // Load the AudioWorkletProcessor from an external file
        await this.audioContext.audioWorklet.addModule('MyAudioProcessor.js');
  
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'MyAudioProcessor');
  
        // Connect the node to the audio context's output
        this.audioWorkletNode.connect(this.audioContext.destination);
  
        // Resume the audio context (autoplay policies may block audio)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    postMessage(data) {
        this.audioWorkletNode.port.postMessage(data);
    }
}