class MyAudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.frequency = 440; // Default frequency is 440Hz (A4 note)
        this.phase = 0;
        this.sampleRate = sampleRate; // Access the sample rate of the audio context
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const sampleRate = this.sampleRate;

        for (let channel = 0; channel < output.length; channel++) {
            const outputChannel = output[channel];

            for (let i = 0; i < outputChannel.length; i++) {
                outputChannel[i] = Math.sin(this.phase);
                this.phase += (2 * Math.PI * this.frequency) / sampleRate;
            }
        }

        // Keep the processor alive
        return true;
    }
}

registerProcessor('MyAudioProcessor', MyAudioProcessor);
