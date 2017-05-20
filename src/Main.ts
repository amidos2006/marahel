/// <reference path="core/regionDivider/DiggerDivider.ts"/>
/// <reference path="core/data/Rule.ts"/>
/// <reference path="core/data/Point.ts"/>
/// <reference path="core/utils/AStar.ts"/>

// let parameters = {"max":"30x30", "min":"15x15", "probDir":"0.02", "probSpawn":"0.05", "allowIntersection":"false"};
// let r = new Rule(["all(solid) > 5 -> self(empty)"]);
// console.log(r);
// console.log(new DiggerDivider(20, parameters).getRegions(new Region(0, 0, 103, 103)));
console.log(AStar.getPath(new Point(0, 0), new Point(5, 5), [new Point(0, 1), new Point(1, 0)], (x:number, y:number):boolean=>{return false;}));