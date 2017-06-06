/// <reference path="Generator.ts"/>

class Group{
    index:number;
    points:Point[];

    constructor(){
        this.index = -1;
        this.points = [];
    }

    addPoint(x:number, y:number):void{
        this.points.push(new Point(x, y));
    }

    getCenter():Point{
        let result:Point = new Point(0, 0);
        for(let p of this.points){
            result.x += p.x;
            result.y + p.y;
        }

        result.x /= this.points.length;
        result.y /= this.points.length;
        return result;
    }

    sort(p:Point):void{
        this.points.sort((a:Point, b:Point):number=>{
            let d1:number = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
            let d2:number = Math.abs(p.x - b.x) + Math.abs(p.y - b.y);
            if(d1 == d2){
                return Math.random()-0.5;
            }
            return d1 - d2;
        })
    }

    cleanPoints(region:Region, allowed:Entity[], neighbor:Neighborhood):void{
        for(let i:number=0; i<this.points.length; i++){
            let found:boolean = false;
            for(let e of allowed){
                if(neighbor.getTotal(Engine.getEntityIndex(e.name),this.points[i], region) < neighbor.locations.length){
                    found = true;
                    break;
                }
            }
            if(!found){
                this.points.splice(i, 1);
                i--;
            }
        }
    }

    combine(group:Group):void{
        for(let p of group.points){
            this.points.push(p);
        }
    }

    distance(group:Group):number{
        let dist:number = Number.MAX_VALUE;
        for(let p1 of this.points){
            for(let p2 of group.points){
                if(Math.abs(p1.x + p2.x) + Math.abs(p1.y + p2.y) < dist){
                    dist = Math.abs(p1.x + p2.x) + Math.abs(p1.y + p2.y);
                }
            }
        }
        return dist;
    }
}

class ConnectorGenerator extends Generator{
    static MAX_ITERATIONS:number = 100;

    static SHORT_CONNECTION:number=0;
    static RANDOM_CONNECTION:number=1;
    static HUB_CONNECTION:number=2;
    static FULL_CONNECTION:number=3;

    private neighbor:Neighborhood;
    private entities:Entity[];
    private connectionType:number;

    constructor(currentRegion:any, rules:string[], parameters:any){
        super(currentRegion, rules);

        this.neighbor = Engine.getNeighborhood("plus");
        if(parameters["neighborhood"]){
            this.neighbor = Engine.getNeighborhood(parameters["neighborhood"].trim());
        }
        this.entities = EntityListParser.parseList("any");
        if(parameters["entities"]){
            this.entities = EntityListParser.parseList(parameters["entities"]);
        }
        this.connectionType = ConnectorGenerator.SHORT_CONNECTION;
        if(parameters["type"]){
            switch(parameters["type"].trim()){
                case "short":
                this.connectionType = ConnectorGenerator.SHORT_CONNECTION;
                break;
                case "hub":
                this.connectionType = ConnectorGenerator.HUB_CONNECTION;
                break;
                case "full":
                this.connectionType = ConnectorGenerator.FULL_CONNECTION;
                break;
                case "random":
                this.connectionType = ConnectorGenerator.RANDOM_CONNECTION;
                break;
            }
        }
    }

    private floodFill(x:number, y:number, label:number, labelBoard:number[][], region:Region):void{
        if(labelBoard[y][x] != -1){
            return;
        }
        labelBoard[y][x] = label;
        let neighborLocations:Point[] = this.neighbor.getNeighbors(x, y, region);
        for(let p of neighborLocations){
            for(let e of this.entities){
                if(region.getValue(p.x, p.y) == Engine.getEntityIndex(e.name)){
                    this.floodFill(p.x, p.y, label, labelBoard, region);
                }
            }
        }
    }

    private getUnconnectedGroups(region:Region):Group[]{
        let label:number = 0;
        let labelBoard:number[][] = [];
        for(let y:number=0; y<region.getHeight(); y++){
            labelBoard.push([]);
            for(let x:number=0; x<region.getWidth(); x++){
                labelBoard[y].push(-1);
            }
        }
        for(let y:number=0; y<region.getHeight(); y++){
            for(let x:number=0; x<region.getWidth(); x++){
                if(labelBoard[y][x] == -1){
                    for(let e of this.entities){
                        if(region.getValue(x, y) == Engine.getEntityIndex(e.name)){
                            this.floodFill(x, y, label, labelBoard, region);
                            label+=1;
                            break;
                        }
                    }
                }
            }
        }
        let groups:Group[] = [];
        for(let i:number=0; i<label; i++){
            groups.push(new Group());
            groups[i].index = i;
        }
        for(let y:number=0; y<region.getHeight(); y++){
            for(let x:number=0; x<region.getWidth(); x++){
                if(labelBoard[y][x] != -1){
                    groups[labelBoard[y][x]].addPoint(x, y);
                }
            }
        }
        return groups;
    }

