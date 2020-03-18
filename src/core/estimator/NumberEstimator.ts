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
        if(this.name != "percent" && this.name != "rpercent" && this.name != "cperct" &&
            this.name != "random" && this.name != "noise" && 
            isNaN(parseFloat(this.name)) && 
            Marahel.marahelEngine.getEntityIndex(this.name) == -1){
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
    calculate(singleperc: number, changeperc:number, repeatperc: number,position:Point, region:Region):number{
        if(this.name == "percent"){
            return singleperc;
        }
        if(this.name == "cpercent"){
            return changeperc;
        }
        if(this.name == "rpercent"){
            return repeatperc;
        }
        if(this.name == "random"){
            return Random.getRandom();
        }
        if(this.name == "noise"){
            return Random.getNoise((position.x - region.getX())/region.getWidth(), 
                (position.y - region.getY())/region.getHeight());
        }
        if(isNaN(parseFloat(this.name))){
            if(this.name == "out"){
                return 0;
            }
            return region.getEntityNumber(Marahel.marahelEngine.getEntityIndex(this.name));
        }
        return parseFloat(this.name);
    }
}