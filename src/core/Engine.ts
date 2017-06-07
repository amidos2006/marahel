/// <reference path="data/Map.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
/// <reference path="utils/Tools.ts"/>

class Engine{
    /**
     * 
     */
    public replacingType:number;
    /**
     * the last generated map, equal to null if generate is not called
     */
    public currentMap:Map;
    public borderType:number;

    private minDim:Point;
    private maxDim:Point;
    private entities:Entity[];
    private entityIndex:any;
    private neighbors:any;
    private regionDivider:DividerInterface;
    private generators:Generator[];

    public constructor(data:any){
        Random.initialize();

        this.replacingType = Map.REPLACE_BACK;
        this.borderType = Region.BORDER_NONE;

        this.minDim = new Point(parseInt(data["metadata"]["min"].split("x")[0]), 
            parseInt(data["metadata"]["min"].split("x")[1]));
        this.maxDim = new Point(parseInt(data["metadata"]["max"].split("x")[0]), 
            parseInt(data["metadata"]["max"].split("x")[1]));
        
        this.entities = [];
        this.entityIndex = {};
        for(let e in data["entity"]){
            this.entities.push(new Entity(e, data["entity"][e]));
            this.entityIndex[e] = this.entities.length - 1;
        }

        this.neighbors = {};
        for(let n in data["neighborhood"]){
            this.neighbors[n] = new Neighborhood(n, data["neighborhood"][n]);
        }
        if(!("plus" in this.neighbors)){
            this.neighbors["plus"] = new Neighborhood("plus", "010,121,010");
        }
        if(!("all" in this.neighbors)){
            this.neighbors["all"] = new Neighborhood("all", "111,121,111");
        }
        if(!("sequential" in this.neighbors)){
            this.neighbors["sequential"] = new Neighborhood("sequential", "31,10");
        } 
        if(!("self" in this.neighbors)){
            this.neighbors["self"] = new Neighborhood("self", "3");
        }

        this.regionDivider = Factory.getDivider(data["region"]["type"], 
            parseInt(data["region"]["number"]), data["region"]["parameters"]);

        this.generators = [];
        for(let g of data["rule"]){
            this.generators.push(Factory.getGenerator(g["type"], g["region"], g["parameters"], g["rules"]));
        }
    }

    private generateOneTime():void{
        this.currentMap = new Map(Random.getIntRandom(this.minDim.x, this.maxDim.x), 
            Random.getIntRandom(this.minDim.y, this.maxDim.y));
        let mapRegion:Region = new Region(0, 0, this.currentMap.width, this.currentMap.height);
        let regions:Region[] = this.regionDivider.getRegions(mapRegion);
        for(let g of this.generators){
            g.selectRegions(mapRegion, regions);
            g.applyGeneration();
        }
    }

    public generate(outputType?:number, seed?:number):any[][]{
        if(seed){
            Random.changeSeed(seed);
        }

        for(let i:number=0; i<Marahel.GENERATION_MAX_TRIALS; i++){
            this.generateOneTime();
            if(this.currentMap.checkNumConstraints()){
                break;
            }
        }

        if(outputType){
            if(outputType == Marahel.COLOR_OUTPUT){
                return this.currentMap.getColorMap();
            }
            if(outputType == Marahel.INDEX_OUTPUT){
                return this.currentMap.getIndexMap();
            }
            return this.currentMap.getStringMap();
        }
    }

    public getEntity(value:number|string):Entity{
        if(typeof value == "string"){
            value = this.getEntityIndex(value);
        }
        if(value < 0 || value >= this.entities.length){
            return new Entity("undefined", {"color":"0x000000"});
        }
        return this.entities[value];
    }

    public getAllEntities():Entity[]{
        return this.entities;
    }

    public getEntityIndex(name:string):number{
        if(name in this.entityIndex){
            return this.entityIndex[name];
        }
        return -1;
    }

    public getNeighborhood(name:string):Neighborhood{
        if(name in this.neighbors){
            return this.neighbors[name];
        }
        return this.neighbors["self"];
    }
}