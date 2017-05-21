class Point{
    x:number;
    y:number;

    constructor(x:number=0, y:number=0){
        this.x = x;
        this.y = y;
    }

    equal(p:Point):boolean{
        return p.x == this.x && p.y == this.y;
    }

    toString():string{
        return "(" + this.x + "," + this.y + ")";
    }
}