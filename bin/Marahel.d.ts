/**
 * Map class that represent the current generated map
 */
declare class MarahelMap {
    /**
     * static value to define same place replacing technique
     */
    static REPLACE_SAME: number;
    /**
     * static value to define back buffer replacing technique
     */
    static REPLACE_BACK: number;
    /**
     * width of the generated map
     */
    width: number;
    /**
     * height of the generated map
     */
    height: number;
    /**
     * front buffer values
     */
    private mapValues;
    /**
     * back buffer values
     */
    private backValues;
    /**
     * dictionary of number of entities
     */
    private numEntities;
    /**
     * constructor for the map class
     * @param width width of the map
     * @param height height of the map
     */
    constructor(width: number, height: number);
    /**
     * set a certain location with an entity index
     * @param x x position
     * @param y y position
     * @param value entity index
     */
    setValue(x: number, y: number, value: number): void;
    /**
     * switch the two buffers
     */
    switchBuffers(): void;
    /**
     * get a certain location
     * @param x x position
     * @param y y position
     * @return entity index in the defined location
     */
    getValue(x: number, y: number): number;
    /**
     * check entity number constraints
     * @return true if all entity number constraints are satisfied and false otherwise
     */
    checkNumConstraints(): boolean;
    /**
     * get number of a certain entity in the map
     * @param e entity name to check
     * @return number of a certain entity in the map
     */
    getNumEntity(e: string): number;
    /**
     * get the generated map inform of 2D matrix of entity names
     * @return 2D matrix of entity names
     */
    getStringMap(): string[][];
    /**
     * get the generated map in form of 2D matrix of entity indexes
     * @return 2D matrix of entity indexes
     */
    getIndexMap(): number[][];
    /**
     * get the generated map in form of 2D matrix of colors
     * @return 2D matrix of entity colors
     */
    getColorMap(): number[][];
    /**
     * string representation for the current map
     * @return string corresponding to the 2D matrix of indexes
     */
    toString(): string;
}
/**
 * Point class carries the x and y position of the point
 */
declare class Point {
    /**
     * x position
     */
    x: number;
    /**
     * y position
     */
    y: number;
    /**
     * Constructor for the point class
     * @param x input x position
     * @param y input y position
     */
    constructor(x?: number, y?: number);
    /**
     * check if the input point equal to this point
     * @param p input point
     * @return true if p equals to this point and false otherwise
     */
    equal(p: Point): boolean;
    /**
     *
     * @return string represent the information in the point class
     */
    toString(): string;
}
/**
 * Entity class carry the information about a certain entity
 */
declare class Entity {
    /**
     * name of the entity
     */
    name: string;
    /**
     * entity color
     */
    color: number;
    /**
     * minimum number of entity in the map
     */
    minValue: number;
    /**
     * maximum number of entity in the map
     */
    maxValue: number;
    /**
     * Constructor for the entity class
     * @param name entity name
     * @param parameters entity parameters such as color,
     *                   minimum number, and/or maximum number
     */
    constructor(name: string, parameters: any);
}
/**
 * the main interface for Marahel with the users
 */
declare class Marahel {
    /**
     * defines the output maps as 2D matrix of strings
     */
    static STRING_OUTPUT: number;
    /**
     * defines the output maps as 2D matrix of colors
     */
    static COLOR_OUTPUT: number;
    /**
     * defines the output maps as 2D matrix of integers
     */
    static INDEX_OUTPUT: number;
    /**
     * maximum number of generation trials before considering a
     * failure generation
     */
    static GENERATION_MAX_TRIALS: number;
    /**
     * maximum number of combinations that A* will use before
     * considering finding the optimum
     */
    static A_STAR_TRIALS: number;
    /**
     * maximum number of trials for multiple A* restarts before
     * considering the current one is the best
     */
    static A_STAR_MULTI_TEST_TRIALS: number;
    /**
     * maximum number of trails done by the sampling divider algorithm
     * to resolve collision between regions
     */
    static SAMPLING_TRAILS: number;
    /**
     * don't change values by hand. it is an instance of the core system.
     * it could be used for advanced level generation.
     */
    static marahelEngine: Engine;
    /**
     * Get entity name from index value. Used if you are using INDEX_OUTPUT
     * @param index integer value corresponding to index in the map.
     * @return entity name corresponding to the index.
     *         returns "undefined" otherwise.
     */
    static getEntityName(index: number): string;
    /**
     * Initialize Marahel to a certain behavior.
     * Must be called before using Marahel to generate levels
     * @param data a JSON object that defines the behavior of Marahel
     *              check http://www.akhalifa.com/marahel/ for more details
     */
    static initialize(data: any): void;
    /**
     * Generate a new map using the specified generator
     * @param outputType (optional) the representation of the output.
     *                   default is Marahel.STRING_OUTPUT.
     *                   either Marahel.STRING_OUTPUT, Marahel.COLOR_OUTPUT,
     *                   Marahel.INDEX_OUTPUT
     * @param seed (optional) the seed for the random number generator
     * @return the generated map in form of 2D matrix
     */
    static generate(outputType?: number, seed?: number): any[][];
    /**
     * print the index generate map in the console in a 2D array format
     * @param generatedMap the map required to be printed
     */
    static printIndexMap(generatedMap: number[][]): void;
}
/**
 *
 */
