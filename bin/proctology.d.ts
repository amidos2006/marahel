declare class Map {
    static REPLACE_SAME: number;
    static REPLACE_BACK: number;
    currentReplacing: number;
    width: number;
    height: number;
    private mapValues;
    private backValues;
    constructor(width: number, height: number);
    setValue(x: number, y: number, value: number): void;
    switchBuffers(): void;
    getValue(x: number, y: number): number;
}
declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    toString(): string;
}
declare class Entity {
    name: string;
    color: number;
    minValue: number;
    maxValue: number;
    constructor(name: string, parameters: any);
}
declare class Region {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    setValue(x: number, y: number, value: number): void;
    getValue(x: number, y: number): number;
    getEntityNumber(value: number): number;
    getDistances(neighbor: Neighborhood, value: number): number[];
    intersect(pr: Region | Point): boolean;
}
declare class Neighborhood {
    width: number;
    height: number;
    name: string;
    private locations;
    private printing;
    constructor(name: string, line: string);
    getTotal(value: number, center: Point, region: Region): number;
    setTotal(value: number, center: Point, region: Region): void;
    toString(): string;
}
interface OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
interface EstimatorInterface {
    calculate(iteration: number, position: Point, region: Region): number;
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
declare class Marahel {
    private static rnd;
    private static minDim;
    private static maxDim;
    private static entities;
    private static entityIndex;
    private static neighbors;
    private static regionDivider;
    private static generators;
    private static currentMap;
    static getRandom(): number;
    static getIntRandom(min: number, max: number): number;
    static shuffleArray(array: any[]): void;
    static initialize(data: any): void;
    static generate(seed?: number): void;
    static getMap(): Map;
    static getEntity(value: number | string): Entity;
    static getEntityIndex(name: string): number;
    static getNeighborhood(name: string): Neighborhood;
    static getEstimator(line: string): EstimatorInterface;
    static getOperator(line: string): OperatorInterface;
}
interface DividerInterface {
    getRegions(map: Region): Region[];
}
declare class DiggerDivider implements DividerInterface {
    static ACCEPTANCE_TRIALS: number;
    private numberOfRegions;
    private minWidth;
    private minHeight;
    private maxWidth;
    private maxHeight;
    private probDir;
    private probSpawn;
    private allowIntersect;
    constructor(numberOfRegions: number, parameters: any);
    private checkIntersection(r, regions);
    private getRegion(map);
    getRegions(map: Region): Region[];
}
declare class Condition {
    private leftSide;
    private operator;
    private rightSide;
    private nextCondition;
    constructor(line: string);
    check(iteration: number, position: Point, region: Region): boolean;
}
declare class Executer {
    private neightbor;
    private entity;
    private nextExecuter;
    constructor(line: string);
    apply(position: Point, region: Region): void;
}
declare class Rule {
    private condition;
    private executer;
    private nextRule;
    constructor(lines: string[]);
    execute(iteration: number, position: Point, region: Region): boolean;
}
declare let parameters: {
    "max": string;
    "min": string;
    "probDir": string;
    "probSpawn": string;
    "allowIntersection": string;
};
declare let r: Rule;
declare class DistanceEstimator implements EstimatorInterface {
    private type;
    private neighbor;
    private entity;
    constructor(line: string);
    calculate(iteration: number, position: Point, region: Region): number;
}
declare class NeighborhoodEstimator implements EstimatorInterface {
    private neighbor;
    private entity;
    constructor(line: string);
    calculate(iteration: number, position: Point, region: Region): number;
}
declare class NumberEstimator implements EstimatorInterface {
    private name;
    constructor(line: string);
    calculate(iteration: number, position: Point, region: Region): number;
}
declare abstract class Generator {
    private regions;
    private rules;
    constructor(currentRegion: string, map: Region, regions: Region[], rules: string[]);
    applyGeneration(): void;
}
declare class AgentGenerator extends Generator {
    applyGeneration(): void;
}
declare class AutomataGenerator extends Generator {
    applyGeneration(): void;
}
declare class ConnectorGenerator extends Generator {
    applyGeneration(): void;
}
declare class EqualOperator implements OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
declare class LargerEqualOperator implements OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
declare class LargerOperator implements OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
declare class LessEqualOperator implements OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
declare class LessOperator implements OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
declare class NotEqualOperator implements OperatorInterface {
    check(leftValue: number, rightValue: number): boolean;
}
declare class AdjustmentDivider implements DividerInterface {
    static ADJUSTMENT_TRAILS: number;
    static RETRY_TRAILS: number;
    private numberOfRegions;
    private minWidth;
    private minHeight;
    private maxWidth;
    private maxHeight;
    private allowIntersect;
    constructor(numberOfRegions: number, parameters: any);
    private checkIntersection(r, regions);
    private changeRegion(map, r);
    private getFitRegion(map, regions);
    private calculateIntersection(regions);
    private adjustRegions(map, regions);
    getRegions(map: Region): Region[];
}
declare class BinaryDivider implements DividerInterface {
    private numberOfRegions;
    private minWidth;
    private minHeight;
    private maxWidth;
    private maxHeight;
    constructor(numberOfRegions: number, parameters: any);
    private divideWidth(region, allowedWidth);
    private divideHeight(region, allowedHeight);
    private testDivide(region);
    private divide(region);
    private checkMaxSize(regions);
    private divideMaxSize(region);
    getRegions(map: Region): Region[];
}
declare class EqualDivider implements DividerInterface {
    private numberOfRegions;
    private minWidth;
    private minHeight;
    private maxWidth;
    private maxHeight;
    constructor(numberOfRegions: number, parameters: any);
    getRegions(map: Region): Region[];
}
