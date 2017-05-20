/// <reference path="EstimatorInterface.ts"/>

class NeighborhoodEstimator implements EstimatorInterface{
    private neighbor:Neighborhood;
    private entities:Entity[];

    constructor(line:string){
        let parts:string[] = line.split(/\((.+)\)/);
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        
        this.entities = EntityListParser.parseList(parts[1]);
    }
    
    calculate(iteration:number, position:Point, region:Region):number{
        let result:number = 0;
        for(let entity of this.entities){
            result += this.neighbor.getTotal(Marahel.getEntityIndex(entity.name), position, region);
        }
        return result;
    }
}