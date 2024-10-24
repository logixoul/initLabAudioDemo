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

export class Reverb {
    buffer; // circular buffer
    currentPos = 0;
    constructor(configuration) {
        this.configuration = configuration;
        this.buffer = new Array(Math.round(10000*configuration.echoDelay))
        this.buffer.fill(0);
    }
    processSample(sample) {
        let newestSample = sample;
        let futurePos = this.currentPos+this.buffer.length;
        if(futurePos >= this.buffer.length)
            futurePos -= this.buffer.length + 1;
        
        //this.buffer[this.currentPos] += newestSample
        const alpha = .05;
        this.buffer[futurePos] = this.buffer[futurePos] * (1-alpha) + newestSample * alpha;
        let returnValue = newestSample + .12*this.buffer[this.currentPos] / alpha;
        this.currentPos++;
        this.currentPos %= this.buffer.length;
        return returnValue;
    }
}