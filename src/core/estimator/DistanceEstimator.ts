/// <reference path="EstimatorInterface.ts"/>

/**
 * Distance estimator is used as part of condition to get min, max, or avg 
 * distance to one or a group of entities
 */
class DistanceEstimator implements EstimatorInterface{
    /**
     * entities used in measuring the distance to
     */
    private entities:Entity[];
    /**
     * is it a distance to the edge
     */
    private hasOut:boolean;

    /**
     * Constructor for the distance estimator
     * @param line input line by user
     */
    constructor(line:string){
        let parts:string[] = line.split(/\((.+)\)/);
        if(parts.length <= 1){
            throw new Error("Distance estimator is not in the correct format: DistanceEstimatorName(entity)");
        }
        this.entities = EntityListParser.parseList(parts[0]);
        this.hasOut = false;
        if(this.entities.length == 1 && this.entities[0].name == "out"){
            this.hasOut = true;
        }
    }

    /**
     * get the distance from the current location to a specified sprite
     * @param iteration percentage of the current generator
     * @param position current position
     * @param region current region
     * @return distance from the current position to the specified entity
     */
    calculate(singleperc: number, changeperc:number, repeatperc: number, position:Point, region:Region):number{
        if(this.hasOut){
            let min:number = position.x - region.getX();
            if(position.y - region.getY() < min){
                min = position.y - region.getY();
            }
            if(region.getWidth() - (position.x - region.getX()) < min){
                min = region.getWidth() - (position.x - region.getX());
            }
            if (region.getHeight() - (position.y - region.getY()) < min){
                min = region.getHeight() - (position.y - region.getY());
            }
            return min;
        }

        let min:number = -1;
        for(let e of this.entities){
            let dists:number[] = region.getDistances(position, e.index);
            for(let d of dists){
                if(min == -1 || d < min){
                    min = d;
                }
            }
        }
        return min;
    }
}