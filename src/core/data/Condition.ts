/// <reference path="../Marahel.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>

/**
 * Condition class is used as a part of the Rule class (Left hand side of any rule)
 */
class Condition{
    /**
     * left hand side of the condition
     */
    private leftSide:EstimatorInterface;
    /**
     * comparison operator
     */
    private operator:OperatorInterface;
    /**
     * right hand side of the operator
     */
    private rightSide:EstimatorInterface;
    /**
     * next anded conditions
     */
    private nextCondition:Condition;

    /**
     * Constructor for the condition class
     * @param line user input line
     */
    constructor(line:string){
        if(line.trim().length == 0){
            line = "self(any)";
        }
        let parts:string[] = line.split(",");
        let cParts:string[] = parts[0].split(/>=|<=|==|!=|>|</);
        this.leftSide = Factory.getEstimator(cParts[0].trim());
        if(cParts.length > 1){
            this.operator = Factory.getOperator(parts[0].match(/>=|<=|==|!=|>|</)[0].trim());
            this.rightSide = Factory.getEstimator(cParts[1].trim());
        }
        else{
            this.operator = Factory.getOperator(">");
            this.rightSide = Factory.getEstimator("0");
        }

        if(parts.length > 1){
            parts.splice(0, 1);
            this.nextCondition = new Condition(parts.join(","));
        }
    }

    /**
     * Check if the condition is true or false including all the anded conditions
     * @param iteration the percentage of completion of the generator
     * @param position the current position where the algorithm is testing
     * @param region allowed region to check on
     * @return true if all conditions are true and false otherwise
     */
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