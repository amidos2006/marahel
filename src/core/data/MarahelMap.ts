/**
 * Map class that represent the current generated map
 */
class MarahelMap{
    /**
     * static value to define same place replacing technique
     */
    public static REPLACE_SAME:number = 0;
    /**
     * static value to define back buffer replacing technique
     */
    public static REPLACE_BACK:number = 1;

    /**
     * width of the generated map
     */
    public width:number;
    /**
     * height of the generated map
     */
    public height:number;

    /**
     * front buffer values
     */
    private mapValues:number[][];
    /**
     * back buffer values
     */
    private backValues:number[][];

    /**
     * dictionary of number of entities
     */
    private numEntities:any = {};

    /**
     * constructor for the map class
     * @param width width of the map
     * @param height height of the map
     */
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
        Marahel.marahelEngine.replacingType = MarahelMap.REPLACE_BACK;
    }

    /**
     * set a certain location with an entity index
     * @param x x position
     * @param y y position
     * @param value entity index
     */
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
        if(Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_SAME){
            this.mapValues[y][x] = value;
        }
        if(Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_BACK){
            this.backValues[y][x] = value;
        }
    }

    /**
     * switch the two buffers
     */
    switchBuffers():void{
        if(Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_BACK){
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

    /**
     * get a certain location
     * @param x x position
     * @param y y position
     * @return entity index in the defined location
     */
    getValue(x:number, y:number):number{
        return this.mapValues[y][x];
    }

    /**
     * check entity number constraints
     * @return true if all entity number constraints are satisfied and false otherwise
     */
    checkNumConstraints():boolean{
        let entities:Entity[] = Marahel.marahelEngine.getAllEntities();
        for(let e of entities){
            if(this.getNumEntity(e.name) < e.minValue){
                return false;
            }
        }
        return true;
    }

    /**
     * get number of a certain entity in the map
     * @param e entity name to check
     * @return number of a certain entity in the map
     */
    getNumEntity(e:string):number{
        if(e in this.numEntities){
            return this.numEntities[e];
        }
        return 0;
    }

    /**
     * get the generated map inform of 2D matrix of entity names
     * @return 2D matrix of entity names
     */
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

    /**
     * get the generated map in form of 2D matrix of entity indexes
     * @return 2D matrix of entity indexes
     */
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

    /**
     * get the generated map in form of 2D matrix of colors
     * @return 2D matrix of entity colors
     */
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

    /**
     * string representation for the current map
     * @return string corresponding to the 2D matrix of indexes
     */
    toString():string{
        return this.mapValues.toString();
    }
}