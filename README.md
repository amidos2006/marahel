<p align="center">
	<img height="200px" src="logo.png"/>
</p>

<h1 align="center">
	Marahel
</h1>

<p align="center">
  <b>Current Framework Version: 0.3.0</b>
</p>

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
if you want to generate a number map based on the index of entities use the following code instead:
```javascript
Marahel.initialize(data);
let map:string[][] = Marahel.generate(true);
```
if you want to seed the generation with certain seed so you can get the same generation use the following code where `seed` is an integer number that reflect the used seed:
```javascript
Marahel.initialize(data);
let map:string[][] = Marahel.generate(true, seed);
```

## Marahel Language
The marahel script consists of 5 different areas described in the following subsections. Feel free to check the examples found here and in the online interface to understand more about each section and parameters.

### Metadata
This section contains information about the generation process of the map such as the map width and height. The following show an example of `metadata` section definition.
```
"metadata": {
    "min": "20x20",
    "max": "40x40"
}
```
The map dimension is being picked random between `min` and `max` dimensions.

### Regions
This section is used to define a PCG algorithm that will divide the map into several regions using a certain algorithm. If you don't care about his division feel free to omit this section from the script file. The following show an example of a bsp algorithm used to divide the map into 5 regions where each region is not less than 10x10 but no bigger than 30x30.
```
"regions": {
    "type": "bsp",
    "number": "5",
    "parameters": {
        "min": "10x10",
        "max": "30x30"
    }
}
```
The following is a list of all the different types of the region divider supported by the current framework version. All the dividers have the same parameter set as thre previous example.
- `equal`: divide the map into equal size rooms based on the `min` and `max` value where `min` is the minimum number of divisions in x and y and `max` is the maximum number of divisions. After the division happens the system will pick a group of random regions equal to the defined `number`.
- `bsp`: uses bsp to divide the map such as no room is smaller than `min` and no room is larger than `max`. It then select a `number` of rooms randomly based on that.
- `sampling`: sample the `number` of regions in the map with dimensions between `min` and `max`. Then the system will try several `trials` (integer number defined in the parameters object) till it make sure that none of the regions collides. You don't need to define the `trails` as they are autocalculated using the other parameters but feel free to override it.

### Entities
The entities is an array of names of all the possible entities that can appear in the generated level. The indeces that appear in the generated map is corresponding to index in that array. The system have some predefined entities such as:
- `unknown`: it is the value that the map is initialized with when it starts.
- `out`: it means that the value is being accessed is outside of the region/map bounds
- `any`: it means it doesn't matter what value is their (can be any of the entities or unknwon)
- `entity`: it means it has to be one of the defined entities

### Neighborhoods
The neighborhoods are a 2D matrix that can be used to check local surrounding or define certain location with respect to others. For example a 3x3 matrix of 1s with the center is 1,1 refer that this neighborhood is pointing to all the surrounding location. The following example show some neighborhood examples:
```
"neighborhoods":{
    "plus": "010,131,010",
    "nocenter": "111,121,111",
    "notsquare": "1001,1201,1001",
    "shift": "31,11"
}
```
As seen the matrix is written as a string where each `,` means a new row and while the values defines the columns in the row. a `0` means that location is not being checked while a `1` means that location is being checked. Every matrix will have a either one `2` or `3` value in it, that location define the center of the matrix for relative locations. `2` means that location is the center and don't need to be checked, while `3` means that location is the center and also need to be checked.

You usually need to define neighborhoods but the framework come with a group of predefined ones which make the definition of the section optional. The following neighborhoods are the predefined ones that you can use directly.
- `self`: only checks the current location - `000,030,000`
- `all`: checks all the locations in a 3x3 grid around the location - `111,131,111`
- `plus`: checks the cardinal locations in a 3x3 grid around the location - `010,131,010`
- `left`: checks the left position to your current location - `000,120,000`
- `right`: checks the right position to your current location - `000,021,000`
- `up`: checks the up position to your current location - `010,020,000`
- `down`: checks the up position to your current location - `000,020,010`
- `horz`: checks the left and right position of your current location - `000,121,000`
- `vert`: checks the up and down position of your current location - `010,020,010`

