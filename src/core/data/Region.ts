/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>

/**
 * 
 */
class Region{
    /**
     * static variable for the wrapping borders
     */
    static BORDER_WRAP:number = -10;
    /**
     * static variable for the none borders
     */
    static BORDER_NONE:number = -20;

    /**
     * the border size from the left
     */
    public borderLeft:number;
    /**
     * the border size from the right
     */
    public borderRight:number;
    /**
     * the border size from the top
     */
    public borderUp:number;
    /**
     * the border size from the bottom
     */
    public borderDown:number;

    /**
     * the x position of the region
     */
    private x:number;
    /**
     * the y position of the region
     */
    private y:number;
    /**
     * the width of the region
     */
    private width:number;
    /**
     * the height of the region
     */
    private height:number;

    /**
     * Constructor for the region class
     * @param x x position for the region
     * @param y y position for the region
     * @param width width of the region
     * @param height height of the region
     */
    constructor(x:number, y:number, width:number, height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.borderLeft = 0;
        this.borderRight = 0;
        this.borderUp = 0;
        this.borderDown = 0;
    }

    /**
     * set x position in the region
     * @param value used to set the x position
     */
    setX(value:number):void{
        this.x = value;
    }

    /**
     * set y position in the region
     * @param value used to set the y position
     */
    setY(value:number):void{
        this.y = value;
    }

    /**
     * set width of the region
     * @param value used to set the width
     */
    setWidth(value:number):void{
        this.width = value;
    }
    
    /**
     * set height of the region
     * @param value used to set the height
     */
    setHeight(value:number):void{
        this.height = value;
    }

    /**
     * get x position of the region after adding the left border
     * @return x position after adding the left border
     */
    getX():number{
        return this.x + this.borderLeft;
    }

    /**
     * get y position of the region after adding the upper border
     * @return y position after adding the top border
     */
    getY():number{
        return this.y + this.borderUp;
    }

    /**
     * get width of the region after removing the left and right borders
     * @return width of the region after removing the left and right borders
     */
    getWidth():number{
        return this.width - this.borderLeft - this.borderRight;
    }

    /**
     * get height of the region after removing the upper and lower borders
     * @return height of the region after removing the upper and lower borders
     */
    getHeight():number{
        return this.height - this.borderUp - this.borderDown;
    }

    /**
     * set the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @param value 
     */
    setValue(x:number, y:number, value:number):void{
        let p:Point = this.getRegionPosition(x, y);
        if(p.x<0 || p.y<0 || p.x>=this.getWidth() || p.y>=this.getHeight()){
            return;
        }
        Marahel.marahelEngine.currentMap.setValue(this.getX() + p.x, this.getY() + p.y, value);
    }

    /**
     * Get the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @return entity index of the specified location
     */
    getValue(x:number, y:number):number{
        let p:Point = this.getRegionPosition(x, y);
        if(p.x<0 || p.y<0 || p.x>=this.getWidth() || p.y>=this.getHeight()){
            if(Marahel.marahelEngine.borderType == Region.BORDER_NONE){
                return -1;
            }
            return Marahel.marahelEngine.borderType;
        }
        return Marahel.marahelEngine.currentMap.getValue(this.getX() + p.x, this.getY() + p.y);
    }

    /**
     * get number of a certain entity in this region
     * @param value index of the entity
     * @return number of times this entity appears in the region
     */
    getEntityNumber(value:number):number{
        let result:number = 0;
        for(let x:number=0; x<this.getWidth(); x++){
            for(let y:number=0; y<this.getHeight(); y++){
                if(Marahel.marahelEngine.currentMap.getValue(x + this.getX(), y + this.getY())==value){
                    result += 1;
                }
            }
        }
        return result;
    }

    /**
     * fix the current input location to adapt correct location 
     * (if the borders are wrapped)
     * @param x input x position
     * @param y input y position
     * @return the fixed location in the region
     */
    getRegionPosition(x:number, y:number):Point{
        let p:Point = new Point(x, y);
        if(Marahel.marahelEngine.borderType == Region.BORDER_WRAP){
            if(p.x >= this.getWidth()){
                p.x -= this.getWidth();
            }
            if(p.y >= this.getHeight()){
                p.y -= this.getHeight();
            }
            if(p.x < 0){
                p.x += this.getWidth();
            }
            if(p.y < 0){
                p.y += this.getHeight();
            }
        }
        return p;
    }

    /**
     * check if the input point is in region or not
     * @param x input x position
     * @param y input y position
     * @return true if the input location in the region or false otherwise
     */
    outRegion(x:number, y:number):boolean{
        let p:Point = this.getRegionPosition(x, y);
        if(p.x<0 || p.y<0 || p.x>=this.getWidth() || p.y>=this.getHeight()){
            return true;
        }
        return false;
    }

    /**
     * get distances between start point and all entities with index "value" 
     * @param start start location
     * @param neighbor neighborhood for checking
     * @param value entity index
     * @param checkSolid solid tiles
     * @return array of distances between current location and all entities with index "value"
     */
    getDistances(start:Point, neighbor:Neighborhood, value:number, checkSolid:Function):number[]{
        let results:number[]=[];
        for(let x:number=0; x<this.getWidth(); x++){
            for(let y:number=0; y<this.getHeight(); y++){
                if(Marahel.marahelEngine.currentMap.getValue(x + this.getX(), y + this.getY())==value){
                    let path:Point[] = neighbor.getPath(start, new Point(x, y), this, checkSolid);
                    if(path.length > 0){
                        results.push(path.length);
                    }
                }
            }
        }
        return results;
    }

    /**
     * Get estimated manhattan distance between start point and certain entity index
     * @param start starting location
     * @param value entity index
     * @return array of distances between current location and all entities with index "value"
     */
    getEstimateDistances(start:Point, value:number):number[]{
        let results:number[]=[];
        for(let x:number=0; x<this.getWidth(); x++){
            for(let y:number=0; y<this.getHeight(); y++){
                if(Marahel.marahelEngine.currentMap.getValue(x + this.getX(), y + this.getY())==value){
                    let dist:number = Math.abs(x-start.x) + Math.abs(y-start.y);
                    results.push(dist);
                }
            }
        }
        return results;
    }

    /**
     * check if the input point/region intersect with this region
     * @param pr either a point or region class to test against
     * @return true if the current region intersect with the input region/point 
     *         and false otherwise
     */
    intersect(pr:Region|Point):boolean{
        if(pr instanceof Region){
            return this.intersect(new Point(pr.x, pr.y)) || 
                this.intersect(new Point(pr.x + pr.width, pr.y)) ||
                this.intersect(new Point(pr.x, pr.y + this.height)) || 
                this.intersect(new Point(pr.x + this.width, pr.y + this.height)) ||
                pr.intersect(new Point(this.x, this.y)) || 
                pr.intersect(new Point(this.x + this.width, this.y)) ||
                pr.intersect(new Point(this.x, this.y + this.height)) || 
                pr.intersect(new Point(this.x + this.width, this.y + this.height));
        }
        else{
            return pr.x >= this.x && pr.y >= this.y && 
                pr.x < this.x + this.width && pr.y < this.y + this.height;
        }
    }
}