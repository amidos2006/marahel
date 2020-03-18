/// <reference path="TurtleExplorer.ts"/>

class DrunkTurtleExplorer extends TurtleExplorer {
    private change_prob:number;
    private dir:Point;

    constructor(regionNames:string[], parameters:any, rules:string[]){
        super(regionNames, parameters, rules);
        
        this.change_prob = 0.1;
        if(parameters["change"]){
            this.change_prob = parseFloat(parameters["change"]);
        }
    }

    protected getNextLocation(currentLocation: Point, region: Region): Point {
        let newX: number = currentLocation.x + this.dir.x;
        let newY: number = currentLocation.y + this.dir.y;
        if (Random.getRandom() < this.change_prob || !region.inRegion(newX, newY)) {
            let dir = Random.choiceArray(this.directions.locations);
            this.dir.x = dir.x;
            this.dir.y = dir.y;
        }
        newX = currentLocation.x + this.dir.x;
        newY = currentLocation.y + this.dir.y;
        if (region.inRegion(newX, newY)) {
            return new Point(newX, newY);
        }
        return currentLocation;
    }
}