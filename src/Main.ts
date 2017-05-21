/// <reference path="core/Marahel.ts"/>

let fs = require("fs");
let savePixels = require("save-pixels");
let zeros = require("zeros");

let data:any = {
    "metadata": {
        "min":"30x30",
        "max":"40x40"
    },
    "region": {
        "type":"bsp",
        "number":"7",
        "parameters":{
            "min":"8x8",
            "max":"15x15"
        }
    },
    "entity": {
        "empty":{"color": "0xffffff"}, 
        "solid":{"color": "0x000000"},
        "player":{"color": "0xff0000", "min":"0", "max":"1"}
    },
    "neighborhood": {
  	    "all":"111,131,111",
        "plus":"010,121,010"
    },
    "rule": [
  	    {
            "type":"automata",
            "region":{"name":"map"},
            "parameters": {"iterations":"1"},
            "rules":["self(any) -> self(solid)"]
        },
        {
            "type":"agent",
            "region":{"name":"map", "border":"1,2"},
            "parameters": {"number":"1,3", "change":"10,15", "lifespan":"80,150"},
            "rules":["self(any), random < 0.7 -> self(empty)", "self(any) -> all(empty)"]
        },
        {
            "type":"automata",
            "region":{"name":"map", "border":"1,2"},
            "parameters":{"iterations":"1"},
            "rules":["self(solid), random<0.2->self(empty)"]
        },
        {
            "type":"automata",
            "region":{"name":"map", "border":"1,2"},
            "parameters":{"iterations":"10"},
            "rules":["self(solid), all(empty)>5->self(empty)", "self(empty),all(solid)>5->self(solid)"]
        },
        {
            "type":"connector",
            "region":{"name":"map"},
            "parameters":{"neighborhood":"plus", "entities": "empty", "type":"full"},
            "rules":["self(any)->self(empty)"]
        },
        {
            "type":"automata",
            "region":{"name":"map", "border":"1,2"},
            "parameters":{"iterations":"10"},
            "rules":["self(empty), plus(empty)==1->self(solid)"]
        }
    ]
};
Marahel.initialize(data);
Marahel.generate();
let colorMap:number[][] = Marahel.currentMap.getColorMap();
let indexMap:number[][] = Marahel.currentMap.getIndexMap();
Marahel.printIndexMap(indexMap);

let picture = zeros([colorMap[0].length, colorMap.length]);
for(let y:number=0; y<colorMap.length; y++){
    for(let x:number=0; x<colorMap[y].length; x++){
        picture.set(x, y, colorMap[y][x])
    }
}

savePixels(picture, "png").pipe(fs.createWriteStream("out.png"))