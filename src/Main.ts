/// <reference path="core/Marahel.ts"/>

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
        "player":{"color": "0xff0000", "min":"1", "max":"1"}
    },
    "neighborhood": {
  	    "all":"111,121,111",
        "plus":"010,121,010"
    },
    "rule": [
  	    {
            "type":"automata",
            "region":{"name":"map"},
            "parameters": {"iterations":1},
            "rules":["self(any)==1 -> self(solid)"]
        },
        {
            "type":"automata",
            "region":{"name":"all", "border":"1,2"},
            "parameters": {"iterations":1},
            "rules":["self(any)==1 -> self(empty:2|solid)"]
        },
        {
            "type":"automata",
            "region":{"name":"all"},
            "parameters": {"iterations":2},
            "rules":["self(solid)==1, all(empty)>5 -> self(empty)", "self(empty)==1, all(solid)>5 -> self(solid)"]
        },
        {
            "type":"automata",
            "region":{"name":"0"},
            "parameters": {"iterations":1},
            "rules":["all(empty)>=6, random < 0.05 -> self(player)"]
        }
    ]
};
Marahel.initialize(data);
let generatedMap:number[][] = Marahel.generate(Marahel.INDEX_OUTPUT);
let result = "";
for(let y:number=0; y<generatedMap.length; y++){
    for(let x:number=0; x<generatedMap[y].length; x++){
        result += generatedMap[y][x];
    }
    result += "\n";
}
console.log(result);