/**
 * Entity class carry the information about a certain entity
 */
class Entity{
    /**
     * name of the entity
     */
    name:string;
    /**
     * the index value for that tile
     */
    index:number;

    /**
     * Constructor for the entity class
     * @param name entity name
     * @param parameters entity parameters such as color, 
     *                   minimum number, and/or maximum number
     */
    constructor(name:string, index:number){
        this.name = name;
        this.index = index;
    }
}