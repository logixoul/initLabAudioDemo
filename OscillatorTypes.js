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
        return this.phase % 1;
    }
}
