/// <reference path="../Marahel.ts"/>
/// <reference path="../data/Neighborhood.ts"/>
/// <reference path="../data/Entity.ts"/>

/**
 * Executer class (Right hand side of the rule)
 */
class Executer{
    /**
     * used neighborhood to apply the executer
     */
    private neighbor:Neighborhood;
    /**
     * entities that will be applied in the region using neighbor
     */
    private entities:Entity[];

    /**
     * Constructor for the executer class
     * @param line user input data
     */
    constructor(line:string){
        if(line.trim().length == 0){
            line = "self(any)";
        }
        let eParts:string[] = line.split(/\((.+)\)/);
        this.neighbor = Marahel.marahelEngine.getNeighborhood(eParts[0].trim());
        this.entities = EntityListParser.parseList(eParts[1].trim());
    }

    /**
     * Apply all the executers on the current selected region
     * @param position current position of the generator
     * @param region allowed region to apply the executer
     */
    apply(position:Point, region:Region):void{
        let entity:number = this.entities[Random.getIntRandom(0, this.entities.length)].index;
        this.neighbor.setTotal(entity, position, region);
    }
}