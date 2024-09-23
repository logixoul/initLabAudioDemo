export class LowPassFilter {
    buffer;
    constructor(configuration) {
        this.configuration = configuration;
        console.log("will create buffer of size", configuration.filterCutoff)
        this.buffer = new Array(configuration.filterCutoff)
        console.log("buffer of size ", this.buffer.length, " created");
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