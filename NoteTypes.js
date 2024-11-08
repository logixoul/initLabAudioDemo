import { SquareOscillator, NoiseOscillator } from "./OscillatorTypes.js";

export class Note {
    osc;
    _isFinished = false;
    _isReleased = false;
    
    constructor(oscillator) {
        this.osc = oscillator;
        this.sampleIndex = 0;
        this.releaseIndex = 0;
    }
    handleNoteRelease() {
        this._isReleased = true;
    }
    nextSample() {
        if(this._isReleased)
            this.releaseIndex++;
        const envelopeValue = Math.pow(0.99994, this.releaseIndex);
        if(envelopeValue < 0.0001)
            this._isFinished = true;
        return this.osc.nextSample()*envelopeValue;
    }
    isFinished() {
        return this._isFinished;
    }
}

const drummingVolume = 0.2; 

export class DrumHit extends Note {
    constructor(frequency, configuration) {
        const osc = new SquareOscillator(frequency, configuration)
        super(osc);
    }

    nextSample() {
        if(!this.osc.configuration.drumLoopEnabled)
            return 0.0;
        this.osc.frequency *= 0.9998;
        if(this.osc.frequency <= 7)
            this._isFinished = true;
        return this.osc.nextSample() * drummingVolume;
    }
}

export class SnareHit extends Note {
    constructor(configuration) {
        const osc = new NoiseOscillator(configuration)
        super(osc);
        this.sampleIndex = 0;
    }

    nextSample() {
        if(!this.osc.configuration.drumLoopEnabled)
            return 0.0;

        this.sampleIndex++;
        if(this.sampleIndex > 4000)
            this._isFinished = true;

        return this.osc.nextSample() * drummingVolume;
    }
}