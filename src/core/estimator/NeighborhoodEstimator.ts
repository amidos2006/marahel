/// <reference path="EstimatorInterface.ts"/>

class NeighborhoodEstimator implements EstimatorInterface{
    private neighbor:Neighborhood;
    private entity:Entity;

    constructor(line:string){
        let parts:string[] = line.split(/\((.+)\)/);
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        this.entity = Marahel.getEntity(parts[1].trim());
    }
    
    calculate(iteration:number, position:Point, region:Region):number{
        return this.neighbor.getTotal(Marahel.getEntityIndex(this.entity.name), position, region);
    }
}