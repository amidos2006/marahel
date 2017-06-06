/// <reference path="DividerInterface.ts"/>

class AdjustmentDivider implements DividerInterface{
    public static ADJUSTMENT_TRAILS:number = 1000;
    public static RETRY_TRAILS:number = 100;

    private numberOfRegions:number;
    private minWidth:number;
    private minHeight:number;
    private maxWidth:number;
    private maxHeight:number;
    private allowIntersect:boolean;

    constructor(numberOfRegions:number, parameters:any){
        this.numberOfRegions = numberOfRegions;

        let parts:string[] = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
        this.allowIntersect = parameters["allowIntersection"] == "true";
    }
    
    private checkIntersection(r:Region, regions:Region[]):boolean{
        for(let cr of regions){
            if(cr.intersect(r)){
                return true;
            }
        }
        return false;
    }

    private changeRegion(map:Region, r:Region):void{
        r.setX(Engine.getIntRandom(0, map.getWidth() - this.maxWidth));
        r.setY(Engine.getIntRandom(0, map.getHeight() - this.maxHeight));
        r.setWidth(Engine.getIntRandom(this.minWidth, this.maxWidth));
        r.setHeight(Engine.getIntRandom(this.minHeight, this.maxHeight));
    }

    private getFitRegion(map:Region, regions:Region[]):Region{
        let r:Region = new Region(0, 0, 0, 0);
        for(let i:number=0; i<AdjustmentDivider.RETRY_TRAILS; i++){
            this.changeRegion(map, r);
            if(!this.checkIntersection(r, regions) || this.allowIntersect){
                break;
            }
        }

        return r;
    }

    private calculateIntersection(regions:Region[]):number{
        let results:number = 0;
        for(let r of regions){
            if(this.checkIntersection(r, regions)){
                results += 1;
            }
        }
        return results - regions.length;
    }

    private adjustRegions(map:Region, regions:Region[]):void{
        let minIntersect:number = this.calculateIntersection(regions);
        for(let i:number=0; i<AdjustmentDivider.ADJUSTMENT_TRAILS; i++){
            let r:Region = regions[Engine.getIntRandom(0, regions.length)];
            let temp:Region = new Region(r.getX(), r.getY(), r.getWidth(), r.getHeight());
            this.changeRegion(map, r);
            let value:number = this.calculateIntersection(regions);
            if(value >= minIntersect){
                r.setX(temp.getX());
                r.setY(temp.getY());
                r.setWidth(temp.getWidth());
                r.setHeight(temp.getHeight());
            }
            else{
                minIntersect = value;
                if(minIntersect <= 0){
                    return;
                }
            }
        }
    }

    getRegions(map: Region): Region[] {
        let results:Region[] = [];

        while(results.length < this.numberOfRegions){
            results.push(this.getFitRegion(map, results));
        }
        if(!this.allowIntersect && this.calculateIntersection(results) > 0){
            this.adjustRegions(map, results);
        }
        return results;
    }
}