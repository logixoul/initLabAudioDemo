export class SineOscillator {
    power = 1;
    constructor(sampleRate) {
        this.frequency = 440;
        this.phase = 0;
        this.sampleRate = sampleRate
    }

    nextSample() {
        let sample = Math.sin(this.phase);
        sample = Math.sign(sample) * Math.pow(Math.abs(sample), this.power)
        this.phase += (2 * Math.PI * this.frequency) / this.sampleRate;
        return sample;
    }
}