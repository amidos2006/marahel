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
     * Constructor for the condition class
     * @param line user input line
     */
    constructor(line:string){
        if(line.trim().length == 0){
            line = "self(any)";
        }
        let cParts:string[] = line.split(/>=|<=|==|!=|>|</);
        this.leftSide = Factory.getEstimator(cParts[0].trim());
        if(cParts.length > 1){
            this.operator = Factory.getOperator(line.match(/>=|<=|==|!=|>|</)[0].trim());
            this.rightSide = Factory.getEstimator(cParts[1].trim());
        }
        else{
            this.operator = Factory.getOperator(">");
            this.rightSide = Factory.getEstimator("0");
        }
    }

    /**
     * Check if the condition is true or false including all the anded conditions
     * @param iteration the percentage of completion of the generator
     * @param position the current position where the algorithm is testing
     * @param region allowed region to check on
     * @return true if all conditions are true and false otherwise
     */
    check(singleperc: number, changeperc:number, repeatperc: number, position:Point, region:Region):boolean{
        let left: number = this.leftSide.calculate(singleperc, changeperc, repeatperc, position, region);
        let right: number = this.rightSide.calculate(singleperc, changeperc, repeatperc, position, region);
        if((this.leftSide instanceof DistanceEstimator && left == -1) || 
            (this.rightSide instanceof DistanceEstimator && right == -1)){
            return true;
        }
        return this.operator.check(left, right);
    }
}