### Explorers
Explorers is the core of the generation process. Explorers modify the map by visiting several tiles of the map and modifying the visited tiles based on certain rules. The explorers section is an array of explorer objects that will be applied after each other. Each object have `type`, the current applied `region`, a group of specific `parameters`, and the applied `rules`. The explorers have 3 main types (`narrow`, `turtle`, and `wide`) similar to the same types defined in [PCGRL paper](https://arxiv.org/abs/2001.09212).

For the region it can be any of the following:
- `map`: apply to the full map
- `all`: apply to every possible region
- `0,1,2,...`: a comma separated list of numbers that define which regions to be applied to

For the rules it consists of two parts: conditions and executers. Conditions are a comma separated list of compared estimators that is true if all the condition are true and false otherwise. Executers are responsible to modify the map.

A condition is consists of either a single estimator or two estimator and an operator. An estimator get applied at the current map location and return a number, while the operator compare the two estimators and return a boolean value. The system have several different estimators, here is a list of all of them:
- `dist(entityname/s)`: the minimum manhattan distance to a certain entity/entities
- `neighborhoodname(entityname/s)`: the number of entity defined by entityname(s) that also are identified by the neigbhorhoodname.
- `entityname`: the number of times this entity exist in the current region
- `number`: a fixed number
- `random`: a random number between 0 and 1
- `noise`: a random noise value between 0 and 1
- `percent`: the percentage of completion of the map modification
- `cpercent`: the percentage of changes of the map
- `rpercent`: the percentage of completion if the explorer is being repeated more than once

The operator can be one of the following:
- `>`: the left estimator is greater than the right estimator
- `<`: the left estimator is less than the right estimator
- `>=`: the left estimator is greater than or equal to the right estimator
- `<=`: the left estimator is less than or equal to the right estimator
- `==`: the left estimator is equal to the right estimator
- `!=`: the left estimator is not equal to the right estimator

An executer is pretty simple and can be defined as `neighborhoodname(entityname/s)`. The system will pick an entity from the defined entities in the list and apply it to every signle location have `1` or `3` in the neighborhood used. For example: `self(solid)` will place in the current location a solid entity.

To define `entityname/s` list: you just need to write the name of entities seprated by `|` symbol. The list of entities means different things between the executer and conditions. For conditions, they mean that all of these need to be checked in the condition, while in the executer it means only one has to be selected. Don't worry if you want to give something more chance to be selected, you can either repeat it (`solid|solid|empty`: means solid can be selected twice as much as empty) or you can use numbers to mean that entity have more weight (`solid:2|empty:1` have the same meaning as before).

Here is a list of some of the common parameters that can appear in the `parameter` section:
- `replace`: replace in the same buffer or a back buffer and filp after each repeat (default `same` but can also be `buffer`)
- `out`: handle the out values as a certain entity.
- `repeats`: the number of times that the explorer will be repeated (default is 1)
- `tiles`: the number of tiles that is maximum visited (default equal to the current region area)
- `changes`: the maximum number of changed tiles (default equal to the area of the current region)

Here is the main features and parameters for each main type:
- `narrow`: The system control the next visited tile based on outside factor such as horizontal movement line by line (`narrow_horz`) or vertical (`narrow_vert`) or just pick random locations (`narrow_rnd`).
- `turtle`: The agent control its location with resepct to its current location either using random changes (`narrow_drunk`), using an estimator function (`turtle_heur`), or to connect disjoint sets (`turtle_connect`). The default relative locations are cardinal directions including the same location. You can change the relative locations by changing `directions` parameter to any defined neighborhood.
- `wide`: The agent controls its next location by selecting any location it wants based on an estimator function (`wide_heur`) or random (`wide_rand`) or any other factor. The difference is in that technique each tile is gonna be visited once based on the input choice.

Here is a list of all different explorers types that are derivative of the 3 basic types:
- `narrow_horz`|`narrow`|`horz`|`horizontal`: visit every single tile in sequential order line by line
- `narrow_vert`: visit every single tile in sequential order column by column
- `narrow_rand`: visit tiles randomly in the map (the same tile can be revisited more than once)
- `turtle_drunk`: the agent visit tiles in a straight line and have a chance to change direction. Similar to the digger agent. To change the chance percentage modify the `change` parameter to any value (default is `0.1` which is 10% percentage to change direction)
- `turtle_heur`: the agent control its next relative location using a comma separated estimators. You can change them by modifying `heuristics` in the parameters. The system will use the first estimator to sort the locations followed by the second estimator if they are equal and so on.
- `turtle_connect`: the agent controls its next relative location based on the next unconnected area. To change what type of entities to check connectivity, modify the `entities` paramters.
- `wide_heur`: the agent order all the tiles based on the input estimators that can be modified by modifying `heuristics` in the parameters.
- `wide_rand`: the agent order all the tiles based on picked random values (similar to `narrow_rand` but there is no chance it will revisit the same tile again).