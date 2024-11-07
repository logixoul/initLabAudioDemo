export class BoxLowPassFilter {
    buffer;

    constructor(configuration) {
        this.configuration = configuration;
        this.buffer = new Array(140);//new Array(configuration.filterCutoff)
        this.buffer.fill(0);
    }
    processSample(sample) {
        this.buffer.splice(0, 1);
        this.buffer.push(sample);
        let sum = 0;
        for(let value of this.buffer) {
            sum+=value;
        }
        return sum / this.buffer.length;
    }
}

export class ExpLowPassFilter {
    filterState = 0;
    constructor(configuration) {
        this.configuration = configuration;
    }
    processSample(sample) {
        let coef = this.configuration.filterCutoff;
        coef = Math.pow(coef, 3.0)
        this.filterState = coef * sample + (1-coef) * this.filterState;
        return this.filterState;
    }
}

export class HighPassFilter {
    lowPassFilter;
    constructor(configuration) {
        this.lowPassFilter = new ExpLowPassFilter(configuration);
    }
    processSample(sample) {
        const lowpassedSample = this.lowPassFilter.processSample(sample);

        return sample - lowpassedSample;
    }
}

export class Echo {
    buffer;
    constructor(configuration) {
        this.configuration = configuration;
        this.buffer = new Array(Math.round(10000*configuration.echoDelay))
        this.buffer.fill(0);
    }
    processSample(sample) {
        this.buffer.splice(0, 1);
        this.buffer.push(sample);
        
        return this.buffer[0] * .5 + this.buffer[this.buffer.length-1];
    }
}

export class DelayLine {
    buffer; // circular buffer
    currentPos = 0;
    constructor(configuration, timeMultiplier) {
        this.configuration = configuration;
        this.buffer = new Array(Math.round(10000*configuration.echoDelay * timeMultiplier))
        this.buffer.fill(0);
    }
    processSample(sample) {
        let newestSample = sample;
        let futurePos = this.currentPos+this.buffer.length;
        if(futurePos >= this.buffer.length)
            futurePos -= this.buffer.length + 1;
        
        this.buffer[futurePos] += newestSample;
        this.buffer[futurePos] *= .95;
        const dryLevel = 1.0;
        const wetLevel = 0.6;
        let returnValue = dryLevel*newestSample + wetLevel*this.buffer[this.currentPos];
        this.currentPos++;
        this.currentPos %= this.buffer.length;
        return returnValue;
    }
}

export class Reverb {
    delayLines = [];
    constructor(configuration) {
        this.configuration = configuration;
        this.delayLines.push(new DelayLine(configuration, 1));
        //for(let i = .9; i <= 1.1; i+=.02)
            //this.delayLines.push(new DelayLine(configuration, i));
    }

    processSample(sample) {
        for(let delayLine of this.delayLines) {
            sample = delayLine.processSample(sample);
        }
        return sample;
    }
}