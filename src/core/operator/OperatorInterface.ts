/// <reference path="../Marahel.ts"/>

/**
 * All opertaors must inherit from it
 */
interface OperatorInterface{
    /**
     * check the result of the operator
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the result is correct and false otherwise
     */
    check(leftValue:number, rightValue:number):boolean;
}