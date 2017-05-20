class Entity{
    name:string;
    color:number;
    minValue:number;
    maxValue:number;

    constructor(name:string, parameters:any){
        this.name = name;
        this.color = -1;
        if("color" in parameters){
            this.color = parameters["color"];
        }
        this.minValue = -1;
        if("min" in parameters){
            this.minValue = parameters["min"];
        }
        this.maxValue = -1;
        if("max" in parameters){
            this.maxValue = parameters["max"];
        }
    }
}