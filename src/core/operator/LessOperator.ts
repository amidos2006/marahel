/// <reference path="OperatorInterface.ts"/>

/**
 * Less than operator used to check if the left value is less than the right value
 */
class LessOperator implements OperatorInterface{
    /**
     * check the leftValue is less than the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left less than the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean {
        return leftValue < rightValue;
    }
}