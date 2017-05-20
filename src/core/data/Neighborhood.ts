/// <reference path="../Marahel.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>

class Neighborhood {
    public width:number;
    public height:number;

    public name:string;
    
    private locations:Point[];
    private printing:string;

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

    getTotal(value:number, center:Point, region:Region):number{
        let result:number = 0;

        for(let i:number=0; i<this.locations.length; i++){
            if(region.getValue(this.locations[i].x + center.x, this.locations[i].y + center.y) == value){
                result += 1;
            }
        }

        return result;
    }

    setTotal(value:number, center:Point, region:Region):void{
        for(let i:number=0; i<this.locations.length; i++){
            region.setValue(center.x + this.locations[i].x, center.y + this.locations[i].y, value);
        }
    }

    toString():string{
        return this.name + "\n" + this.printing + "\nRelative locations\n" + this.locations;
    }
}