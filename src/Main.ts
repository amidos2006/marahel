/// <reference path="core/regionDivider/DiggerDivider.ts"/>
/// <reference path="core/data/Rule.ts"/>

let parameters = {"max":"30x30", "min":"15x15", "probDir":"0.02", "probSpawn":"0.05", "allowIntersection":"false"};
let r = new Rule(["all(solid) > 5 -> self(empty)"]);
console.log(r);
console.log(new DiggerDivider(20, parameters).getRegions(new Region(0, 0, 103, 103)));