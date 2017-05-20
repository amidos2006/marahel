/// <reference path="OperatorInterface.ts"/>

class EqualOperator implements OperatorInterface{
    check(leftValue: number, rightValue: number): boolean {
        return leftValue == rightValue;
    }
}