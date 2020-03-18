/// <reference path="../data/Point.ts"/>
/// <reference path="Prando.ts"/>
/// <reference path="Noise.ts"/>

/// <reference path="../regionDivider/SamplingDivider.ts"/>
/// <reference path="../regionDivider/BinaryDivider.ts"/>
/// <reference path="../regionDivider/EqualDivider.ts"/>

/// <reference path="../operator/LargerEqualOperator.ts"/>
/// <reference path="../operator/LessEqualOperator.ts"/>
/// <reference path="../operator/LargerOperator.ts"/>
/// <reference path="../operator/LessOperator.ts"/>
/// <reference path="../operator/EqualOperator.ts"/>
/// <reference path="../operator/NotEqualOperator.ts"/>

/// <reference path="../estimator/NeighborhoodEstimator.ts"/>
/// <reference path="../estimator/NumberEstimator.ts"/>
/// <reference path="../estimator/DistanceEstimator.ts"/>

/// <reference path="../explorer/HorizontalNarrowExplorer.ts"/>
/// <reference path="../explorer/VerticalNarrowExplorer.ts"/>
/// <reference path="../explorer/RandomNarrowExplorer.ts"/>

/// <reference path="../explorer/DrunkTurtleExplorer.ts"/>
/// <reference path="../explorer/HeuristicTurtleExplorer.ts"/>
/// <reference path="../explorer/ConnectTurtleExplorer.ts"/>

/// <reference path="../explorer/HeuristicWideExplorer.ts"/>
/// <reference path="../explorer/RandomWideExplorer.ts"/>

/**
 * parses list of entities to an actual entity array
 * e.g solid:2|empty:3|player => [solid, solid, empty, empty, player]
 * where the array elements are entity objects
 */
class EntityListParser{
    /**
     * convert the user input into an array of entities
     * @param line input line by user
     * @return list of entities that is equivalent to the user input
     */
    static parseList(line:string):Entity[]{
        if(line.trim() == "any"){
            return Marahel.marahelEngine.getAllEntities().concat([Marahel.marahelEngine.getEntity(-1)]);
        }
        if (line.trim() == "entity") {
            return Marahel.marahelEngine.getAllEntities();
        }
        if(line.trim() == "out"){
            return [new Entity("out", -2)];
        }
        let result:Entity[] = [];
        let eeParts:string[] = line.split("|");
        for(let e of eeParts){
            let nums:string[] = e.split(":");
            let times:number = 1;
            if(nums.length > 1){
                times = parseInt(nums[1]);
            }
            for(let i:number=0; i<times; i++){
                result.push(Marahel.marahelEngine.getEntity(nums[0].trim()));
            }
        }
        return result;
    }
}

/**
 * Interface for Prando and Noise classes
 */
class Random{
    /**
     * Prando object used in the random class
     */
    private static rnd:Prando;
    /**
     * Noise object used in the random class
     */
    private static noise:Noise;

    /**
     * initialize the parameters of the system
     */
    public static initialize():void{
        this.rnd = new Prando();
        this.noise = new Noise();
    }

    /**
     * change noise and random seeds
     * @param seed new seed for the random and noise objects
     */
    public static changeSeed(seed:number):void{
        this.rnd = new Prando(seed);
        this.noise.seed(seed);
    }

    /**
     * get random number between 0 and 1
     * @return a random value between 0 (inclusive) and 1 (exclusive)
     */
	public static getRandom():number{
        return this.rnd.next();
    }

    /**
     * get random integer between min and max
     * @param min min value for the random integer
     * @param max max value for the random integer
     * @return a random integer between min (inclusive) and max (exclusive)
     */
    public static getIntRandom(min:number, max:number):number{
        if(max <= min) return min;
        return this.rnd.nextInt(min, max - 1);
    }

    /**
     * get 2D perlin noise value based on the location x and y
     * @param x x location
     * @param y y location
     * @return noise value based on the location x and y
     */
    public static getNoise(x:number, y:number):number{
        return this.noise.perlin2(x, y);
    }

