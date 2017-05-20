/// <reference path="../data/Point.ts"/>

class LocationNode{
    x:number;
    y:number;
    parent:LocationNode;

    constructor(parent:LocationNode=null, x:number=0, y:number=0){
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    checkEnd(x:number, y:number):boolean{
        return this.x == x && this.y == y;
    }

    estimate(x:number, y:number):number{
        return Math.pow(x - this.x,2) + Math.pow(y - this.y, 2);
    }
    
    toString():string{
        return this.x + "," + this.y;
    }
}

class AStar{
    static MAX_ITERATIONS:number = 1000;

    private static convertNodeToPath(node:LocationNode):Point[]{
        let points:Point[] = [];
        while(node != null){
            points.push(new Point(node.x, node.y));
            node = node.parent;
        }
        return points.reverse();
    }

    static getPath(start:Point, end:Point, directions:Point[], region:Region, checkSolid:Function):Point[]{
        let iterations:number = 0;
        let openNodes:LocationNode[] = [new LocationNode(null, start.x, start.y)];
        let visited:any = {};
        let currentNode:LocationNode = openNodes[0];
        while(openNodes.length > 0 && !currentNode.checkEnd(end.x, end.y)){
            currentNode = openNodes.splice(0, 1)[0];
            if(!visited[currentNode.toString()]){
                visited[currentNode.toString()] = true;
                for(let d of directions){
                    let p:Point = region.getRegionPosition(currentNode.x + d.x, currentNode.y + d.y);
                    let newLocation:LocationNode = new LocationNode(currentNode, p.x, p.y);
                    if(!checkSolid(newLocation.x, newLocation.y) && !region.outRegion(p.x, p.y)){
                        openNodes.push(newLocation);
                    }
                }
                openNodes.sort((a:LocationNode, b:LocationNode)=>{
                    return a.estimate(end.x, end.y) - b.estimate(end.x, end.y);
                });
            }
            iterations += 1;
            if(iterations >= AStar.MAX_ITERATIONS){
                break;
            }
        }
        if(currentNode.checkEnd(end.x, end.y)){
            return AStar.convertNodeToPath(currentNode);
        }
        return [];
    }
}

class EntityListParser{
    static parseList(line:string):Entity[]{
        let result:Entity[] = [];
        let eeParts:string[] = line.split("|");
        for(let e of eeParts){
            let nums:string[] = e.split(":");
            let times:number = 1;
            if(nums.length > 1){
                times = parseInt(nums[1]);
            }
            for(let i:number=0; i<times; i++){
                result.push(Marahel.getEntity(nums[0].trim()));
            }
        }
        return result;
    }
}