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
//         "number":"7",
//         "parameters":{
//             "min":"10x10",
//             "max":"20x20"
//         }
//     },
//     "entity": {
//         "empty":{"color": "0xffffff"}, 
//         "solid":{"color": "0x000000"},
//         "player":{"color": "0xff0000", "min":"0", "max":"1"}
//     },
//     "neighborhood": {
//   	    "all":"111,131,111",
//         "plus":"010,121,010"
//     },
//     "rule": [
//   	    {
//             "type":"automata",
//             "region":{"name":"map"},
//             "parameters": {"iterations":"1"},
//             "rules":["self(any) -> self(solid)"]
//         },
//         {
//             "type":"automata",
//             "region":{"name":"all", "border":"1,1"},
//             "parameters": {"iterations":"1"},
//             "rules":["self(any) -> self(solid:1|empty:2)"]
//         },
//         {
//             "type":"automata",
//             "region":{"name":"all"},
//             "parameters": {"iterations":"2"},
//             "rules":["self(empty),all(solid)>6 -> self(solid)", "self(solid),all(empty)>5 -> self(empty)"]
//         },
//         {
//             "type":"connector",
//             "region":{"name":"map"},
//             "parameters":{"type":"short", "neighborhood":"plus", "entities":"empty"},
//             "rules":["self(solid)->self(empty)"]
//         }
//     ]
// };

// Marahel.initialize(data);
// Marahel.generate();

// let colorMap: number[][] = Marahel.marahelEngine.currentMap.getColorMap();
// let indexMap: number[][] = Marahel.marahelEngine.currentMap.getIndexMap();
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