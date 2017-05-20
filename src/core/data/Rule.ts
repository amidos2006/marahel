/// <reference path="../Marahel.ts"/>
/// <reference path="Condition.ts"/>
/// <reference path="Executer.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="Region.ts"/>

class Rule{
    private condition:Condition;
    private executer:Executer
    private nextRule:Rule;
    
    constructor(lines:string[]){
        this.condition = new Condition(lines[0].split("->")[0]);
        this.executer = new Executer(lines[0].split("->")[1]);
        this.nextRule = null;
        if(lines.length > 1){
            lines.splice(0, 1);
            this.nextRule = new Rule(lines);
        }
    }

    checkRule(iteration:number, position:Point, region:Region):boolean{
        if(this.condition.check(iteration, position, region)){
            return true;
        }
        else if(this.nextRule != null){
            return this.nextRule.checkRule(iteration, position, region);
        }
        return false;
    }

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