/// <reference path="DividerInterface.ts"/>

class BinaryDivider implements DividerInterface{
    private numberOfRegions:number;
    private minWidth:number;
    private minHeight:number;
    private maxWidth:number;
    private maxHeight:number;

    constructor(numberOfRegions:number, parameters:any){
        this.numberOfRegions = numberOfRegions;

        let parts:string[] = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
    }

    private divideWidth(region:Region, allowedWidth:number):Region[]{
        let rWidth:number = this.minWidth + Marahel.getIntRandom(0, allowedWidth);
        return [new Region(region.x, region.y, rWidth, region.height), 
                new Region(region.x + rWidth, region.y, region.width - rWidth, region.height)];
    }

    private divideHeight(region:Region, allowedHeight:number):Region[]{
        let rHeight:number = this.minHeight + Marahel.getIntRandom(0, allowedHeight);
        return [new Region(region.x, region.y, region.width, rHeight), 
                new Region(region.x, region.y + rHeight, region.width, region.height - rHeight)];
    }

    private testDivide(region:Region):boolean{
        return (region.width >= 2 * this.minWidth || region.height >= 2 * this.minHeight);
    }

    private divide(region:Region):Region[]{
        let allowedWidth:number = region.width - 2 * this.minWidth;
        let allowedHeight:number = region.height - 2 * this.minHeight;

        if(Marahel.getRandom() < 0.5){
            if(allowedWidth > 0){
                return this.divideWidth(region, allowedWidth);
            }
            if(allowedHeight > 0){
                return this.divideHeight(region, allowedHeight);
            }
        }
        else{
            if(allowedHeight > 0){
                return this.divideHeight(region, allowedHeight);
            }
            if(allowedWidth > 0){
                return this.divideWidth(region, allowedWidth);
            }
        }

        if(region.width > region.height){
            return this.divideWidth(region, 0);
        }
        else{
            return this.divideHeight(region, 0);
        }
    }

    private checkMaxSize(regions:Region[]):boolean{
        for(let r of regions){
            if(r.width > this.maxWidth || r.height > this.maxHeight){
                return true;
            }
        }
        return false;
    }

    private divideMaxSize(region:Region):Region[]{
        if(Marahel.getRandom() < 0.5){
            if(region.width >= this.maxWidth){
                return this.divideWidth(region, 0);
            }
            if(region.height >= this.maxHeight){
                return this.divideHeight(region, 0);
            }
        }
        else{
            if(region.height >= this.maxHeight){
                return this.divideHeight(region, 0);
            }
            if(region.width >= this.maxWidth){
                return this.divideWidth(region, 0);
            }
        }

        if(region.width > region.height){
            return this.divideWidth(region, 0);
        }
        else{
            return this.divideHeight(region, 0);
        }
    }

    getRegions(map: Region): Region[] {
        let results:Region[] = [new Region(0, 0, map.width, map.height)];
        
        while(results.length<this.numberOfRegions || this.checkMaxSize(results)){
            Marahel.shuffleArray(results);
            let prevLength:number = results.length;
            for(let i:number=0; i<results.length; i++){
                if(this.testDivide(results[i])){
                    results = results.concat(this.divide(results.splice(i, 1)[0]));
                    break;
                }
            }
            if(prevLength == results.length){
                for(let i:number=0; i<results.length; i++){
                    if(this.checkMaxSize([results[i]])){
                        results = results.concat(this.divideMaxSize(results.splice(i, 1)[0]));
                        break;
                    }
                }
            }
        }

        Marahel.shuffleArray(results);
        results = results.slice(0,this.numberOfRegions);
        return results;
    }
}