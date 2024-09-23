export class LowPassFilter {
    buffer = [0, 0, 0, 0, 0, 0,0,0,0,0];
    constructor(configuration) {
        this.configuration = configuration;
        this.buffer = new Array(configuration.filterCutoff)
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