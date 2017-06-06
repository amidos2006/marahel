// /// <reference path="core/Marahel.ts"/>

// let fs = require("fs");
// let savePixels = require("save-pixels");
// let zeros = require("zeros");

// function floodFill(x: number, y: number, label: number, labelBoard: number[][], region: Region, neighbor: Neighborhood, entity: Entity): void {
//     if (labelBoard[y][x] != -1) {
//         return;
//     }
//     labelBoard[y][x] = label;
//     let neighborLocations: Point[] = neighbor.getNeighbors(x, y, region);
//     for (let p of neighborLocations) {
//         if (region.getValue(p.x, p.y) == Marahel.getEntityIndex(entity.name)) {
//             floodFill(p.x, p.y, label, labelBoard, region, neighbor, entity);
//         }
//     }
// }
// function getUnconnectedGroups(region: Region, entity: Entity): Group[] {
//     let label: number = 0;
//     let labelBoard: number[][] = [];
//     for (let y: number = 0; y < region.getHeight(); y++) {
//         labelBoard.push([]);
//         for (let x: number = 0; x < region.getWidth(); x++) {
//             labelBoard[y].push(-1);
//         }
//     }
//     for (let y: number = 0; y < region.getHeight(); y++) {
//         for (let x: number = 0; x < region.getWidth(); x++) {
//             if (labelBoard[y][x] == -1) {
//                 if (region.getValue(x, y) == Marahel.getEntityIndex(entity.name)) {
//                     floodFill(x, y, label, labelBoard, region, Marahel.getNeighborhood("plus"), entity);
//                     label += 1;
//                     break;
//                 }

//             }
//         }
//     }
//     let groups: Group[] = [];
//     for (let i: number = 0; i < label; i++) {
//         groups.push(new Group());
//         groups[i].index = i;
//     }
//     for (let y: number = 0; y < region.getHeight(); y++) {
//         for (let x: number = 0; x < region.getWidth(); x++) {
//             if (labelBoard[y][x] != -1) {
//                 groups[labelBoard[y][x]].addPoint(x, y);
//             }
//         }
//     }
//     return groups;
// }

// function getGroupValue(map:Map):Point{
//     let result:Point = new Point();

//     Marahel.currentMap = map;
//     result.x = getUnconnectedGroups(new Region(0, 0, map.width, map.height), Marahel.getEntity("solid")).length;
//     result.y = getUnconnectedGroups(new Region(0, 0, map.width, map.height), Marahel.getEntity("empty")).length;

//     return result;
// }

// function getNumberOpen(map:Region):number{
//     let result:number=0;
//     for(let x:number=0; x<map.getWidth(); x++){
//         for(let y:number=0; y<map.getHeight(); y++){
//             if(map.getValue(x, y) == Marahel.getEntityIndex("empty")){
//                 result += 1;
//             }
//         }
//     }
//     return result;
// }

// let data:any = {
//     "metadata": {
//         "min":"50x50",
//         "max":"50x50"
//     },
//     "region": {
//         "type":"bsp",
//         "number":"1",
//         "parameters":{
//             "min":"31x64",
//             "max":"80x36"
//         }
//     },
//     "entity": {
//         "empty":{"color": "0xffffff"}, 
//         "solid":{"color": "0x000000"},
//         "player":{"color": "0x40963c", "min":"1", "max":"1"},
//         "treasure":{"color": "0xf4d442", "min":"5", "max":"10"},
//         "enemy":{"color": "0xd85050", "min":"10", "max":"15"}
//     },
//     "neighborhood": {
//   	    "all":"111,131,111",
//         "plus":"010,121,010",
//         "vert":"1,2,1",
//         "horz":"121"
//     },
//     "rule": [
//   	    {
//               "region":{"name":"map", "border":"6,6"}, 
//               "type":"connector", 
//               "parameters":{"type":"full", "neighborhood":"all", "entities":"solid"}, 
//               "rules":["noise != complete, noise != vert(empty) -> vert(empty:6|empty:2)", "3 > complete -> plus(empty:1|solid:4)", "random < noise, complete != 4 -> all(empty:8|solid:4)", "complete >= complete, random != noise, vert(solid) <= complete -> all(solid)"]
//         }
//     ]
// };

// let maps: Map[] = [];

// Marahel.initialize(data);
// for (let i: number = 0; i < 1; i++) {
//     console.log("Generating " + i)
//     Marahel.generate();
//     maps.push(Marahel.currentMap);
//     console.log("Finished " + i);
// }

// let values: Point[] = [];
// let entropy:number[] = [];
// for (let i: number = 0; i < maps.length; i++) {
//     console.log("Analyzing " + i);
//     let temp = getGroupValue(maps[i]);
//     values.push(new Point(getNumberOpen(new Region(0,0, maps[i].width, maps[i].height)), temp.x + temp.y));
//     let tempProbability:number[] = [];
//     for(let x:number=0; x<maps[i].width; x+=10){
//         for(let y:number=0; y<maps[i].height; y+=10){
//             tempProbability.push(getNumberOpen(new Region(x,y, 10, 10))/100);
//         }
//     }
//     let tempEntropy:number = 0;
//     for(let p of tempProbability){
//         if(p == 0 || p == 1){
//             tempEntropy = 0;
//         }
//         else{
//             tempEntropy += - p * Math.log(p)/Math.log(2) - p * Math.log(p)/Math.log(2);
//         }
//     }
//     entropy.push(tempEntropy/tempProbability.length);
//     console.log("Finished " + i);
// }

// let maxValue:Point = new Point(0, 0)
// for(let i:number=0; i<values.length; i++){
//     if(maxValue.x < values[i].x){
//         maxValue.x = values[i].x;
//     }
//     if(maxValue.y < values[i].y){
//         maxValue.y = values[i].y;
//     }
// }

// console.log(maxValue);

// let out = fs.createWriteStream("mine.txt");
// for(let i:number=0; i<values.length; i++){
//     console.log("Writing " + i);
//     out.write(values[i].x + "," + values[i].y + "," + entropy[i] + "\n");
// }
// out.end();

// console.log("Done.");
// // let image: number[][] = [];
// // for(let i:number=0; i<51; i++){
// //     image.push([]);
// //     for(let j:number=0; j<51; j++){
// //         image[i].push(0);
// //     }
// // }

// // for(let i:number=0; i<values.length; i++){
// //     image[values[i].x][values[i].y] += 1;
// // }

// let colorMap: number[][] = Marahel.currentMap.getColorMap();
// let indexMap: number[][] = Marahel.currentMap.getIndexMap();
// Marahel.printIndexMap(indexMap);

// let picture = zeros([colorMap[0].length, colorMap.length, 3]);
// for (let y: number = 0; y < colorMap.length; y++) {
//     for (let x: number = 0; x < colorMap[y].length; x++) {
//         picture.set(x, y, 0, colorMap[y][x]>>16);
//         picture.set(x, y, 1, colorMap[y][x]>>8 & 0xff);
//         picture.set(x, y, 2, colorMap[y][x] & 0xff);
//     }
// }

// savePixels(picture, "png").pipe(fs.createWriteStream("out.png"));