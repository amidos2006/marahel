/// <reference path="Explorer.ts"/>

/**
 * Automata Generator class
 */
abstract class NarrowExplorer extends Explorer{
    protected restartRepeat(region: Region): Point {
        return new Point(Random.getIntRandom(region.getX(), region.getX() + region.getWidth()),
            Random.getIntRandom(region.getY(), region.getY() + region.getHeight()));
    }
}