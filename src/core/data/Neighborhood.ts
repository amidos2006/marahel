/// <reference path="../Marahel.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="Group.ts"/>

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
        if(line.trim().length == 0){
            throw new Error("Neighborhood " + name + " should have a definition matrix.");
        }
        line = line.replace("\n", "");
        line = line.replace("\t", "");
        line = line.replace(" ", "");
        if(line.match(/[^0-3\,]+/)){
            throw new Error("Neighborhoods must only contain numbers from 0 to 3 and commas.");
        }

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
        let temp = Marahel.marahelEngine.outValue;
        if(value == -2){
            Marahel.marahelEngine.outValue = -2;
        }
        let result:number = 0;
        for(let i:number=0; i<this.locations.length; i++){
            if(region.getValue(this.locations[i].x + center.x, this.locations[i].y + center.y) == value){
                result += 1;
            }
        }
        if (value == -2) {
            Marahel.marahelEngine.outValue = temp;
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
     * get neighboring locations using this neighborhood
     * @param x x center position
     * @param y y center position
     * @param region the current region
     * @return a list of surrounding locations using this neighborhood
     */
    getNeighbors(x:number, y:number, region:Region):Point[]{
        let result:Point[] = [];
        for(let l of this.locations){
            let p:Point = new Point(x + l.x, y + l.y);
            if(region.inRegion(p.x, p.y)){
                result.push(p);
            }
        }
        return result;
    }

    /**
     * flood fill algorithm to label the map and get unconnected groups and areas
     * @param x x position
     * @param y y position
     * @param label current label
     * @param labelBoard current labelling board to change
     * @param region current region
     */
    private floodFill(x: number, y: number, entities:number[], label: number, labelBoard: number[][], region: Region): void {
        if (labelBoard[y][x] != -1) {
            return;
        }
        labelBoard[y][x] = label;
        let neighborLocations: Point[] = this.getNeighbors(x, y, region);
        for (let p of neighborLocations) {
            if (entities.indexOf(region.getValue(p.x, p.y)) >= 0) {
                this.floodFill(p.x, p.y, entities, label, labelBoard, region);
            }
        }
    }

    /**
     * Get all unconnected groups
     * @param region current applied region
     * @return an array of all unconnected groups 
     */
    getGroups(entities:number[], region: Region): Group[] {
        let label: number = 0;
        let labelBoard: number[][] = [];
        for (let y: number = 0; y < region.getHeight(); y++) {
            labelBoard.push([]);
            for (let x: number = 0; x < region.getWidth(); x++) {
                labelBoard[y].push(-1);
            }
        }
        for (let y: number = 0; y < region.getHeight(); y++) {
            for (let x: number = 0; x < region.getWidth(); x++) {
                if (labelBoard[y][x] == -1) {
                    if (entities.indexOf(region.getValue(x + region.getX(), y + region.getY())) >= 0){
                        this.floodFill(x, y, entities, label, labelBoard, region);
                        label += 1;
                    }
                }
            }
        }
        let groups: Group[] = [];
        for (let i: number = 0; i < label; i++) {
            groups.push(new Group());
            groups[i].index = i;
        }
        for (let y: number = 0; y < region.getHeight(); y++) {
            for (let x: number = 0; x < region.getWidth(); x++) {
                if (labelBoard[y][x] != -1) {
                    groups[labelBoard[y][x]].addPoint(x, y);
                }
            }
        }
        return groups;
    }

    /**
     * get a string representation for this neighborhood
     * @return a string represent this neighborhood
     */
    toString():string{
        return this.name + "\n" + this.printing + "\nRelative locations\n" + this.locations;
    }
}