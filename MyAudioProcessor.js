class MyAudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.phase = 0;
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const frequency = 440;

        for (let channel = 0; channel < output.length; channel++) {
            const outputChannel = output[channel];

            for (let i = 0; i < outputChannel.length; i++) {
                outputChannel[i] = Math.sin(this.phase);
                this.phase += (2 * Math.PI * frequency) / sampleRate;
            }
        }

        // Keep the processor alive
        return true;
    }
}

registerProcessor('MyAudioProcessor', MyAudioProcessor);
