/// <reference path="EstimatorInterface.ts"/>

class DistanceEstimator implements EstimatorInterface{
    private type:string;
    private neighbor:Neighborhood;
    private entities:Entity[];
    private avoids:Entity[];

    constructor(line:string){
        if(line.match("max")){
            this.type = "max";
        }
        else if(line.match("min")){
            this.type = "min"
        }

        let parts:string[] = line.split(/\((.+)\)/)[1].split(",");
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        this.entities = EntityListParser.parseList(parts[1]);
        this.avoids = EntityListParser.parseList(parts[2]);
    }

    private getMax(position:Point, region:Region, entityIndex:number):number{
        let values:number[] = region.getDistances(position, this.neighbor, entityIndex, 
            (x:number, y:number)=>{
                for(let a of this.avoids){
                    if(region.getValue(x, y) == Marahel.getEntityIndex(a.name)){
                        return true;
                    }
                }
                return false;
            });
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

    private getMin(position:Point, region:Region, entityIndex:number):number{
        let values:number[] = region.getDistances(position, this.neighbor, entityIndex, 
            (x:number, y:number)=>{
                for(let a of this.avoids){
                    if(region.getValue(x, y) == Marahel.getEntityIndex(a.name)){
                        return true;
                    }
                }
                return false;
            });
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
        let maxChange:boolean = false;
        let minChange:boolean = false;
        for(let e of this.entities){
            let maxValue:number = this.getMax(position, region, Marahel.getEntityIndex(e.name));
            if(maxValue != -1 && maxValue > max){
                max = max;
                maxChange = true;
            }
            let minValue:number = this.getMin(position, region, Marahel.getEntityIndex(e.name));
            if(minValue != -1 && minValue < min){
                min = minValue;
                minChange = false;
            }
        }

        switch(this.type){
            case "max":
                if(!maxChange){
                    return -1;
                }
                return max;
            case "min":
                if(!minChange){
                    return -1;
                }
                return min;
        }
    }
}