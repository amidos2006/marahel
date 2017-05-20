/// <reference path="DividerInterface.ts"/>

class DiggerDivider implements DividerInterface{
    public static ACCEPTANCE_TRIALS:number = 100;

    private numberOfRegions:number;
    private minWidth:number;
    private minHeight:number;
    private maxWidth:number;
    private maxHeight:number;
    private probDir:number;
    private probSpawn:number;
    private allowIntersect:boolean;

    constructor(numberOfRegions:number, parameters:any){
        this.numberOfRegions = numberOfRegions;

        let parts:string[] = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
        this.probDir = parseFloat(parameters["probDir"]);
        this.probSpawn = parseFloat(parameters["probSpawn"]);
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

    private getRegion(map:Region):Region{
        let width:number = Marahel.getIntRandom(this.minWidth, this.maxWidth);
        let height:number = Marahel.getIntRandom(this.minHeight, this.maxHeight);
        let x:number = Marahel.getIntRandom(0, map.width - this.maxWidth) - Math.floor(width / 2);
        if(x < 0){
            x = 0;
        }
        if(x + Math.ceil(width/2) >= map.width){
            x = map.width - Math.ceil(width/2);
        }
        let y:number = Marahel.getIntRandom(0, map.height - this.maxHeight) - Math.floor(height / 2);
        if(y < 0){
            y = 0;
        }
        if(y + Math.ceil(height/2) >= map.height){
            x = map.height - Math.ceil(height/2);
        }
        return new Region(x, y, width, height);
    }

    getRegions(map: Region): Region[] {
        let results:Region[] = [];
        let digger:Point = new Point(Marahel.getIntRandom(0, map.width), Marahel.getIntRandom(0, map.height));
        let directions:Point[] = [new Point(0, 1), new Point(0, -1), new Point(1, 0), new Point(-1, 0)];
        let currentDir:number = Marahel.getIntRandom(0, directions.length);
        let directionProb:number = 0;
        let spawnProb:number = 0;
        let acceptCounter:number = 0;
        while(results.length < this.numberOfRegions){
            if(Marahel.getRandom() < directionProb || !map.intersect(new Point(digger.x + directions[currentDir].x, digger.y + directions[currentDir].y))){
                currentDir = Marahel.getIntRandom(0, directions.length);
                directionProb = 0;
            }
            else{
                directionProb += this.probDir;
            }
            if(Marahel.getRandom() < spawnProb){
                let r:Region = this.getRegion(map);
                if(this.allowIntersect){
                    results.push(r);
                }
                else if(!this.checkIntersection(r, results)){
                    results.push(r);
                }
                else if(acceptCounter >= DiggerDivider.ACCEPTANCE_TRIALS){
                    results.push(r);
                }
                else{
                    acceptCounter += 1;
                }
                spawnProb = 0;
            }
            else{
                spawnProb += this.probSpawn;
            }
            if(map.intersect(new Point(digger.x + directions[currentDir].x, digger.y + directions[currentDir].y))){
                digger.x += directions[currentDir].x;
                digger.y += directions[currentDir].x;
            }
        }

        return results;
    }
}