declare class Region {
    /**
     * static variable for the wrapping borders
     */
    static BORDER_WRAP: number;
    /**
     * static variable for the none borders
     */
    static BORDER_NONE: number;
    /**
     * the border size from the left
     */
    borderLeft: number;
    /**
     * the border size from the right
     */
    borderRight: number;
    /**
     * the border size from the top
     */
    borderUp: number;
    /**
     * the border size from the bottom
     */
    borderDown: number;
    /**
     * the x position of the region
     */
    private x;
    /**
     * the y position of the region
     */
    private y;
    /**
     * the width of the region
     */
    private width;
    /**
     * the height of the region
     */
    private height;
    /**
     * Constructor for the region class
     * @param x x position for the region
     * @param y y position for the region
     * @param width width of the region
     * @param height height of the region
     */
    constructor(x: number, y: number, width: number, height: number);
    /**
     * set x position in the region
     * @param value used to set the x position
     */
    setX(value: number): void;
    /**
     * set y position in the region
     * @param value used to set the y position
     */
    setY(value: number): void;
    /**
     * set width of the region
     * @param value used to set the width
     */
    setWidth(value: number): void;
    /**
     * set height of the region
     * @param value used to set the height
     */
    setHeight(value: number): void;
    /**
     * get x position of the region after adding the left border
     * @return x position after adding the left border
     */
    getX(): number;
    /**
     * get y position of the region after adding the upper border
     * @return y position after adding the top border
     */
    getY(): number;
    /**
     * get width of the region after removing the left and right borders
     * @return width of the region after removing the left and right borders
     */
    getWidth(): number;
    /**
     * get height of the region after removing the upper and lower borders
     * @return height of the region after removing the upper and lower borders
     */
    getHeight(): number;
    /**
     * set the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @param value
     */
    setValue(x: number, y: number, value: number): void;
    /**
     * Get the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @return entity index of the specified location
     */
    getValue(x: number, y: number): number;
    /**
     * get number of a certain entity in this region
     * @param value index of the entity
     * @return number of times this entity appears in the region
     */
    getEntityNumber(value: number): number;
    /**
     * fix the current input location to adapt correct location
     * (if the borders are wrapped)
     * @param x input x position
     * @param y input y position
     * @return the fixed location in the region
     */
    getRegionPosition(x: number, y: number): Point;
    /**
     * check if the input point is in region or not
     * @param x input x position
     * @param y input y position
     * @return true if the input location in the region or false otherwise
     */
    outRegion(x: number, y: number): boolean;
    /**
     * get distances between start point and all entities with index "value"
     * @param start start location
     * @param neighbor neighborhood for checking
     * @param value entity index
     * @param checkSolid solid tiles
     * @return array of distances between current location and all entities with index "value"
     */
    getDistances(start: Point, neighbor: Neighborhood, value: number, checkSolid: Function): number[];
    /**
     * Get estimated manhattan distance between start point and certain entity index
     * @param start starting location
     * @param value entity index
     * @return array of distances between current location and all entities with index "value"
     */
    getEstimateDistances(start: Point, value: number): number[];
    /**
     * check if the input point/region intersect with this region
     * @param pr either a point or region class to test against
     * @return true if the current region intersect with the input region/point
     *         and false otherwise
     */
    intersect(pr: Region | Point): boolean;
}
/**
 * Neighborhood class carries information about the user defined neighborhoods
 */
