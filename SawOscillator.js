export class SawOscillator {
    configuration;
    constructor(frequency, configuration) {
        this.frequency = frequency;
        this.phase = 0;
        this.configuration = configuration;
    }

    nextSample() {
        //sample = Math.sign(sample) * Math.pow(Math.abs(sample), this.shaping)
        this.phase += this.frequency / this.configuration.sampleRate;
        let sample = this.phase % 1;
        return sample;
    }
}