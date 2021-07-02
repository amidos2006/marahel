/**
 * Point class carries the x and y position of the point
 */
class Point{
    /**
     * x position
     */
    x:number;
    /**
     * y position
     */
    y:number;

    /**
     * Constructor for the point class
     * @param x input x position
     * @param y input y position
     */
    constructor(x:number=0, y:number=0){
        this.x = x;
        this.y = y;
    }

    /**
     * check if the input point equal to this point
     * @param p input point
     * @return true if p equals to this point and false otherwise
     */
    equal(p:Point):boolean{
        return p.x == this.x && p.y == this.y;
    }

    /**
     * 
     * @return string represent the information in the point class
     */
    toString():string{
        return "(" + this.x + "," + this.y + ")";
    }
}