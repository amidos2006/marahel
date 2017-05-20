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
        this.leftSide = Marahel.getEstimator(cParts[0].trim());
        if(cParts.length > 1){
            this.operator = Marahel.getOperator(parts[0].match(/>=|<=|==|!=|>|</)[0].trim());
            this.rightSide = Marahel.getEstimator(cParts[1].trim());
        }
        else{
            this.operator = Marahel.getOperator(">");
            this.rightSide = Marahel.getEstimator("0");
        }

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextCondition = new Condition(parts.join(","));
        }
    }

    check(iteration:number, position:Point, region:Region):boolean{
        let left:number = this.leftSide.calculate(iteration, position, region);
        let right:number = this.rightSide.calculate(iteration, position, region);
        if((this.leftSide instanceof DistanceEstimator && left == -1) || 
            (this.rightSide instanceof DistanceEstimator && right == -1)){
            return true;
        }
        let result:boolean = this.operator.check(left, right);
        if(result && this.nextCondition != null){
            result = result && this.nextCondition.check(iteration, position, region);
        }
        return result;
    }
}