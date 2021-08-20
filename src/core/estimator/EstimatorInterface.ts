/// <reference path="../Marahel.ts"/>
/// <reference path="../data/Point.ts"/>
/// <reference path="../data/Region.ts"/>

/**
 * Estimator interface used by the condition class
 */
interface EstimatorInterface{
    /**
     * calculate the estimator value
     * @param singleperc the percentage of completion
     * @param repeatperc the percentage of repeatition
     * @param position position of the generator
     * @param region current selected region
     * @return estimated number
     */
    calculate(singleperc:number, changeperc:number, repeatperc:number, position:Point, region:Region):number;
}
