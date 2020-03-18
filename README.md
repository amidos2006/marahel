# Marahel
Marahel (ProcEngine 2.0) is a step toward having a constructive language that can be used to describe different map generation techniques. This framework uses Prando (https://www.npmjs.com/package/prando) for random number generation and Noise! (https://github.com/josephg/noisejs) for 2D perlin noise generation.

Fore more technical details check the framework's paper: http://www.akhalifa.com/marahel/Khalifa2017Marahel.pdf

## How to use?
The library is made using TypeScript and compiled to ES5 code to be able to use it in any of your javascript projects. You have to do the following steps:
- **Step 1:** Download the compiled version of the library from the following link (https://github.com/amidos2006/Marahel/blob/master/bin/Marahel.js).
- **Step 2:** Import the downloaded library using the most suitable way import script in your index.html or use require in your node.js
- **Step 3:** Write your generator using either the online application or by yourself using the following guide then copy that generated code from the online application to your final code.
- **Step 4:** Use the following code to generate a new string map based on your generator definition in the `data` object.
```javascript
Marahel.initialize(data);
let map:string[][] = Marahel.generate();
```