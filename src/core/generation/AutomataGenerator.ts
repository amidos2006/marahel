/// <reference path="Generator.ts"/>

class AutomataGenerator extends Generator{
    private numIterations:number;

    constructor(currentRegion:any, map:Region, regions:Region[], rules:string[], parameters:any){
        super(currentRegion, map, regions, rules);

    }

    applyGeneration(): void {
        super.applyGeneration();
    }
}