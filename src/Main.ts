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
            "type":"automata",
            "region":{"name":"all", "border":"1,2"},
            "parameters": {"iterations":"1"},
            "rules":["self(any) -> self(empty:2|solid)"]
        },
        {
            "type":"automata",
            "region":{"name":"map"},
            "parameters": {"iterations":"10"},
            "rules":["self(empty), all(solid)>6 -> self(solid)", "self(solid), all(empty)>5 -> self(empty)"]
        },
        {
            "type":"connector",
            "region":{"name":"map"},
            "parameters":{"type":"full", "neighborhood":"plus", "entities":"empty"},
            "rules":["self(solid)->self(empty)"]
        }
    ]
};
Marahel.initialize(data);
let generatedMap:number[][] = Marahel.generate(Marahel.INDEX_OUTPUT);
Marahel.printIndexMap(generatedMap);
