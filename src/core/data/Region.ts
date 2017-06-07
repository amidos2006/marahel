/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>

class Region{
    static BORDER_WRAP:number = -10;
    static BORDER_NONE:number = -20;

    public border:number;

    private x:number;
    private y:number;
    private width:number;
    private height:number;

    constructor(x:number, y:number, width:number, height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.border = 0;
    }

    setX(value:number):void{
        this.x = value;
    }

    setY(value:number):void{
        this.y = value;
    }

    setWidth(value:number):void{
        this.width = value;
    }
    
    setHeight(value:number):void{
        this.height = value;
    }

    getX():number{
        return this.x + this.border;
    }

    getY():number{
        return this.y + this.border;
    }

    getWidth():number{
        return this.width - 2*this.border;
    }

    getHeight():number{
        return this.height - 2*this.border;
    }

    setValue(x:number, y:number, value:number){
        let p:Point = this.getRegionPosition(x, y);
        if(p.x<0 || p.y<0 || p.x>=this.getWidth() || p.y>=this.getHeight()){
            return;
        }
        Engine.currentMap.setValue(this.getX() + p.x, this.getY() + p.y, value);
    }

    getValue(x:number, y:number):number{
        let p:Point = this.getRegionPosition(x, y);
        if(p.x<0 || p.y<0 || p.x>=this.getWidth() || p.y>=this.getHeight()){
            if(Engine.borderType == Region.BORDER_NONE){
                return -1;
            }
            return Engine.borderType;
        }
        return Engine.currentMap.getValue(this.getX() + p.x, this.getY() + p.y);
    }

    getEntityNumber(value:number):number{
        let result:number = 0;
        for(let x:number=0; x<this.getWidth(); x++){
            for(let y:number=0; y<this.getHeight(); y++){
                if(Engine.currentMap.getValue(x + this.getX(), y + this.getY())==value){
                    result += 1;
                }
            }
        }
        return result;
    }

    getRegionPosition(x:number, y:number):Point{
        let p:Point = new Point(x, y);
        if(Engine.borderType == Region.BORDER_WRAP){
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

    outRegion(x:number, y:number):boolean{
        let p:Point = this.getRegionPosition(x, y);
        if(p.x<0 || p.y<0 || p.x>=this.getWidth() || p.y>=this.getHeight()){
            return true;
        }
        return false;
    }

    getDistances(start:Point, neighbor:Neighborhood, value:number, checkSolid:Function):number[]{
        let results:number[]=[];
        for(let x:number=0; x<this.getWidth(); x++){
            for(let y:number=0; y<this.getHeight(); y++){
                if(Engine.currentMap.getValue(x + this.getX(), y + this.getY())==value){
                    let path:Point[] = neighbor.getPath(start, new Point(x, y), this, checkSolid);
                    if(path.length > 0){
                        results.push(path.length);
                    }
                }
            }
        }
        return results;
    }

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