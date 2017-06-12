/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Point.ts"/>
/// <reference path="../Data/Region.ts"/>

/**
 * Estimator interface used by the condition class
 */
interface EstimatorInterface{
    /**
     * calculate the estimator value
     * @param iteration percentage of the generator
     * @param position position of the generator
     * @param region current selected region
     * @return estimated number
     */
    calculate(iteration:number, position:Point, region:Region):number;
}