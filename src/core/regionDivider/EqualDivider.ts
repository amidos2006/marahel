/// <reference path="DividerInterface.ts"/>

class EqualDivider implements DividerInterface{
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

    getRegions(map:Region): Region[] {
        let result:Region[] = [];

        let currentWidth:number = Marahel.getIntRandom(this.minWidth, this.maxWidth);
        let currentHeight:number = Marahel.getIntRandom(this.minHeight, this.maxHeight);

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

        Marahel.shuffleArray(result);
        result = result.slice(0,this.numberOfRegions);
        return result;
    }
}