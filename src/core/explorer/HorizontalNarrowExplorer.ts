/// <reference path="NarrowExplorer.ts"/>

class HorizontalNarrowExplorer extends NarrowExplorer{
    protected getNextLocation(currentLocation: Point, region: Region): Point {
        let newPoint:Point = new Point(currentLocation.x, currentLocation.y);
        newPoint.x += 1;
        if(!region.inRegion(newPoint.x, newPoint.y)){
            newPoint.x -= region.getWidth();
            newPoint.y += 1;
            if (!region.inRegion(newPoint.x, newPoint.y)){
                newPoint.y -= region.getHeight();
            }
        }
        return newPoint;
    }
}