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
        this.neightbor = Marahel.getNeighborhood(eParts[0]);
        this.entities = EntityListParser.parseList(eParts[1]);

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextExecuter = new Executer(parts.join(","));
        }
    }

    apply(position:Point, region:Region):void{
        let entity:Entity = this.entities[Marahel.getIntRandom(0, this.entities.length)];
        this.neightbor.setTotal(Marahel.getEntityIndex(entity.name), position, region);
        if(this.nextExecuter != null){
            this.nextExecuter.apply(position, region);
        }
    }
}