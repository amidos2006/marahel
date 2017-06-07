/// <reference path="../Marahel.ts"/>
/// <reference path="../data/Neighborhood.ts"/>
/// <reference path="../data/Entity.ts"/>

class Executer{
    private neightbor:Neighborhood;
    private entities:Entity[];
    private nextExecuter:Executer;

    constructor(line:string){
        let parts:string[] = line.split(",");
        let eParts:string[] = parts[0].split(/\((.+)\)/);
        this.neightbor = Marahel.marahelEngine.getNeighborhood(eParts[0].trim());
        this.entities = EntityListParser.parseList(eParts[1].trim());

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextExecuter = new Executer(parts.join(","));
        }
    }

    apply(position:Point, region:Region):void{
        let entity:Entity = this.entities[Random.getIntRandom(0, this.entities.length)];
        this.neightbor.setTotal(Marahel.marahelEngine.getEntityIndex(entity.name), position, region);
        if(this.nextExecuter != null){
            this.nextExecuter.apply(position, region);
        }
    }
}