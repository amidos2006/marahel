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
     * type of the game borders (Region.BORDER_WRAP, Region.BORDER_NONE, integer >= 0)
     * either an index for entity, the borders are wrapped around, 
     * or the borders are not calculated.
     */
    public borderType:number;

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
    private generators:Generator[];

    /**
     * constructor where it initialize different parts of Marahel
     */
    public constructor(){
        // initialize different parts of the system
        Random.initialize();
        this.replacingType = MarahelMap.REPLACE_BACK;
        this.borderType = Region.BORDER_NONE;
    }

    /**
     * Initialize the current level generator using a JSON object
     * @param data JSON object that definse the current level generator
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
        for(let e in data["entity"]){
            this.entities.push(new Entity(e, data["entity"][e]));
            this.entityIndex[e] = this.entities.length - 1;
        }

        // define the generator's neighborhoods
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

        // define the generator region divider
        this.regionDivider = Factory.getDivider(data["region"]["type"], 
            parseInt(data["region"]["number"]), data["region"]["parameters"]);

        // define the modules of the current level generator
        this.generators = [];
        for(let g of data["rule"]){
            let gen:Generator = Factory.getGenerator(g["type"], g["region"], g["parameters"], g["rules"]);
            if(gen != null){
                this.generators.push(gen);
            }
            else{
                throw new Error("Undefined generator - " + g.toString());
            }
        }
    }

    /**
     * generate a new map using the defined generator
     */
    public generate():void{
        // create a map object with randomly selected dimensions between minDim and maxDim
        this.currentMap = new MarahelMap(Random.getIntRandom(this.minDim.x, this.maxDim.x), 
            Random.getIntRandom(this.minDim.y, this.maxDim.y));
        // define a region that covers the whole map
        let mapRegion:Region = new Region(0, 0, this.currentMap.width, this.currentMap.height);
        // get regions from the region divider, if no divider defined the regions are the whole map
        let regions:Region[] = [mapRegion];
        if(this.regionDivider != null){
            regions = this.regionDivider.getRegions(mapRegion);
        }
        // update the map using the defined generators
        for(let g of this.generators){
            g.selectRegions(mapRegion, regions);
            g.applyGeneration();
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
        if(value < 0 || value >= this.entities.length){
            return new Entity("undefined", {"color":"0x000000"});
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