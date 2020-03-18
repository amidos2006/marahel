/// <reference path="TurtleExplorer.ts"/>
/// <reference path="../data/Group.ts"/>
/// <reference path="../Marahel.ts"/>

class ConnectTurtleExplorer extends TurtleExplorer {
    private entities:number[];

    private waypoints:Point[];
    private total_waypoints:number;
    
    constructor(regionNames:string[], parameters:any, rules:string[]) {
        super(regionNames, parameters, rules);
        
        let entities = EntityListParser.parseList("entity");
        if(parameters["entities"]){
            entities = EntityListParser.parseList(parameters["entities"]);
        }
        this.entities = [];
        for(let e of entities){
            this.entities.push(e.index);
        }
    }

    protected restartRepeat(region:Region):Point {
        let groups = this.directions.getGroups(this.entities, region);
        if(groups.length == 0){
            this.waypoints = [];
            this.total_waypoints = 1;
            return new Point(region.getX(), region.getY());
        }
        for(let g of groups){
            g.sort(g.getCenter());
        }
        let centers:Group = new Group();
        for(let g of groups){
            let p = g.rankSelection();
            centers.addPoint(p.x, p.y);
        }
        Random.shuffleArray(centers.points);

        this.waypoints = [];
        let prevPoint = centers.points[0];
        let currentPoint = centers.points[0];
        while(centers.points.length > 0){
            centers.points.splice(centers.points.indexOf(currentPoint), 1);
            this.waypoints.push(currentPoint);
            if(Random.getRandom() < 0.25){
                this.waypoints.push(prevPoint);
                currentPoint = prevPoint;
            }
            centers.sort(currentPoint);
            prevPoint = currentPoint;
            currentPoint = centers.rankSelection();
        }
        if(Random.getRandom() < 0.5 && this.waypoints.length > 1){
            let p = Random.choiceArray(this.waypoints.slice(0, this.waypoints.length - 1));
            this.waypoints.push(new Point(p.x, p.y));
        }
        this.total_waypoints = this.waypoints.length;
        return new Point(this.waypoints[0].x, this.waypoints[0].y);
    }

    protected getNextLocation(currentLocation: Point, region: Region): Point {
        let target:Point = this.waypoints[0];
        if (currentLocation.x == target.x && currentLocation.y == target.y){
            this.waypoints.splice(0, 1);
            if (this.waypoints.length == 0) {
                return currentLocation;
            }
            target = this.waypoints[0];
        }
        let newlocs:Point[] = this.directions.getNeighbors(currentLocation.x, currentLocation.y, region);
        newlocs.sort(function(l1,l2){
            let dist1 = Math.abs(l1.x - target.x) + Math.abs(l1.y - target.y);
            let dist2 = Math.abs(l2.x - target.x) + Math.abs(l2.y - target.y);
            if(dist1 == dist2){
                return Random.getRandom() - 0.5;
            }
            return dist1 - dist2;
        });
        return newlocs[0];
    }

    protected checkRepeatTermination(region:Region): boolean {
        return super.checkRepeatTermination(region) || this.waypoints.length == 0;
    }

    protected getTilesPercentage(): number {
        return (this.total_waypoints - this.waypoints.length) / this.total_waypoints;
    }
}