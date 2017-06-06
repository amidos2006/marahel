/// <reference path="EstimatorInterface.ts"/>

class NumberEstimator implements EstimatorInterface{
    private name:string;

    constructor(line:string){
        this.name = line;
    }

    calculate(iteration:number, position:Point, region:Region):number{
        if(this.name == "complete"){
            return iteration;
        }
        if(this.name == "random"){
            return Engine.getRandom();
        }
        if(this.name == "noise"){
            return Engine.getNoise(position.x/region.getWidth(), position.y/region.getHeight());
        }
        if(isNaN(parseFloat(this.name))){
            return region.getEntityNumber(Engine.getEntityIndex(this.name));
        }
        return parseFloat(this.name);
    }
}