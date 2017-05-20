/// <reference path="../data/Region.ts"/>
/// <reference path="../data/Rule.ts"/>

abstract class Generator{
    protected regionsName:string;
    protected regions:Region[];
    protected rules:Rule[];
    protected minBorder:number;
    protected maxBorder:number;
    protected replacingType:number;
    protected borderType:number;
    
    constructor(currentRegion:any, rules:string[]){
        this.minBorder = 0;
        this.maxBorder = 0;
        if(currentRegion["border"]){
            this.minBorder = parseInt(currentRegion["border"].split(",")[0]);
            this.maxBorder = parseInt(currentRegion["border"].split(",")[1]);
        }
        this.regionsName = currentRegion["name"].trim();

        this.replacingType = Map.REPLACE_BACK;
        if(currentRegion["replacingType"]){
            if(currentRegion["replacingType"].trim() == "same"){
                this.replacingType = Map.REPLACE_SAME;
            }
            else if(currentRegion["replacingType"].trim() == "buffer"){
                this.replacingType = Map.REPLACE_BACK
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
                this.borderType = Marahel.getEntityIndex(currentRegion["borderType"].trim());
            }
        }

        this.rules = [];
        for(let r of rules){
            this.rules.push(new Rule(rules));
        }
    }

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

    applyGeneration():void{
        Marahel.replacingType = this.replacingType;
        Marahel.borderType = this.borderType;
        for(let r of this.regions){
            r.border = Marahel.getIntRandom(this.minBorder, this.maxBorder);
        }
    }
}