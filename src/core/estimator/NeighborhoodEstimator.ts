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
    calculate(iteration:number, position:Point, region:Region):number{
        let result:number = 0;
        for(let entity of this.entities){
            result += this.neighbor.getTotal(Marahel.marahelEngine.getEntityIndex(entity.name), position, region);
        }
        return result;
    }
}