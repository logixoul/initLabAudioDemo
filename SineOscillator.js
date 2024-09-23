export class SineOscillator {
    configuration;
    constructor(frequency, configuration) {
        this.frequency = frequency;
        this.phase = 0;
        this.configuration = configuration;
    }

    nextSample() {
        let sample = Math.sin(this.phase);
        //sample = Math.sign(sample) * Math.pow(Math.abs(sample), this.shaping)
        this.phase += (2 * Math.PI * this.frequency) / this.configuration.sampleRate;
        return sample;
    }
}