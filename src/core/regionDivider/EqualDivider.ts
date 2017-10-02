/// <reference path="DividerInterface.ts"/>

/**
 * Equal Divider class that divides the map into a grid of equal size regions
 */
class EqualDivider implements DividerInterface{
    /**
     * number of required regions
     */
    private numberOfRegions:number;
    /**
     * minimum number of regions in the x direction
     */
    private minWidth:number;
    /**
     * minimum number of regions in the y direction
     */
    private minHeight:number;
    /**
     * maximum number of regions in the x direction
     */
    private maxWidth:number;
    /**
     * maximum number of regions in the y direction
     */
    private maxHeight:number;

    /**
     * constructor for the EqualDivider class
     * @param numberOfRegions number of required regions
     * @param parameters to initialize the EqualDivider
     */
    constructor(numberOfRegions:number, parameters:any){
        this.numberOfRegions = 1;
        if(numberOfRegions){
            this.numberOfRegions = numberOfRegions;
        }

        this.minWidth = 1;
        this.minHeight = 1;
        this.maxWidth = 1;
        this.maxHeight = 1;
        if(parameters){
            let parts:string[] = [];
            if(parameters["min"]){
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = this.minWidth;
                if(parts.length > 1){
                    this.minHeight = parseInt(parts[1]);
                }
            }
            if(parameters["max"]){
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = this.maxWidth;
                if(parts.length > 1){
                    this.maxHeight = parseInt(parts[1]);
                }
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
     * get regions in the map using equal dividing algorithm
     * @param map the generated map
     * @return an array of regions based on equal division of the map
     */
    getRegions(map:Region): Region[] {
        let result:Region[] = [];

        let currentWidth:number = Random.getIntRandom(this.minWidth, this.maxWidth);
        let currentHeight:number = Random.getIntRandom(this.minHeight, this.maxHeight);

        let roomWidth:number = Math.floor(map.getWidth() / currentWidth);
        let roomHeight:number = Math.floor(map.getHeight() / currentHeight);
        for(let x:number=0; x<this.minWidth; x++){
            for(let y:number=0; y<this.minHeight; y++){
                let rX:number = x*roomWidth;
                let rY:number = y*roomHeight;
                let rW:number = roomWidth;
                let rH:number = roomHeight;
                if(x==currentWidth - 1){
                    rW = map.getWidth() - rX;
                }
                if(y==currentHeight - 1){
                    rH = map.getHeight() - rY;
                }
                result.push(new Region(rX, rY, rW, rH));
            }
        }

        Random.shuffleArray(result);
        result = result.slice(0,this.numberOfRegions);
        return result;
    }
}