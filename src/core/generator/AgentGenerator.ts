/// <reference path="Generator.ts"/>

class Agent{
    private position:Point;
    private currentLifespan:number;
    private lifespan:number;
    private currentSpeed:number;
    private speed:number;
    private currentChange:number;
    private change:Point;
    private currentDirection:Point;
    private directions:Point[];
    private entities:Entity[];

    constructor(lifespan:number, speed:number, change:Point, entities:Entity[], directions:Neighborhood){
        this.position = new Point(0, 0);
        this.currentLifespan = lifespan;
        this.lifespan = lifespan;
        this.currentSpeed = speed;
        this.speed = speed;
        this.currentChange = Marahel.getIntRandom(change.x, change.y);
        this.change = change;
        this.currentDirection = directions.locations[Marahel.getIntRandom(0, directions.locations.length)];
        this.directions = [];
        for(let i:number=0; i<directions.locations.length; i++){
            this.directions.push(new Point(directions.locations[i].x, directions.locations[i].y));
        }
        this.entities = entities;
    }

    moveToLocation(region:Region):void{
        let locations:Point[] = [];
        for(let x:number=0; x<region.getWidth(); x++){
            for(let y:number=0; y<region.getHeight(); y++){
                for(let e of this.entities){
                    if(region.getValue(x, y) == Marahel.getEntityIndex(e.name)){
                        locations.push(new Point(x, y));
                    }
                }
            }
        }
        if(locations.length == 0){
            this.currentLifespan = -100;
            return;
        }
        this.position = locations[Marahel.getIntRandom(0, locations.length)];
    }

    private checkAllowed(x:number, y:number, region:Region, avoid:Entity[]):boolean{
        for(let e of avoid){
            if(region.getValue(x, y) == Marahel.getEntityIndex(e.name)){
                return false;
            }
        }
        return true;
    }

    private changeDirection(region:Region, avoid:Entity[]):void{
        Marahel.shuffleArray(this.directions);
        for(let d of this.directions){
            let newPosition:Point = region.getRegionPosition(this.position.x + d.x, this.position.y + d.y);
            if(!region.outRegion(newPosition.x, newPosition.y) && 
                this.checkAllowed(newPosition.x, newPosition.y, region, avoid)){
                this.currentDirection = d;
                this.position = newPosition;
                return;
            }
        }
        this.moveToLocation(region);
    }

    update(region:Region, rules:Rule[], avoid:Entity[]):boolean{
        if(this.currentLifespan <= 0){
            return false;
        }
        this.currentSpeed -= 1;
        if(this.currentSpeed > 0){
            return true;
        }
        this.currentSpeed = this.speed;
        this.currentLifespan -= 1;
        this.currentChange -= 1;
        if(this.currentChange <= 0){
            this.currentChange = Marahel.getIntRandom(this.change.x, this.change.y);
            this.changeDirection(region, avoid);
        }
        else{
            this.position = region.getRegionPosition(this.position.x + this.currentDirection.x, 
                this.position.y + this.currentDirection.y);
            if(region.outRegion(this.position.x, this.position.y) ||
                !this.checkAllowed(this.position.x, this.position.y, region, avoid)){
                this.changeDirection(region, avoid);
            }
        }
        if(this.lifespan <= -10){
            return false;
        }
        for(let r of rules){
            let applied:boolean = r.execute(this.currentLifespan/this.lifespan, this.position, region);
            if(applied){
                break;
            }
        }
        return true;
    }
}

class AgentGenerator extends Generator{
    private startEntities:Entity[];
    private avoidEntities:Entity[];
    private numAgents:Point;
    private speed:Point;
    private changeTime:Point;
    private lifespan:Point;
    private directions:Neighborhood;

    constructor(currentRegion:any, rules:string[], parameters:any){
        super(currentRegion, rules);

        this.startEntities = EntityListParser.parseList("any");
        if(parameters["start"]){
            this.startEntities = EntityListParser.parseList(parameters["start"]);
        }
        this.avoidEntities = [];
        if(parameters["avoid"]){
            this.avoidEntities = EntityListParser.parseList(parameters["avoid"]);
        }
        this.numAgents = new Point(1, 1);
        if(parameters["number"]){
            this.numAgents.x = parseInt(parameters["number"].split(",")[0]);
            this.numAgents.y = parseInt(parameters["number"].split(",")[1]);
        }
        this.speed = new Point(1, 1);
        if(parameters["speed"]){
            this.speed.x = parseInt(parameters["speed"].split(",")[0]);
            this.speed.y = parseInt(parameters["speed"].split(",")[1]);
        }
        this.changeTime = new Point(1, 1);
        if(parameters["change"]){
            this.changeTime.x = parseInt(parameters["change"].split(",")[0]);
            this.changeTime.y = parseInt(parameters["change"].split(",")[1]);
        }
        this.lifespan = new Point(50,50);
        if(parameters["lifespan"]){
            this.lifespan.x = parseInt(parameters["lifespan"].split(",")[0]);
            this.lifespan.y = parseInt(parameters["lifespan"].split(",")[1]);
        }
        this.directions = Marahel.getNeighborhood("plus");
        if(parameters["directions"]){
            this.directions = Marahel.getNeighborhood(parameters["directions"]);
        }
    }

    applyGeneration(): void {
        super.applyGeneration();
        for(let r of this.regions){
            let agents:Agent[] = [];
            let numberOfAgents:number = Marahel.getIntRandom(this.numAgents.x, this.numAgents.y);
            for(let i:number=0; i<numberOfAgents; i++){
                agents.push(new Agent(Marahel.getIntRandom(this.lifespan.x, this.lifespan.y), 
                    Marahel.getIntRandom(this.speed.x, this.speed.y), this.changeTime, this.startEntities, this.directions));
                agents[agents.length - 1].moveToLocation(r);
            }
            let agentChanges:boolean = true;
            while(agentChanges){
                for(let a of agents){
                    agentChanges = false;
                    agentChanges = agentChanges || a.update(r, this.rules, this.avoidEntities);
                    Marahel.currentMap.switchBuffers();
                }
            }
        }
    }
}