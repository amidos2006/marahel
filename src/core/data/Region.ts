/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>

/**
 * 
 */
class Region{
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
     * all possible Locations;
     */
    private regionLocations:Point[];

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

        this.regionLocations = [];
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                this.regionLocations.push(new Point(x+this.x, y+this.y));
            }
        }
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
     * get x position of the region
     * @return x position
     */
    getX():number{
        return this.x;
    }

    /**
     * get y position of the region
     * @return y position
     */
    getY():number{
        return this.y;
    }

    /**
     * get width of the region
     * @return width of the region
     */
    getWidth():number{
        return this.width;
    }

    /**
     * get height of the region
     * @return height of the region
     */
    getHeight():number{
        return this.height;
    }

    getRegionLocations():Point[]{
        return this.regionLocations;
    }

    /**
     * check if the input point is in region or not
     * @param x input x position
     * @param y input y position
     * @return true if the input location in the region or false otherwise
     */
    inRegion(x: number, y: number): boolean {
        return (x >= this.getX() && y >= this.getY() && 
                x < this.getX() + this.getWidth() && y < this.getY() + this.getHeight());
    }

    /**
     * set the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @param value 
     */
    setValue(x:number, y:number, value:number):void{
        if(!this.inRegion(x, y)){
            return;
        }
        Marahel.marahelEngine.currentMap.setValue(x, y, value);
    }

    /**
     * Get the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @return entity index of the specified location
     */
    getValue(x:number, y:number):number{
        if(!this.inRegion(x, y)){
            return Marahel.marahelEngine.outValue;
        }
        return Marahel.marahelEngine.currentMap.getValue(x, y);
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
     * Get estimated manhattan distance between start point and certain entity index
     * @param start starting location
     * @param value entity index
     * @return array of distances between current location and all entities with index "value"
     */
    getDistances(start:Point, value:number):number[]{
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
                this.intersect(new Point(pr.x + pr.width - 1, pr.y)) ||
                this.intersect(new Point(pr.x, pr.y + this.height - 1)) || 
                this.intersect(new Point(pr.x + this.width - 1, pr.y + this.height - 1)) ||
                pr.intersect(new Point(this.x, this.y)) || 
                pr.intersect(new Point(this.x + this.width - 1, this.y)) ||
                pr.intersect(new Point(this.x, this.y + this.height - 1)) || 
                pr.intersect(new Point(this.x + this.width - 1, this.y + this.height - 1));
        }
        else{
            return pr.x >= this.x && pr.y >= this.y && 
                pr.x < this.x + this.width && pr.y < this.y + this.height;
        }
    }
}