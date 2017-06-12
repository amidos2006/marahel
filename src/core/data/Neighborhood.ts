/// <reference path="../Marahel.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>

/**
 * Neighborhood class carries information about the user defined neighborhoods
 */
class Neighborhood {
    /**
     * width of the neighborhood
     */
    public width:number;
    /**
     * height of the neighborhood
     */
    public height:number;

    /**
     * name of the neighborhood
     */
    public name:string;
    
    /**
     * the locations relative to the center of neighborhood
     */
    public locations:Point[];
    /**
     * user input definition of neighborhood
     */
    private printing:string;

    /**
     * Constructor for neighborhood class
     * @param name name of the neighborhood
     * @param line input definition of the neighborhood
     */
    constructor(name:string, line:string) {
        this.printing = line;
        this.name = name.replace(",", "\n");

        let center:Point = new Point();
        let lines:string[] = line.split(",");
        this.width = 0;
        this.height = lines.length;
        for (let i:number = 0; i < lines.length; i++) {
            if (lines[i].length > this.width) {
                this.width = lines[i].length;
            }
            for (let j:number = 0; j < lines[i].length; j++) {
                let value:number = parseInt(lines[i].charAt(j)) || 0;
                if((value & 2) > 0){
                    center.x = j;
                    center.y = i;
                }
            }
        }

        this.locations = [];
        for (let i:number = 0; i < lines.length; i++) {
            for (let j:number = 0; j < lines[i].length; j++) {
                let value:number = parseInt(lines[i].charAt(j)) || 0;
                if((value & 1) > 0){
                    this.locations.push(new Point(j - center.x, i - center.y));
                }
            }
        }
    }

    /**
     * get number of a certain entity using this neighborhood
     * @param value entity index
     * @param center position for the neighborhood
     * @param region the current region
     * @return number of times the entity index in the neighborhood
     */
    getTotal(value:number, center:Point, region:Region):number{
        let result:number = 0;

        for(let i:number=0; i<this.locations.length; i++){
            if(region.getValue(this.locations[i].x + center.x, this.locations[i].y + center.y) == value){
                result += 1;
            }
        }

        return result;
    }

    /**
     * set all relative location using neighborhood to an entity
     * @param value entity index
     * @param center position for the neighborhood
     * @param region the current region
     */
    setTotal(value:number, center:Point, region:Region):void{
        for(let i:number=0; i<this.locations.length; i++){
            region.setValue(center.x + this.locations[i].x, center.y + this.locations[i].y, value);
        }
    }
    
    /**
     * Get path between start and end location in a certain region using this neighborhood
     * @param start start location
     * @param end end location
     * @param region the allowed region
     * @param checkSolid function to define which locations are solid
     * @return list of points that specify the path between start and end points
     */
    getPath(start:Point, end:Point, region:Region, checkSolid:Function):Point[]{
        return AStar.getPath(start, end, this.locations, region, checkSolid);
    }

    /**
     * get neighboring locations using this neighborhood
     * @param x x center position
     * @param y y center position
     * @param region the current region
     * @return a list of surrounding locations using this neighborhood
     */
    getNeighbors(x:number, y:number, region:Region):Point[]{
        let result:Point[] = [];
        for(let l of this.locations){
            let p:Point = region.getRegionPosition(x + l.x, y + l.y);
            if(!region.outRegion(p.x, p.y)){
                result.push(p);
            }
        }
        return result;
    }

    /**
     * get a string representation for this neighborhood
     * @return a string represent this neighborhood
     */
    toString():string{
        return this.name + "\n" + this.printing + "\nRelative locations\n" + this.locations;
    }
}