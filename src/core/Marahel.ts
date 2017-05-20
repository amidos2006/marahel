/// <reference path="data/Map.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
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
/// <reference path="utils/Prando.ts"/>

class Marahel{
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
        //TODO:
    }

    static generate(seed?:number):void{
        if(!Marahel.rnd){
            console.log("Call initialize first.");
            return;
        }
        if(seed){
            Marahel.rnd = new Prando(seed);
        }

        Marahel.currentMap = new Map(Marahel.getIntRandom(Marahel.minDim.x, Marahel.maxDim.x), 
            Marahel.getIntRandom(Marahel.minDim.y, Marahel.maxDim.y));
        let mapRegion:Region = new Region(0, 0, Marahel.currentMap.width, Marahel.currentMap.height);
        let regions:Region[] = Marahel.regionDivider.getRegions(mapRegion);
        for(let g of Marahel.generators){
            g.applyGeneration();
        }
    }

    static getEntity(value:number|string):Entity{
        if(typeof value == "string"){
            return Marahel.entities[Marahel.getEntityIndex(value)];
        }
        return Marahel.entities[value];
    }

    static getEntityIndex(name:string):number{
        return Marahel.entityIndex[name];
    }

    static getNeighborhood(name:string):Neighborhood{
        return Marahel.neighbors[name];
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
}