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
     * next anded executer
     */
    private nextExecuter:Executer;

    /**
     * Constructor for the executer class
     * @param line user input data
     */
    constructor(line:string){
        let parts:string[] = line.split(",");
        let eParts:string[] = parts[0].split(/\((.+)\)/);
        this.neighbor = Marahel.marahelEngine.getNeighborhood(eParts[0].trim());
        this.entities = EntityListParser.parseList(eParts[1].trim());

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextExecuter = new Executer(parts.join(","));
        }
    }

    /**
     * Apply all the executers on the current selected region
     * @param position current position of the generator
     * @param region allowed region to apply the executer
     */
    apply(position:Point, region:Region):void{
        let entity:Entity = this.entities[Random.getIntRandom(0, this.entities.length)];
        this.neighbor.setTotal(Marahel.marahelEngine.getEntityIndex(entity.name), position, region);
        if(this.nextExecuter != null){
            this.nextExecuter.apply(position, region);
        }
    }
}