/// <reference path="OperatorInterface.ts"/>

class LessEqualOperator implements OperatorInterface{
    check(leftValue: number, rightValue: number): boolean {
        return leftValue <= rightValue;
    }
}