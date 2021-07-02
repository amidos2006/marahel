/// <reference path="OperatorInterface.ts"/>

/**
 * Not equal operator used to check if the two values are not equal
 */
class NotEqualOperator implements OperatorInterface{
    /**
     * check the values are not equal
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if not equal and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean {
        return leftValue != rightValue;
    }
}