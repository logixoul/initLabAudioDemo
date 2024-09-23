export class SquareOscillator {
    constructor(sampleRate, frequency) {
        this.frequency = frequency;
        this.phase = 0;
        this.sampleRate = sampleRate;
    }

    nextSample() {
        let sample = Math.sin(this.phase);
        this.phase += (2 * Math.PI * this.frequency) / this.sampleRate;
        return sample < 0 ? -1: 1;
    }
}