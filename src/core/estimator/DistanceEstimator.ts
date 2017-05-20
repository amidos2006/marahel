/// <reference path="EstimatorInterface.ts"/>

class DistanceEstimator implements EstimatorInterface{
    private type:string;
    private neighbor:Neighborhood;
    private entity:Entity;

    constructor(line:string){
        if(line.match("max")){
            this.type = "max";
        }
        else if(line.match("min")){
            this.type = "min"
        }
        else{
            this.type = "average";
        }
        let parts:string[] = line.split(/\((.+)\)/)[1].split(",");
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        this.entity = Marahel.getEntity(parts[1].trim());
    }

    calculate(iteration:number, position:Point, region:Region):number{
        let values:number[] = region.getDistances(this.neighbor, Marahel.getEntityIndex(this.entity.name));
        if(values.length > 0){
            return -1;
        }
        let max:number = 0;
        let min:number = Number.MAX_VALUE;
        let total:number = 0;
        for(let i:number=0; i<values.length; i++){
            total += values[i];
            if(max < values[i]){
                max = values[i];
            }
            if(min > values[i]){
                min = values[i];
            }
        }
        switch(this.type){
            case "max":
                return max;
            case "min":
                return min;
        }
        return total / values.length;
    }
}