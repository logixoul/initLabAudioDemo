export class SineOscillator {
    shaping;
    constructor(sampleRate, frequency, shaping) {
        this.frequency = frequency;
        this.phase = 0;
        this.sampleRate = sampleRate;
        this.shaping = shaping;
    }

    nextSample() {
        let sample = Math.sin(this.phase);
        sample = Math.sign(sample) * Math.pow(Math.abs(sample), this.shaping)
        this.phase += (2 * Math.PI * this.frequency) / this.sampleRate;
        return sample;
    }
}