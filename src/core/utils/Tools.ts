/// <reference path="../data/Point.ts"/>
/// <reference path="Prando.ts"/>
/// <reference path="Noise.ts"/>
/// <reference path="../regionDivider/SamplingDivider.ts"/>
/// <reference path="../regionDivider/BinaryDivider.ts"/>
/// <reference path="../regionDivider/EqualDivider.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>
/// <reference path="../operator/LargerEqualOperator.ts"/>
/// <reference path="../operator/LessEqualOperator.ts"/>
/// <reference path="../operator/LargerOperator.ts"/>
/// <reference path="../operator/LessOperator.ts"/>
/// <reference path="../operator/EqualOperator.ts"/>
/// <reference path="../operator/NotEqualOperator.ts"/>
/// <reference path="../estimator/NeighborhoodEstimator.ts"/>
/// <reference path="../estimator/NumberEstimator.ts"/>
/// <reference path="../estimator/DistanceEstimator.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../generator/AutomataGenerator.ts"/>
/// <reference path="../generator/AgentGenerator.ts"/>
/// <reference path="../generator/ConnectorGenerator.ts"/>

/**
 * basic node used in the A* algorithm
 */
class LocationNode{
    /**
     * x position on the map
     */
    x:number;
    /**
     * y position on the map
     */
    y:number;
    /**
     * parent of the node, null if root
     */
    parent:LocationNode;

    /**
     * constructor
     * @param parent current parent of the node
     * @param x map x position
     * @param y map y position
     */
    constructor(parent:LocationNode=null, x:number=0, y:number=0){
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    /**
     * check if the current node is the end node
     * @param x end location x position
     * @param y end location y position
     * @return true if its the end location, false otherwise
     */
    checkEnd(x:number, y:number):boolean{
        return this.x == x && this.y == y;
    }

    /**
     * get an estimate between the current node and 
     * end location using manhattan distance
     * @param x end location x position
     * @param y end location y position
     * @return the manhattan distance towards the exit
     */
    estimate(x:number, y:number):number{
        return Math.abs(x - this.x) + Math.abs(y - this.y);
    }
    
    /**
     * return printable version of the location node
     * @return 
     */
    toString():string{
        return this.x + "," + this.y;
    }
}

/**
 * A* algorithm used by the connector generator
 */
class AStar{
    /**
     * get the path from the root node to the input node
     * @param node destination node where u need path between the root and itself
     * @return a list of points that specify the path between the root and node
     */
    private static convertNodeToPath(node:LocationNode):Point[]{
        let points:Point[] = [];
        while(node != null){
            points.push(new Point(node.x, node.y));
            node = node.parent;
        }
        return points.reverse();
    }

    /**
     * Get path between start point and end point in a certain region
     * @param start start location
     * @param end destination
     * @param directions allowed directions for the A*
     * @param region the allowed region the algorithm should work in
     * @param checkSolid function that return true in locations not allowed
     * @return a list of points that represent the path between start and end points
     */
    static getPath(start:Point, end:Point, directions:Point[], region:Region, checkSolid:Function):Point[]{
        let iterations:number = 0;
        let openNodes:LocationNode[] = [new LocationNode(null, start.x, start.y)];
        let visited:any = {};
        let currentNode:LocationNode = openNodes[0];
        while(openNodes.length > 0 && !currentNode.checkEnd(end.x, end.y)){
            currentNode = openNodes.splice(0, 1)[0];
            if(!visited[currentNode.toString()]){
                visited[currentNode.toString()] = true;
                for(let d of directions){
                    let p:Point = region.getRegionPosition(currentNode.x + d.x, currentNode.y + d.y);
                    let newLocation:LocationNode = new LocationNode(currentNode, p.x, p.y);
                    if(newLocation.checkEnd(end.x, end.y)){
                        return AStar.convertNodeToPath(newLocation);
                    }
                    if(!checkSolid(newLocation.x, newLocation.y) && !region.outRegion(p.x, p.y)){
                        openNodes.push(newLocation);
                    }
                }
                openNodes.sort((a:LocationNode, b:LocationNode)=>{
                    return a.estimate(end.x, end.y) - b.estimate(end.x, end.y);
                });
            }
            iterations += 1;
            if(iterations >= Marahel.CONNECTOR_TRIALS){
                break;
            }
        }
        if(currentNode.checkEnd(end.x, end.y)){
            return AStar.convertNodeToPath(currentNode);
        }
        return [];
    }

    /**
     * get path between multiple start locations and ending location
     * @param start start location
     * @param end destination
     * @param directions allowed directions for the A*
     * @param region the allowed region the algorithm should work in
     * @param checkSolid function that return true in locations not allowed
     * @return a list of points that represent the path between start and end points
     */
    static getPathMultipleStartEnd(start:Point[], end:Point[], directions:Point[], region:Region, checkSolid:Function):Point[]{
        let shortest:number = Number.MAX_VALUE;
        let path:Point[] = [];

        for(let s of start){
            let iterations:number = 0;
            for(let e of end){
                let temp:Point[] = AStar.getPath(s, e, directions, region, checkSolid);
                if(temp.length < shortest){
                    shortest = temp.length;
                    path = temp;
                    iterations = 0;
                    if(shortest < 4){
                        break;
                    }
                }
                else{
                    iterations += 1;
                    if(iterations > Marahel.CONNECTOR_MULTI_TEST_TRIALS){
                        break;
                    }
                }
            }
            if(shortest < 4 || (shortest < Number.MAX_VALUE && 
                iterations > Marahel.CONNECTOR_MULTI_TEST_TRIALS)){
                break;
            }
        }
        return path;
    }
}

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
     * change thre noise and random seeds
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
        let parts:string[] = line.split(/\((.+)\)/);
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

    public static getDivider(type:string, numRegions:number, parameters:any):DividerInterface{
        switch(type.trim()){
            case "equal":
            return new EqualDivider(numRegions, parameters);
            case "bsp":
            return new BinaryDivider(numRegions, parameters);
            case "sampling":
            return new SamplingDivider(numRegions, parameters);
        }
        return null;
    }

    public static getGenerator(type:string, currentRegion:any, parameters:any, rules:string[]):Generator{
        switch(type.trim()){
            case "automata":
                return new AutomataGenerator(currentRegion, rules, parameters);
            case "agent":
                return new AgentGenerator(currentRegion, rules, parameters);
            case "connector":
                return new ConnectorGenerator(currentRegion, rules, parameters);
        }
        return null;
    }
}