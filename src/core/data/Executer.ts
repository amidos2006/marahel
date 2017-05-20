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
        this.entities = [];
        let eeParts:string[] = eParts[1].split("|");
        for(let e of eeParts){
            let nums:string[] = e.split(":");
            let times:number = 1;
            if(nums.length > 1){
                times = parseInt(nums[1]);
            }
            for(let i:number=0; i<times; i++){
                this.entities.push(Marahel.getEntity(nums[0].trim()));
            }
        }

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