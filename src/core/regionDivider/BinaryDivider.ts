/// <reference path="DividerInterface.ts"/>

class BinaryDivider implements DividerInterface{
    private numberOfRegions:number;
    private minWidth:number;
    private minHeight:number;
    private maxWidth:number;
    private maxHeight:number;

    constructor(numberOfRegions:number, parameters:any){
        this.numberOfRegions = 1;
        if(numberOfRegions){
            this.numberOfRegions = numberOfRegions;
        }

        this.minWidth = 0;
        this.minHeight = 0;
        this.maxWidth = Number.MAX_VALUE;
        this.maxHeight = Number.MAX_VALUE;
        if(parameters){
            let parts:string[] = [];
            if(parameters["min"]){
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = parseInt(parts[1]);
            }
            if(parameters["max"]){
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = parseInt(parts[1]);
            }
        }
        if(this.maxWidth < this.minWidth){
            let temp:number = this.maxWidth;
            this.maxWidth = this.minWidth;
            this.minWidth = temp;
        }
        if(this.maxHeight < this.minHeight){
            let temp:number = this.maxHeight;
            this.maxHeight = this.minHeight;
            this.minHeight = temp;
        }
    }

    private divideWidth(region:Region, allowedWidth:number):Region[]{
        let rWidth:number = this.minWidth + Random.getIntRandom(0, allowedWidth);
        return [new Region(region.getX(), region.getY(), rWidth, region.getHeight()), 
                new Region(region.getX() + rWidth, region.getY(), region.getWidth() - rWidth, region.getHeight())];
    }

    private divideHeight(region:Region, allowedHeight:number):Region[]{
        let rHeight:number = this.minHeight + Random.getIntRandom(0, allowedHeight);
        return [new Region(region.getX(), region.getY(), region.getWidth(), rHeight), 
                new Region(region.getX(), region.getY() + rHeight, region.getWidth(), region.getHeight() - rHeight)];
    }

    private testDivide(region:Region):boolean{
        return (region.getWidth() >= 2 * this.minWidth || region.getHeight() >= 2 * this.minHeight);
    }

    private divide(region:Region):Region[]{
        let allowedWidth:number = region.getWidth() - 2 * this.minWidth;
        let allowedHeight:number = region.getHeight() - 2 * this.minHeight;

        if(Random.getRandom() < 0.5){
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

        if(region.getWidth() > region.getHeight()){
            return this.divideWidth(region, 0);
        }
        else{
            return this.divideHeight(region, 0);
        }
    }

    private checkMaxSize(regions:Region[]):boolean{
        for(let r of regions){
            if(r.getWidth() > this.maxWidth || r.getHeight() > this.maxHeight){
                return true;
            }
        }
        return false;
    }

    private divideMaxSize(region:Region):Region[]{
        if(Random.getRandom() < 0.5){
            if(region.getWidth() >= this.maxWidth){
                return this.divideWidth(region, 0);
            }
            if(region.getHeight() >= this.maxHeight){
                return this.divideHeight(region, 0);
            }
        }
        else{
            if(region.getHeight() >= this.maxHeight){
                return this.divideHeight(region, 0);
            }
            if(region.getWidth() >= this.maxWidth){
                return this.divideWidth(region, 0);
            }
        }

        if(region.getWidth() > region.getHeight()){
            return this.divideWidth(region, 0);
        }
        else{
            return this.divideHeight(region, 0);
        }
    }

    getRegions(map: Region): Region[] {
        let results:Region[] = [new Region(0, 0, map.getWidth(), map.getHeight())];
        
        while(results.length<this.numberOfRegions || this.checkMaxSize(results)){
            Random.shuffleArray(results);
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

        Random.shuffleArray(results);
        results = results.slice(0,this.numberOfRegions);
        return results;
    }
}