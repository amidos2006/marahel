class Entity{
    name:string;
    color:number;
    minValue:number;
    maxValue:number;

    constructor(name:string, parameters:any){
        this.name = name;
        this.color = parameters["color"];
        this.minValue = parameters["min"];
        this.maxValue = parameters["max"];
    }
}