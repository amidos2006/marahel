/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>

class Region{
    static BORDER_WRAP:number = -10;
    static BORDER_NONE:number = -20;

    x:number;
    y:number;
    width:number;
    height:number;

    constructor(x:number, y:number, width:number, height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setValue(x:number, y:number, value:number){

    }

    getValue(x:number, y:number):number{
        return -1;
    }

    getEntityNumber(value:number):number{
        let result:number = 0;
        for(let x:number=0; x<this.width; x++){
            for(let y:number=0; y<this.height; y++){
                //TODO
            }
        }
        return result;
    }

    getDistances(neighbor:Neighborhood, value:number):number[]{
        return [];
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