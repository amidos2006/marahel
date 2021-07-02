/// <reference path="OperatorInterface.ts"/>

/**
 * Larger than operator used to check the left value is 
 * larger than the right value
 */
class LargerOperator implements OperatorInterface{
    /**
     * check the leftValue is larger than the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left larger than the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean {
        return leftValue > rightValue;
    }
}