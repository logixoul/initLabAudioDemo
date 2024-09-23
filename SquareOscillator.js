export class SquareOscillator {
    configuration;
    constructor(frequency, configuration) {
        this.frequency = frequency;
        this.phase = 0;
        this.configuration = configuration;
    }

    nextSample() {
        let sample = Math.sin(this.phase);
        this.phase += (2 * Math.PI * this.frequency) / this.configuration.sampleRate;
        return sample < 0 ? -1: 1;
    }
}