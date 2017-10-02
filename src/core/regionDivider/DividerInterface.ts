/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Region.ts"/>

/**
 * Interface that all divider algorithms should have
 */
interface DividerInterface{
    /**
     * get non-intersection regions in the map
     * @param map generated map
     * @return an array of regions that doesn't intersect and in the map
     */
    getRegions(map:Region):Region[];
}