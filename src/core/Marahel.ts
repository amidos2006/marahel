/// <reference path="data/Map.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
/// <reference path="regionDivider/AdjustmentDivider.ts"/>
/// <reference path="regionDivider/BinaryDivider.ts"/>
/// <reference path="regionDivider/DiggerDivider.ts"/>
/// <reference path="regionDivider/EqualDivider.ts"/>
/// <reference path="operator/OperatorInterface.ts"/>
/// <reference path="operator/LargerEqualOperator.ts"/>
/// <reference path="operator/LessEqualOperator.ts"/>
/// <reference path="operator/LargerOperator.ts"/>
/// <reference path="operator/LessOperator.ts"/>
/// <reference path="operator/EqualOperator.ts"/>
/// <reference path="operator/NotEqualOperator.ts"/>
/// <reference path="estimator/NeighborhoodEstimator.ts"/>
/// <reference path="estimator/NumberEstimator.ts"/>
/// <reference path="estimator/DistanceEstimator.ts"/>
/// <reference path="estimator/EstimatorInterface.ts"/>
/// <reference path="generator/AutomataGenerator.ts"/>
/// <reference path="generator/AgentGenerator.ts"/>
/// <reference path="generator/ConnectorGenerator.ts"/>
/// <reference path="utils/Prando.ts"/>
/// <reference path="utils/Noise.ts"/>

class Marahel{
    public static STRING_OUTPUT:number = 0;
    public static COLOR_OUTPUT:number = 1;
    public static INDEX_OUTPUT:number = 2;

    public static MAX_TRIALS:number = 10;

    public static replacingType:number;
    public static borderType:number;
    public static currentMap:Map;

    private static rnd:Prando;
    private static noise:Noise;
    private static minDim:Point;
    private static maxDim:Point;
    private static entities:Entity[];
    private static entityIndex:any;
    private static neighbors:any;
    private static regionDivider:DividerInterface;
    private static generators:Generator[];

    static getRandom():number{
        return Marahel.rnd.next();
    }

    static getIntRandom(min:number, max:number):number{
        return Marahel.rnd.nextInt(min, max - 1);
    }

    static getNoise(x:number, y:number):number{
        return Marahel.noise.perlin2(x, y);
    }

    static shuffleArray(array:any[]):void{
        for(let i:number=0; i<array.length; i++){
            let i1:number = Marahel.getIntRandom(0, array.length);
            let i2:number = Marahel.getIntRandom(0, array.length);
            let temp:any = array[i1];
            array[i1] = array[i2];
            array[i2] = temp;
        }
    }

    static initialize(data:any):void{
        Marahel.rnd = new Prando();
        Marahel.noise = new Noise();
        Marahel.replacingType = Map.REPLACE_BACK;
        Marahel.borderType = Region.BORDER_NONE;

        Marahel.minDim = new Point(parseInt(data["metadata"]["min"].split("x")[0]), parseInt(data["metadata"]["min"].split("x")[1]));
        Marahel.maxDim = new Point(parseInt(data["metadata"]["max"].split("x")[0]), parseInt(data["metadata"]["max"].split("x")[1]));
        
        Marahel.entities = [];
        Marahel.entityIndex = {};
        for(let e in data["entity"]){
            Marahel.entities.push(new Entity(e, data["entity"][e]));
            Marahel.entityIndex[e] = Marahel.entities.length - 1;
        }

        Marahel.neighbors = {};
        for(let n in data["neighborhood"]){
            Marahel.neighbors[n] = new Neighborhood(n, data["neighborhood"][n]);
        }
        if(!("plus" in Marahel.neighbors)){
            Marahel.neighbors["plus"] = new Neighborhood("plus", "010,121,010");
        }
        if(!("all" in Marahel.neighbors)){
            Marahel.neighbors["all"] = new Neighborhood("all", "111,121,111");
        }
        if(!("sequential" in Marahel.neighbors)){
            Marahel.neighbors["sequential"] = new Neighborhood("sequential", "31,10");
        } 
        if(!("self" in Marahel.neighbors)){
            Marahel.neighbors["self"] = new Neighborhood("self", "3");
        }

        Marahel.regionDivider = Marahel.getDivider(data["region"]["type"], 
            parseInt(data["region"]["number"]), data["region"]["parameters"]);

        Marahel.generators = [];
        for(let g of data["rule"]){
            Marahel.generators.push(Marahel.getGenerator(g["type"], g["region"], g["parameters"], g["rules"]));
        }
    }

    private static generateOneTime():void{
        Marahel.currentMap = new Map(Marahel.getIntRandom(Marahel.minDim.x, Marahel.maxDim.x), 
            Marahel.getIntRandom(Marahel.minDim.y, Marahel.maxDim.y));
        let mapRegion:Region = new Region(0, 0, Marahel.currentMap.width, Marahel.currentMap.height);
        let regions:Region[] = Marahel.regionDivider.getRegions(mapRegion);
        for(let g of Marahel.generators){
            g.selectRegions(mapRegion, regions);
            g.applyGeneration();
        }
    }

    static generate(outputType:number=0, seed?:number):any[][]{
        if(!Marahel.rnd){
            throw new Error("Call initialize first.");
        }
        if(seed){
            Marahel.rnd = new Prando(seed);
            Marahel.noise.seed(seed);
        }

        for(let i:number=0; i<Marahel.MAX_TRIALS; i++){
            Marahel.generateOneTime();
            if(Marahel.currentMap.checkConstraints()){
                break;
            }
        }

        if(outputType == Marahel.COLOR_OUTPUT){
            return Marahel.currentMap.getColorMap();
        }
        if(outputType == Marahel.INDEX_OUTPUT){
            return Marahel.currentMap.getIndexMap();
        }
        return Marahel.currentMap.getStringMap();
    }

    static getEntity(value:number|string):Entity{
        if(typeof value == "string"){
            value = Marahel.getEntityIndex(value);
        }
        if(value < 0 || value >= Marahel.entities.length){
            return new Entity("undefined", {"color":"0x000000"});
        }
        return Marahel.entities[value];
    }

    static getAllEntities():Entity[]{
        return this.entities;
    }

    static getEntityIndex(name:string):number{
        if(name in Marahel.entityIndex){
            return Marahel.entityIndex[name];
        }
        return -1;
    }

    static getNeighborhood(name:string):Neighborhood{
        if(name in Marahel.neighbors){
            return Marahel.neighbors[name];
        }
        return Marahel.neighbors["self"];
    }

    static getEstimator(line:string):EstimatorInterface{
        let parts:string[] = line.split(/\((.+)\)/);
        if(line.match(/\((.+)\)/) == null){
            return new NumberEstimator(line);
        }
        else if(line.match("Dist")){
            return new DistanceEstimator(line);
        }
        return new NeighborhoodEstimator(line);
    }

    static getOperator(line:string):OperatorInterface{
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

    private static getDivider(type:string, numRegions:number, parameters:any):DividerInterface{
        switch(type.trim()){
            case "equal":
            return new EqualDivider(numRegions, parameters);
            case "bsp":
            return new BinaryDivider(numRegions, parameters);
            case "digger":
            return new DiggerDivider(numRegions, parameters);
            case "sampling":
            return new AdjustmentDivider(numRegions, parameters);
        }
        return null;
    }

    private static getGenerator(type:string, currentRegion:any, parameters:any, rules:string[]):Generator{
        switch(type.trim()){
            case "automata":
                return new AutomataGenerator(currentRegion, rules, parameters);
            case "agent":
            case "connector":
        }
        return null;
    }
}