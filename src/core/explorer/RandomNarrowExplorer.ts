/// <reference path="NarrowExplorer.ts"/>

class RandomNarrowExplorer extends NarrowExplorer {
    protected getNextLocation(currentLocation: Point, region: Region): Point {
        return new Point(Random.getIntRandom(region.getX(), region.getX() + region.getWidth()),
            Random.getIntRandom(region.getY(), region.getY() + region.getHeight()));
    }
}