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
    private condition:Condition;
    /**
     * Right hand side of the rule
     */
    private executer:Executer;
    /**
     * next rule to test if the current one failed
     */
    private nextRule:Rule;
    
    /**
     * Constructor for the Rule class
     * @param lines user input rules
     */
    constructor(lines:string[]){
        this.condition = new Condition(lines[0].split("->")[0]);
        this.executer = new Executer(lines[0].split("->")[1]);
        this.nextRule = null;
        if(lines.length > 1){
            lines.splice(0, 1);
            this.nextRule = new Rule(lines);
        }
    }

    /**
     * Execute the rule chain on the current region
     * @param iteration the percentage of the finished generator
     * @param position the current position of the generator
     * @param region current selected region
     * @return true if any of the rules has been applied and false otherwise
     */
    execute(iteration:number, position:Point, region:Region):boolean{
        if(this.condition.check(iteration, position, region)){
            this.executer.apply(position, region);
            return true;
        }
        else if(this.nextRule != null){
            return this.nextRule.execute(iteration, position, region);
        }
        return false;
    }
}