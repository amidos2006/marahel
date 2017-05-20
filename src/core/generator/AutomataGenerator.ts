/// <reference path="Generator.ts"/>

class AutomataGenerator extends Generator{
    private numIterations:number;
    private start:Point;
    private explore:Neighborhood;

    constructor(currentRegion:any, rules:string[], parameters:any){
        super(currentRegion, rules);

        this.numIterations = 0;
        if(parameters["iterations"]){
            this.numIterations = parseInt(parameters["iterations"]);
        }
        this.start = new Point();
        if(parameters["start"]){
            this.start = new Point(parseInt(parameters["start"].split(",")[0]), parseInt(parameters["start"].split(",")[1]));
        }
        this.explore = Marahel.getNeighborhood("sequential");
        if(parameters["exploration"]){
            this.explore = Marahel.getNeighborhood(parameters["exploration"]);
        }
    }

    applyGeneration(): void {
        super.applyGeneration();
        for(let r of this.regions){
            for(let i:number=0; i<this.numIterations; i++){
                let visited:any = {};
                let exploreList:Point[] = [new Point(this.start.x * r.getWidth(), this.start.y * r.getHeight())];
                while(exploreList.length > 0){
                    let currentPoint:Point = exploreList.splice(0, 1)[0];
                    currentPoint = r.getRegionPosition(currentPoint.x, currentPoint.y);
                    if(!visited[currentPoint.toString()] && !r.outRegion(currentPoint.x, currentPoint.y)){
                        visited[currentPoint.toString()] = true;
                        for(let rule of this.rules){
                            let applied:boolean = rule.execute(i/this.numIterations, currentPoint, r);
                            if(applied){
                                break;
                            }
                        }
                        let neighbors:Point[] = this.explore.getNeighbors(currentPoint.x, currentPoint.y, r);
                        for(let n of neighbors){
                                exploreList.push(n);
                        }
                    }
                }
                Marahel.currentMap.switchBuffers();
            }
        }
    }
}