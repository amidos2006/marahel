/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Region.ts"/>

/**
 * Interface that all divider algorithms should have
 */
interface DividerInterface{
    /**
     * get non-interesection regions in the map
     * @param map generated map
     * @return an array of regions that doens't intersect and in the map
     */
    getRegions(map:Region):Region[];
}