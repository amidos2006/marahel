/// <reference path="DividerInterface.ts"/>

/**
 * Divide the map into regions by sampling different ones 
 * that doesn't intersect with each other
 */
class SamplingDivider implements DividerInterface{
    /**
     * number of regions required
     */
    private numberOfRegions:number;
    /**
     * min width for any region
     */
    private minWidth:number;
    /**
     * min height for any region
     */
    private minHeight:number;
    /**
     * max width for any region
     */
    private maxWidth:number;
    /**
     * max height for any region
     */
    private maxHeight:number;

    /**
     * create a new sampling divider
     * @param numberOfRegions number of required regions
     * @param parameters sampling parameters
     */
    constructor(numberOfRegions:number, parameters:any){
        this.numberOfRegions = 1;
        if(this.numberOfRegions){
            this.numberOfRegions = numberOfRegions;
        }

        this.minWidth = 1;
        this.minHeight = 1;
        this.maxHeight = 1;
        this.maxWidth = 1;
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
    
    /**
     * Check if a region is intersecting with any other region
     * @param r region to be tested with other regions
     * @param regions current regions
     * @return true if r is not intersecting with any region in regions 
     *              and false otherwise
     */
    private checkIntersection(r:Region, regions:Region[]):boolean{
        for(let cr of regions){
            if(cr.intersect(r)){
                return true;
            }
        }
        return false;
    }

    /**
     * change the current region to a new one
     * @param map generated map region to define the map boundaries
     * @param r region object to be changed
     */
    private changeRegion(map:Region, r:Region):void{
        r.setX(Random.getIntRandom(0, map.getWidth() - this.maxWidth));
        r.setY(Random.getIntRandom(0, map.getHeight() - this.maxHeight));
        r.setWidth(Random.getIntRandom(this.minWidth, this.maxWidth));
        r.setHeight(Random.getIntRandom(this.minHeight, this.maxHeight));
    }

    /**
     * get a fit region that is in the map and doesn't intersect with 
     * any of the others 
     * @param map generated map
     * @param regions previous generated regions
     * @return a suitable new region that doesn't intersect 
     *         with any of the previous ones
     */
    private getFitRegion(map:Region, regions:Region[]):Region{
        let r:Region = new Region(0, 0, 0, 0);
        for(let i:number=0; i<Marahel.SAMPLING_TRAILS; i++){
            this.changeRegion(map, r);
            if(!this.checkIntersection(r, regions)){
                break;
            }
        }

        return r;
    }

    /**
     * get the number of intersections between the regions
     * @param regions current generated regions
     * @return the number of intersection in the current array
     */
    private calculateIntersection(regions:Region[]):number{
        let results:number = 0;
        for(let r of regions){
            if(this.checkIntersection(r, regions)){
                results += 1;
            }
        }
        return results - regions.length;
    }

    /**
     * a hill climber algorithm to decrease the number of intersections between regions
     * @param map generated map
     * @param regions current generated regions
     */
    private adjustRegions(map:Region, regions:Region[]):void{
        let minIntersect:number = this.calculateIntersection(regions);
        for(let i:number=0; i<Marahel.SAMPLING_TRAILS; i++){
            let r:Region = regions[Random.getIntRandom(0, regions.length)];
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

    /**
     * divide the map into different regions using sampling
     * @param map generated map
     * @return an array of regions that are selected using sampling methodology
     */
    getRegions(map: Region): Region[] {
        let results:Region[] = [];

        while(results.length < this.numberOfRegions){
            results.push(this.getFitRegion(map, results));
        }
        if(this.calculateIntersection(results) > 0){
            this.adjustRegions(map, results);
        }
        return results;
    }
}