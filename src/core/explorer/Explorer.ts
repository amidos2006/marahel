/// <reference path="../data/Region.ts"/>
/// <reference path="../data/Rule.ts"/>

/**
 * Base Generator class
 */
abstract class Explorer{
    /**
     * region names
     */
    protected regionNames:string[];
    /**
     * the current selected regions
     */
    protected regions:Region[];
    /**
     * generation rules to be applied
     */
    protected rules:Rule[];
    /**
     * replacing type (same location, back buffer)
     */
    protected replacingType:number;
    /**
     * the border values
     */
    protected outValue:number;
    /**
     * the number of repeats
     */
    protected repeats:number;
    /**
     * the maximum number of repeats allowed
     */
    protected max_repeats:number;
    /**
     * the number of visited tiles
     */
    protected visited_tiles:number;
    /**
     * the maximum number of tiles
     */
    protected max_tiles:number;
    /**
     * the number of changed tiles
     */
    protected changed_tiles:number;
    /**
     * the maximum number of changed tiles
     */
    protected max_changed_tiles:number;
    
    /**
     * Constructor for the generator class
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     */
    constructor(regionNames:string[], parameters:any, rules:string[]){
        this.regionNames = regionNames;

        this.rules = [];
        for (let r of rules) {
            this.rules.push(new Rule(r));
        }

        this.replacingType = MarahelMap.REPLACE_SAME;
        if(parameters["replace"]){
            if (parameters["replace"].trim() == "buffer"){
                this.replacingType = MarahelMap.REPLACE_BACK
            }
        }
        
        this.outValue = Engine.OUT_VALUE;
        if(parameters["out"]){
            this.outValue = Marahel.marahelEngine.getEntityIndex(parameters["out"]);
        }

        this.max_repeats = 1;
        if(parameters["repeats"]){
            this.max_repeats = parseInt(parameters["repeats"]);
        }

        this.visited_tiles = 0;
        this.max_tiles = -1;
        if(parameters["tiles"]){
            this.max_tiles = parseInt(parameters["tiles"]);
        }
        this.changed_tiles = 0;
        this.max_changed_tiles = -1;
        if(parameters["changes"]){
            this.max_changed_tiles = parseInt(parameters["changes"]);
        }
    }

    protected getTilesPercentage(region:Region):number{
        if(this.max_tiles == -1){
            return this.visited_tiles / region.getWidth() * region.getHeight();
        }
        return this.visited_tiles / this.max_tiles;
    }

    protected getChangePercentage(region:Region):number{
        if(this.max_changed_tiles == -1){
            return this.changed_tiles / region.getWidth() * region.getHeight();
        }
        return this.changed_tiles / this.max_changed_tiles;
    }

    protected getRepeatPercentage():number{
        return this.repeats / this.max_repeats;
    }

    protected checkRepeatTermination(region:Region):boolean{
        return this.getTilesPercentage(region) >= 1 || 
            this.getChangePercentage(region) >= 1;
    }

    protected abstract restartRepeat(region:Region):Point;

    protected abstract getNextLocation(currentLocation:Point, region:Region):Point;

    /**
     * Apply the generation algorithm on the regions array
     */
    protected applyRepeat(region:Region):void{
        let currentLocation = this.restartRepeat(region);
        while (!this.checkRepeatTermination(region)) {
            for (let r of this.rules) {
                if (r.execute(this.getTilesPercentage(region), 
                        this.getChangePercentage(region), 
                        this.getRepeatPercentage(), currentLocation, region)) {
                    this.changed_tiles += 1;
                    break;
                }
            }
            currentLocation = this.getNextLocation(currentLocation, region);
            this.visited_tiles += 1;
        }
    }

    applyRegion(mapRegion:Region, regions:Region[]):void{
        this.regions = [];
        for(let r of this.regionNames){
            if(r.trim() == "map"){
                this.regions.push(mapRegion);
            }
            if(r.trim() == "all"){
                if(regions.length == 0){
                    this.regions.push(mapRegion);
                }
                else{
                    this.regions = this.regions.concat(regions);
                }
            }
            if(!isNaN(parseInt(r.trim()))){
                if(regions.length == 0){
                    this.regions.push(mapRegion);
                }
                else{
                    this.regions.push(regions[parseInt(r.trim())]);
                }
            }
        }
        if(this.max_tiles == -1 || this.max_changed_tiles == -1){
            let maxArea = 0;
            for (let r of this.regions) {
                let tempArea = r.getWidth() * r.getHeight();
                if(tempArea > maxArea){
                    maxArea = tempArea;
                }
            }
            if(this.max_tiles == -1){
                this.max_tiles = maxArea;
            }
            if(this.max_changed_tiles == -1){
                this.max_changed_tiles = maxArea;
            }
        }
    }

    /**
     * Run the explorer
     */
    runExplorer():void{
        Marahel.marahelEngine.outValue = this.outValue;
        Marahel.marahelEngine.replacingType = this.replacingType;
        this.repeats = 0;
        while(this.getRepeatPercentage() < 1){
            for(let r of this.regions){
                this.visited_tiles = 0;
                this.changed_tiles = 0;
                this.applyRepeat(r);
                if (this.replacingType == MarahelMap.REPLACE_BACK) {
                    Marahel.marahelEngine.currentMap.reflectBackBuffer();
                }
            }
            this.repeats += 1;
        }
    }
}