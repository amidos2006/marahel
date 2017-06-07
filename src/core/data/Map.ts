class Map{
    public static REPLACE_SAME:number = 0;
    public static REPLACE_BACK:number = 1;

    public width:number;
    public height:number;

    private mapValues:number[][];
    private backValues:number[][];

    private numEntities:any = {};

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
        this.numEntities["undefined"] = this.width * this.height;
        Marahel.marahelEngine.replacingType = Map.REPLACE_BACK;
    }

    setValue(x:number, y:number, value:number):void{
        let e:Entity = Marahel.marahelEngine.getEntity(value);
        if(e.name in this.numEntities && e.maxValue > 0 && this.numEntities[e.name] >= e.maxValue){
            return;
        }
        this.numEntities[Marahel.marahelEngine.getEntity(this.mapValues[y][x]).name] -= 1;
        if(!(e.name in this.numEntities)){
            this.numEntities[e.name] = 0;
        }
        this.numEntities[e.name] += 1;
        if(Marahel.marahelEngine.replacingType == Map.REPLACE_SAME){
            this.mapValues[y][x] = value;
        }
        if(Marahel.marahelEngine.replacingType == Map.REPLACE_BACK){
            this.backValues[y][x] = value;
        }
    }

    switchBuffers():void{
        if(Marahel.marahelEngine.replacingType == Map.REPLACE_BACK){
            let temp:number[][] = this.mapValues;
            this.mapValues = this.backValues;
            this.backValues = temp;
            for(let y:number=0; y<this.backValues.length; y++){
                for(let x:number=0; x<this.backValues[y].length; x++){
                    this.backValues[y][x] = this.mapValues[y][x];
                }
            }
        }
    }

    getValue(x:number, y:number):number{
        return this.mapValues[y][x];
    }

    checkNumConstraints():boolean{
        let entities:Entity[] = Marahel.marahelEngine.getAllEntities();
        for(let e of entities){
            if(this.getNumEntity(e.name) < e.minValue){
                return false;
            }
        }
        return true;
    }

    getNumEntity(e:string){
        if(e in this.numEntities){
            return this.numEntities;
        }
        return 0;
    }

    getStringMap():string[][]{
        let result:string[][] = [];
        for(let y:number=0; y<this.mapValues.length; y++){
            result.push([]);
            for(let x:number=0; x<this.mapValues[y].length; x++){
                result[y].push(Marahel.marahelEngine.getEntity(this.mapValues[y][x]).name);
            }
        }
        return result;
    }

    getIndexMap():number[][]{
        let result:number[][] = [];
        for(let y:number=0; y<this.mapValues.length; y++){
            result.push([]);
            for(let x:number=0; x<this.mapValues[y].length; x++){
                result[y].push(this.mapValues[y][x]);
            }
        }
        return result;
    }

    getColorMap():number[][]{
        let result:number[][] = [];
        for(let y:number=0; y<this.mapValues.length; y++){
            result.push([]);
            for(let x:number=0; x<this.mapValues[y].length; x++){
                result[y].push(Marahel.marahelEngine.getEntity(this.mapValues[y][x]).color);
            }
        }
        return result;
    }

    toString():string{
        return this.mapValues.toString();
    }
}