/// <reference path="../data/Region.ts"/>
/// <reference path="../data/Rule.ts"/>

/**
 * Base Generator class
 */
abstract class Generator{
    /**
     * name of the region that the generator will be applied onto it
     */
    protected regionsName:string;
    /**
     * list of the selected regions
     */
    protected regions:Region[];
    /**
     * generation rules to be applied
     */
    protected rules:Rule;
    /**
     * minimum size of the border
     */
    protected minBorder:number;
    /**
     * maximum size of the border
     */
    protected maxBorder:number;
    /**
     * borders are same in all 4 directions
     */
    protected sameBorders:boolean;
    /**
     * replacing type (same location, back buffer)
     */
    protected replacingType:number;
    /**
     * border type (entity, none, wrapping)
     */
    protected borderType:number;
    
    /**
     * Constructor for the generator class
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     */
    constructor(currentRegion:any, rules:string[]){
        this.minBorder = 0;
        this.maxBorder = 0;
        if(currentRegion["border"]){
            this.minBorder = parseInt(currentRegion["border"].split(",")[0]);
            this.maxBorder = parseInt(currentRegion["border"].split(",")[1]);
        }
        this.sameBorders = false;
        if(currentRegion["sameBorder"]){
            this.sameBorders = currentRegion["sameBorder"].toLowerCase() == "true";
        }
        this.regionsName = "map";
        if(currentRegion["name"]){
            this.regionsName = currentRegion["name"].trim();
        }

        this.replacingType = MarahelMap.REPLACE_BACK;
        if(currentRegion["replacingType"]){
            if(currentRegion["replacingType"].trim() == "same"){
                this.replacingType = MarahelMap.REPLACE_SAME;
            }
            else if(currentRegion["replacingType"].trim() == "buffer"){
                this.replacingType = MarahelMap.REPLACE_BACK
            }
        }
        
        this.borderType = Region.BORDER_NONE;
        if(currentRegion["borderType"]){
            if(currentRegion["borderType"].trim() == "wrap"){
                this.borderType = Region.BORDER_WRAP;
            }
            else if(currentRegion["borderType"].trim() == "none"){
                this.borderType = Region.BORDER_NONE;
            }
            else{
                this.borderType = Marahel.marahelEngine.getEntityIndex(currentRegion["borderType"].trim());
            }
        }
        
        this.rules = new Rule(rules);
    }

    /**
     * select the correct region based on the regionName
     * @param map the whole map
     * @param regions list of all the regions from the divider algorithm
     */
    selectRegions(map:Region, regions:Region[]):void{
        if(this.regionsName == "map"){
            this.regions = [map];

        }
        else if(this.regionsName.trim() == "all"){
            this.regions = regions;
        }
        else{
            this.regions = [];
            let parts:string[] = this.regionsName.split(",");
            for(let p of parts){
                p = p.trim();
                if(p.match("-")){
                    let indeces:string[] = p.split("-");
                    for(let i=parseInt(indeces[0]); i<parseInt(indeces[1]); i++){
                        this.regions.push(regions[i]);
                    }
                }
                else{
                    this.regions.push(regions[parseInt(p)]);
                }
            }
        }
    }

    /**
     * Apply the generation algorithm on the regions array
     */
    applyGeneration():void{
        Marahel.marahelEngine.replacingType = this.replacingType;
        Marahel.marahelEngine.borderType = this.borderType;
        for(let r of this.regions){
            r.borderLeft = Random.getIntRandom(this.minBorder, this.maxBorder);
            if(this.sameBorders){
                r.borderRight = r.borderLeft;
                r.borderUp = r.borderLeft;
                r.borderDown = r.borderLeft;
            }
            else{
                r.borderRight = Random.getIntRandom(this.minBorder, this.maxBorder);
                r.borderUp = Random.getIntRandom(this.minBorder, this.maxBorder);
                r.borderDown = Random.getIntRandom(this.minBorder, this.maxBorder);
            }
        }
    }
}