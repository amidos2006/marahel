/// <reference path="OperatorInterface.ts"/>

class LargerOperator implements OperatorInterface{
    check(leftValue: number, rightValue: number): boolean {
        return leftValue > rightValue;
    }
}