export class SystemAudioGlue {
    async playSineWave() {
        const audioContext = new AudioContext();
  
        // Load the AudioWorkletProcessor from an external file
        await audioContext.audioWorklet.addModule('MyAudioProcessor.js');
  
        const sineWaveNode = new AudioWorkletNode(audioContext, 'MyAudioProcessor');
  
        // Connect the node to the audio context's output
        sineWaveNode.connect(audioContext.destination);
  
        // Resume the audio context (autoplay policies may block audio)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
    }
}