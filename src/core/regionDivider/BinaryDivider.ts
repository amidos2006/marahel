/// <reference path="DividerInterface.ts"/>

/**
 * Binary Space Partitioning Algorithm
 */
class BinaryDivider implements DividerInterface{
    /**
     * number of reuired regions
     */
    private numberOfRegions:number;
    /**
     * minimum width for any region
     */
    private minWidth:number;
    /**
     * minimum height for any region
     */
    private minHeight:number;
    /**
     * maximum width for any region
     */
    private maxWidth:number;
    /**
     * maximum height for any region
     */
    private maxHeight:number;

    /**
     * Constructor for the binary space partitioning class
     * @param numberOfRegions number of required regions
     * @param parameters to initialize the bsp algorithm
     */
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

    /**
     * divide on the region width
     * @param region the region that will be divided over its width
     * @param allowedWidth the amount of width the system is allowed during division
     * @return two regions after division
     */
    private divideWidth(region:Region, allowedWidth:number):Region[]{
        let rWidth:number = this.minWidth + Random.getIntRandom(0, allowedWidth);
        return [new Region(region.getX(), region.getY(), rWidth, region.getHeight()), 
                new Region(region.getX() + rWidth, region.getY(), 
                region.getWidth() - rWidth, region.getHeight())];
    }

    /**
     * divide on the region height
     * @param region the regions that will be divided over its height
     * @param allowedHeight the amount of height the system is allowed during the division
     * @return two regions after division
     */
    private divideHeight(region:Region, allowedHeight:number):Region[]{
        let rHeight:number = this.minHeight + Random.getIntRandom(0, allowedHeight);
        return [new Region(region.getX(), region.getY(), region.getWidth(), rHeight), 
                new Region(region.getX(), region.getY() + rHeight, region.getWidth(), region.getHeight() - rHeight)];
    }

    /**
     * test if the region should be further divided
     * @param region the tested region
     * @return true if the region is bigger than twice minWidth or twice minHeight
     */
    private testDivide(region:Region):boolean{
        return (region.getWidth() >= 2 * this.minWidth || region.getHeight() >= 2 * this.minHeight);
    }

    /**
     * divide a region randomly either on width or height
     * @param region the region required to be divided
     * @return two regions after the division
     */
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

    /**
     * check if any of the regions have a width or height more than 
     * maxWidht or maxHeight
     * @param regions all the regions
     * @return true if any of the regions have the width or the height 
     *         bigger than maxWidth or maxHeight
     */
    private checkMaxSize(regions:Region[]):boolean{
        for(let r of regions){
            if(r.getWidth() > this.maxWidth || r.getHeight() > this.maxHeight){
                return true;
            }
        }
        return false;
    }

    /**
     * divided the on the maximum size diminsion
     * @param region the region that will be divided
     * @return two regions after the division
     */
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

    /**
     * divide the generated map using BSP till satisfy all the constraints
     * @param map the generated map
     * @return an array of regions that fits all the constraints and 
     *         divided using BSP
     */
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