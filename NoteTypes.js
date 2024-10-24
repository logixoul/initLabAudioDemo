import { SquareOscillator } from "./OscillatorTypes.js";

export class Note {
    osc;
    _isFinished = false;
    
    constructor(oscillator) {
        this.osc = oscillator;
        this.sampleIndex = 0;
        this.releaseIndex = 0;
    }
    nextSample() {
        const releaseTime = 1000;
        this.sampleIndex++;
        //const envelopeValue = Math.pow(0.99994, this.sampleIndex);
        let envelopeValue = 1;
        //if(envelopeValue < 0.0001)
        if(this.sampleIndex > 10000) {
            envelopeValue = Math.max(1-this.releaseIndex / releaseTime, 0)
            this.releaseIndex++;
            if(this.releaseIndex > releaseTime)
                this._isFinished = true;
        }
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
        this.osc.frequency *= 0.9998;
        if(this.osc.frequency <= 7)
            this._isFinished = true;
        return this.osc.nextSample() * drummingVolume;
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

        return (Math.random()*2-1) * drummingVolume;
    }
}