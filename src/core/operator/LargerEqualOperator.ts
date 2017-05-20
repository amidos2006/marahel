/// <reference path="OperatorInterface.ts"/>

class LargerEqualOperator implements OperatorInterface{
    check(leftValue: number, rightValue: number): boolean {
        return leftValue >= rightValue;
    }
}