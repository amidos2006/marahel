/// <reference path="../src/core/Marahel.ts"/>

let fs = require("fs");
let savePixels = require("save-pixels");
let zeros = require("zeros");

let data:any = {
    "metadata": {
        "minDimension":"50x50",
        "maxDimension":"50x50"
    },
    "regions": {
        "type":"bsp",
        "number":"4",
        "parameters":{
            "min":"20x20",
            "max":"30x30"
        }
    },
    "entities": {
        "empty":{"color": "0xffffff"}, 
        "solid":{"color": "0x000000"},
        "player":{"color": "0xff0000", "min":"0", "max":"1"}
    },
    "neighborhoods": {
  	    "all":"111,131,111"
    },
    "explorers": [
  	    {
            "type":"sequential",
            "region":{"name":"map"},
            "parameters": {"iterations":"1"},
            "rules":["self(any) -> self(solid)"]
        },
        {
            "type":"sequential",
            "region":{"name":"all", "border":"1,1"},
            "parameters": {"iterations":"1"},
            "rules":["self(any) -> self(solid:1|empty:2)"]
        },
        {
            "type":"sequential",
            "region":{"name":"all"},
            "parameters": {"iterations":"2"},
            "rules":["self(empty),all(solid)>6 -> self(solid)", "self(solid),all(empty)>5 -> self(empty)"]
        },
        {
            "type":"connector",
            "region":{"name":"map"},
            "parameters":{"type":"short", "neighborhood":"plus", "entities":"empty"},
            "rules":["self(solid)->self(empty)"]
        }
    ]
};

Marahel.initialize(data);
Marahel.generate();

let colorMap: number[][] = Marahel.marahelEngine.currentMap.getColorMap();
let indexMap: number[][] = Marahel.marahelEngine.currentMap.getIndexMap();
Marahel.printIndexMap(indexMap);

let picture = zeros([colorMap[0].length, colorMap.length, 3]);
for (let y: number = 0; y < colorMap.length; y++) {
    for (let x: number = 0; x < colorMap[y].length; x++) {
        picture.set(x, y, 0, colorMap[y][x]>>16);
        picture.set(x, y, 1, colorMap[y][x]>>8 & 0xff);
        picture.set(x, y, 2, colorMap[y][x] & 0xff);
    }
}

savePixels(picture, "png").pipe(fs.createWriteStream("bin/out.png"));