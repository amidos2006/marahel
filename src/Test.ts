// /// <reference path="core/Marahel.ts"/>

// let fs = require("fs");
// let savePixels = require("save-pixels");
// let zeros = require("zeros");

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

// Marahel.initialize(data);
// Marahel.generate();

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