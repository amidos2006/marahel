/// <reference path="OperatorInterface.ts"/>

class LessOperator implements OperatorInterface{
    check(leftValue: number, rightValue: number): boolean {
        return leftValue < rightValue;
    }
}