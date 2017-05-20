/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Point.ts"/>
/// <reference path="../Data/Region.ts"/>

interface EstimatorInterface{
    calculate(iteration:number, position:Point, region:Region):number;
}