declare class Neighborhood {
    /**
     * width of the neighborhood
     */
    width: number;
    /**
     * height of the neighborhood
     */
    height: number;
    /**
     * name of the neighborhood
     */
    name: string;
    /**
     * the locations relative to the center of neighborhood
     */
    locations: Point[];
    /**
     * user input definition of neighborhood
     */
    private printing;
    /**
     * Constructor for neighborhood class
     * @param name name of the neighborhood
     * @param line input definition of the neighborhood
     */
    constructor(name: string, line: string);
    /**
     * get number of a certain entity using this neighborhood
     * @param value entity index
     * @param center position for the neighborhood
     * @param region the current region
     * @return number of times the entity index in the neighborhood
     */
    getTotal(value: number, center: Point, region: Region): number;
    /**
     * set all relative location using neighborhood to an entity
     * @param value entity index
     * @param center position for the neighborhood
     * @param region the current region
     */
    setTotal(value: number, center: Point, region: Region): void;
    /**
     * Get path between start and end location in a certain region using this neighborhood
     * @param start start location
     * @param end end location
     * @param region the allowed region
     * @param checkSolid function to define which locations are solid
     * @return list of points that specify the path between start and end points
     */
    getPath(start: Point, end: Point, region: Region, checkSolid: Function): Point[];
    /**
     * get neighboring locations using this neighborhood
     * @param x x center position
     * @param y y center position
     * @param region the current region
     * @return a list of surrounding locations using this neighborhood
     */
    getNeighbors(x: number, y: number, region: Region): Point[];
    /**
     * get a string representation for this neighborhood
     * @return a string represent this neighborhood
     */
    toString(): string;
}
declare class Prando {
    private static MIN;
    private static MAX;
    private _seed;
    private _value;
    /**
     * Generate a new Prando pseudo-random number generator.
     *
     * @param seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to current time.
     */
    constructor();
    constructor(seed: number);
    constructor(seed: string);
    /**
     * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
     *
     * @param min - The minimum number that can be randomly generated.
     * @param pseudoMax - The maximum number that can be randomly generated (exclusive).
     * @return The generated pseudo-random number.
     */
    next(min?: number, pseudoMax?: number): number;
    /**
     * Generates a pseudo-random integer number in a range (inclusive).
     *
     * @param min - The minimum number that can be randomly generated.
     * @param max - The maximum number that can be randomly generated.
     * @return The generated pseudo-random number.
     */
    nextInt(min?: number, max?: number): number;
    /**
     * Generates a pseudo-random string sequence of a particular length from a specific character range.
     *
     * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
     * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
     * pre-existing ids, or employ a robust GUID/UUID generator.
     *
     * @param length - Length of the strting to be generated.
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated string sequence.
     */
    nextString(length?: number, chars?: string): string;
    /**
     * Generates a pseudo-random string of 1 character specific character range.
     *
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated character.
     */
    nextChar(chars?: string): string;
    /**
     * Picks a pseudo-random item from an array. The array is left unmodified.
     *
     * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
     * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
     * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
     * apply a *shuffle* transformation to the array instead, then read it linearly.
     *
     * @param array - Array of any type containing one or more candidates for random picking.
     * @return An item from the array.
     */
    nextArrayItem<T>(array: T[]): T;
    /**
     * Generates a pseudo-random boolean.
     *
     * @return A value of true or false.
     */
    nextBoolean(): boolean;
    /**
     * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
     * calling next() a specified number of times, but faster since it doesn't need to map the
     * new random numbers to a range and return it.
     *
     * @param iterations - The number of items to skip ahead.
     */
    skip(iterations?: number): void;
    /**
     * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
     * will then produce the same sequence of numbers it had produced before. This is equivalent to
     * creating a new Prando instance with the same seed as another Prando instance.
     *
     * Example:
     * let rng = new Prando(12345678);
     * console.log(rng.next()); // 0.6177754114889017
     * console.log(rng.next()); // 0.5784605181725837
     * rng.reset();
     * console.log(rng.next()); // 0.6177754114889017 again
     * console.log(rng.next()); // 0.5784605181725837 again
     */
    reset(): void;
    private recalculate();
    private map(val, minFrom, maxFrom, minTo, maxTo);
    private hashCode(str);
}
declare class Grad {
    private x;
    private y;
    private z;
    constructor(x: number, y: number, z: number);
    dot2(x: number, y: number): number;
    dot3(x: number, y: number, z: number): number;
}
declare class Noise {
    private grad3;
    private p;
    private perm;
    private gradP;
    private F2;
    private F3;
    private G2;
    private G3;
    constructor();
    seed(seed: number): void;
    simplex2(xin: number, yin: number): number;
    simplex3(xin: any, yin: any, zin: any): number;
    private fade(t);
    private lerp(a, b, t);
    perlin2(x: number, y: number): number;
    perlin3(x: number, y: number, z: number): number;
}
/**
 * Interface that all divider algorithms should have
 */
interface DividerInterface {
    /**
     * get non-intersection regions in the map
     * @param map generated map
     * @return an array of regions that doesn't intersect and in the map
     */
    getRegions(map: Region): Region[];
}
/**
 * Divide the map into regions by sampling different ones
 * that doesn't intersect with each other
 */
declare class SamplingDivider implements DividerInterface {
    /**
     * number of regions required
     */
    private numberOfRegions;
    /**
     * min width for any region
     */
    private minWidth;
    /**
     * min height for any region
     */
    private minHeight;
    /**
     * max width for any region
     */
    private maxWidth;
    /**
     * max height for any region
     */
    private maxHeight;
    /**
     * create a new sampling divider
     * @param numberOfRegions number of required regions
     * @param parameters sampling parameters
     */
    constructor(numberOfRegions: number, parameters: any);
    /**
     * Check if a region is intersecting with any other region
     * @param r region to be tested with other regions
     * @param regions current regions
     * @return true if r is not intersecting with any region in regions
     *              and false otherwise
     */
    private checkIntersection(r, regions);
    /**
     * change the current region to a new one
     * @param map generated map region to define the map boundaries
     * @param r region object to be changed
     */
    private changeRegion(map, r);
    /**
     * get a fit region that is in the map and doesn't intersect with
     * any of the others
     * @param map generated map
     * @param regions previous generated regions
     * @return a suitable new region that doesn't intersect
     *         with any of the previous ones
     */
    private getFitRegion(map, regions);
    /**
     * get the number of intersections between the regions
     * @param regions current generated regions
     * @return the number of intersection in the current array
     */
    private calculateIntersection(regions);
    /**
     * a hill climber algorithm to decrease the number of intersections between regions
     * @param map generated map
     * @param regions current generated regions
     */
    private adjustRegions(map, regions);
    /**
     * divide the map into different regions using sampling
     * @param map generated map
     * @return an array of regions that are selected using sampling methodology
     */
    getRegions(map: Region): Region[];
}
/**
 * Binary Space Partitioning Algorithm
 */
