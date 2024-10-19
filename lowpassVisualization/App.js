import * as EffectTypes from "../EffectTypes.js";

class Configuration {
    filterCutoff = 1;
}

export class App {

    
    constructor() {
        this.configuration = new Configuration();
        this.canvas;
        this.canvasContext;
        this.mouseY = 0;
        this.samples = new Array(20000); // circular buffer
        this.reachedIndex = 0;
        this.filter = new EffectTypes.ExpLowPassFilter(this.configuration)
        document.getElementById("filterCutoff").oninput = (e) => {
            this.configuration.filterCutoff = Number(e.target.value);
        };
        this.configuration.filterCutoff = Number(document.getElementById("filterCutoff").value);
        document.getElementById("filterSelection").onchange = (e) => {
            let filterClassName = e.target.value;
            const filterClass = eval("EffectTypes." + filterClassName)
            this.filter = new filterClass(this.configuration); // reset the filter with the new config        };
        }
        this.canvas = document.getElementById("canvas");
        this.canvasContext = this.canvas.getContext("2d");

        this.canvas.addEventListener("mousemove", (e) => {
            var x = e.pageX - e.currentTarget.offsetLeft;
            var y = e.pageY - e.currentTarget.offsetTop; 
            this.mouseY = y;
        });

        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        
        window.setInterval (()=>{this.nextFrame();}, 1000/60);

    }

    nextFrame() {
        
        this.samples[this.reachedIndex] = this.filter.processSample(this.mouseY - this.canvas.height/2);
        this.reachedIndex++;
        if(this.reachedIndex >= this.canvas.width)
            this.reachedIndex = 0;
        this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, this.samples[0]);
        for(let i = 1; i < this.canvas.width; i++) {
            this.canvasContext.lineTo(i, this.samples[i]+ this.canvas.height/2);
        }
        //this.canvasContext.endPath();
        this.canvasContext.stroke();
    }
}
