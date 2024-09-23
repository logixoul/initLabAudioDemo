export class AudioThreadManager {
    audioContext;
    sampleRate() {
        return this.audioContext.sampleRate;
    }

    async launchThread() {
        this.audioContext = new AudioContext();
        await this.audioContext.audioWorklet.addModule('MyAudioProcessor.js');
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'MyAudioProcessor');
        // Connect the node to the audio context's output
        this.audioWorkletNode.connect(this.audioContext.destination);
    }
    postMessage(data) {
        this.audioWorkletNode.port.postMessage(data);
    }
}