declare class BinaryDivider implements DividerInterface {
    /**
     * number of required regions
     */
    private numberOfRegions;
    /**
     * minimum width for any region
     */
    private minWidth;
    /**
     * minimum height for any region
     */
    private minHeight;
    /**
     * maximum width for any region
     */
    private maxWidth;
    /**
     * maximum height for any region
     */
    private maxHeight;
    /**
     * Constructor for the binary space partitioning class
     * @param numberOfRegions number of required regions
     * @param parameters to initialize the bsp algorithm
     */
    constructor(numberOfRegions: number, parameters: any);
    /**
     * divide on the region width
     * @param region the region that will be divided over its width
     * @param allowedWidth the amount of width the system is allowed during division
     * @return two regions after division
     */
    private divideWidth(region, allowedWidth);
    /**
     * divide on the region height
     * @param region the regions that will be divided over its height
     * @param allowedHeight the amount of height the system is allowed during the division
     * @return two regions after division
     */
    private divideHeight(region, allowedHeight);
    /**
     * test if the region should be further divided
     * @param region the tested region
     * @return true if the region is bigger than twice minWidth or twice minHeight
     */
    private testDivide(region);
    /**
     * divide a region randomly either on width or height
     * @param region the region required to be divided
     * @return two regions after the division
     */
    private divide(region);
    /**
     * check if any of the regions have a width or height more than
     * maxWidth or maxHeight
     * @param regions all the regions
     * @return true if any of the regions have the width or the height
     *         bigger than maxWidth or maxHeight
     */
    private checkMaxSize(regions);
    /**
     * divided the on the maximum size dimension
     * @param region the region that will be divided
     * @return two regions after the division
     */
    private divideMaxSize(region);
    /**
     * divide the generated map using BSP till satisfy all the constraints
     * @param map the generated map
     * @return an array of regions that fits all the constraints and
     *         divided using BSP
     */
    getRegions(map: Region): Region[];
}
/**
 * Equal Divider class that divides the map into a grid of equal size regions
 */
declare class EqualDivider implements DividerInterface {
    /**
     * number of required regions
     */
    private numberOfRegions;
    /**
     * minimum number of regions in the x direction
     */
    private minWidth;
    /**
     * minimum number of regions in the y direction
     */
    private minHeight;
    /**
     * maximum number of regions in the x direction
     */
    private maxWidth;
    /**
     * maximum number of regions in the y direction
     */
    private maxHeight;
    /**
     * constructor for the EqualDivider class
     * @param numberOfRegions number of required regions
     * @param parameters to initialize the EqualDivider
     */
    constructor(numberOfRegions: number, parameters: any);
    /**
     * get regions in the map using equal dividing algorithm
     * @param map the generated map
     * @return an array of regions based on equal division of the map
     */
    getRegions(map: Region): Region[];
}
/**
 * All opertaors must inherit from it
 */
