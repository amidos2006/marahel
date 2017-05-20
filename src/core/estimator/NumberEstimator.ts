/// <reference path="EstimatorInterface.ts"/>

class NumberEstimator implements EstimatorInterface{
    private name:string;

    constructor(line:string){

    }

    calculate(iteration:number, position:Point, region:Region):number{
        if(this.name == "complete"){
            return iteration;
        }
        if(this.name == "random"){
            return Marahel.getRandom();
        }
        return region.getEntityNumber(Marahel.getEntityIndex(this.name));
    }
}