    /**
     * shuffle an array in place
     * @param array input array to be shuffled
     */
    public static shuffleArray(array:any[]):void{
        for(let i:number=0; i<array.length; i++){
            let i1:number = this.getIntRandom(0, array.length);
            let i2:number = this.getIntRandom(0, array.length);
            let temp:any = array[i1];
            array[i1] = array[i2];
            array[i2] = temp;
        }
    }

    /**
     * get a random value from the array
     * @param array the input array
     * @return a random value from the array
     */
    public static choiceArray(array:any[]):any{
        return array[Random.getIntRandom(0, array.length)];
    }

}

/**
 * transform a string to its corresponding class
 */
class Factory{
    /**
     * create an estimator based on the user input
     * @param line user input to be parsed
     * @return Number Estimator, Distance Estimator, or NeighborhoodEstimator
     */
    public static getEstimator(line:string):EstimatorInterface{
        if(line.match(/\((.+)\)/) == null){
            return new NumberEstimator(line);
        }
        else if(line.match("Dist")){
            return new DistanceEstimator(line);
        }
        return new NeighborhoodEstimator(line);
    }

    /**
     * get the correct operator based on the user input
     * @param line user input to be parsed to operator
     * @return >=, <=, >, <, == (=), or != (<>)
     */
    public static getOperator(line:string):OperatorInterface{
        line = line.trim()
        switch(line){
            case ">=":
                return new LargerEqualOperator();
            case "<=":
                return new LessEqualOperator();
            case "=":
            case "==":
                return new EqualOperator();
            case "<>":
            case "!=":
                return new NotEqualOperator();
            case ">":
                return new LargerOperator();
            case "<":
                return new LessOperator();
        }
        return null;
    }

    /**
     * get the correct divider based on the user input
     * @param type input type of the divider
     * @param numRegions number of region after division
     * @param parameters parameters for the divider
     * @return EqualDivider, BinaryDivider, or SamplingDivider
     */
    public static getDivider(type:string, numRegions:number, parameters:any):DividerInterface{
        switch(type.trim()){
            case "equal":
                return new EqualDivider(numRegions, parameters);
            case "bsp":
                return new BinaryDivider(numRegions, parameters);
            case "sample":
            case "sampling":
                return new SamplingDivider(numRegions, parameters);
        }
        return null;
    }

    /**
     * get the specified generator by the user
     * @param type generator type
     * @param currentRegion region applied on
     * @param parameters generator parameters
     * @param rules generator rules
     * @return AutomataGenerator, AgentGenerator, or ConnectorGenerator
     */
    public static getGenerator(type:string, regions:any, parameters:any, rules:string[]):Explorer{
        let regionNames:string[] = regions.split(",");
        switch(type.trim()){
            case "narrow":
            case "narrow_horz":
            case "horz":
            case "horizontal":
                return new HorizontalNarrowExplorer(regionNames, parameters, rules);
            case "narrow_vert":
            case "vert":
            case "vertical":
                return new VerticalNarrowExplorer(regionNames, parameters, rules);
            case "narrow_rand":
            case "rand":
            case "random":
                return new RandomNarrowExplorer(regionNames, parameters, rules);
            case "turtle":
            case "turtle_drunk":
            case "drunk":
            case "digger":
                return new DrunkTurtleExplorer(regionNames, parameters, rules);
            case "turtle_heur":
            case "greedy":
            case "agent":
                return new HeuristicTurtleExplorer(regionNames, parameters, rules);
            case "turlte_connect":
            case "connect":
                return new ConnectTurtleExplorer(regionNames, parameters, rules);
            case "wide":
            case "wide_heur":
            case "heuristic":
            case "order":
                return new HeuristicWideExplorer(regionNames, parameters, rules);
            case "wide_rand":
            case "rorder":
            case "rand_order":
                return new RandomWideExplorer(regionNames, parameters, rules);
        }
        return null;
    }
}