interface OperatorInterface {
    /**
     * check the result of the operator
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the result is correct and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Larger than or Equal operator used to check the left value is larger than
 * or equal to the right value
 */
declare class LargerEqualOperator implements OperatorInterface {
    /**
     * check the leftValue is larger than or equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left larger than or equal to the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Less than or Equal operator to check if the left value is less than or
 * equal to the right value
 */
declare class LessEqualOperator implements OperatorInterface {
    /**
     * check the leftValue is less than or equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left less than or equal to the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Larger than operator used to check the left value is
 * larger than the right value
 */
declare class LargerOperator implements OperatorInterface {
    /**
     * check the leftValue is larger than the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left larger than the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Less than operator used to check if the left value is less than the right value
 */
declare class LessOperator implements OperatorInterface {
    /**
     * check the leftValue is less than the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left less than the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Equal operator used to check if the two values are equal or not
 */
declare class EqualOperator implements OperatorInterface {
    /**
     * check the leftValue is equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the right hand side
     * @return true if the left equal to the right and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Not equal operator used to check if the two values are not equal
 */
declare class NotEqualOperator implements OperatorInterface {
    /**
     * check the values are not equal
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if not equal and false otherwise
     */
    check(leftValue: number, rightValue: number): boolean;
}
/**
 * Estimator interface used by the condition class
 */
interface EstimatorInterface {
    /**
     * calculate the estimator value
     * @param iteration percentage of the generator
     * @param position position of the generator
     * @param region current selected region
     * @return estimated number
     */
    calculate(iteration: number, position: Point, region: Region): number;
}
/**
 * Neighborhood estimator calculates the number of entities using a certain neighborhood
 */
declare class NeighborhoodEstimator implements EstimatorInterface {
    /**
     * used neighborhood
     */
    private neighbor;
    /**
     * entities used for calculation
     */
    private entities;
    /**
     * Constructor for the neighborhood estimator
     * @param line user input
     */
    constructor(line: string);
    /**
     * Calculates the number of entities using a certain neighborhood
     * @param iteration percentage of completion of the generator
     * @param position current position
     * @param region current region
     * @return number of entities using a certain neighborhood
     */
    calculate(iteration: number, position: Point, region: Region): number;
}
/**
 * Number estimator is most common used estimator. It can return completion percentage,
 * random value, noise value, constant value, or number of entities in the selected region
 */
declare class NumberEstimator implements EstimatorInterface {
    /**
     * current specified name
     */
    private name;
    /**
     * Constructor for Number Estimator
     * @param line user input
     */
    constructor(line: string);
    /**
     * Calculates the value for the specified name
     * @param iteration completion percentage
     * @param position current position
     * @param region current region
     * @return estimated value for the name
     */
    calculate(iteration: number, position: Point, region: Region): number;
}
/**
 * Distance estimator is used as part of condition to get min, max, or avg
 * distance to one or a group of entities
 */
declare class DistanceEstimator implements EstimatorInterface {
    /**
     * type of the distance estimator (minimum, maximum, average)
     */
    private type;
    /**
     * neighborhood used in measuring distance
     */
    private neighbor;
    /**
     * entities used in measuring the distance to
     */
    private entities;
    /**
     * allowed movement tiles
     */
    private allowed;
    /**
     * Constructor for the distance estimator
     * @param line input line by user
     */
    constructor(line: string);
    /**
     * get maximum distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return maximum distance between current location and entity index
     */
    private getMax(position, region, entityIndex);
    /**
     * get minimum distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return minimum distance between current location and entity index
     */
    private getMin(position, region, entityIndex);
    /**
     * get average distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return average distance between current location and entity index
     */
    private getAvg(position, region, entityIndex);
    /**
     * get the distance from the current location to a specified sprite
     * @param iteration percentage of the current generator
     * @param position current position
     * @param region current region
     * @return distance from the current position to the specified entity
     */
    calculate(iteration: number, position: Point, region: Region): number;
}
/**
 * Condition class is used as a part of the Rule class (Left hand side of any rule)
 */
declare class Condition {
    /**
     * left hand side of the condition
     */
    private leftSide;
    /**
     * comparison operator
     */
    private operator;
    /**
     * right hand side of the operator
     */
    private rightSide;
    /**
     * next anded conditions
     */
    private nextCondition;
    /**
     * Constructor for the condition class
     * @param line user input line
     */
    constructor(line: string);
    /**
     * Check if the condition is true or false including all the anded conditions
     * @param iteration the percentage of completion of the generator
     * @param position the current position where the algorithm is testing
     * @param region allowed region to check on
     * @return true if all conditions are true and false otherwise
     */
    check(iteration: number, position: Point, region: Region): boolean;
}
/**
 * Executer class (Right hand side of the rule)
 */
declare class Executer {
    /**
     * used neighborhood to apply the executer
     */
    private neighbor;
    /**
     * entities that will be applied in the region using neighbor
     */
    private entities;
    /**
     * next anded executer
     */
    private nextExecuter;
    /**
     * Constructor for the executer class
     * @param line user input data
     */
    constructor(line: string);
    /**
     * Apply all the executers on the current selected region
     * @param position current position of the generator
     * @param region allowed region to apply the executer
     */
    apply(position: Point, region: Region): void;
}
/**
 * Rule class used to apply any of the generators
 */
declare class Rule {
    /**
     * Left hand side of the rule
     */
    private condition;
    /**
     * Right hand side of the rule
     */
    private executer;
    /**
     * next rule to test if the current one failed
     */
    private nextRule;
    /**
     * Constructor for the Rule class
     * @param lines user input rules
     */
    constructor(lines: string[]);
    /**
     * Execute the rule chain on the current region
     * @param iteration the percentage of the finished generator
     * @param position the current position of the generator
     * @param region current selected region
     * @return true if any of the rules has been applied and false otherwise
     */
    execute(iteration: number, position: Point, region: Region): boolean;
}
/**
 * Base Generator class
 */
declare abstract class Generator {
    /**
     * name of the region that the generator will be applied onto it
     */
    protected regionsName: string;
    /**
     * list of the selected regions
     */
    protected regions: Region[];
    /**
     * generation rules to be applied
     */
    protected rules: Rule;
    /**
     * minimum size of the border
     */
    protected minBorder: number;
    /**
     * maximum size of the border
     */
    protected maxBorder: number;
    /**
     * borders are same in all 4 directions
     */
    protected sameBorders: boolean;
    /**
     * replacing type (same location, back buffer)
     */
    protected replacingType: number;
    /**
     * border type (entity, none, wrapping)
     */
    protected borderType: number;
    /**
     * Constructor for the generator class
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     */
    constructor(currentRegion: any, rules: string[]);
    /**
     * select the correct region based on the regionName
     * @param map the whole map
     * @param regions list of all the regions from the divider algorithm
     */
    selectRegions(map: Region, regions: Region[]): void;
    /**
     * Apply the generation algorithm on the regions array
     */
    applyGeneration(): void;
}
/**
 * Automata Generator class
 */
declare class SequentialGenerator extends Generator {
    /**
     * number of iterations to apply cellular automata
     */
    private numIterations;
    /**
     * anchor point to start the generation
     */
    private start;
    /**
     * neighborhood defines which tiles to explore next
     */
    private explore;
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the automata generator
     */
    constructor(currentRegion: any, rules: string[], parameters: any);
    /**
     * Apply the automata algorithm on the regions array
     */
    applyGeneration(): void;
}
/**
 * Agent class used in the AgentGenerator Algorithm
 */
declare class Agent {
    /**
     * current position of the agent
     */
    private position;
    /**
     * current lifespan of the agent
     */
    private currentLifespan;
    /**
     * total lifespan of the agent
     */
    private lifespan;
    /**
     * current agent speed
     */
    private currentSpeed;
    /**
     * when does the agent apply rules
     */
    private speed;
    /**
     * amount of time when the agent change direction
     */
    private currentChange;
    /**
     * total amount of time the agent change direction
     */
    private change;
    /**
     * current agent direction
     */
    private currentDirection;
    /**
     * allowed directions by the agent
     */
    private directions;
    /**
     * starting entity
     */
    private entities;
    /**
     * Constructor for the agent class
     * @param lifespan current lifespan after it reach zero the agent dies
     * @param speed current agent speed to apply rules
     * @param change amount of time the agent change direction at
     * @param entities starting location of the agent
     * @param directions current allowed directions
     */
    constructor(lifespan: number, speed: Point, change: Point, entities: Entity[], directions: Neighborhood);
    /**
     * move the agent to an allowed location used when the agent get stuck
     * @param region the applied region
     */
    moveToLocation(region: Region): void;
    /**
     * check if the current location is allowed
     * @param x x position
     * @param y y position
     * @param region current region
     * @return true if the location is allowed for the agent and false otherwise
     */
    private checkAllowed(x, y, region);
    /**
     * change the current direction of the agent or jump to
     * new location if no location found
     * @param region the applied region
     */
    private changeDirection(region);
    /**
     * update the current agent
     * @param region current applied region
     * @param rules rules to be applied when its time to react
     * @return true if the agent is still alive and false otherwise
     */
    update(region: Region, rules: Rule): boolean;
}
/**
 * Agent based generator
 */
declare class AgentGenerator extends Generator {
    /**
     * number of entities the agent can move on it
     */
    private allowedEntities;
    /**
     * number of spawned agents
     */
    private numAgents;
    /**
     * speed of the agent to apply the rules
     */
    private speed;
    /**
     * time before the agent change its direction
     */
    private changeTime;
    /**
     * lifespan for the agents
     */
    private lifespan;
    /**
     * directions allowed for the agents
     */
    private directions;
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    constructor(currentRegion: any, rules: string[], parameters: any);
    /**
     * Apply the agent based algorithm on the regions array
     */
    applyGeneration(): void;
}
/**
 * Group class is a helper class to the connector algorithm
 */
declare class Group {
    /**
     * group identifier
     */
    index: number;
    /**
     * points in the group
     */
    points: Point[];
    /**
     * constructor to initialize the values
     */
    constructor();
    /**
     * add new point to the group
     * @param x x position
     * @param y y position
     */
    addPoint(x: number, y: number): void;
    /**
     * get the center of the group
     * @return the center of the group
     */
    getCenter(): Point;
    /**
     * sort the points in an ascending order with respect to input point p
     * @param p relative point for sorting
     */
    sort(p: Point): void;
    /**
     * remove all the points that inside the shape so the group only have border points
     * @param region current region
     * @param allowed connectivity checking entity
     * @param neighbor neighborhood used in connection
     */
    cleanPoints(region: Region, allowed: Entity[], neighbor: Neighborhood): void;
    /**
     * merge two groups together
     * @param group the other group to be merged with
     */
    combine(group: Group): void;
    /**
     * Get the minimum manhattan distance between this group and the input group
     * @param group the other to measure distance towards it
     * @return the minimum manhattan distance between this group and the other group
     */
    distance(group: Group): number;
}
/**
 * Connector Generator which changes the generated map in order to connect
 * different areas on it
 */
declare class ConnectorGenerator extends Generator {
    /**
     * Type of connection for the shortest connections
     */
    static SHORT_CONNECTION: number;
    /**
     * Type of connection for the random connections
     */
    static RANDOM_CONNECTION: number;
    /**
     * Type of connection for the hub connections
     */
    static HUB_CONNECTION: number;
    /**
     * Type of connection for the full connections
     */
    static FULL_CONNECTION: number;
    /**
     * the connection neighborhood used to check connectivity
     */
    private neighbor;
    /**
     * entities that are used to check connectivity
     */
    private entities;
    /**
     * type of connection (short, random, hub, or full)
     */
    private connectionType;
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the connector generator
     */
    constructor(currentRegion: any, rules: string[], parameters: any);
    /**
     * flood fill algorithm to label the map and get unconnected groups and areas
     * @param x x position
     * @param y y position
     * @param label current label
     * @param labelBoard current labelling board to change
     * @param region current region
     */
    private floodFill(x, y, label, labelBoard, region);
    /**
     * Get all unconnected groups
     * @param region current applied region
     * @return an array of all unconnected groups
     */
    private getUnconnectedGroups(region);
    /**
     * connect the two points
     * @param start start point for connection
     * @param end end point for connection
     * @param region current region
     * @return true if the two groups are connected and false otherwise
     */
    private connect(start, end, region);
    /**
     * connect the groups randomly
     * @param groups unconnected groups
     * @param region applied region
     */
    private connectRandom(groups, region);
    /**
     * helper function to connect the groups using the shortest path
     * @param groups unconnected groups
     * @param region applied region
     * @return the first point and last point and the indeces of both group to be connected
     */
    private shortestGroup(groups, region);
    /**
     * helper function to connect the groups using one center group
     * @param groups unconnected groups
     * @param region applied region
     * @return the index of the center group that leads to the shortest distance towards other groups
     */
    private centerGroup(groups, region);
    /**
     * connect the groups using the shortest distance
     * @param groups unconnected groups
     * @param region applied region
     */
    private connectShort(groups, region);
    /**
     * connect the all groups together
     * @param groups unconnected groups
     * @param region applied region
     */
    private connectFull(groups, region);
    /**
     * connect the groups using hub architecture (one group is connected to the rest)
     * @param groups unconnected groups
     * @param region applied region
     */
    private connectHub(groups, region);
    /**
     * Apply the connector algorithm on the regions array
     */
    applyGeneration(): void;
}
/**
 * basic node used in the A* algorithm
 */
declare class LocationNode {
    /**
     * x position on the map
     */
    x: number;
    /**
     * y position on the map
     */
    y: number;
    /**
     * parent of the node, null if root
     */
    parent: LocationNode;
    /**
     * constructor
     * @param parent current parent of the node
     * @param x map x position
     * @param y map y position
     */
    constructor(parent?: LocationNode, x?: number, y?: number);
    /**
     * check if the current node is the end node
     * @param x end location x position
     * @param y end location y position
     * @return true if its the end location, false otherwise
     */
    checkEnd(x: number, y: number): boolean;
    /**
     * get an estimate between the current node and
     * end location using manhattan distance
     * @param x end location x position
     * @param y end location y position
     * @return the manhattan distance towards the exit
     */
    estimate(x: number, y: number): number;
    /**
     * return printable version of the location node
     * @return
     */
    toString(): string;
}
/**
 * A* algorithm used by the connector generator
 */
declare class AStar {
    /**
     * get the path from the root node to the input node
     * @param node destination node where u need path between the root and itself
     * @return a list of points that specify the path between the root and node
     */
    private static convertNodeToPath(node);
    /**
     * Get path between start point and end point in a certain region
     * @param start start location
     * @param end destination
     * @param directions allowed directions for the A*
     * @param region the allowed region the algorithm should work in
     * @param checkSolid function that return true in locations not allowed
     * @return a list of points that represent the path between start and end points
     */
    static getPath(start: Point, end: Point, directions: Point[], region: Region, checkSolid: Function): Point[];
    /**
     * get path between multiple start locations and ending location
     * @param start start location
     * @param end destination
     * @param directions allowed directions for the A*
     * @param region the allowed region the algorithm should work in
     * @param checkSolid function that return true in locations not allowed
     * @return a list of points that represent the path between start and end points
     */
    static getPathMultipleStartEnd(start: Point[], end: Point[], directions: Point[], region: Region, checkSolid: Function): Point[];
}
/**
 * parses list of entities to an actual entity array
 * e.g solid:2|empty:3|player => [solid, solid, empty, empty, player]
 * where the array elements are entity objects
 */
declare class EntityListParser {
    /**
     * convert the user input into an array of entities
     * @param line input line by user
     * @return list of entities that is equivalent to the user input
     */
    static parseList(line: string): Entity[];
}
/**
 * Interface for Prando and Noise classes
 */
declare class Random {
    /**
     * Prando object used in the random class
     */
    private static rnd;
    /**
     * Noise object used in the random class
     */
    private static noise;
    /**
     * initialize the parameters of the system
     */
    static initialize(): void;
    /**
     * change noise and random seeds
     * @param seed new seed for the random and noise objects
     */
    static changeSeed(seed: number): void;
    /**
     * get random number between 0 and 1
     * @return a random value between 0 (inclusive) and 1 (exclusive)
     */
    static getRandom(): number;
    /**
     * get random integer between min and max
     * @param min min value for the random integer
     * @param max max value for the random integer
     * @return a random integer between min (inclusive) and max (exclusive)
     */
    static getIntRandom(min: number, max: number): number;
    /**
     * get 2D perlin noise value based on the location x and y
     * @param x x location
     * @param y y location
     * @return noise value based on the location x and y
     */
    static getNoise(x: number, y: number): number;
    /**
     * shuffle an array in place
     * @param array input array to be shuffled
     */
    static shuffleArray(array: any[]): void;
}
/**
 * transform a string to its corresponding class
 */
declare class Factory {
    /**
     * create an estimator based on the user input
     * @param line user input to be parsed
     * @return Number Estimator, Distance Estimator, or NeighborhoodEstimator
     */
    static getEstimator(line: string): EstimatorInterface;
    /**
     * get the correct operator based on the user input
     * @param line user input to be parsed to operator
     * @return >=, <=, >, <, == (=), or != (<>)
     */
    static getOperator(line: string): OperatorInterface;
    /**
     * get the correct divider based on the user input
     * @param type input type of the divider
     * @param numRegions number of region after division
     * @param parameters parameters for the divider
     * @return EqualDivider, BinaryDivider, or SamplingDivider
     */
    static getDivider(type: string, numRegions: number, parameters: any): DividerInterface;
    /**
     * get the specified generator by the user
     * @param type generator type
     * @param currentRegion region applied on
     * @param parameters generator parameters
     * @param rules generator rules
     * @return AutomataGenerator, AgentGenerator, or ConnectorGenerator
     */
    static getGenerator(type: string, currentRegion: any, parameters: any, rules: string[]): Generator;
}
/**
 * core class of Marahel framework
 */
declare class Engine {
    /**
     * type of replacing entities on the map (Map.REPLACE_SAME, Map.REPLACE_BACK)
     * either replace on the same board or in using a buffer and swap the buffer
     * after each iteration
     */
    replacingType: number;
    /**
     * the last generated map, equal to null if generate is not called
     */
    currentMap: MarahelMap;
    /**
     * type of the game borders (Region.BORDER_WRAP, Region.BORDER_NONE, integer >= 0)
     * either an index for entity, the borders are wrapped around,
     * or the borders are not calculated.
     */
    borderType: number;
    /**
     * minimum map size
     */
    private minDim;
    /**
     * maximum map size
     */
    private maxDim;
    /**
     * generator entities
     */
    private entities;
    /**
     * entity to index dictionary
     */
    private entityIndex;
    /**
     * dictionary of neighborhoods
     */
    private neighbors;
    /**
     * current region divider
     */
    private regionDivider;
    /**
     * list of generators that defines the level generator behavior
     */
    private generators;
    /**
     * constructor where it initialize different parts of Marahel
     */
    constructor();
    /**
     * Initialize the current level generator using a JSON object
     * @param data JSON object that defines the current level generator
     */
    initialize(data: any): void;
    /**
     * generate a new map using the defined generator
     */
    generate(): void;
    /**
     * get entity object using its name or index. It returns undefined entity otherwise
     * @param value name or index of the required entity
     * @return the entity selected using "value" or "undefined" entity otherwise
     */
    getEntity(value: number | string): Entity;
    /**
     * get all entities defined in the system
     * @return an array of all the entities defined in the generator
     */
    getAllEntities(): Entity[];
    /**
     * get entity index using its name. returns -1 if not found
     * @param name entity name
     * @return entity index from its name. returns -1 if not found
     */
    getEntityIndex(name: string): number;
    /**
     * get a neighborhood with a certain name or self neighborhood otherwise
     * @param name neighborhood name
     * @return neighborhood object with the input name or self neighborhood otherwise
     */
    getNeighborhood(name: string): Neighborhood;
}
/**
 * Automata Generator class
 */
declare class RandomGenerator extends Generator {
    /**
     * number of iterations to apply cellular automata
     */
    private numOfTiles;
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the automata generator
     */
    constructor(currentRegion: any, rules: string[], parameters: any);
    /**
     * Apply the automata algorithm on the regions array
     */
    applyGeneration(): void;
}
declare let fs: any;
declare let savePixels: any;
declare let zeros: any;
declare let data: any;
declare let colorMap: number[][];
declare let indexMap: number[][];
declare let picture: any;
