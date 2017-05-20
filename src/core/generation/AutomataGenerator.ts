/// <reference path="Generator.ts"/>

class AutomataGenerator extends Generator{
    private numIterations:number;

    constructor(currentRegion:string, replacingType:string, borderType:string, map:Region, regions:Region[], rules:string[], parameters:any){
        super(currentRegion, map, regions, rules);

    }

    applyGeneration(): void {
        throw new Error("Method not implemented.");
    }
}