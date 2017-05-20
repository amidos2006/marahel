/// <reference path="../Marahel.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>

class Condition{
    private leftSide:EstimatorInterface;
    private operator:OperatorInterface;
    private rightSide:EstimatorInterface;
    private nextCondition:Condition;

    constructor(line:string){
        let parts:string[] = line.split(",");
        let cParts:string[] = parts[0].split(/>=|<=|==|!=|>|</);
        this.leftSide = Marahel.getEstimator(cParts[0]);
        this.operator = Marahel.getOperator(cParts[1]);
        this.rightSide = Marahel.getEstimator(cParts[2]);

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextCondition = new Condition(parts.join(","));
        }
    }

    check(iteration:number, position:Point, region:Region):boolean{
        let result:boolean = this.operator.check(this.leftSide.calculate(iteration, position, region), 
            this.rightSide.calculate(iteration, position, region));
        if(result && this.nextCondition != null){
            result = result && this.nextCondition.check(iteration, position, region);
        }
        return result;
    }
}