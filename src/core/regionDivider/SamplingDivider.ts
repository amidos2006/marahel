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
     * max sampling tries
     */
    private samplingTrials:number;

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
        this.samplingTrials = -1;
        if(parameters){
            let parts:string[] = [];
            if(parameters["min"]){
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = this.minWidth;
                if(parts.length > 1){
                    this.minHeight = parseInt(parts[1]);
                }
                this.maxWidth = this.minWidth;
                this.maxHeight = this.minHeight;
            }
            if(parameters["max"]){
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = this.maxWidth;
                if(parts.length > 1){
                    this.maxHeight = parseInt(parts[1]);
                }
            }
            if(parameters["trials"]){
                this.samplingTrials = parseInt(parameters["trials"]);
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
    private checkIntersection(r:Region, regions:Region[]):Region{
        for(let cr of regions){
            if(cr == r) continue;
            if(cr.intersect(r)){
                return cr;
            }
        }
        return null;
    }

    /**
     * change the current region to a new one
     * @param map generated map region to define the map boundaries
     * @param r region object to be changed
     */
    private randomChange(r:Region, map:Region):boolean{
        let x = r.getX();
        let y = r.getY();
        let w = r.getWidth();
        let h = r.getHeight();
        
        if(Random.getRandom() < 0.7){
            if(Random.getRandom() < 0.7){
                let v = Random.getIntRandom(0, 4);
                switch(v){
                    case 0:
                        r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
                        break;
                    case 1:
                        r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
                        break;
                    case 2:
                        r.setWidth(Random.getIntRandom(this.minWidth, Math.min(this.maxWidth, map.getWidth() - r.getX())));
                        break;
                    case 3:
                        r.setHeight(Random.getIntRandom(this.minHeight, Math.min(this.maxHeight, map.getHeight() - r.getY())));
                        break;
                }
            }
            else{
                if(Random.getRandom() < 0.7){
                    r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
                    r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
                }
                else{
                    r.setWidth(Random.getIntRandom(this.minWidth, Math.min(this.maxWidth, map.getWidth() - r.getX())));
                    r.setHeight(Random.getIntRandom(this.minHeight, Math.min(this.maxHeight, map.getHeight() - r.getY())));
                }
            }
        }
        else{
            r.setWidth(Random.getIntRandom(this.minWidth, this.maxWidth));
            r.setHeight(Random.getIntRandom(this.minHeight, this.maxHeight));
            r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
            r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
        }        
        return x != r.getX() || y != r.getY() || w != r.getWidth() || h != r.getHeight();
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
        let r: Region = new Region(0,0,Random.getIntRandom(this.minWidth, this.maxWidth),
            Random.getIntRandom(this.minHeight, this.maxHeight));
        r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
        r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
        for(let i:number=0; i<this.samplingTrials; i++){
            let cr: Region = this.checkIntersection(r, regions);
            if(cr == null){
                break;
            }
            let change = false;
            while (!change) {
                let value = Random.getRandom();
                if (value < 0.6) {
                    change = change || this.moveRegions(r, cr, map);
                }
                else if (value < 0.9) {
                    change = change || this.randomChange(r, map);
                }
                else {
                    change = change || this.adjustRegions(r, cr);
                }
            }
        }
        return r;
    }

    private moveRegions(r1:Region, r2:Region, map:Region):boolean{
        let x1 = r1.getX();
        let y1 = r1.getY();
        let w1 = r1.getWidth();
        let h1 = r1.getHeight();
        let x2 = r2.getX();
        let y2 = r2.getY();
        let w2 = r2.getWidth();
        let h2 = r2.getHeight();

        let dx = r1.getX() + r1.getWidth() - r2.getX();
        let dy = r1.getY() + r1.getHeight() - r2.getY();
        if(Random.getRandom() < 0.5){
            if(Random.getRandom() < 0.5){
                r1.setX(Math.max(0, r1.getX() - dx));
            }
            else{
                r1.setY(Math.max(0, r1.getY() - dy));
            }
        }
        else{
            if(Random.getRandom() < 0.5){
                r2.setX(Math.min(r2.getX() + dx, map.getWidth() - r2.getWidth()));
            }
            else{
                r2.setY(Math.min(r2.getY() + dy, map.getHeight() - r2.getHeight()));
            }
        }

        return x1 != r1.getX() || y1 != r1.getY() || w1 != r1.getWidth() || h1 != r1.getHeight() ||
            x2 != r2.getX() || y2 != r2.getY() || w2 != r2.getWidth() || h2 != r2.getHeight();
    }

    private adjustRegions(r1:Region, r2:Region):boolean{
        let x1 = r1.getX();
        let y1 = r1.getY();
        let w1 = r1.getWidth();
        let h1 = r1.getHeight();
        let x2 = r2.getX();
        let y2 = r2.getY();
        let w2 = r2.getWidth();
        let h2 = r2.getHeight();

        let dx = Math.abs(r1.getX() + r1.getWidth() - r2.getX());
        let dy = Math.abs(r1.getY() + r1.getHeight() - r2.getY());
        if(Random.getRandom() < 0.5){
            if (Random.getRandom() < 0.5) {
                r1.setWidth(Random.getIntRandom(this.minWidth, Math.max(this.minWidth, r1.getWidth() - dx)));
            }
            else{
                r1.setHeight(Random.getIntRandom(this.minHeight, Math.max(this.minHeight, r1.getHeight() - dy)));
            }
        }
        else{
            if (Random.getRandom() < 0.5) {
                r2.setWidth(Random.getIntRandom(this.minWidth, Math.max(this.minWidth, r2.getWidth() - dx)));
            }
            else {
                r2.setHeight(Random.getIntRandom(this.minHeight, Math.max(this.minHeight, r2.getHeight() - dy)));
            }
        }
        return x1 != r1.getX() || y1 != r1.getY() || w1 != r1.getWidth() || h1 != r1.getHeight() ||
            x2 != r2.getX() || y2 != r2.getY() || w2 != r2.getWidth() || h2 != r2.getHeight();
    }

    /**
     * divide the map into different regions using sampling
     * @param map generated map
     * @return an array of regions that are selected using sampling methodology
     */
    getRegions(map: Region): Region[] {
        let autoSampling:boolean = false;
        if(this.samplingTrials == -1){
            autoSampling = true;
            this.samplingTrials = Math.pow(10, Math.pow(this.numberOfRegions,2) / 
                ((map.getWidth()*map.getHeight())/(this.minWidth * this.minHeight)));
            this.samplingTrials = Math.min(10000, Math.max(100, this.samplingTrials));
        }
        let results:Region[] = [];

        while(results.length < this.numberOfRegions){
            results.push(this.getFitRegion(map, results));
        }
        let noIntersection:boolean = false;
        let trials = 0;
        while (!noIntersection && trials < this.samplingTrials){
            noIntersection = true;
            trials += 1;
            for(let r of results){
                let cr = this.checkIntersection(r, results);
                if(cr != null){
                    noIntersection = false;
                    let change = false;
                    while(!change){
                        let value = Random.getRandom();
                        if (value < 0.6){
                            change = change || this.moveRegions(r, cr, map);
                        }
                        else if(value < 0.9){
                            change = change || this.randomChange(r, map);
                        }
                        else{
                            change = change || this.adjustRegions(r, cr);
                        }
                    }
                }
            }
        }
        if(autoSampling){
            this.samplingTrials = -1;
        }
        return results;
    }
}