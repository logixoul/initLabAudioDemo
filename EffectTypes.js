export class BoxLowPassFilter {
    buffer;
    constructor(configuration) {
        this.configuration = configuration;
        this.buffer = new Array(configuration.filterCutoff)
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
        const coef = this.configuration.filterCutoff;
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