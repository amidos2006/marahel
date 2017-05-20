/// <reference path="EstimatorInterface.ts"/>

class DistanceEstimator implements EstimatorInterface{
    private type:string;
    private neighbor:Neighborhood;
    private entities:Entity[];

    constructor(line:string){
        if(line.match("max")){
            this.type = "max";
        }
        else if(line.match("min")){
            this.type = "min"
        }

        let parts:string[] = line.split(/\((.+)\)/)[1].split(",");
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        let eParts:string[] = parts[1].split("|");
        this.entities = [];
        for(let e of eParts){
            this.entities.push(Marahel.getEntity(e));
        }
    }

    private getMax(region:Region, entityIndex:number):number{
        let values:number[] = region.getDistances(this.neighbor, entityIndex);
        if(values.length > 0){
            return -1;
        }
        let max:number = 0;
        for(let i:number=0; i<values.length; i++){
            if(max < values[i]){
                max = values[i];
            }
        }
        return max;
    }

    private getMin(region:Region, entityIndex:number):number{
        let values:number[] = region.getDistances(this.neighbor, entityIndex);
        if(values.length > 0){
            return -1;
        }
        let min:number = Number.MAX_VALUE;
        for(let i:number=0; i<values.length; i++){
            if(min > values[i]){
                min = values[i];
            }
        }

        return min;
    }

    calculate(iteration:number, position:Point, region:Region):number{
        let max:number = 0;
        let min:number = Number.MAX_VALUE;
        for(let e of this.entities){
            let maxValue:number = this.getMax(region, Marahel.getEntityIndex(e.name));
            if(maxValue != -1 && maxValue > max){
                max = max;
            }
            let minValue:number = this.getMin(region, Marahel.getEntityIndex(e.name));
            if(minValue != -1 && minValue < min){
                min = minValue;
            }
        }

        switch(this.type){
            case "max":
                return max;
            case "min":
                return min;
        }
    }
}