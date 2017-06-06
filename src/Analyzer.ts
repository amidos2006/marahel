// /// <reference path="core/Marahel.ts"/>

// let fs = require("fs");
// let savePixels = require("save-pixels");
// let zeros = require("zeros");

// let filename:string = "equal";

// fs.readFile(filename + ".txt", {encoding: "utf8"}, function read(err, data){
//     console.log(data);
//     let lines:string[] = data.split("\n");
//     let values:Point[] = [];
//     for(let l of lines){
//         if(l.trim().length == 0){
//             continue;
//         }
//         let parts:string[] = l.split(",");
//         values.push(new Point(parseFloat(parts[0]), parseFloat(parts[1])));
//     }
//     saveHeatMap(values)
// });

// let result:string = "";

// fs.readFile("equal.txt", {encoding: "utf8"}, function read(err, data){
//     console.log(data);
//     let lines:string[] = data.split("\n");
//     for(let l of lines){
//         if(l.trim().length == 0){
//             continue;
//         }
//         let parts:string[] = l.split(",");
//         result += parts[2] + ",";
//     }
//     result += "\n";
//     fs.readFile("bsp.txt", {encoding: "utf8"}, function read(err, data){
//         console.log(data);
//         let lines:string[] = data.split("\n");
//         for(let l of lines){
//             if(l.trim().length == 0){
//                 continue;
//             }
//             let parts:string[] = l.split(",");
//             result += parts[2] + ",";
//         }
//         result += "\n";
//         fs.readFile("digger.txt", {encoding: "utf8"}, function read(err, data){
//             console.log(data);
//             let lines:string[] = data.split("\n");
//             for(let l of lines){
//                 if(l.trim().length == 0){
//                     continue;
//                 }
//                 let parts:string[] = l.split(",");
//                 result += parts[2] + ",";
//             }
//             result += "\n";
//             fs.readFile("cave.txt", {encoding: "utf8"}, function read(err, data){
//                 console.log(data);
//                 let lines:string[] = data.split("\n");
//                 for(let l of lines){
//                     if(l.trim().length == 0){
//                         continue;
//                     }
//                     let parts:string[] = l.split(",");
//                     result += parts[2] + ",";
//                 }
//                 result += "\n";
//                 fs.readFile("mine.txt", {encoding: "utf8"}, function read(err, data){
//                     console.log(data);
//                     let lines:string[] = data.split("\n");
//                     for(let l of lines){
//                         if(l.trim().length == 0){
//                             continue;
//                         }
//                         let parts:string[] = l.split(",");
//                         result += parts[2] + ",";
//                     }
//                     result += "\n";
//                     let out = fs.createWriteStream("total.csv");
//                     out.write(result);
//                     out.end();
//                     console.log("End :D")
//                 });
//             });
//         });
//     });
// });

// function saveHeatMap(values:Point[]){
//     let colorMap: number[][] = [];
//     for(let i:number=0; i<100; i++){
//         colorMap.push([]);
//         for(let j:number=0; j<100; j++){
//             colorMap[i].push(0);
//         }
//     }

//     for(let i:number=0; i<values.length; i++){
//         let x:number = Math.floor(values[i].x/25);
//         // x = Math.floor(100 * Math.log(x)/(2 * Math.log(100)));
//         let y:number = colorMap.length - Math.floor(values[i].y);
//         // y = Math.floor(100 * Math.log(y)/(2 * Math.log(100)));
//         colorMap[y][x] += 1;
//     }

//     let max:number = 0;
//     for(let i:number=0; i<colorMap.length; i++){
//         for(let j:number=0; j<colorMap[i].length; j++){
//             if(colorMap[i][j] > max){
//                 max = colorMap[i][j];
//             }
//         }
//     }
    
//     for(let i:number=0; i<colorMap.length; i++){
//         for(let j:number=0; j<colorMap[i].length; j++){
//             colorMap[i][j] = Math.floor((colorMap[i][j] / max) * 255);
//         }
//     }

//     let picture = zeros([colorMap[0].length, colorMap.length]);
//     for (let y: number = 0; y < colorMap.length; y++) {
//         for (let x: number = 0; x < colorMap[y].length; x++) {
//             picture.set(x, y, colorMap[y][x])
//         }
//     }

//     savePixels(picture, "png").pipe(fs.createWriteStream(filename + ".png"));
//     console.log("Done");
// }
