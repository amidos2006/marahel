/// <reference path="../core/Marahel.ts"/>

let fs = require("fs");
let savePixels = require("save-pixels");
let zeros = require("zeros");

let data:any = {
    "metadata": {
        "min":"50x50",
        "max":"50x50"
    },
    "regions": {
        "type":"sampling",
        "number":"4",
        "parameters":{
            "min":"20x20",
            "max":"30x30"
        }
    },
    "entities": ["empty", "solid"],
    "neighborhoods": {
  	    "all":"111,131,111"
    },
    "explorers": [
  	    {
            "type":"horizontal",
            "region": "map",
            "rules":[
                "self(any) -> self(solid)"
            ]
        },
        {
            "type":"horizontal",
            "region":"all",
            "rules":[
                "self(any),left(out)==0,right(out)==0,up(out)==0,down(out)==0 -> self(solid:1|empty:2)"
            ]
        },
        {
            "type": "horizontal",
            "region": "all",
            "parameters": { 
                "repeats": "2" 
            },
            "rules": [
                "self(empty),all(solid)>6 -> self(solid)",
                "self(solid),all(empty)>5 -> self(empty)"
            ]
        },
        {
            "type": "connect",
            "region": "map",
            "parameters": { 
                "neighborhood": "plus", 
                "entities": "empty" 
            },
            "rules": [
                "self(solid)->self(empty)"
            ]
        }
    ]
};

Marahel.initialize(data);
let indexMap: number[][] = Marahel.generate(true);
Marahel.printIndexMap(indexMap);

let colorMap = [0xFFFFFF, 0x000000];
let picture = zeros([indexMap[0].length, indexMap.length, 3]);
for (let y: number = 0; y < indexMap.length; y++) {
    for (let x: number = 0; x < indexMap[y].length; x++) {
        let color = colorMap[indexMap[y][x]];
        picture.set(x, y, 0, color>>16);
        picture.set(x, y, 1, color>>8 & 0xff);
        picture.set(x, y, 2, color & 0xff);
    }
}
savePixels(picture, "png").pipe(fs.createWriteStream("bin/out.png"));