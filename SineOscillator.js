export class SineOscillator {
    constructor(sampleRate) {
        this.frequency = 440;
        this.phase = 0;
        this.sampleRate = sampleRate
    }

    nextSample() {
        let sample = Math.sin(this.phase);
        this.phase += (2 * Math.PI * this.frequency) / this.sampleRate;
        return sample;
    }
}