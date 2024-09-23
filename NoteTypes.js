import { SquareOscillator } from "./SquareOscillator.js";

export class Note {
    osc;
    _isFinished = false;
    constructor(oscillator) {
        this.osc = oscillator;
        this.sampleIndex = 0;
    }
    nextSample() {
        this.sampleIndex++;
        const envelopeValue = Math.pow(0.9999, this.sampleIndex);
        if(envelopeValue < 0.0001)
            this._isFinished = true;
        return this.osc.nextSample()*envelopeValue;
    }
    isFinished() {
        return this._isFinished;
    }
}

export class DrumHit extends Note {
    frequencyStep;
    constructor(frequency, configuration) {
        const osc = new SquareOscillator(frequency, configuration)
        super(osc);
        this.frequencyStep = frequency / 10000;
    }

    nextSample() {
        //this.osc.frequency -= this.frequencyStep;
        this.osc.frequency *= 0.9998;
        if(this.osc.frequency <= 10)
            this._isFinished = true;
        return this.osc.nextSample();
    }
}

export class SnareHit extends Note {
    constructor() {
        super(null);
        this.sampleIndex = 0;
    }

    nextSample() {
        this.sampleIndex++;
        if(this.sampleIndex > 4000)
            this._isFinished = true;

        return Math.random()*2-1;
    }
}