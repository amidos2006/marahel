/// <reference path="Engine.ts"/>

/**
 * the main interface for Marahel with the users
 */
class Marahel{
    /**
     * don't change values by hand. it is an instance of the core system. 
     * it could be used for advanced level generation.
     */
    public static marahelEngine:Engine;

    /**
     * Get entity name from index value. Used if you are using INDEX_OUTPUT
     * @param index integer value corresponding to index in the map.
     * @return entity name corresponding to the index.
     *         returns "undefined" otherwise.
     */
    public static getEntityName(index:number):string{
        return Marahel.marahelEngine.getEntity(index).name;
    }

    /**
     * Initialize Marahel to a certain behavior.
     * Must be called before using Marahel to generate levels
     * @param data a JSON object that defines the behavior of Marahel
     *              check http://www.akhalifa.com/marahel/ for more details
     */
    public static initialize(data:any):void{
        Marahel.marahelEngine = new Engine();
        Marahel.marahelEngine.initialize(data);
    }

    /**
     * Generate a new map using the specified generator
     * @param outputType (optional) the representation of the output. 
     *                   default is Marahel.STRING_OUTPUT.
     *                   either Marahel.STRING_OUTPUT, Marahel.COLOR_OUTPUT, 
     *                   Marahel.INDEX_OUTPUT
     * @param seed (optional) the seed for the random number generator
     * @return the generated map in form of 2D matrix
     */
    public static generate(indeces?:boolean, seed?:number):any[][]{
        if(!Marahel.marahelEngine){
            throw new Error("Call initialize first.");
        }
        if(seed){
            Random.changeSeed(seed);
        }

        this.marahelEngine.generate();
        if (indeces){
            return this.marahelEngine.currentMap.getIndexMap();
        }
        return this.marahelEngine.currentMap.getStringMap();
    }

    /**
     * print the index generate map in the console in a 2D array format
     * @param generatedMap the map required to be printed
     */
    public static printIndexMap(generatedMap:number[][]):void{
        let result = "";
        for(let y:number=0; y<generatedMap.length; y++){
            for(let x:number=0; x<generatedMap[y].length; x++){
                result += generatedMap[y][x];
            }
            result += "\n";
        }
        console.log(result);
    }
}