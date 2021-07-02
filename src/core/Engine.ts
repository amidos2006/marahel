/// <reference path="data/MarahelMap.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
/// <reference path="utils/Tools.ts"/>

/**
 * core class of Marahel framework
 */
class Engine{
    /**
     * The value for out tiles
     */
    public static OUT_VALUE:number = -2;
    /**
     * The value for unknown tiles
     */
    public static UNKNOWN_VALUE:number = -1;

    /**
     * type of replacing entities on the map (Map.REPLACE_SAME, Map.REPLACE_BACK)
     * either replace on the same board or in using a buffer and swap the buffer
     * after each iteration
     */
    public replacingType:number;
    /**
     * the last generated map, equal to null if generate is not called
     */
    public currentMap:MarahelMap;
    /**
     * The current used value for out of border
     */
    public outValue:number;
    /**
     * The current used value for unknown types
     */
    public unknownValue:number;

    /**
     * minimum map size
     */
    private minDim:Point;
    /**
     * maximum map size
     */
    private maxDim:Point;
    /**
     * generator entities
     */
    private entities:Entity[];
    /**
     * entity to index dictionary
     */
    private entityIndex:any;
    /**
     * dictionary of neighborhoods
     */
    private neighbors:any;
    /**
     * current region divider
     */
    private regionDivider:DividerInterface;
    /**
     * list of generators that defines the level generator behavior
     */
    private explorers:Explorer[];

    /**
     * constructor where it initialize different parts of Marahel
     */
    public constructor(){
        // initialize different parts of the system
        Random.initialize();
        this.replacingType = MarahelMap.REPLACE_SAME;
        this.outValue = Engine.OUT_VALUE;
    }

    /**
     * Initialize the current level generator using a JSON object
     * @param data JSON object that defines the current level generator
     */
    public initialize(data:any):void{
        // define the maximum and minimum sizes of the generated maps
        this.minDim = new Point(parseInt(data["metadata"]["min"].split("x")[0]), 
            parseInt(data["metadata"]["min"].split("x")[1]));
        this.maxDim = new Point(parseInt(data["metadata"]["max"].split("x")[0]), 
            parseInt(data["metadata"]["max"].split("x")[1]));
        
        // define the generator's entities 
        this.entities = [];
        this.entityIndex = {};
        for(let i=0; i<data["entities"].length; i++){
            this.entities.push(new Entity(data["entities"][i], i));
            this.entityIndex[data["entities"][i]] = i;
        }

        // define the generator's neighborhoods
        this.neighbors = {};
        for(let n in data["neighborhoods"]){
            this.neighbors[n] = new Neighborhood(n, data["neighborhoods"][n]);
        }
        if(!("plus" in this.neighbors)){
            this.neighbors["plus"] = new Neighborhood("plus", "010,131,010");
        }
        if(!("all" in this.neighbors)){
            this.neighbors["all"] = new Neighborhood("all", "111,131,111");
        }
        if (!("left" in this.neighbors)) {
            this.neighbors["left"] = new Neighborhood("left", "000,120,000");
        }
        if (!("right" in this.neighbors)) {
            this.neighbors["right"] = new Neighborhood("right", "000,021,000");
        }
        if (!("up" in this.neighbors)) {
            this.neighbors["up"] = new Neighborhood("up", "010,020,000");
        }
        if (!("down" in this.neighbors)) {
            this.neighbors["down"] = new Neighborhood("down", "000,020,010");
        }
        if (!("horz" in this.neighbors)) {
            this.neighbors["horz"] = new Neighborhood("horz", "000,121,000");
        }
        if (!("vert" in this.neighbors)) {
            this.neighbors["vert"] = new Neighborhood("vert", "010,020,010");
        }
        if(!("self" in this.neighbors)){
            this.neighbors["self"] = new Neighborhood("self", "3");
        }

        // define the generator region divider
        if(data["regions"]){
            this.regionDivider = Factory.getDivider(data["regions"]["type"], 
                parseInt(data["regions"]["number"]), data["regions"]["parameters"]);
        }

        // define the modules of the current level generator
        this.explorers = [];
        for(let e of data["explorers"]){
            let exp:Explorer = Factory.getGenerator(
                e["type"]?e["type"]:"horizontal", 
                e["region"]?e["region"]:"map", 
                e["parameters"]?e["parameters"]:{}, 
                e["rules"]);
            if (exp != null){
                this.explorers.push(exp);
            }
            else{
                throw new Error("Undefined generator - " + e.toString());
            }
        }
    }

    /**
     * generate a new map using the defined generator
     */
    public generate(callback?:(map:number[][])=>void):void{
        // create a map object with randomly selected dimensions between minDim and maxDim
        this.currentMap = new MarahelMap(Random.getIntRandom(this.minDim.x, this.maxDim.x), 
            Random.getIntRandom(this.minDim.y, this.maxDim.y));
        // define a region that covers the whole map
        let mapRegion:Region = new Region(0, 0, this.currentMap.width, this.currentMap.height);
        // get regions from the region divider, if no divider defined the regions are the whole map
        let regions:Region[] = [];
        if(this.regionDivider != null){
            regions = this.regionDivider.getRegions(mapRegion);
        }
        // update the map using the defined generators
        for(let e of this.explorers){
            e.applyRegion(mapRegion, regions);
            e.runExplorer();
            if(callback){
                callback(this.currentMap.getIndexMap());
            }
        }
    }

    /**
     * get entity object using its name or index. It returns undefined entity otherwise
     * @param value name or index of the required entity
     * @return the entity selected using "value" or "undefined" entity otherwise
     */
    public getEntity(value:number|string):Entity{
        if(typeof value == "string"){
            value = this.getEntityIndex(value);
        }
        if(value == -1){
            return new Entity("undefined", -1);
        }
        if(value == -2){
            return new Entity("out", -2);
        }
        return this.entities[value];
    }

    /**
     * get all entities defined in the system
     * @return an array of all the entities defined in the generator
     */
    public getAllEntities():Entity[]{
        return this.entities;
    }

    /**
     * get entity index using its name. returns -1 if not found
     * @param name entity name
     * @return entity index from its name. returns -1 if not found
     */
    public getEntityIndex(name:string):number{
        if(name in this.entityIndex){
            return this.entityIndex[name];
        }
        if(name.trim() == "out"){
            return -2;
        }
        return -1;
    }

    /**
     * get a neighborhood with a certain name or self neighborhood otherwise
     * @param name neighborhood name
     * @return neighborhood object with the input name or self neighborhood otherwise
     */
    public getNeighborhood(name:string):Neighborhood{
        if(name in this.neighbors){
            return this.neighbors[name];
        }
        return this.neighbors["self"];
    }
}