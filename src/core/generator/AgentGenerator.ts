/// <reference path="Generator.ts"/>

/**
 * Agent class used in the AgentGenerator Algorithm
 */
class Agent{
    /**
     * current position of the agent
     */
    private position:Point;
    /**
     * current lifespan of the agent
     */
    private currentLifespan:number;
    /**
     * total lifespan of the agent
     */
    private lifespan:number;
    /**
     * current agent speed
     */
    private currentSpeed:number;
    /**
     * when does the agent apply rules
     */
    private speed:Point;
    /**
     * amount of time when the agent change direction
     */
    private currentChange:number;
    /**
     * total amount of time the agent change direction
     */
    private change:Point;
    /**
     * current agent direction
     */
    private currentDirection:Point;
    /**
     * allowed directions by the agent
     */
    private directions:Point[];
    /**
     * starting entity
     */
    private entities:Entity[];

    /**
     * Constructor for the agent class
     * @param lifespan current lifespan after it reach zero the agent dies
     * @param speed current agent speed to apply rules
     * @param change amount of time the agent change direction at
     * @param entities starting location of the agent
     * @param directions current allowed directions
     */
    constructor(lifespan:number, speed:Point, change:Point, entities:Entity[], directions:Neighborhood){
        this.position = new Point(0, 0);
        this.currentLifespan = lifespan;
        this.lifespan = lifespan;
        this.currentSpeed = Random.getIntRandom(speed.x, speed.y);
        this.speed = speed;
        this.currentChange = Random.getIntRandom(change.x, change.y);
        this.change = change;
        this.currentDirection = directions.locations[Random.getIntRandom(0, directions.locations.length)];
        this.directions = [];
        for(let i:number=0; i<directions.locations.length; i++){
            this.directions.push(new Point(directions.locations[i].x, directions.locations[i].y));
        }
        this.entities = entities;
    }

    /**
     * move the agent to an allowed location used when the agent get stuck
     * @param region the applied region
     */
    moveToLocation(region:Region):void{
        let locations:Point[] = [];
        for(let x:number=0; x<region.getWidth(); x++){
            for(let y:number=0; y<region.getHeight(); y++){
                for(let e of this.entities){
                    if(region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(e.name)){
                        locations.push(new Point(x, y));
                    }
                }
            }
        }
        if(locations.length == 0){
            this.currentLifespan = -100;
            return;
        }
        this.position = locations[Random.getIntRandom(0, locations.length)];
    }

    /**
     * check if the current location is allowed
     * @param x x position
     * @param y y position
     * @param region current region
     * @return true if the location is allowed for the agent and false otherwise
     */
    private checkAllowed(x:number, y:number, region:Region):boolean{
        for(let e of this.entities){
            if(region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(e.name)){
                return true;
            }
        }
        return false;
    }

    /**
     * change the current direction of the agent or jump to 
     * new location if no location found
     * @param region the applied region
     */
    private changeDirection(region:Region):void{
        Random.shuffleArray(this.directions);
        for(let d of this.directions){
            let newPosition:Point = region.getRegionPosition(this.position.x + d.x, this.position.y + d.y);
            if(!region.outRegion(newPosition.x, newPosition.y) && 
                this.checkAllowed(newPosition.x, newPosition.y, region)){
                this.currentDirection = d;
                this.position = newPosition;
                return;
            }
        }
        this.moveToLocation(region);
    }

    /**
     * update the current agent
     * @param region current applied region
     * @param rules rules to be applied when its time to react
     * @return true if the agent is still alive and false otherwise
     */
    update(region:Region, rules:Rule):boolean{
        if(this.currentLifespan <= 0){
            return false;
        }
        this.currentSpeed -= 1;
        if(this.currentSpeed > 0){
            return true;
        }
        this.currentSpeed = Random.getIntRandom(this.speed.x, this.speed.y);
        this.currentLifespan -= 1;
        this.currentChange -= 1;
        if(this.currentChange <= 0){
            this.currentChange = Random.getIntRandom(this.change.x, this.change.y);
            this.changeDirection(region);
        }
        else{
            this.position = region.getRegionPosition(this.position.x + this.currentDirection.x, 
                this.position.y + this.currentDirection.y);
            if(region.outRegion(this.position.x, this.position.y) ||
                !this.checkAllowed(this.position.x, this.position.y, region)){
                this.changeDirection(region);
            }
        }
        if(this.lifespan <= -10){
            return false;
        }
        rules.execute(this.currentLifespan/this.lifespan, this.position, region);
        return true;
    }
}

/**
 * Agent based generator
 */
class AgentGenerator extends Generator{
    /**
     * number of entities the agent can move on it
     */
    private allowedEntities:Entity[];
    /**
     * number of spawned agents
     */
    private numAgents:Point;
    /**
     * speed of the agent to apply the rules
     */
    private speed:Point;
    /**
     * time before the agent change its direction
     */
    private changeTime:Point;
    /**
     * lifespan for the agents
     */
    private lifespan:Point;
    /**
     * directions allowed for the agents
     */
    private directions:Neighborhood;

    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    constructor(currentRegion:any, rules:string[], parameters:any){
        super(currentRegion, rules);

        this.allowedEntities = EntityListParser.parseList("any");
        if(parameters["allowed"]){
            this.allowedEntities = EntityListParser.parseList(parameters["start"]);
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
        this.directions = Marahel.marahelEngine.getNeighborhood("plus");
        if(parameters["directions"]){
            this.directions = Marahel.marahelEngine.getNeighborhood(parameters["directions"]);
        }
    }

    /**
     * Apply the agent based algorithm on the regions array
     */
    applyGeneration():void {
        super.applyGeneration();
        for(let r of this.regions){
            let agents:Agent[] = [];
            let numberOfAgents:number = Random.getIntRandom(this.numAgents.x, this.numAgents.y);
            for(let i:number=0; i<numberOfAgents; i++){
                agents.push(new Agent(Random.getIntRandom(this.lifespan.x, this.lifespan.y), 
                    this.speed, this.changeTime, this.allowedEntities, this.directions));
                agents[agents.length - 1].moveToLocation(r);
            }
            let agentChanges:boolean = true;
            while(agentChanges){
                for(let a of agents){
                    agentChanges = false;
                    agentChanges = agentChanges || a.update(r, this.rules);
                    Marahel.marahelEngine.currentMap.switchBuffers();
                }
            }
        }
    }
}