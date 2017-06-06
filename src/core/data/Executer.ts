/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Entity.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>

class Executer{
    private neightbor:Neighborhood;
    private entities:Entity[];
    private nextExecuter:Executer;

    constructor(line:string){
        let parts:string[] = line.split(",");
        let eParts:string[] = parts[0].split(/\((.+)\)/);
        this.neightbor = Engine.getNeighborhood(eParts[0].trim());
        this.entities = EntityListParser.parseList(eParts[1].trim());

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextExecuter = new Executer(parts.join(","));
        }
    }

    apply(position:Point, region:Region):void{
        let entity:Entity = this.entities[Engine.getIntRandom(0, this.entities.length)];
        this.neightbor.setTotal(Engine.getEntityIndex(entity.name), position, region);
        if(this.nextExecuter != null){
            this.nextExecuter.apply(position, region);
        }
    }
}