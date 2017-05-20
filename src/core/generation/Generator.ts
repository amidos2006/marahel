/// <reference path="../data/Region.ts"/>

abstract class Generator{
    private regions:Region[];
    private rules:Rule[];
    
    constructor(currentRegion:string, map:Region, regions:Region[], rules:string[]){
        currentRegion = currentRegion.trim();
        if(currentRegion == "map"){
            this.regions = [map];
        }
        else if(currentRegion == "all"){
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
    }

    applyGeneration():void{
    }
}