/// <reference path="../data/Region.ts"/>

abstract class Generator{
    private regions:Region[];
    private rules:Rule[];
    private minBorder:number;
    private maxBorder:number;
    
    constructor(currentRegion:any, map:Region, regions:Region[], rules:string[]){
        this.minBorder = parseInt(currentRegion["minBorder"]);
        this.maxBorder = parseInt(currentRegion["maxBorder"]);

        if(currentRegion["name"].trim() == "map"){
            this.regions = [map];

        }
        else if(currentRegion["name"].trim() == "all"){
            this.regions = regions;
        }
        else{
            this.regions = [];
            let parts:string[] = currentRegion.split(",");
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

        this.rules = [];
        for(let r of rules){
            this.rules.push(new Rule(rules));
        }

        if(currentRegion["replacingType"].trim() == "same"){
            Marahel.replacingType = Map.REPLACE_SAME;
        }
        else if(currentRegion["replacingType"].trim() == "buffer"){
            Marahel.replacingType = Map.REPLACE_SAME
        }

        if(currentRegion["borderType"].trim() == "wrap"){
            Marahel.borderType = Region.BORDER_WRAP;
        }
        else if(currentRegion["borderType"].trim() == "none"){
            Marahel.borderType = Region.BORDER_NONE;
        }
        else{
            Marahel.borderType = Marahel.getEntityIndex(currentRegion["borderType"].trim());
        }

    }

    applyGeneration():void{
        for(let r of this.regions){
            r.border = Marahel.getIntRandom(this.minBorder, this.maxBorder);
        }
    }
}