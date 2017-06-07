/// <reference path="Engine.ts"/>

/**
 * main class for Marahel where user can a
 */
class Marahel{
    /**
     * defines the output maps as 2D matrix of strings
     */
    public static STRING_OUTPUT:number = 0;
    /**
     * defines the output maps as 2D matrix of colors
     */
    public static COLOR_OUTPUT:number = 1;
    /**
     * defines the output maps as 2D matrix of integers
     */
    public static INDEX_OUTPUT:number = 2;

    /**
     * maximum number of generation trials before considering a 
     * failure generation
     */
    public static GENERATION_MAX_TRIALS:number = 10;

    /**
     * maximum number of combinations that A* will use before 
     * considering finding the optimum
     */
    public static CONNECTOR_TRIALS:number = 1000;
    /**
     * maximum number of trials for multiple A* restarts before 
     * considering the current one is the best
     */
    public static CONNECTOR_MULTI_TEST_TRIALS:number = 10;
    /**
     * maximum number of trails done by the sampling divider algorithm 
     * to resolve collision between regions
     */
    public static SAMPLING_TRAILS:number = 100;

    /**
     * Get entity name from index value. Used if you are using INDEX_OUTPUT
     * @param index integer value corresponding to index in the map.
     * @return entity name corresponding to the index.
     *         returns "undefined" otherwise.
     */
    static getEntityName(index:number):string{
        return Engine.getEntity(index).name;
    }

    /**
     * Initialize Marahel to a certain behavior.
     * Must be called before using Marahel to generate levels
     * @param data a JSON object that defines the behavior of Marahel
     *              check http://www.akhalifa.com/marahel/ for more details
     */
    static initialize(data:any):void{
        Engine.initialize(data);
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
    static generate(outputType?:number, seed?:number):any[][]{
        return Engine.generate(outputType, seed);
    }

    /**
     * print the index generate map in the console in a 2D array format
     * @param generatedMap the map required to be printed
     */
    static printIndexMap(generatedMap:number[][]):void{
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