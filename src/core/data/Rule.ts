/// <reference path="Condition.ts"/>
/// <reference path="Executer.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="Region.ts"/>

/**
 * Rule class used to apply any of the generators
 */
class Rule{
    /**
     * Left hand side of the rule
     */
    private conditions:Condition[];
    /**
     * Right hand side of the rule
     */
    private executers:Executer[];
    
    /**
     * Constructor for the Rule class
     * @param lines user input rules
     */
    constructor(line:string){
        let parts:string[] = line.split("->");
        if(parts.length < 0){
            throw new Error("Rules should have -> in it.");
        }
        this.conditions = [];
        let conditions:string[] = parts[0].split(",");
        for(let c of conditions){
            this.conditions.push(new Condition(c));
        }
        this.executers = [];
        let executers:string[] = parts[1].split(",");
        for(let e of executers){
            this.executers.push(new Executer(e));
        }
    }

    /**
     * Execute the rule chain on the current region
     * @param iteration the percentage of the finished generator
     * @param position the current position of the generator
     * @param region current selected region
     * @return true if any of the rules has been applied and false otherwise
     */
    execute(singleperc:number, changePerc:number, repeatperc:number, position:Point, region:Region):boolean{
        let result:boolean = true;
        for(let c of this.conditions){
            result = result && c.check(singleperc, changePerc, repeatperc, position, region);
        }
        if(result){
            for(let e of this.executers){
                e.apply(position, region);
            }
            return true;
        }
        return false;
    }
}