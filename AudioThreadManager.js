export class AudioThreadManager {
    _sampleRate;
    sampleRate() {
        return this._sampleRate;
    }

    async launchThread() {
        const audioContext = new AudioContext();
        this._sampleRate = audioContext.sampleRate;
        
        // Load the AudioWorkletProcessor from an external file
        await audioContext.audioWorklet.addModule('MyAudioProcessor.js');
  
        this.audioWorkletNode = new AudioWorkletNode(audioContext, 'MyAudioProcessor');
  
        // Connect the node to the audio context's output
        this.audioWorkletNode.connect(audioContext.destination);
  
        // Resume the audio context (autoplay policies may block audio)
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
    }
    postMessage(data) {
        this.audioWorkletNode.port.postMessage(data);
    }
}