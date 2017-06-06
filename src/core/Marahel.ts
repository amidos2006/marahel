/// <reference path="data/Map.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
/// <reference path="regionDivider/AdjustmentDivider.ts"/>
/// <reference path="regionDivider/BinaryDivider.ts"/>
/// <reference path="regionDivider/DiggerDivider.ts"/>
/// <reference path="regionDivider/EqualDivider.ts"/>
/// <reference path="operator/OperatorInterface.ts"/>
/// <reference path="operator/LargerEqualOperator.ts"/>
/// <reference path="operator/LessEqualOperator.ts"/>
/// <reference path="operator/LargerOperator.ts"/>
/// <reference path="operator/LessOperator.ts"/>
/// <reference path="operator/EqualOperator.ts"/>
/// <reference path="operator/NotEqualOperator.ts"/>
/// <reference path="estimator/NeighborhoodEstimator.ts"/>
/// <reference path="estimator/NumberEstimator.ts"/>
/// <reference path="estimator/DistanceEstimator.ts"/>
/// <reference path="estimator/EstimatorInterface.ts"/>
/// <reference path="generator/AutomataGenerator.ts"/>
/// <reference path="generator/AgentGenerator.ts"/>
/// <reference path="generator/ConnectorGenerator.ts"/>
/// <reference path="utils/Prando.ts"/>
/// <reference path="utils/Noise.ts"/>

class Marahel{
    public static MAX_TRIALS:number = 10;

    public static currentMap:Map;

    static initialize(data:any):void{
        Engine.initialize(data);
    }

    static generate(outputType?:number, seed?:number):any[][]{
        return Engine.generate(outputType, seed);
    }

    static printIndexMap(generatedMap:number[][]){
        let result = "";
        for(let y:number=0; y<generatedMap.length; y++){
            for(let x:number=0; x<generatedMap[y].length; x++){
                result += generatedMap[y][x];
            }
            result += "\n";
        }
        console.log(result);
    }
}