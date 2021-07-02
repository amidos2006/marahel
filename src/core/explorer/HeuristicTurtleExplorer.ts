/// <reference path="TurtleExplorer.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>

class HeuristicTurtleExplorer extends TurtleExplorer {
    private estimators:EstimatorInterface[];

    constructor(regionNames: string[], parameters: any, rules: string[]) {
        super(regionNames, parameters, rules);

        this.estimators = [];
        let parts = parameters["heuristics"].split(",");
        for(let p of parts){
            this.estimators.push(Factory.getEstimator(p));
        }
    }

    protected getNextLocation(currentLocation: Point, region: Region): Point {
        let newlocs: Point[] = this.directions.getNeighbors(currentLocation.x,
            currentLocation.y, region);
        newlocs.sort(function (l1, l2) {
            for (let e of this.estimators){
                let v1 = e.calculate(this.getTilesPercentage(region), 
                    this.getChangePercentage(region), 
                    this.getRepeatPercentage(), l1, region);
                let v2 = e.calculate(this.getTilesPercentage(region), 
                    this.getChangePercentage(region), 
                    this.getRepeatPercentage(), l2, region);
                if(v1 != v2){
                    return v1-v2;
                }
            }
            return Random.getRandom() - 0.5;
        }.bind(this));
        return newlocs[0];
    }
}