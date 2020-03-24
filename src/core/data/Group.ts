/// <reference path="Point.ts"/>

/**
 * Group class is a helper class to the connector algorithm
 */
class Group {
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
    constructor() {
        this.index = -1;
        this.points = [];
    }

    /**
     * add new point to the group
     * @param x x position
     * @param y y position
     */
    addPoint(x: number, y: number): void {
        this.points.push(new Point(x, y));
    }

    /**
     * get the center of the group
     * @return the center of the group
     */
    getCenter(): Point {
        let result: Point = new Point(0, 0);
        for (let p of this.points) {
            result.x += p.x;
            result.y += p.y;
        }

        result.x /= this.points.length;
        result.y /= this.points.length;
        return result;
    }

    /**
     * sort the points in an ascending order with respect to input point p
     * @param p relative point for sorting
     */
    sort(p: Point): void {
        this.points.sort((a: Point, b: Point): number => {
            let d1: number = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
            let d2: number = Math.abs(p.x - b.x) + Math.abs(p.y - b.y);
            if (d1 == d2) {
                return Random.getRandom() - 0.5;
            }
            return d1 - d2;
        })
    }

    rankSelection():Point{
        if(this.points.length == 0){
            return null;
        }
        let prob:number[] = [];
        let total:number = this.points.length;
        prob.push(this.points.length);
        for(let i:number=1; i<this.points.length; i++){
            prob.push(this.points.length - i + prob[i-1]);
            total += this.points.length - i;
        }
        let random:number = Random.getRandom();
        for(let i:number=0; i<this.points.length; i++){
            if(random < prob[i] / total){
                return new Point(this.points[i].x, this.points[i].y);
            }
        }
        return new Point(this.points[this.points.length - 1].x, this.points[this.points.length -1].y);
    }

    /**
     * remove all the points that inside the shape so the group only have border points
     * @param region current region
     * @param allowed connectivity checking entity
     * @param neighbor neighborhood used in connection
     */
    cleanPoints(region: Region, allowed: Entity[], neighbor: Neighborhood): void {
        for (let i: number = 0; i < this.points.length; i++) {
            let found: boolean = false;
            for (let e of allowed) {
                if (neighbor.getTotal(Marahel.marahelEngine.getEntityIndex(e.name), this.points[i],
                    region) < neighbor.locations.length) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.points.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * merge two groups together
     * @param group the other group to be merged with
     */
    combine(group: Group): void {
        for (let p of group.points) {
            this.points.push(p);
        }
    }

    /**
     * Get the minimum manhattan distance between this group and the input group
     * @param group the other to measure distance towards it
     * @return the minimum manhattan distance between this group and the other group
     */
    distance(group: Group): number {
        let dist: number = Number.MAX_VALUE;
        for (let p1 of this.points) {
            for (let p2 of group.points) {
                if (Math.abs(p1.x + p2.x) + Math.abs(p1.y + p2.y) < dist) {
                    dist = Math.abs(p1.x + p2.x) + Math.abs(p1.y + p2.y);
                }
            }
        }
        return dist;
    }
}