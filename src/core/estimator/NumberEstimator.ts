/// <reference path="EstimatorInterface.ts"/>

/**
 * Number estimator is most common used estimator. It can return completion percentage, 
 * random value, noise value, constant value, or number of entities in the selected region
 */
class NumberEstimator implements EstimatorInterface{
    /**
     * current specified name
     */
    private name:string;

    /**
     * Constructor for Number Estimator
     * @param line user input
     */
    constructor(line:string){
        this.name = line;
        if(this.name != "complete" && this.name != "random" && this.name != "noise" && 
            isNaN(parseFloat(this.name)) && Marahel.marahelEngine.getEntityIndex(this.name) == -1){
            throw new Error("Undefined name estimator.");
        }
    }

    /**
     * Calculates the value for the specified name
     * @param iteration completion percentage
     * @param position current position
     * @param region current region
     * @return estimated value for the name
     */
    calculate(iteration:number, position:Point, region:Region):number{
        if(this.name == "complete"){
            return iteration;
        }
        if(this.name == "random"){
            return Random.getRandom();
        }
        if(this.name == "noise"){
            return Random.getNoise(position.x/region.getWidth(), position.y/region.getHeight());
        }
        if(isNaN(parseFloat(this.name))){
            return region.getEntityNumber(Marahel.marahelEngine.getEntityIndex(this.name));
        }
        return parseFloat(this.name);
    }
}