/// <reference path="OperatorInterface.ts"/>

/**
 * Less than or Equal operator to check if the left value is less than or
 * equal to the right value
 */
class LessEqualOperator implements OperatorInterface{
    /**
     * check the leftValue is less than or equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left less than or equal to the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean {
        return leftValue <= rightValue;
    }
}