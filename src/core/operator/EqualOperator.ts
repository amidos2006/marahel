/// <reference path="OperatorInterface.ts"/>

/**
 * Equal operator used to check if the two values are equal or not
 */
class EqualOperator implements OperatorInterface{
    /**
     * check the leftValue is equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the right hand side
     * @return true if the left equal to the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean {
        return leftValue == rightValue;
    }
}