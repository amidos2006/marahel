/// <reference path="EstimatorInterface.ts"/>

/**
 * Distance estimator is used as part of condition to get min, max, or avg 
 * distance to one or a group of entities
 */
class DistanceEstimator implements EstimatorInterface{
    /**
     * type of the distance estimator (minimum, maximum, average)
     */
    private type:string;
    /**
     * neighborhood used in measuring distance
     */
    private neighbor:Neighborhood;
    /**
     * entities used in measuring the distance to
     */
    private entities:Entity[];
    /**
     * allowed movement tiles
     */
    private allowed:Entity[];

    /**
     * Constructor for the distance estimator
     * @param line input line by user
     */
    constructor(line:string){
        if(line.match("max")){
            this.type = "max";
        }
        else if(line.match("min")){
            this.type = "min"
        }
        else{
            this.type = "avg";
        }

        let parts:string[] = line.split(/\((.+)\)/)[1].split(",");
        if(parts.length == 1){
            this.neighbor = null;
            this.entities = EntityListParser.parseList(parts[0]);
        }
        else{
            this.neighbor = Marahel.marahelEngine.getNeighborhood(parts[0].trim());
            this.entities = EntityListParser.parseList(parts[1]);
            let allowedName:string = "any";
            if(parts.length > 2){
                allowedName = parts[2].trim();
            }
            this.allowed = EntityListParser.parseList(allowedName);
        }
    }

    /**
     * get maximum distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return maximum distance between current location and entity index
     */
    private getMax(position:Point, region:Region, entityIndex:number):number{
        let values:number[] = [];
        if(this.neighbor != null){
            values = region.getDistances(position, this.neighbor, entityIndex, 
                (x:number, y:number)=>{
                    for(let a of this.allowed){
                        if(region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(a.name)){
                            return false;
                        }
                    }
                    return true;
                });
        }
        else{
            values = region.getEstimateDistances(position, entityIndex);
        }
        if(values.length <= 0){
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

    /**
     * get minimum distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return minimum distance between current location and entity index
     */
    private getMin(position:Point, region:Region, entityIndex:number):number{
        let values:number[] = [];
        if(this.neighbor != null){
            values = region.getDistances(position, this.neighbor, entityIndex, 
                (x:number, y:number)=>{
                    for(let a of this.allowed){
                        if(region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(a.name)){
                            return false;
                        }
                    }
                    return true;
                });
        }
        else{
            values = region.getEstimateDistances(position, entityIndex);
        }
        if(values.length <= 0){
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

    /**
     * get average distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return average distance between current location and entity index
     */
    private getAvg(position:Point, region:Region, entityIndex:number):number{
        let values:number[] = [];
        if(this.neighbor != null){
            values = region.getDistances(position, this.neighbor, entityIndex, 
                (x:number, y:number)=>{
                    for(let a of this.allowed){
                        if(region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(a.name)){
                            return false;
                        }
                    }
                    return true;
                });
        }
        else{
            values = region.getEstimateDistances(position, entityIndex);
        }
        if(values.length <= 0){
            return -1;
        }
        let total:number = 0;
        for(let i:number=0; i<values.length; i++){
            total += values[i];
        }

        return total / values.length;
    }

    /**
     * get the distance from the current location to a specified sprite
     * @param iteration percentage of the current generator
     * @param position current position
     * @param region current region
     * @return distance from the current position to the specified entity
     */
    calculate(iteration:number, position:Point, region:Region):number{
        let max:number = 0;
        let min:number = Number.MAX_VALUE;
        let totalAvg:number = 0;
        let maxChange:boolean = false;
        let minChange:boolean = false;
        let avgChange:boolean = false;
        for(let e of this.entities){
            let maxValue:number = this.getMax(position, region, Marahel.marahelEngine.getEntityIndex(e.name));
            if(maxValue != -1 && maxValue > max){
                max = max;
                maxChange = true;
            }
            let minValue:number = this.getMin(position, region, Marahel.marahelEngine.getEntityIndex(e.name));
            if(minValue != -1 && minValue < min){
                min = minValue;
                minChange = true;
            }
            let avgValue:number = this.getAvg(position, region, Marahel.marahelEngine.getEntityIndex(e.name));
            if(avgValue != -1){
                totalAvg += avgValue;
                avgChange = true;
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
            case "avg":
                if(!avgChange){
                    return -1;
                }
                return totalAvg/this.entities.length;
        }
    }
}