/// <reference path="Generator.ts"/>

/**
 * Automata Generator class
 */
class RandomGenerator extends Generator{
    /**
     * number of iterations to apply cellular automata
     */
    private numOfTiles:number;

    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the automata generator
     */
    constructor(currentRegion:any, rules:string[], parameters:any){
        super(currentRegion, rules);

        this.numOfTiles = 0;
        if(parameters["numberOfTiles"]){
            this.numOfTiles = parseInt(parameters["numberOfTiles"]);
        }
    }

    /**
     * Apply the automata algorithm on the regions array
     */
    applyGeneration(): void {
        super.applyGeneration();
        for(let r of this.regions){
            for(let i:number=0; i<this.numOfTiles; i++){    
                let currentPoint:Point = new Point(r.getX() + Random.getIntRandom(0, r.getWidth()), 
                    r.getY() + Random.getIntRandom(0, r.getHeight()));
                currentPoint = r.getRegionPosition(currentPoint.x, currentPoint.y);
                this.rules.execute(i/this.numOfTiles, currentPoint, r);
                Marahel.marahelEngine.currentMap.switchBuffers();
            }
        }
    }
}