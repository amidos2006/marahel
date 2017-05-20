class Map{
    public static REPLACE_SAME:number = 0;
    public static REPLACE_BACK:number = 1;

    public width:number;
    public height:number;

    private mapValues:number[][];
    private backValues:number[][];

    constructor(width:number, height:number){
        this.width = width;
        this.height = height;

        this.mapValues = [];
        this.backValues = [];
        for(let y:number=0; y<height; y++){
            this.mapValues.push([]);
            this.backValues.push([]);
            for(let x:number=0; x<width; x++){
                this.mapValues[y].push(-1);
                this.backValues[y].push(-1);
            }
        }
        Marahel.replacingType = Map.REPLACE_BACK;
    }

    setValue(x:number, y:number, value:number):void{
        if(Marahel.replacingType == Map.REPLACE_SAME){
            this.mapValues[y][x] = value;
        }
        if(Marahel.replacingType == Map.REPLACE_BACK){
            this.backValues[y][x] = value;
        }
    }

    switchBuffers():void{
        let temp:number[][] = this.mapValues;
        this.mapValues = this.backValues;
        this.backValues = temp;
    }

    getValue(x:number, y:number):number{
        return this.mapValues[y][x];
    }
}