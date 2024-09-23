export class SawOscillator {
    configuration;
    constructor(sampleRate, frequency, configuration) {
        this.frequency = frequency;
        this.phase = 0;
        this.sampleRate = sampleRate;
        this.configuration = configuration;
    }

    nextSample() {
        //sample = Math.sign(sample) * Math.pow(Math.abs(sample), this.shaping)
        this.phase += this.frequency / this.sampleRate;
        let sample = this.phase % 1;
        return sample;
    }
}