    private connect(start:Point, end:Point, region:Region):boolean{
        let blocked:any={};
        let currentPosition:Point = start;
        while(!currentPosition.equal(end)){
            let path:Point[] = AStar.getPath(currentPosition, end, this.neighbor.locations, region, 
                (x:number, y:number)=>{
                    if(blocked[x + "," + y]){
                        return true;
                    }
                    return false;
                });
            if(path.length == 0){
                return false;
            }
            let i:number = -1;
            for(i=1; i<path.length - 1; i++){
                let applied:boolean = false;
                for(let rule of this.rules){
                    applied = rule.execute(i/path.length, path[i], region);
                    if(applied){
                        break;
                    }
                }
                if(!applied){
                    blocked[path[i].x + "," + path[i].y] = true;
                    currentPosition = path[i-1];
                }
            }
            if(i == path.length - 1){
                currentPosition = path[i];
            }
        }
        return true;
    }

    private connectRandom(groups:Group[], region:Region):void{
        let index:number=0;
        while(groups.length > 1){
            let i1:number=Engine.getIntRandom(0,groups.length);
            let i2:number=(i1+Engine.getIntRandom(0, groups.length-1) + 1)%groups.length;
            this.connect(groups[i1].points[Engine.getIntRandom(0, groups[i1].points.length)], 
                groups[i2].points[Engine.getIntRandom(0, groups[i2].points.length)], region);
            groups[i1].combine(groups[i2]);
            groups.splice(i2, 1);
            index+=1;
            if(index > ConnectorGenerator.MAX_ITERATIONS){
                throw new Error("Connector: " + this + " is taking too much time.")
            }
        }
    }

    private shortestGroup(groups:Group[], region:Region):Point[]{
        let c1:Point = groups[0].getCenter();
        let minDistance:number = Number.MAX_VALUE;
        let index:number = -1;
        for(let i:number=1; i<groups.length; i++){
            let c2:Point = groups[i].getCenter();
            if(Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) < minDistance){
                index = i;
                minDistance = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
            }
        }

        groups[0].sort(groups[index].getCenter());
        groups[index].sort(c1);
        let path:Point[] = AStar.getPathMultipleStartEnd(groups[0].points, groups[index].points, 
                this.neighbor.locations, region, (x:number, y:number)=>{return false;});

        return [path[0], path[path.length-1], new Point(0, index)];
    }

    private centerGroup(groups:Group[], region:Region):number{
        let minDistance:number = Number.MAX_VALUE;
        let index:number = -1;
        for(let i:number=0; i<groups.length; i++){
            let c1:Point = groups[0].getCenter();
            let totalDistance:number = 0;
            for(let j:number=i; j<groups.length; j++){
                let c2:Point = groups[i].getCenter();
                totalDistance += Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
            }
            if(totalDistance < minDistance){
                index = i;
                minDistance = totalDistance;
            }
        }

        return index;
    }

    private connectShort(groups:Group[], region:Region):void{
        let index:number=0;
        while(groups.length > 1){
            let p:Point[] = this.shortestGroup(groups, region);
            this.connect(p[0], p[1], region);
            groups[p[2].x].combine(groups[p[2].y]);
            groups.splice(p[2].y, 1);
            index+=1;
            if(index > ConnectorGenerator.MAX_ITERATIONS){
                throw new Error("Connector: " + this + " is taking too much time.")
            }
        }
    }

    private connectFull(groups:Group[], region:Region):void{
        let index:number=0;
        let probability:number = 1/groups.length;
        for(let g1 of groups){
            for(let g2 of groups){
                if(g1 == g2){
                    continue;
                }
                if(Engine.getRandom() > probability){
                    probability += 1/groups.length;
                    continue;
                }
                probability = 1/groups.length;
                let p1:Point = g1.points[Engine.getIntRandom(0, g1.points.length)];
                let p2:Point = g2.points[Engine.getIntRandom(0, g2.points.length)];
                this.connect(p1, p2, region);
            }
        }
    }

    private connectHub(groups:Group[], region:Region):void{
        let center:number = this.centerGroup(groups, region);
        for(let g of groups){
            if(g != groups[center]){
                let path:Point[] = AStar.getPathMultipleStartEnd(groups[center].points, g.points, 
                    this.neighbor.locations, region, (x:number, y:number)=>{return false;});
                this.connect(path[0], path[path.length-1], region);
            }
        }
    }

    applyGeneration(): void {
        super.applyGeneration();
        for(let r of this.regions){
            let groups:Group[] = this.getUnconnectedGroups(r);
            for(let g of groups){
                g.cleanPoints(r, this.entities, this.neighbor);
            }
            if(groups.length > 1){
                switch(this.connectionType){
                    case ConnectorGenerator.HUB_CONNECTION:
                    this.connectHub(groups, r);
                    break;
                    case ConnectorGenerator.RANDOM_CONNECTION:
                    this.connectRandom(groups, r);
                    break;
                    case ConnectorGenerator.SHORT_CONNECTION:
                    this.connectShort(groups, r);
                    break;
                    case ConnectorGenerator.FULL_CONNECTION:
                    this.connectFull(groups, r);
                    break;
                }
                Marahel.currentMap.switchBuffers();
            }
        }
    }
}