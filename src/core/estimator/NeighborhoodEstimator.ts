/// <reference path="EstimatorInterface.ts"/>
/// <reference path="../utils/Tools.ts"/>

/**
 * Neighborhood estimator calculates the number of entities using a certain neighborhood
 */
class NeighborhoodEstimator implements EstimatorInterface{
    /**
     * used neighborhood
     */
    private neighbor:Neighborhood;
    /**
     * entities used for calculation
     */
    private entities:Entity[];

    /**
     * Constructor for the neighborhood estimator
     * @param line user input
     */
    constructor(line:string){
        let parts:string[] = line.split(/\((.+)\)/);
        if(parts.length <= 1){
            throw new Error("Neighborhood estimator is not in the correct format: NeighborhoodName(entity).")
        }
        this.neighbor = Marahel.marahelEngine.getNeighborhood(parts[0].trim());
        
        this.entities = EntityListParser.parseList(parts[1]);
    }
    
    /**
     * Calculates the number of entities using a certain neighborhood
     * @param iteration percentage of completion of the generator
     * @param position current position
     * @param region current region
     * @return number of entities using a certain neighborhood
     */
    calculate(singleperc: number, changeperc: number, repeatperc: number, position:Point, region:Region):number{
        let result:number = 0;
        for(let entity of this.entities){
            result += this.neighbor.getTotal(entity.index, position, region);
        }
        return result;
    }

    numberOfOnes():number{
        return this.neighbor.locations.length;
    }
}