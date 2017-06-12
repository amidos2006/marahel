/**
 * Entity class carry the information about a certain entity
 */
class Entity{
    /**
     * name of the entity
     */
    name:string;
    /**
     * entity color
     */
    color:number;
    /**
     * minimum number of entity in the map
     */
    minValue:number;
    /**
     * maximum number of entity in the map
     */
    maxValue:number;

    /**
     * Constructor for the entity class
     * @param name entity name
     * @param parameters entity parameters such as color, 
     *                   minimum number, and/or maximum number
     */
    constructor(name:string, parameters:any){
        this.name = name;
        this.color = -1;
        if("color" in parameters){
            this.color = parameters["color"];
        }
        this.minValue = -1;
        if("min" in parameters){
            this.minValue = parameters["min"];
        }
        this.maxValue = -1;
        if("max" in parameters){
            this.maxValue = parameters["max"];
        }
    }
}