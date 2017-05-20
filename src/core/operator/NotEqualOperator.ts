/// <reference path="OperatorInterface.ts"/>

class NotEqualOperator implements OperatorInterface{
    check(leftValue: number, rightValue: number): boolean {
        return leftValue != rightValue;
    }
}