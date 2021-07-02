/// <reference path="OperatorInterface.ts"/>

/**
 * Larger than or Equal operator used to check the left value is larger than
 * or equal to the right value
 */
class LargerEqualOperator implements OperatorInterface{
    /**
     * check the leftValue is larger than or equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left larger than or equal to the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean {
        return leftValue >= rightValue;
    }
}