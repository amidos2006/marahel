/// <reference path="WideExplorer.ts"/>

/**
 * Agent based generator
 */
class HeuristicWideExplorer extends WideExplorer {
    private estimators: EstimatorInterface[];

    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    constructor(regionNames:string[], parameters:any, rules:string[]) {
        super(regionNames, parameters, rules);

        this.estimators = [];
        let parts = parameters["heuristics"].split(",");
        for (let p of parts) {
            this.estimators.push(Factory.getEstimator(p));
        }
    }

    protected sortTiles(): void{
        this.locations.sort(function (l1, l2) {
            for (let e of this.estimators) {
                let v1 = e.calculate(this.getSinglePercentage(), 0, l1, this.region);
                let v2 = e.calculate(this.getSinglePercentage(), 0, l2, this.region);
                if (v1 != v2) {
                    return v1 - v2;
                }
            }
            return Random.getRandom() - 0.5;
        });
    }
}