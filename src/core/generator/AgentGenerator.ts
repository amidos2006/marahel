/// <reference path="Generator.ts"/>

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
        throw new Error("Method not implemented.");
    }
}