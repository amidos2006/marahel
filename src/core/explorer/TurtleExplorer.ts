/// <reference path="Explorer.ts"/>

/**
 * Agent based generator
 */
abstract class TurtleExplorer extends Explorer{
    /**
     * directions allowed for the agents
     */
    protected directions:Neighborhood;

    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    constructor(regionNames:string[], parameters:any, rules:string[]){
        super(regionNames, parameters, rules);

        this.directions = Marahel.marahelEngine.getNeighborhood("plus");
        if(parameters["directions"]){
            this.directions = Marahel.marahelEngine.getNeighborhood(parameters["directions"]);
        }
    }

    protected restartRepeat(region:Region):Point{
        return new Point(Random.getIntRandom(region.getX(), region.getX() + region.getWidth()), 
            Random.getIntRandom(region.getY(), region.getY() + region.getHeight()));
    }
}