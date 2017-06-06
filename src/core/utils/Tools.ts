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
        return Math.abs(x - this.x) + Math.abs(y - this.y);
    }
    
    toString():string{
        return this.x + "," + this.y;
    }
}

class AStar{
    static MAX_ITERATIONS:number = 1000;
    static MAX_MULTI_TEST:number = 10;

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
                    if(newLocation.checkEnd(end.x, end.y)){
                        return AStar.convertNodeToPath(newLocation);
                    }
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

    static getPathMultipleStartEnd(start:Point[], end:Point[], directions:Point[], region:Region, checkSolid:Function):Point[]{
        let shortest:number = Number.MAX_VALUE;
        let path:Point[] = [];

        for(let s of start){
            let iterations:number = 0;
            for(let e of end){
                let temp:Point[] = AStar.getPath(s, e, directions, region, checkSolid);
                if(temp.length < shortest){
                    shortest = temp.length;
                    path = temp;
                    iterations = 0;
                    if(shortest < 4){
                        break;
                    }
                }
                else{
                    iterations += 1;
                    if(iterations > AStar.MAX_MULTI_TEST){
                        break;
                    }
                }
            }
            if(shortest < 4 || (shortest < Number.MAX_VALUE && iterations > AStar.MAX_MULTI_TEST)){
                break;
            }
        }
        return path;
    }
}

class EntityListParser{
    static parseList(line:string):Entity[]{
        if(line.trim() == "any"){
            return Engine.getAllEntities().concat([Engine.getEntity(-1)]);
        }
        let result:Entity[] = [];
        let eeParts:string[] = line.split("|");
        for(let e of eeParts){
            let nums:string[] = e.split(":");
            let times:number = 1;
            if(nums.length > 1){
                times = parseInt(nums[1]);
            }
            for(let i:number=0; i<times; i++){
                result.push(Engine.getEntity(nums[0].trim()));
            }
        }
        return result;
    }
}