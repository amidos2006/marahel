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
            "parameters": {"number":"1,5", "change":"10,15", "lifespan":"100,200", "directions":"plus"},
            "rules":["self(any), random<0.9 -> self(empty)", "self(any) -> all(empty)"]
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