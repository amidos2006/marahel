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

class LocationNode{
    x:number;
    y:number;
    parent:LocationNode;

    constructor(parent:LocationNode=null, x:number=0, y:number=0){
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    checkEnd(x:number, y:number):boolean{
        return this.x == x && this.y == y;
    }

    estimate(x:number, y:number):number{
        return Math.abs(x - this.x) + Math.abs(y - this.y);
    }
    
    toString():string{
        return this.x + "," + this.y;
    }
}

class AStar{
    private static convertNodeToPath(node:LocationNode):Point[]{
        let points:Point[] = [];
        while(node != null){
            points.push(new Point(node.x, node.y));
            node = node.parent;
        }
        return points.reverse();
    }

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

class EntityListParser{
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

class Random{
    private static rnd:Prando;
    private static noise:Noise;

    public static initialize():void{
        this.rnd = new Prando();
        this.noise = new Noise();
    }

    public static changeSeed(seed:number):void{
        this.rnd = new Prando(seed);
        this.noise.seed(seed);
    }

	public static getRandom():number{
        return this.rnd.next();
    }

    public static getIntRandom(min:number, max:number):number{
        return this.rnd.nextInt(min, max - 1);
    }

    public static getNoise(x:number, y:number):number{
        return this.noise.perlin2(x, y);
    }

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

class Factory{
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