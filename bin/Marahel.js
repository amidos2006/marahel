var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// /// <reference path="core/Marahel.ts"/>
// let fs = require("fs");
// let savePixels = require("save-pixels");
// let zeros = require("zeros");
// let data:any = {
//     "metadata": {
//         "min":"50x50",
//         "max":"50x50"
//     },
//     "region": {
//         "type":"bsp",
//         "number":"7",
//         "parameters":{
//             "min":"10x10",
//             "max":"20x20"
//         }
//     },
//     "entity": {
//         "empty":{"color": "0xffffff"}, 
//         "solid":{"color": "0x000000"},
//         "player":{"color": "0xff0000", "min":"0", "max":"1"}
//     },
//     "neighborhood": {
//   	    "all":"111,131,111",
//         "plus":"010,121,010"
//     },
//     "rule": [
//   	    {
//             "type":"automata",
//             "region":{"name":"map"},
//             "parameters": {"iterations":"1"},
//             "rules":["self(any) -> self(solid)"]
//         },
//         {
//             "type":"automata",
//             "region":{"name":"all", "border":"1,1"},
//             "parameters": {"iterations":"1"},
//             "rules":["self(any) -> self(solid:1|empty:2)"]
//         },
//         {
//             "type":"automata",
//             "region":{"name":"all"},
//             "parameters": {"iterations":"2"},
//             "rules":["self(empty),all(solid)>6 -> self(solid)", "self(solid),all(empty)>5 -> self(empty)"]
//         },
//         {
//             "type":"connector",
//             "region":{"name":"map"},
//             "parameters":{"type":"short", "neighborhood":"plus", "entities":"empty"},
//             "rules":["self(solid)->self(empty)"]
//         }
//     ]
// };
// Marahel.initialize(data);
// Marahel.generate();
// let colorMap: number[][] = Marahel.marahelEngine.currentMap.getColorMap();
// let indexMap: number[][] = Marahel.marahelEngine.currentMap.getIndexMap();
// Marahel.printIndexMap(indexMap);
// let picture = zeros([colorMap[0].length, colorMap.length, 3]);
// for (let y: number = 0; y < colorMap.length; y++) {
//     for (let x: number = 0; x < colorMap[y].length; x++) {
//         picture.set(x, y, 0, colorMap[y][x]>>16);
//         picture.set(x, y, 1, colorMap[y][x]>>8 & 0xff);
//         picture.set(x, y, 2, colorMap[y][x] & 0xff);
//     }
// }
// savePixels(picture, "png").pipe(fs.createWriteStream("bin/out.png")); 
/**
 * Map class that represent the current generated map
 */
var MarahelMap = (function () {
    /**
     * constructor for the map class
     * @param width width of the map
     * @param height height of the map
     */
    function MarahelMap(width, height) {
        /**
         * dictionary of number of entities
         */
        this.numEntities = {};
        this.width = width;
        this.height = height;
        this.mapValues = [];
        this.backValues = [];
        for (var y = 0; y < height; y++) {
            this.mapValues.push([]);
            this.backValues.push([]);
            for (var x = 0; x < width; x++) {
                this.mapValues[y].push(-1);
                this.backValues[y].push(-1);
            }
        }
        this.numEntities["undefined"] = this.width * this.height;
        Marahel.marahelEngine.replacingType = MarahelMap.REPLACE_BACK;
    }
    /**
     * set a certain location with an entity index
     * @param x x position
     * @param y y position
     * @param value entity index
     */
    MarahelMap.prototype.setValue = function (x, y, value) {
        var e = Marahel.marahelEngine.getEntity(value);
        if (e.name in this.numEntities && e.maxValue > 0 && this.numEntities[e.name] >= e.maxValue) {
            return;
        }
        this.numEntities[Marahel.marahelEngine.getEntity(this.mapValues[y][x]).name] -= 1;
        if (!(e.name in this.numEntities)) {
            this.numEntities[e.name] = 0;
        }
        this.numEntities[e.name] += 1;
        if (Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_SAME) {
            this.mapValues[y][x] = value;
        }
        if (Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_BACK) {
            this.backValues[y][x] = value;
        }
    };
    /**
     * switch the two buffers
     */
    MarahelMap.prototype.switchBuffers = function () {
        if (Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_BACK) {
            var temp = this.mapValues;
            this.mapValues = this.backValues;
            this.backValues = temp;
            for (var y = 0; y < this.backValues.length; y++) {
                for (var x = 0; x < this.backValues[y].length; x++) {
                    this.backValues[y][x] = this.mapValues[y][x];
                }
            }
        }
    };
    /**
     * get a certain location
     * @param x x position
     * @param y y position
     * @return entity index in the defined location
     */
    MarahelMap.prototype.getValue = function (x, y) {
        return this.mapValues[y][x];
    };
    /**
     * check entity number constraints
     * @return true if all entity number constraints are satisfied and false otherwise
     */
    MarahelMap.prototype.checkNumConstraints = function () {
        var entities = Marahel.marahelEngine.getAllEntities();
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var e = entities_1[_i];
            if (this.getNumEntity(e.name) < e.minValue) {
                return false;
            }
        }
        return true;
    };
    /**
     * get number of a certain entity in the map
     * @param e entity name to check
     * @return number of a certain entity in the map
     */
    MarahelMap.prototype.getNumEntity = function (e) {
        if (e in this.numEntities) {
            return this.numEntities[e];
        }
        return 0;
    };
    /**
     * get the generated map inform of 2D matrix of entity names
     * @return 2D matrix of entity names
     */
    MarahelMap.prototype.getStringMap = function () {
        var result = [];
        for (var y = 0; y < this.mapValues.length; y++) {
            result.push([]);
            for (var x = 0; x < this.mapValues[y].length; x++) {
                result[y].push(Marahel.marahelEngine.getEntity(this.mapValues[y][x]).name);
            }
        }
        return result;
    };
    /**
     * get the generated map in form of 2D matrix of entity indexes
     * @return 2D matrix of entity indexes
     */
    MarahelMap.prototype.getIndexMap = function () {
        var result = [];
        for (var y = 0; y < this.mapValues.length; y++) {
            result.push([]);
            for (var x = 0; x < this.mapValues[y].length; x++) {
                result[y].push(this.mapValues[y][x]);
            }
        }
        return result;
    };
    /**
     * get the generated map in form of 2D matrix of colors
     * @return 2D matrix of entity colors
     */
    MarahelMap.prototype.getColorMap = function () {
        var result = [];
        for (var y = 0; y < this.mapValues.length; y++) {
            result.push([]);
            for (var x = 0; x < this.mapValues[y].length; x++) {
                result[y].push(Marahel.marahelEngine.getEntity(this.mapValues[y][x]).color);
            }
        }
        return result;
    };
    /**
     * string representation for the current map
     * @return string corresponding to the 2D matrix of indexes
     */
    MarahelMap.prototype.toString = function () {
        return this.mapValues.toString();
    };
    return MarahelMap;
}());
/**
 * static value to define same place replacing technique
 */
MarahelMap.REPLACE_SAME = 0;
/**
 * static value to define back buffer replacing technique
 */
MarahelMap.REPLACE_BACK = 1;
/**
 * Point class carries the x and y position of the point
 */
var Point = (function () {
    /**
     * Constructor for the point class
     * @param x input x position
     * @param y input y position
     */
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    /**
     * check if the input point equal to this point
     * @param p input point
     * @return true if p equals to this point and false otherwise
     */
    Point.prototype.equal = function (p) {
        return p.x == this.x && p.y == this.y;
    };
    /**
     *
     * @return string represent the information in the point class
     */
    Point.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
    return Point;
}());
/**
 * Entity class carry the information about a certain entity
 */
var Entity = (function () {
    /**
     * Constructor for the entity class
     * @param name entity name
     * @param parameters entity parameters such as color,
     *                   minimum number, and/or maximum number
     */
    function Entity(name, parameters) {
        this.name = name;
        this.color = -1;
        if ("color" in parameters) {
            this.color = parameters["color"];
        }
        this.minValue = -1;
        if ("min" in parameters) {
            this.minValue = parameters["min"];
        }
        this.maxValue = -1;
        if ("max" in parameters) {
            this.maxValue = parameters["max"];
        }
    }
    return Entity;
}());
/// <reference path="Engine.ts"/>
/**
 * the main interface for Marahel with the users
 */
var Marahel = (function () {
    function Marahel() {
    }
    /**
     * Get entity name from index value. Used if you are using INDEX_OUTPUT
     * @param index integer value corresponding to index in the map.
     * @return entity name corresponding to the index.
     *         returns "undefined" otherwise.
     */
    Marahel.getEntityName = function (index) {
        return Marahel.marahelEngine.getEntity(index).name;
    };
    /**
     * Initialize Marahel to a certain behavior.
     * Must be called before using Marahel to generate levels
     * @param data a JSON object that defines the behavior of Marahel
     *              check http://www.akhalifa.com/marahel/ for more details
     */
    Marahel.initialize = function (data) {
        Marahel.marahelEngine = new Engine();
        Marahel.marahelEngine.initialize(data);
    };
    /**
     * Generate a new map using the specified generator
     * @param outputType (optional) the representation of the output.
     *                   default is Marahel.STRING_OUTPUT.
     *                   either Marahel.STRING_OUTPUT, Marahel.COLOR_OUTPUT,
     *                   Marahel.INDEX_OUTPUT
     * @param seed (optional) the seed for the random number generator
     * @return the generated map in form of 2D matrix
     */
    Marahel.generate = function (outputType, seed) {
        if (!Marahel.marahelEngine) {
            throw new Error("Call initialize first.");
        }
        if (seed) {
            Random.changeSeed(seed);
        }
        for (var i = 0; i < Marahel.GENERATION_MAX_TRIALS; i++) {
            this.marahelEngine.generate();
            if (this.marahelEngine.currentMap.checkNumConstraints()) {
                break;
            }
        }
        if (outputType) {
            if (outputType == Marahel.COLOR_OUTPUT) {
                return this.marahelEngine.currentMap.getColorMap();
            }
            if (outputType == Marahel.INDEX_OUTPUT) {
                return this.marahelEngine.currentMap.getIndexMap();
            }
        }
        return this.marahelEngine.currentMap.getStringMap();
    };
    /**
     * print the index generate map in the console in a 2D array format
     * @param generatedMap the map required to be printed
     */
    Marahel.printIndexMap = function (generatedMap) {
        var result = "";
        for (var y = 0; y < generatedMap.length; y++) {
            for (var x = 0; x < generatedMap[y].length; x++) {
                result += generatedMap[y][x];
            }
            result += "\n";
        }
        console.log(result);
    };
    return Marahel;
}());
/**
 * defines the output maps as 2D matrix of strings
 */
Marahel.STRING_OUTPUT = 0;
/**
 * defines the output maps as 2D matrix of colors
 */
Marahel.COLOR_OUTPUT = 1;
/**
 * defines the output maps as 2D matrix of integers
 */
Marahel.INDEX_OUTPUT = 2;
/**
 * maximum number of generation trials before considering a
 * failure generation
 */
Marahel.GENERATION_MAX_TRIALS = 10;
/**
 * maximum number of combinations that A* will use before
 * considering finding the optimum
 */
Marahel.A_STAR_TRIALS = 1000;
/**
 * maximum number of trials for multiple A* restarts before
 * considering the current one is the best
 */
Marahel.A_STAR_MULTI_TEST_TRIALS = 10;
/**
 * maximum number of trials used by the connector algorithm
 */
Marahel.CONNECTOR_MAX_TRIALS = 100;
/**
 * maximum number of trails done by the sampling divider algorithm
 * to resolve collision between regions
 */
Marahel.SAMPLING_TRAILS = 100;
/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>
/**
 *
 */
var Region = (function () {
    /**
     * Constructor for the region class
     * @param x x position for the region
     * @param y y position for the region
     * @param width width of the region
     * @param height height of the region
     */
    function Region(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.borderLeft = 0;
        this.borderRight = 0;
        this.borderUp = 0;
        this.borderDown = 0;
    }
    /**
     * set x position in the region
     * @param value used to set the x position
     */
    Region.prototype.setX = function (value) {
        this.x = value;
    };
    /**
     * set y position in the region
     * @param value used to set the y position
     */
    Region.prototype.setY = function (value) {
        this.y = value;
    };
    /**
     * set width of the region
     * @param value used to set the width
     */
    Region.prototype.setWidth = function (value) {
        this.width = value;
    };
    /**
     * set height of the region
     * @param value used to set the height
     */
    Region.prototype.setHeight = function (value) {
        this.height = value;
    };
    /**
     * get x position of the region after adding the left border
     * @return x position after adding the left border
     */
    Region.prototype.getX = function () {
        return this.x + this.borderLeft;
    };
    /**
     * get y position of the region after adding the upper border
     * @return y position after adding the top border
     */
    Region.prototype.getY = function () {
        return this.y + this.borderUp;
    };
    /**
     * get width of the region after removing the left and right borders
     * @return width of the region after removing the left and right borders
     */
    Region.prototype.getWidth = function () {
        return this.width - this.borderLeft - this.borderRight;
    };
    /**
     * get height of the region after removing the upper and lower borders
     * @return height of the region after removing the upper and lower borders
     */
    Region.prototype.getHeight = function () {
        return this.height - this.borderUp - this.borderDown;
    };
    /**
     * set the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @param value
     */
    Region.prototype.setValue = function (x, y, value) {
        var p = this.getRegionPosition(x, y);
        if (p.x < 0 || p.y < 0 || p.x >= this.getWidth() || p.y >= this.getHeight()) {
            return;
        }
        Marahel.marahelEngine.currentMap.setValue(this.getX() + p.x, this.getY() + p.y, value);
    };
    /**
     * Get the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @return entity index of the specified location
     */
    Region.prototype.getValue = function (x, y) {
        var p = this.getRegionPosition(x, y);
        if (p.x < 0 || p.y < 0 || p.x >= this.getWidth() || p.y >= this.getHeight()) {
            if (Marahel.marahelEngine.borderType == Region.BORDER_NONE) {
                return -1;
            }
            return Marahel.marahelEngine.borderType;
        }
        return Marahel.marahelEngine.currentMap.getValue(this.getX() + p.x, this.getY() + p.y);
    };
    /**
     * get number of a certain entity in this region
     * @param value index of the entity
     * @return number of times this entity appears in the region
     */
    Region.prototype.getEntityNumber = function (value) {
        var result = 0;
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                if (Marahel.marahelEngine.currentMap.getValue(x + this.getX(), y + this.getY()) == value) {
                    result += 1;
                }
            }
        }
        return result;
    };
    /**
     * fix the current input location to adapt correct location
     * (if the borders are wrapped)
     * @param x input x position
     * @param y input y position
     * @return the fixed location in the region
     */
    Region.prototype.getRegionPosition = function (x, y) {
        var p = new Point(x, y);
        if (Marahel.marahelEngine.borderType == Region.BORDER_WRAP) {
            if (p.x >= this.getWidth()) {
                p.x -= this.getWidth();
            }
            if (p.y >= this.getHeight()) {
                p.y -= this.getHeight();
            }
            if (p.x < 0) {
                p.x += this.getWidth();
            }
            if (p.y < 0) {
                p.y += this.getHeight();
            }
        }
        return p;
    };
    /**
     * check if the input point is in region or not
     * @param x input x position
     * @param y input y position
     * @return true if the input location in the region or false otherwise
     */
    Region.prototype.outRegion = function (x, y) {
        var p = this.getRegionPosition(x, y);
        if (p.x < 0 || p.y < 0 || p.x >= this.getWidth() || p.y >= this.getHeight()) {
            return true;
        }
        return false;
    };
    /**
     * get distances between start point and all entities with index "value"
     * @param start start location
     * @param neighbor neighborhood for checking
     * @param value entity index
     * @param checkSolid solid tiles
     * @return array of distances between current location and all entities with index "value"
     */
    Region.prototype.getDistances = function (start, neighbor, value, checkSolid) {
        var results = [];
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                if (Marahel.marahelEngine.currentMap.getValue(x + this.getX(), y + this.getY()) == value) {
                    var path = neighbor.getPath(start, new Point(x, y), this, checkSolid);
                    if (path.length > 0) {
                        results.push(path.length);
                    }
                }
            }
        }
        return results;
    };
    /**
     * Get estimated manhattan distance between start point and certain entity index
     * @param start starting location
     * @param value entity index
     * @return array of distances between current location and all entities with index "value"
     */
    Region.prototype.getEstimateDistances = function (start, value) {
        var results = [];
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                if (Marahel.marahelEngine.currentMap.getValue(x + this.getX(), y + this.getY()) == value) {
                    var dist = Math.abs(x - start.x) + Math.abs(y - start.y);
                    results.push(dist);
                }
            }
        }
        return results;
    };
    /**
     * check if the input point/region intersect with this region
     * @param pr either a point or region class to test against
     * @return true if the current region intersect with the input region/point
     *         and false otherwise
     */
    Region.prototype.intersect = function (pr) {
        if (pr instanceof Region) {
            return this.intersect(new Point(pr.x, pr.y)) ||
                this.intersect(new Point(pr.x + pr.width, pr.y)) ||
                this.intersect(new Point(pr.x, pr.y + this.height)) ||
                this.intersect(new Point(pr.x + this.width, pr.y + this.height)) ||
                pr.intersect(new Point(this.x, this.y)) ||
                pr.intersect(new Point(this.x + this.width, this.y)) ||
                pr.intersect(new Point(this.x, this.y + this.height)) ||
                pr.intersect(new Point(this.x + this.width, this.y + this.height));
        }
        else {
            return pr.x >= this.x && pr.y >= this.y &&
                pr.x < this.x + this.width && pr.y < this.y + this.height;
        }
    };
    return Region;
}());
/**
 * static variable for the wrapping borders
 */
Region.BORDER_WRAP = -10;
/**
 * static variable for the none borders
 */
Region.BORDER_NONE = -20;
/// <reference path="../Marahel.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>
/**
 * Neighborhood class carries information about the user defined neighborhoods
 */
var Neighborhood = (function () {
    /**
     * Constructor for neighborhood class
     * @param name name of the neighborhood
     * @param line input definition of the neighborhood
     */
    function Neighborhood(name, line) {
        this.printing = line;
        this.name = name.replace(",", "\n");
        var center = new Point();
        var lines = line.split(",");
        this.width = 0;
        this.height = lines.length;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length > this.width) {
                this.width = lines[i].length;
            }
            for (var j = 0; j < lines[i].length; j++) {
                var value = parseInt(lines[i].charAt(j)) || 0;
                if ((value & 2) > 0) {
                    center.x = j;
                    center.y = i;
                }
            }
        }
        this.locations = [];
        for (var i = 0; i < lines.length; i++) {
            for (var j = 0; j < lines[i].length; j++) {
                var value = parseInt(lines[i].charAt(j)) || 0;
                if ((value & 1) > 0) {
                    this.locations.push(new Point(j - center.x, i - center.y));
                }
            }
        }
    }
    /**
     * get number of a certain entity using this neighborhood
     * @param value entity index
     * @param center position for the neighborhood
     * @param region the current region
     * @return number of times the entity index in the neighborhood
     */
    Neighborhood.prototype.getTotal = function (value, center, region) {
        var result = 0;
        for (var i = 0; i < this.locations.length; i++) {
            if (region.getValue(this.locations[i].x + center.x, this.locations[i].y + center.y) == value) {
                result += 1;
            }
        }
        return result;
    };
    /**
     * set all relative location using neighborhood to an entity
     * @param value entity index
     * @param center position for the neighborhood
     * @param region the current region
     */
    Neighborhood.prototype.setTotal = function (value, center, region) {
        for (var i = 0; i < this.locations.length; i++) {
            region.setValue(center.x + this.locations[i].x, center.y + this.locations[i].y, value);
        }
    };
    /**
     * Get path between start and end location in a certain region using this neighborhood
     * @param start start location
     * @param end end location
     * @param region the allowed region
     * @param checkSolid function to define which locations are solid
     * @return list of points that specify the path between start and end points
     */
    Neighborhood.prototype.getPath = function (start, end, region, checkSolid) {
        return AStar.getPath(start, end, this.locations, region, checkSolid);
    };
    /**
     * get neighboring locations using this neighborhood
     * @param x x center position
     * @param y y center position
     * @param region the current region
     * @return a list of surrounding locations using this neighborhood
     */
    Neighborhood.prototype.getNeighbors = function (x, y, region) {
        var result = [];
        for (var _i = 0, _a = this.locations; _i < _a.length; _i++) {
            var l = _a[_i];
            var p = region.getRegionPosition(x + l.x, y + l.y);
            if (!region.outRegion(p.x, p.y)) {
                result.push(p);
            }
        }
        return result;
    };
    /**
     * get a string representation for this neighborhood
     * @return a string represent this neighborhood
     */
    Neighborhood.prototype.toString = function () {
        return this.name + "\n" + this.printing + "\nRelative locations\n" + this.locations;
    };
    return Neighborhood;
}());
// https://github.com/zeh/prando
var Prando = (function () {
    function Prando(seed) {
        if (seed === void 0) { seed = undefined; }
        if (typeof (seed) === "string") {
            // String seed
            this._seed = this.hashCode(seed);
        }
        else if (typeof (seed) === "number") {
            // Numeric seed
            this._seed = seed;
        }
        else {
            // Pseudo-random seed
            this._seed = Date.now() + Math.random();
        }
        this.reset();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    /**
     * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
     *
     * @param min - The minimum number that can be randomly generated.
     * @param pseudoMax - The maximum number that can be randomly generated (exclusive).
     * @return The generated pseudo-random number.
     */
    Prando.prototype.next = function (min, pseudoMax) {
        if (min === void 0) { min = 0; }
        if (pseudoMax === void 0) { pseudoMax = 1; }
        this.recalculate();
        return this.map(this._value, Prando.MIN, Prando.MAX, min, pseudoMax);
    };
    /**
     * Generates a pseudo-random integer number in a range (inclusive).
     *
     * @param min - The minimum number that can be randomly generated.
     * @param max - The maximum number that can be randomly generated.
     * @return The generated pseudo-random number.
     */
    Prando.prototype.nextInt = function (min, max) {
        if (min === void 0) { min = 10; }
        if (max === void 0) { max = 100; }
        this.recalculate();
        return Math.floor(this.map(this._value, Prando.MIN, Prando.MAX, min, max + 1));
    };
    /**
     * Generates a pseudo-random string sequence of a particular length from a specific character range.
     *
     * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
     * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
     * pre-existing ids, or employ a robust GUID/UUID generator.
     *
     * @param length - Length of the strting to be generated.
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated string sequence.
     */
    Prando.prototype.nextString = function (length, chars) {
        if (length === void 0) { length = 16; }
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        var str = "";
        while (str.length < length) {
            str += this.nextChar(chars);
        }
        return str;
    };
    /**
     * Generates a pseudo-random string of 1 character specific character range.
     *
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated character.
     */
    Prando.prototype.nextChar = function (chars) {
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        this.recalculate();
        return chars.substr(this.nextInt(0, chars.length - 1), 1);
    };
    /**
     * Picks a pseudo-random item from an array. The array is left unmodified.
     *
     * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
     * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
     * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
     * apply a *shuffle* transformation to the array instead, then read it linearly.
     *
     * @param array - Array of any type containing one or more candidates for random picking.
     * @return An item from the array.
     */
    Prando.prototype.nextArrayItem = function (array) {
        this.recalculate();
        return array[this.nextInt(0, array.length - 1)];
    };
    /**
     * Generates a pseudo-random boolean.
     *
     * @return A value of true or false.
     */
    Prando.prototype.nextBoolean = function () {
        this.recalculate();
        return this._value > 0.5;
    };
    /**
     * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
     * calling next() a specified number of times, but faster since it doesn't need to map the
     * new random numbers to a range and return it.
     *
     * @param iterations - The number of items to skip ahead.
     */
    Prando.prototype.skip = function (iterations) {
        if (iterations === void 0) { iterations = 1; }
        while (iterations-- > 0) {
            this.recalculate();
        }
    };
    /**
     * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
     * will then produce the same sequence of numbers it had produced before. This is equivalent to
     * creating a new Prando instance with the same seed as another Prando instance.
     *
     * Example:
     * let rng = new Prando(12345678);
     * console.log(rng.next()); // 0.6177754114889017
     * console.log(rng.next()); // 0.5784605181725837
     * rng.reset();
     * console.log(rng.next()); // 0.6177754114889017 again
     * console.log(rng.next()); // 0.5784605181725837 again
     */
    Prando.prototype.reset = function () {
        this._value = this._seed;
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    Prando.prototype.recalculate = function () {
        // Xorshift*32
        // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
        this._value ^= this._value << 13;
        this._value ^= this._value >> 17;
        this._value ^= this._value << 5;
    };
    Prando.prototype.map = function (val, minFrom, maxFrom, minTo, maxTo) {
        return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
    };
    Prando.prototype.hashCode = function (str) {
        var hash = 0;
        if (str) {
            var l = str.length;
            for (var i = 0; i < l; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
        }
        return hash;
    };
    return Prando;
}());
Prando.MIN = -2147483648; // Int32 min
Prando.MAX = 2147483647; // Int32 max
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */
var Grad = (function () {
    function Grad(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Grad.prototype.dot2 = function (x, y) {
        return this.x * x + this.y * y;
    };
    Grad.prototype.dot3 = function (x, y, z) {
        return this.x * x + this.y * y + this.z * z;
    };
    return Grad;
}());
var Noise = (function () {
    function Noise() {
        this.grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
            new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
            new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
        this.p = [151, 160, 137, 91, 90, 15,
            131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
            190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
            88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
            77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
            102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
            135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
            5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
            223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
            129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
            251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
            49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
            138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
        this.perm = new Array(512);
        this.gradP = new Array(512);
        this.F2 = 0.5 * (Math.sqrt(3) - 1);
        this.G2 = (3 - Math.sqrt(3)) / 6;
        this.F3 = 1 / 3;
        this.G3 = 1 / 6;
        this.seed(0);
    }
    Noise.prototype.seed = function (seed) {
        if (seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536;
        }
        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }
        for (var i = 0; i < 256; i++) {
            var v;
            if (i & 1) {
                v = this.p[i] ^ (seed & 255);
            }
            else {
                v = this.p[i] ^ ((seed >> 8) & 255);
            }
            this.perm[i] = this.perm[i + 256] = v;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
        }
    };
    // 2D simplex noise
    Noise.prototype.simplex2 = function (xin, yin) {
        var n0, n1, n2; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * this.F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * this.G2;
        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        var y0 = yin - j + t;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else {
            i1 = 0;
            j1 = 1;
        }
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + this.G2;
        var x2 = x0 - 1 + 2 * this.G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1 + 2 * this.G2;
        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;
        var gi0 = this.gradP[i + this.perm[j]];
        var gi1 = this.gradP[i + i1 + this.perm[j + j1]];
        var gi2 = this.gradP[i + 1 + this.perm[j + 1]];
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        }
        else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        }
        else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        }
        else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    };
    // 3D simplex noise
    Noise.prototype.simplex3 = function (xin, yin, zin) {
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * this.F3; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * this.G3;
        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        var y0 = yin - j + t;
        var z0 = zin - k + t;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
            else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
            else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        }
        else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            }
            else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            }
            else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + this.G3; // Offsets for second corner
        var y1 = y0 - j1 + this.G3;
        var z1 = z0 - k1 + this.G3;
        var x2 = x0 - i2 + 2 * this.G3; // Offsets for third corner
        var y2 = y0 - j2 + 2 * this.G3;
        var z2 = z0 - k2 + 2 * this.G3;
        var x3 = x0 - 1 + 3 * this.G3; // Offsets for fourth corner
        var y3 = y0 - 1 + 3 * this.G3;
        var z3 = z0 - 1 + 3 * this.G3;
        // Work out the hashed gradient indices of the four simplex corners
        i &= 255;
        j &= 255;
        k &= 255;
        var gi0 = this.gradP[i + this.perm[j + this.perm[k]]];
        var gi1 = this.gradP[i + i1 + this.perm[j + j1 + this.perm[k + k1]]];
        var gi2 = this.gradP[i + i2 + this.perm[j + j2 + this.perm[k + k2]]];
        var gi3 = this.gradP[i + 1 + this.perm[j + 1 + this.perm[k + 1]]];
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) {
            n0 = 0;
        }
        else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) {
            n1 = 0;
        }
        else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) {
            n2 = 0;
        }
        else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) {
            n3 = 0;
        }
        else {
            t3 *= t3;
            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 32 * (n0 + n1 + n2 + n3);
    };
    // ##### Perlin noise stuff
    Noise.prototype.fade = function (t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    };
    Noise.prototype.lerp = function (a, b, t) {
        return (1 - t) * a + t * b;
    };
    // 2D Perlin Noise
    Noise.prototype.perlin2 = function (x, y) {
        // Find unit grid cell containing point
        var X = Math.floor(x), Y = Math.floor(y);
        // Get relative xy coordinates of point within that cell
        x = x - X;
        y = y - Y;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        // Calculate noise contributions from each of the four corners
        var n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
        var n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
        var n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
        var n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
        // Compute the fade curve value for x
        var u = this.fade(x);
        // Interpolate the four results
        return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
    };
    // 3D Perlin Noise
    Noise.prototype.perlin3 = function (x, y, z) {
        // Find unit grid cell containing point
        var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
        // Get relative xyz coordinates of point within that cell
        x = x - X;
        y = y - Y;
        z = z - Z;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;
        // Calculate noise contributions from each of the eight corners
        var n000 = this.gradP[X + this.perm[Y + this.perm[Z]]].dot3(x, y, z);
        var n001 = this.gradP[X + this.perm[Y + this.perm[Z + 1]]].dot3(x, y, z - 1);
        var n010 = this.gradP[X + this.perm[Y + 1 + this.perm[Z]]].dot3(x, y - 1, z);
        var n011 = this.gradP[X + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(x, y - 1, z - 1);
        var n100 = this.gradP[X + 1 + this.perm[Y + this.perm[Z]]].dot3(x - 1, y, z);
        var n101 = this.gradP[X + 1 + this.perm[Y + this.perm[Z + 1]]].dot3(x - 1, y, z - 1);
        var n110 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z]]].dot3(x - 1, y - 1, z);
        var n111 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);
        // Compute the fade curve value for x, y, z
        var u = this.fade(x);
        var v = this.fade(y);
        var w = this.fade(z);
        // Interpolate
        return this.lerp(this.lerp(this.lerp(n000, n100, u), this.lerp(n001, n101, u), w), this.lerp(this.lerp(n010, n110, u), this.lerp(n011, n111, u), w), v);
    };
    return Noise;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Region.ts"/>
/// <reference path="DividerInterface.ts"/>
/**
 * Divide the map into regions by sampling different ones
 * that doesn't intersect with each other
 */
var SamplingDivider = (function () {
    /**
     * create a new sampling divider
     * @param numberOfRegions number of required regions
     * @param parameters sampling parameters
     */
    function SamplingDivider(numberOfRegions, parameters) {
        this.numberOfRegions = 1;
        if (this.numberOfRegions) {
            this.numberOfRegions = numberOfRegions;
        }
        this.minWidth = 1;
        this.minHeight = 1;
        this.maxHeight = 1;
        this.maxWidth = 1;
        if (parameters) {
            var parts = [];
            if (parameters["min"]) {
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = parseInt(parts[1]);
            }
            if (parameters["max"]) {
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = parseInt(parts[1]);
            }
        }
        if (this.maxWidth < this.minWidth) {
            var temp = this.maxWidth;
            this.maxWidth = this.minWidth;
            this.minWidth = temp;
        }
        if (this.maxHeight < this.minHeight) {
            var temp = this.maxHeight;
            this.maxHeight = this.minHeight;
            this.minHeight = temp;
        }
    }
    /**
     * Check if a region is intersecting with any other region
     * @param r region to be tested with other regions
     * @param regions current regions
     * @return true if r is not intersecting with any region in regions
     *              and false otherwise
     */
    SamplingDivider.prototype.checkIntersection = function (r, regions) {
        for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
            var cr = regions_1[_i];
            if (cr.intersect(r)) {
                return true;
            }
        }
        return false;
    };
    /**
     * change the current region to a new one
     * @param map generated map region to define the map boundaries
     * @param r region object to be changed
     */
    SamplingDivider.prototype.changeRegion = function (map, r) {
        r.setX(Random.getIntRandom(0, map.getWidth() - this.maxWidth));
        r.setY(Random.getIntRandom(0, map.getHeight() - this.maxHeight));
        r.setWidth(Random.getIntRandom(this.minWidth, this.maxWidth));
        r.setHeight(Random.getIntRandom(this.minHeight, this.maxHeight));
    };
    /**
     * get a fit region that is in the map and doesn't intersect with
     * any of the others
     * @param map generated map
     * @param regions previous generated regions
     * @return a suitable new region that doesn't intersect
     *         with any of the previous ones
     */
    SamplingDivider.prototype.getFitRegion = function (map, regions) {
        var r = new Region(0, 0, 0, 0);
        for (var i = 0; i < Marahel.SAMPLING_TRAILS; i++) {
            this.changeRegion(map, r);
            if (!this.checkIntersection(r, regions)) {
                break;
            }
        }
        return r;
    };
    /**
     * get the number of intersections between the regions
     * @param regions current generated regions
     * @return the number of intersection in the current array
     */
    SamplingDivider.prototype.calculateIntersection = function (regions) {
        var results = 0;
        for (var _i = 0, regions_2 = regions; _i < regions_2.length; _i++) {
            var r = regions_2[_i];
            if (this.checkIntersection(r, regions)) {
                results += 1;
            }
        }
        return results - regions.length;
    };
    /**
     * a hill climber algorithm to decrease the number of intersections between regions
     * @param map generated map
     * @param regions current generated regions
     */
    SamplingDivider.prototype.adjustRegions = function (map, regions) {
        var minIntersect = this.calculateIntersection(regions);
        for (var i = 0; i < Marahel.SAMPLING_TRAILS; i++) {
            var r = regions[Random.getIntRandom(0, regions.length)];
            var temp = new Region(r.getX(), r.getY(), r.getWidth(), r.getHeight());
            this.changeRegion(map, r);
            var value = this.calculateIntersection(regions);
            if (value >= minIntersect) {
                r.setX(temp.getX());
                r.setY(temp.getY());
                r.setWidth(temp.getWidth());
                r.setHeight(temp.getHeight());
            }
            else {
                minIntersect = value;
                if (minIntersect <= 0) {
                    return;
                }
            }
        }
    };
    /**
     * divide the map into different regions using sampling
     * @param map generated map
     * @return an array of regions that are selected using sampling methodology
     */
    SamplingDivider.prototype.getRegions = function (map) {
        var results = [];
        while (results.length < this.numberOfRegions) {
            results.push(this.getFitRegion(map, results));
        }
        if (this.calculateIntersection(results) > 0) {
            this.adjustRegions(map, results);
        }
        return results;
    };
    return SamplingDivider;
}());
/// <reference path="DividerInterface.ts"/>
/**
 * Binary Space Partitioning Algorithm
 */
var BinaryDivider = (function () {
    /**
     * Constructor for the binary space partitioning class
     * @param numberOfRegions number of required regions
     * @param parameters to initialize the bsp algorithm
     */
    function BinaryDivider(numberOfRegions, parameters) {
        this.numberOfRegions = 1;
        if (numberOfRegions) {
            this.numberOfRegions = numberOfRegions;
        }
        this.minWidth = 0;
        this.minHeight = 0;
        this.maxWidth = Number.MAX_VALUE;
        this.maxHeight = Number.MAX_VALUE;
        if (parameters) {
            var parts = [];
            if (parameters["min"]) {
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = parseInt(parts[1]);
            }
            if (parameters["max"]) {
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = parseInt(parts[1]);
            }
        }
        if (this.maxWidth < this.minWidth) {
            var temp = this.maxWidth;
            this.maxWidth = this.minWidth;
            this.minWidth = temp;
        }
        if (this.maxHeight < this.minHeight) {
            var temp = this.maxHeight;
            this.maxHeight = this.minHeight;
            this.minHeight = temp;
        }
    }
    /**
     * divide on the region width
     * @param region the region that will be divided over its width
     * @param allowedWidth the amount of width the system is allowed during division
     * @return two regions after division
     */
    BinaryDivider.prototype.divideWidth = function (region, allowedWidth) {
        var rWidth = this.minWidth + Random.getIntRandom(0, allowedWidth);
        return [new Region(region.getX(), region.getY(), rWidth, region.getHeight()),
            new Region(region.getX() + rWidth, region.getY(), region.getWidth() - rWidth, region.getHeight())];
    };
    /**
     * divide on the region height
     * @param region the regions that will be divided over its height
     * @param allowedHeight the amount of height the system is allowed during the division
     * @return two regions after division
     */
    BinaryDivider.prototype.divideHeight = function (region, allowedHeight) {
        var rHeight = this.minHeight + Random.getIntRandom(0, allowedHeight);
        return [new Region(region.getX(), region.getY(), region.getWidth(), rHeight),
            new Region(region.getX(), region.getY() + rHeight, region.getWidth(), region.getHeight() - rHeight)];
    };
    /**
     * test if the region should be further divided
     * @param region the tested region
     * @return true if the region is bigger than twice minWidth or twice minHeight
     */
    BinaryDivider.prototype.testDivide = function (region) {
        return (region.getWidth() >= 2 * this.minWidth || region.getHeight() >= 2 * this.minHeight);
    };
    /**
     * divide a region randomly either on width or height
     * @param region the region required to be divided
     * @return two regions after the division
     */
    BinaryDivider.prototype.divide = function (region) {
        var allowedWidth = region.getWidth() - 2 * this.minWidth;
        var allowedHeight = region.getHeight() - 2 * this.minHeight;
        if (Random.getRandom() < 0.5) {
            if (allowedWidth > 0) {
                return this.divideWidth(region, allowedWidth);
            }
            if (allowedHeight > 0) {
                return this.divideHeight(region, allowedHeight);
            }
        }
        else {
            if (allowedHeight > 0) {
                return this.divideHeight(region, allowedHeight);
            }
            if (allowedWidth > 0) {
                return this.divideWidth(region, allowedWidth);
            }
        }
        if (region.getWidth() > region.getHeight()) {
            return this.divideWidth(region, 0);
        }
        else {
            return this.divideHeight(region, 0);
        }
    };
    /**
     * check if any of the regions have a width or height more than
     * maxWidht or maxHeight
     * @param regions all the regions
     * @return true if any of the regions have the width or the height
     *         bigger than maxWidth or maxHeight
     */
    BinaryDivider.prototype.checkMaxSize = function (regions) {
        for (var _i = 0, regions_3 = regions; _i < regions_3.length; _i++) {
            var r = regions_3[_i];
            if (r.getWidth() > this.maxWidth || r.getHeight() > this.maxHeight) {
                return true;
            }
        }
        return false;
    };
    /**
     * divided the on the maximum size diminsion
     * @param region the region that will be divided
     * @return two regions after the division
     */
    BinaryDivider.prototype.divideMaxSize = function (region) {
        if (Random.getRandom() < 0.5) {
            if (region.getWidth() >= this.maxWidth) {
                return this.divideWidth(region, 0);
            }
            if (region.getHeight() >= this.maxHeight) {
                return this.divideHeight(region, 0);
            }
        }
        else {
            if (region.getHeight() >= this.maxHeight) {
                return this.divideHeight(region, 0);
            }
            if (region.getWidth() >= this.maxWidth) {
                return this.divideWidth(region, 0);
            }
        }
        if (region.getWidth() > region.getHeight()) {
            return this.divideWidth(region, 0);
        }
        else {
            return this.divideHeight(region, 0);
        }
    };
    /**
     * divide the generated map using BSP till satisfy all the constraints
     * @param map the generated map
     * @return an array of regions that fits all the constraints and
     *         divided using BSP
     */
    BinaryDivider.prototype.getRegions = function (map) {
        var results = [new Region(0, 0, map.getWidth(), map.getHeight())];
        while (results.length < this.numberOfRegions || this.checkMaxSize(results)) {
            Random.shuffleArray(results);
            var prevLength = results.length;
            for (var i = 0; i < results.length; i++) {
                if (this.testDivide(results[i])) {
                    results = results.concat(this.divide(results.splice(i, 1)[0]));
                    break;
                }
            }
            if (prevLength == results.length) {
                for (var i = 0; i < results.length; i++) {
                    if (this.checkMaxSize([results[i]])) {
                        results = results.concat(this.divideMaxSize(results.splice(i, 1)[0]));
                        break;
                    }
                }
            }
        }
        Random.shuffleArray(results);
        results = results.slice(0, this.numberOfRegions);
        return results;
    };
    return BinaryDivider;
}());
/// <reference path="DividerInterface.ts"/>
/**
 * Equal Divider class that divides the map into a grid of equal size regions
 */
var EqualDivider = (function () {
    /**
     * constructor for the EqualDivider class
     * @param numberOfRegions number of required regions
     * @param parameters to initialize the EqualDivider
     */
    function EqualDivider(numberOfRegions, parameters) {
        this.numberOfRegions = 1;
        if (numberOfRegions) {
            this.numberOfRegions = numberOfRegions;
        }
        this.minWidth = 1;
        this.minHeight = 1;
        this.maxWidth = 1;
        this.maxHeight = 1;
        if (parameters) {
            var parts = [];
            if (parameters["min"]) {
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = parseInt(parts[1]);
            }
            if (parameters["max"]) {
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = parseInt(parts[1]);
            }
        }
        if (this.maxWidth < this.minWidth) {
            var temp = this.maxWidth;
            this.maxWidth = this.minWidth;
            this.minWidth = temp;
        }
        if (this.maxHeight < this.minHeight) {
            var temp = this.maxHeight;
            this.maxHeight = this.minHeight;
            this.minHeight = temp;
        }
    }
    /**
     * get regions in the map using equal dividing algorithm
     * @param map the generated map
     * @return an array of regions based on equal division of the map
     */
    EqualDivider.prototype.getRegions = function (map) {
        var result = [];
        var currentWidth = Random.getIntRandom(this.minWidth, this.maxWidth);
        var currentHeight = Random.getIntRandom(this.minHeight, this.maxHeight);
        var roomWidth = Math.floor(map.getWidth() / currentWidth);
        var roomHeight = Math.floor(map.getHeight() / currentHeight);
        for (var x = 0; x < this.minWidth; x++) {
            for (var y = 0; y < this.minHeight; y++) {
                var rX = x * roomWidth;
                var rY = y * roomHeight;
                var rW = roomWidth;
                var rH = roomHeight;
                if (x == currentWidth - 1) {
                    rW = map.getWidth() - rX;
                }
                if (y == currentHeight - 1) {
                    rH = map.getHeight() - rY;
                }
                result.push(new Region(rX, rY, rW, rH));
            }
        }
        Random.shuffleArray(result);
        result = result.slice(0, this.numberOfRegions);
        return result;
    };
    return EqualDivider;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="OperatorInterface.ts"/>
/**
 * Larger than or Equal operator used to check the left value is larger than
 * or equal to the right value
 */
var LargerEqualOperator = (function () {
    function LargerEqualOperator() {
    }
    /**
     * check the leftValue is larger than or equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left larger than or equal to the right and false otherwise
     */
    LargerEqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue >= rightValue;
    };
    return LargerEqualOperator;
}());
/// <reference path="OperatorInterface.ts"/>
/**
 * Less than or Equal operator to check if the left value is less than or
 * equal to the right value
 */
var LessEqualOperator = (function () {
    function LessEqualOperator() {
    }
    /**
     * check the leftValue is less than or equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left less than or equal to the right and false otherwise
     */
    LessEqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue <= rightValue;
    };
    return LessEqualOperator;
}());
/// <reference path="OperatorInterface.ts"/>
/**
 * Larger than operator used to check the left value is
 * larger than the right value
 */
var LargerOperator = (function () {
    function LargerOperator() {
    }
    /**
     * check the leftValue is larger than the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left larger than the right and false otherwise
     */
    LargerOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue > rightValue;
    };
    return LargerOperator;
}());
/// <reference path="OperatorInterface.ts"/>
/**
 * Less than operator used to check if the left value is less than the right value
 */
var LessOperator = (function () {
    function LessOperator() {
    }
    /**
     * check the leftValue is less than the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left less than the right and false otherwise
     */
    LessOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue < rightValue;
    };
    return LessOperator;
}());
/// <reference path="OperatorInterface.ts"/>
/**
 * Equal operator used to check if the two values are equal or not
 */
var EqualOperator = (function () {
    function EqualOperator() {
    }
    /**
     * check the leftValue is equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if the left equal to the right and false otherwise
     */
    EqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue == rightValue;
    };
    return EqualOperator;
}());
/// <reference path="OperatorInterface.ts"/>
/**
 * Not equal operator used to check if the two values are not equal
 */
var NotEqualOperator = (function () {
    function NotEqualOperator() {
    }
    /**
     * check the values are not equal
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the righ hand side
     * @return true if not equal and false otherwise
     */
    NotEqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue != rightValue;
    };
    return NotEqualOperator;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Point.ts"/>
/// <reference path="../Data/Region.ts"/>
/// <reference path="EstimatorInterface.ts"/>
/// <reference path="../utils/Tools.ts"/>
/**
 * Neighborhood estimator calculates the number of entities using a certain neighborhood
 */
var NeighborhoodEstimator = (function () {
    /**
     * Constructor for the neighborhood estimator
     * @param line user input
     */
    function NeighborhoodEstimator(line) {
        var parts = line.split(/\((.+)\)/);
        this.neighbor = Marahel.marahelEngine.getNeighborhood(parts[0].trim());
        this.entities = EntityListParser.parseList(parts[1]);
    }
    /**
     * Calculates the number of entities using a certain neighborhood
     * @param iteration percentage of completion of the generator
     * @param position current position
     * @param region current region
     * @return number of entities using a certain neighborhood
     */
    NeighborhoodEstimator.prototype.calculate = function (iteration, position, region) {
        var result = 0;
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            result += this.neighbor.getTotal(Marahel.marahelEngine.getEntityIndex(entity.name), position, region);
        }
        return result;
    };
    return NeighborhoodEstimator;
}());
/// <reference path="EstimatorInterface.ts"/>
/**
 * Number estimator is most common used estimator. It can return completion percentage,
 * random value, noise value, constant value, or number of entities in the selected region
 */
var NumberEstimator = (function () {
    /**
     * Constructor for Number Estimator
     * @param line user input
     */
    function NumberEstimator(line) {
        this.name = line;
    }
    /**
     * Calculates the value for the specified name
     * @param iteration completion percentage
     * @param position current position
     * @param region current region
     * @return estimated value for the name
     */
    NumberEstimator.prototype.calculate = function (iteration, position, region) {
        if (this.name == "complete") {
            return iteration;
        }
        if (this.name == "random") {
            return Random.getRandom();
        }
        if (this.name == "noise") {
            return Random.getNoise(position.x / region.getWidth(), position.y / region.getHeight());
        }
        if (isNaN(parseFloat(this.name))) {
            return region.getEntityNumber(Marahel.marahelEngine.getEntityIndex(this.name));
        }
        return parseFloat(this.name);
    };
    return NumberEstimator;
}());
/// <reference path="EstimatorInterface.ts"/>
/**
 * Distance estimator is used as part of condition to get min, max, or avg
 * distance to one or a group of entities
 */
var DistanceEstimator = (function () {
    /**
     * Constructor for the distance estimator
     * @param line input line by user
     */
    function DistanceEstimator(line) {
        if (line.match("max")) {
            this.type = "max";
        }
        else if (line.match("min")) {
            this.type = "min";
        }
        else {
            this.type = "avg";
        }
        var parts = line.split(/\((.+)\)/)[1].split(",");
        if (parts.length == 1) {
            this.neighbor = null;
            this.entities = EntityListParser.parseList(parts[0]);
        }
        else {
            this.neighbor = Marahel.marahelEngine.getNeighborhood(parts[0].trim());
            this.entities = EntityListParser.parseList(parts[1]);
            var allowedName = "any";
            if (parts.length > 2) {
                allowedName = parts[2].trim();
            }
            this.allowed = EntityListParser.parseList(allowedName);
        }
    }
    /**
     * get maximum distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return maximum distance between current location and entity index
     */
    DistanceEstimator.prototype.getMax = function (position, region, entityIndex) {
        var _this = this;
        var values = [];
        if (this.neighbor != null) {
            values = region.getDistances(position, this.neighbor, entityIndex, function (x, y) {
                for (var _i = 0, _a = _this.allowed; _i < _a.length; _i++) {
                    var a = _a[_i];
                    if (region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(a.name)) {
                        return false;
                    }
                }
                return true;
            });
        }
        else {
            values = region.getEstimateDistances(position, entityIndex);
        }
        if (values.length <= 0) {
            return -1;
        }
        var max = 0;
        for (var i = 0; i < values.length; i++) {
            if (max < values[i]) {
                max = values[i];
            }
        }
        return max;
    };
    /**
     * get minimum distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return minimum distance between current location and entity index
     */
    DistanceEstimator.prototype.getMin = function (position, region, entityIndex) {
        var _this = this;
        var values = [];
        if (this.neighbor != null) {
            values = region.getDistances(position, this.neighbor, entityIndex, function (x, y) {
                for (var _i = 0, _a = _this.allowed; _i < _a.length; _i++) {
                    var a = _a[_i];
                    if (region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(a.name)) {
                        return false;
                    }
                }
                return true;
            });
        }
        else {
            values = region.getEstimateDistances(position, entityIndex);
        }
        if (values.length <= 0) {
            return -1;
        }
        var min = Number.MAX_VALUE;
        for (var i = 0; i < values.length; i++) {
            if (min > values[i]) {
                min = values[i];
            }
        }
        return min;
    };
    /**
     * get average distance between current location and entity index
     * @param position current location
     * @param region current region
     * @param entityIndex checked entity index
     * @return average distance between current location and entity index
     */
    DistanceEstimator.prototype.getAvg = function (position, region, entityIndex) {
        var _this = this;
        var values = [];
        if (this.neighbor != null) {
            values = region.getDistances(position, this.neighbor, entityIndex, function (x, y) {
                for (var _i = 0, _a = _this.allowed; _i < _a.length; _i++) {
                    var a = _a[_i];
                    if (region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(a.name)) {
                        return false;
                    }
                }
                return true;
            });
        }
        else {
            values = region.getEstimateDistances(position, entityIndex);
        }
        if (values.length <= 0) {
            return -1;
        }
        var total = 0;
        for (var i = 0; i < values.length; i++) {
            total += values[i];
        }
        return total / values.length;
    };
    /**
     * get the distance from the current location to a specified sprite
     * @param iteration percentage of the current generator
     * @param position current position
     * @param region current region
     * @return distance from the current position to the specified entity
     */
    DistanceEstimator.prototype.calculate = function (iteration, position, region) {
        var max = 0;
        var min = Number.MAX_VALUE;
        var totalAvg = 0;
        var maxChange = false;
        var minChange = false;
        var avgChange = false;
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            var maxValue = this.getMax(position, region, Marahel.marahelEngine.getEntityIndex(e.name));
            if (maxValue != -1 && maxValue > max) {
                max = max;
                maxChange = true;
            }
            var minValue = this.getMin(position, region, Marahel.marahelEngine.getEntityIndex(e.name));
            if (minValue != -1 && minValue < min) {
                min = minValue;
                minChange = true;
            }
            var avgValue = this.getAvg(position, region, Marahel.marahelEngine.getEntityIndex(e.name));
            if (avgValue != -1) {
                totalAvg += avgValue;
                avgChange = true;
            }
        }
        switch (this.type) {
            case "max":
                if (!maxChange) {
                    return -1;
                }
                return max;
            case "min":
                if (!minChange) {
                    return -1;
                }
                return min;
            case "avg":
                if (!avgChange) {
                    return -1;
                }
                return totalAvg / this.entities.length;
        }
    };
    return DistanceEstimator;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>
/**
 * Condition class is used as a part of the Rule class (Left hand side of any rule)
 */
var Condition = (function () {
    /**
     * Constructor for the condition class
     * @param line user input line
     */
    function Condition(line) {
        var parts = line.split(",");
        var cParts = parts[0].split(/>=|<=|==|!=|>|</);
        this.leftSide = Factory.getEstimator(cParts[0].trim());
        if (cParts.length > 1) {
            this.operator = Factory.getOperator(parts[0].match(/>=|<=|==|!=|>|</)[0].trim());
            this.rightSide = Factory.getEstimator(cParts[1].trim());
        }
        else {
            this.operator = Factory.getOperator(">");
            this.rightSide = Factory.getEstimator("0");
        }
        if (parts.length > 1) {
            parts.splice(0, 1);
            this.nextCondition = new Condition(parts.join(","));
        }
    }
    /**
     * Check if the condition is true or false including all the anded conditions
     * @param iteration the percentage of completion of the generator
     * @param position the current position where the algorithm is testing
     * @param region allowed region to check on
     * @return true if all conditions are true and false otherwise
     */
    Condition.prototype.check = function (iteration, position, region) {
        var left = this.leftSide.calculate(iteration, position, region);
        var right = this.rightSide.calculate(iteration, position, region);
        if ((this.leftSide instanceof DistanceEstimator && left == -1) ||
            (this.rightSide instanceof DistanceEstimator && right == -1)) {
            return true;
        }
        var result = this.operator.check(left, right);
        if (result && this.nextCondition != null) {
            result = result && this.nextCondition.check(iteration, position, region);
        }
        return result;
    };
    return Condition;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../data/Neighborhood.ts"/>
/// <reference path="../data/Entity.ts"/>
/**
 * Executer class (Right hand side of the rule)
 */
var Executer = (function () {
    /**
     * Constructor for the executer class
     * @param line user input data
     */
    function Executer(line) {
        var parts = line.split(",");
        var eParts = parts[0].split(/\((.+)\)/);
        this.neighbor = Marahel.marahelEngine.getNeighborhood(eParts[0].trim());
        this.entities = EntityListParser.parseList(eParts[1].trim());
        if (parts.length > 1) {
            parts.splice(0, 1);
            this.nextExecuter = new Executer(parts.join(","));
        }
    }
    /**
     * Apply all the executers on the current selected region
     * @param position current position of the generator
     * @param region allowed region to apply the executer
     */
    Executer.prototype.apply = function (position, region) {
        var entity = this.entities[Random.getIntRandom(0, this.entities.length)];
        this.neighbor.setTotal(Marahel.marahelEngine.getEntityIndex(entity.name), position, region);
        if (this.nextExecuter != null) {
            this.nextExecuter.apply(position, region);
        }
    };
    return Executer;
}());
/// <reference path="Condition.ts"/>
/// <reference path="Executer.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="Region.ts"/>
/**
 * Rule class used to apply any of the generators
 */
var Rule = (function () {
    /**
     * Constructor for the Rule class
     * @param lines user input rules
     */
    function Rule(lines) {
        this.condition = new Condition(lines[0].split("->")[0]);
        this.executer = new Executer(lines[0].split("->")[1]);
        this.nextRule = null;
        if (lines.length > 1) {
            lines.splice(0, 1);
            this.nextRule = new Rule(lines);
        }
    }
    /**
     * Execute the rule chain on the current region
     * @param iteration the percentage of the finished generator
     * @param position the current position of the generator
     * @param region current selected region
     * @return true if any of the rules has been applied and false otherwise
     */
    Rule.prototype.execute = function (iteration, position, region) {
        if (this.condition.check(iteration, position, region)) {
            this.executer.apply(position, region);
            return true;
        }
        else if (this.nextRule != null) {
            return this.nextRule.execute(iteration, position, region);
        }
        return false;
    };
    return Rule;
}());
/// <reference path="../data/Region.ts"/>
/// <reference path="../data/Rule.ts"/>
/**
 * Base Generator class
 */
var Generator = (function () {
    /**
     * Constructor for the generator class
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     */
    function Generator(currentRegion, rules) {
        this.minBorder = 0;
        this.maxBorder = 0;
        if (currentRegion["border"]) {
            this.minBorder = parseInt(currentRegion["border"].split(",")[0]);
            this.maxBorder = parseInt(currentRegion["border"].split(",")[1]);
        }
        this.sameBorders = false;
        if (currentRegion["sameBorder"]) {
            this.sameBorders = currentRegion["sameBorder"].toLowerCase() == "true";
        }
        this.regionsName = "map";
        if (currentRegion["name"]) {
            this.regionsName = currentRegion["name"].trim();
        }
        this.replacingType = MarahelMap.REPLACE_BACK;
        if (currentRegion["replacingType"]) {
            if (currentRegion["replacingType"].trim() == "same") {
                this.replacingType = MarahelMap.REPLACE_SAME;
            }
            else if (currentRegion["replacingType"].trim() == "buffer") {
                this.replacingType = MarahelMap.REPLACE_BACK;
            }
        }
        this.borderType = Region.BORDER_NONE;
        if (currentRegion["borderType"]) {
            if (currentRegion["borderType"].trim() == "wrap") {
                this.borderType = Region.BORDER_WRAP;
            }
            else if (currentRegion["borderType"].trim() == "none") {
                this.borderType = Region.BORDER_NONE;
            }
            else {
                this.borderType = Marahel.marahelEngine.getEntityIndex(currentRegion["borderType"].trim());
            }
        }
        this.rules = new Rule(rules);
    }
    /**
     * select the correct region based on the regionName
     * @param map the whole map
     * @param regions list of all the regions from the divider algorithm
     */
    Generator.prototype.selectRegions = function (map, regions) {
        if (this.regionsName == "map") {
            this.regions = [map];
        }
        else if (this.regionsName.trim() == "all") {
            this.regions = regions;
        }
        else {
            this.regions = [];
            var parts = this.regionsName.split(",");
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var p = parts_1[_i];
                p = p.trim();
                if (p.match("-")) {
                    var indeces = p.split("-");
                    for (var i = parseInt(indeces[0]); i < parseInt(indeces[1]); i++) {
                        this.regions.push(regions[i]);
                    }
                }
                else {
                    this.regions.push(regions[parseInt(p)]);
                }
            }
        }
    };
    /**
     * Apply the generation algorithm on the regions array
     */
    Generator.prototype.applyGeneration = function () {
        Marahel.marahelEngine.replacingType = this.replacingType;
        Marahel.marahelEngine.borderType = this.borderType;
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var r = _a[_i];
            r.borderLeft = Random.getIntRandom(this.minBorder, this.maxBorder);
            if (this.sameBorders) {
                r.borderRight = r.borderLeft;
                r.borderUp = r.borderLeft;
                r.borderDown = r.borderLeft;
            }
            else {
                r.borderRight = Random.getIntRandom(this.minBorder, this.maxBorder);
                r.borderUp = Random.getIntRandom(this.minBorder, this.maxBorder);
                r.borderDown = Random.getIntRandom(this.minBorder, this.maxBorder);
            }
        }
    };
    return Generator;
}());
/// <reference path="Generator.ts"/>
/**
 * Automata Generator class
 */
var AutomataGenerator = (function (_super) {
    __extends(AutomataGenerator, _super);
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the automata generator
     */
    function AutomataGenerator(currentRegion, rules, parameters) {
        var _this = _super.call(this, currentRegion, rules) || this;
        _this.numIterations = 0;
        if (parameters["iterations"]) {
            _this.numIterations = parseInt(parameters["iterations"]);
        }
        _this.start = new Point();
        if (parameters["start"]) {
            _this.start = new Point(parseInt(parameters["start"].split(",")[0]), parseInt(parameters["start"].split(",")[1]));
        }
        _this.explore = Marahel.marahelEngine.getNeighborhood("sequential");
        if (parameters["exploration"]) {
            _this.explore = Marahel.marahelEngine.getNeighborhood(parameters["exploration"]);
        }
        return _this;
    }
    /**
     * Apply the automata algorithm on the regions array
     */
    AutomataGenerator.prototype.applyGeneration = function () {
        _super.prototype.applyGeneration.call(this);
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var r = _a[_i];
            for (var i = 0; i < this.numIterations; i++) {
                var visited = {};
                var exploreList = [new Point(this.start.x * r.getWidth(), this.start.y * r.getHeight())];
                while (exploreList.length > 0) {
                    var currentPoint = exploreList.splice(0, 1)[0];
                    currentPoint = r.getRegionPosition(currentPoint.x, currentPoint.y);
                    if (!visited[currentPoint.toString()] && !r.outRegion(currentPoint.x, currentPoint.y)) {
                        visited[currentPoint.toString()] = true;
                        this.rules.execute(i / this.numIterations, currentPoint, r);
                        var neighbors = this.explore.getNeighbors(currentPoint.x, currentPoint.y, r);
                        for (var _b = 0, neighbors_1 = neighbors; _b < neighbors_1.length; _b++) {
                            var n = neighbors_1[_b];
                            exploreList.push(n);
                        }
                    }
                }
                Marahel.marahelEngine.currentMap.switchBuffers();
            }
        }
    };
    return AutomataGenerator;
}(Generator));
/// <reference path="Generator.ts"/>
/**
 * Agent class used in the AgentGenerator Algorithm
 */
var Agent = (function () {
    /**
     * Constructor for the agent class
     * @param lifespan current lifespan after it reach zero the agent dies
     * @param speed current agent speed to apply rules
     * @param change amount of time the agent change direction at
     * @param entities starting location of the agent
     * @param directions current allowed directions
     */
    function Agent(lifespan, speed, change, entities, directions) {
        this.position = new Point(0, 0);
        this.currentLifespan = lifespan;
        this.lifespan = lifespan;
        this.currentSpeed = Random.getIntRandom(speed.x, speed.y);
        this.speed = speed;
        this.currentChange = Random.getIntRandom(change.x, change.y);
        this.change = change;
        this.currentDirection = directions.locations[Random.getIntRandom(0, directions.locations.length)];
        this.directions = [];
        for (var i = 0; i < directions.locations.length; i++) {
            this.directions.push(new Point(directions.locations[i].x, directions.locations[i].y));
        }
        this.entities = entities;
    }
    /**
     * move the agent to an allowed location used when the agent get stuck
     * @param region the applied region
     */
    Agent.prototype.moveToLocation = function (region) {
        var locations = [];
        for (var x = 0; x < region.getWidth(); x++) {
            for (var y = 0; y < region.getHeight(); y++) {
                for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(e.name)) {
                        locations.push(new Point(x, y));
                    }
                }
            }
        }
        if (locations.length == 0) {
            this.currentLifespan = -100;
            return;
        }
        this.position = locations[Random.getIntRandom(0, locations.length)];
    };
    /**
     * check if the current location is allowed
     * @param x x position
     * @param y y position
     * @param region current region
     * @return true if the location is allowed for the agent and false otherwise
     */
    Agent.prototype.checkAllowed = function (x, y, region) {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            if (region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(e.name)) {
                return true;
            }
        }
        return false;
    };
    /**
     * change the current direction of the agent or jump to
     * new location if no location found
     * @param region the applied region
     */
    Agent.prototype.changeDirection = function (region) {
        Random.shuffleArray(this.directions);
        for (var _i = 0, _a = this.directions; _i < _a.length; _i++) {
            var d = _a[_i];
            var newPosition = region.getRegionPosition(this.position.x + d.x, this.position.y + d.y);
            if (!region.outRegion(newPosition.x, newPosition.y) &&
                this.checkAllowed(newPosition.x, newPosition.y, region)) {
                this.currentDirection = d;
                this.position = newPosition;
                return;
            }
        }
        this.moveToLocation(region);
    };
    /**
     * update the current agent
     * @param region current applied region
     * @param rules rules to be applied when its time to react
     * @return true if the agent is still alive and false otherwise
     */
    Agent.prototype.update = function (region, rules) {
        if (this.currentLifespan <= 0) {
            return false;
        }
        this.currentSpeed -= 1;
        if (this.currentSpeed > 0) {
            return true;
        }
        this.currentSpeed = Random.getIntRandom(this.speed.x, this.speed.y);
        this.currentLifespan -= 1;
        this.currentChange -= 1;
        if (this.currentChange <= 0) {
            this.currentChange = Random.getIntRandom(this.change.x, this.change.y);
            this.changeDirection(region);
        }
        else {
            this.position = region.getRegionPosition(this.position.x + this.currentDirection.x, this.position.y + this.currentDirection.y);
            if (region.outRegion(this.position.x, this.position.y) ||
                !this.checkAllowed(this.position.x, this.position.y, region)) {
                this.changeDirection(region);
            }
        }
        if (this.lifespan <= -10) {
            return false;
        }
        rules.execute(this.currentLifespan / this.lifespan, this.position, region);
        return true;
    };
    return Agent;
}());
/**
 * Agent based generator
 */
var AgentGenerator = (function (_super) {
    __extends(AgentGenerator, _super);
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    function AgentGenerator(currentRegion, rules, parameters) {
        var _this = _super.call(this, currentRegion, rules) || this;
        _this.allowedEntities = EntityListParser.parseList("any");
        if (parameters["allowed"]) {
            _this.allowedEntities = EntityListParser.parseList(parameters["start"]);
        }
        _this.numAgents = new Point(1, 1);
        if (parameters["number"]) {
            _this.numAgents.x = parseInt(parameters["number"].split(",")[0]);
            _this.numAgents.y = parseInt(parameters["number"].split(",")[1]);
        }
        _this.speed = new Point(1, 1);
        if (parameters["speed"]) {
            _this.speed.x = parseInt(parameters["speed"].split(",")[0]);
            _this.speed.y = parseInt(parameters["speed"].split(",")[1]);
        }
        _this.changeTime = new Point(1, 1);
        if (parameters["change"]) {
            _this.changeTime.x = parseInt(parameters["change"].split(",")[0]);
            _this.changeTime.y = parseInt(parameters["change"].split(",")[1]);
        }
        _this.lifespan = new Point(50, 50);
        if (parameters["lifespan"]) {
            _this.lifespan.x = parseInt(parameters["lifespan"].split(",")[0]);
            _this.lifespan.y = parseInt(parameters["lifespan"].split(",")[1]);
        }
        _this.directions = Marahel.marahelEngine.getNeighborhood("plus");
        if (parameters["directions"]) {
            _this.directions = Marahel.marahelEngine.getNeighborhood(parameters["directions"]);
        }
        return _this;
    }
    /**
     * Apply the agent based algorithm on the regions array
     */
    AgentGenerator.prototype.applyGeneration = function () {
        _super.prototype.applyGeneration.call(this);
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var r = _a[_i];
            var agents = [];
            var numberOfAgents = Random.getIntRandom(this.numAgents.x, this.numAgents.y);
            for (var i = 0; i < numberOfAgents; i++) {
                agents.push(new Agent(Random.getIntRandom(this.lifespan.x, this.lifespan.y), this.speed, this.changeTime, this.allowedEntities, this.directions));
                agents[agents.length - 1].moveToLocation(r);
            }
            var agentChanges = true;
            while (agentChanges) {
                for (var _b = 0, agents_1 = agents; _b < agents_1.length; _b++) {
                    var a = agents_1[_b];
                    agentChanges = false;
                    agentChanges = agentChanges || a.update(r, this.rules);
                    Marahel.marahelEngine.currentMap.switchBuffers();
                }
            }
        }
    };
    return AgentGenerator;
}(Generator));
/// <reference path="Generator.ts"/>
/**
 * Group class is a helper class to the connector algorithm
 */
var Group = (function () {
    /**
     * constructor to initialize the values
     */
    function Group() {
        this.index = -1;
        this.points = [];
    }
    /**
     * add new point to the group
     * @param x x position
     * @param y y position
     */
    Group.prototype.addPoint = function (x, y) {
        this.points.push(new Point(x, y));
    };
    /**
     * get the center of the group
     * @return the center of the group
     */
    Group.prototype.getCenter = function () {
        var result = new Point(0, 0);
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            result.x += p.x;
            result.y + p.y;
        }
        result.x /= this.points.length;
        result.y /= this.points.length;
        return result;
    };
    /**
     * sort the points in an ascending order with respect to input point p
     * @param p relative point for sorting
     */
    Group.prototype.sort = function (p) {
        this.points.sort(function (a, b) {
            var d1 = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
            var d2 = Math.abs(p.x - b.x) + Math.abs(p.y - b.y);
            if (d1 == d2) {
                return Math.random() - 0.5;
            }
            return d1 - d2;
        });
    };
    /**
     * remove all the points that inside the shape so the group only have border points
     * @param region current region
     * @param allowed connectivity checking entity
     * @param neighbor neighborhood used in connection
     */
    Group.prototype.cleanPoints = function (region, allowed, neighbor) {
        for (var i = 0; i < this.points.length; i++) {
            var found = false;
            for (var _i = 0, allowed_1 = allowed; _i < allowed_1.length; _i++) {
                var e = allowed_1[_i];
                if (neighbor.getTotal(Marahel.marahelEngine.getEntityIndex(e.name), this.points[i], region) < neighbor.locations.length) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.points.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * merge two groups together
     * @param group the other group to be merged with
     */
    Group.prototype.combine = function (group) {
        for (var _i = 0, _a = group.points; _i < _a.length; _i++) {
            var p = _a[_i];
            this.points.push(p);
        }
    };
    /**
     * Get the minimum manhattan distance between this group and the input group
     * @param group the other to measure distance towards it
     * @return the minimum manhattan distance between this group and the other group
     */
    Group.prototype.distance = function (group) {
        var dist = Number.MAX_VALUE;
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p1 = _a[_i];
            for (var _b = 0, _c = group.points; _b < _c.length; _b++) {
                var p2 = _c[_b];
                if (Math.abs(p1.x + p2.x) + Math.abs(p1.y + p2.y) < dist) {
                    dist = Math.abs(p1.x + p2.x) + Math.abs(p1.y + p2.y);
                }
            }
        }
        return dist;
    };
    return Group;
}());
/**
 * Connector Generator which changes the generated map in order to connect
 * different areas on it
 */
var ConnectorGenerator = (function (_super) {
    __extends(ConnectorGenerator, _super);
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the connector generator
     */
    function ConnectorGenerator(currentRegion, rules, parameters) {
        var _this = _super.call(this, currentRegion, rules) || this;
        _this.neighbor = Marahel.marahelEngine.getNeighborhood("plus");
        if (parameters["neighborhood"]) {
            _this.neighbor = Marahel.marahelEngine.getNeighborhood(parameters["neighborhood"].trim());
        }
        _this.entities = EntityListParser.parseList("any");
        if (parameters["entities"]) {
            _this.entities = EntityListParser.parseList(parameters["entities"]);
        }
        _this.connectionType = ConnectorGenerator.SHORT_CONNECTION;
        if (parameters["type"]) {
            switch (parameters["type"].trim()) {
                case "short":
                    _this.connectionType = ConnectorGenerator.SHORT_CONNECTION;
                    break;
                case "hub":
                    _this.connectionType = ConnectorGenerator.HUB_CONNECTION;
                    break;
                case "full":
                    _this.connectionType = ConnectorGenerator.FULL_CONNECTION;
                    break;
                case "random":
                    _this.connectionType = ConnectorGenerator.RANDOM_CONNECTION;
                    break;
            }
        }
        return _this;
    }
    /**
     * flood fill algorithm to label the map and get unconnected groups and areas
     * @param x x position
     * @param y y position
     * @param label current label
     * @param labelBoard current labelling board to change
     * @param region current region
     */
    ConnectorGenerator.prototype.floodFill = function (x, y, label, labelBoard, region) {
        if (labelBoard[y][x] != -1) {
            return;
        }
        labelBoard[y][x] = label;
        var neighborLocations = this.neighbor.getNeighbors(x, y, region);
        for (var _i = 0, neighborLocations_1 = neighborLocations; _i < neighborLocations_1.length; _i++) {
            var p = neighborLocations_1[_i];
            for (var _a = 0, _b = this.entities; _a < _b.length; _a++) {
                var e = _b[_a];
                if (region.getValue(p.x, p.y) == Marahel.marahelEngine.getEntityIndex(e.name)) {
                    this.floodFill(p.x, p.y, label, labelBoard, region);
                }
            }
        }
    };
    /**
     * Get all unconnected groups
     * @param region current applied region
     * @return an array of all unconnected groups
     */
    ConnectorGenerator.prototype.getUnconnectedGroups = function (region) {
        var label = 0;
        var labelBoard = [];
        for (var y = 0; y < region.getHeight(); y++) {
            labelBoard.push([]);
            for (var x = 0; x < region.getWidth(); x++) {
                labelBoard[y].push(-1);
            }
        }
        for (var y = 0; y < region.getHeight(); y++) {
            for (var x = 0; x < region.getWidth(); x++) {
                if (labelBoard[y][x] == -1) {
                    for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                        var e = _a[_i];
                        if (region.getValue(x, y) == Marahel.marahelEngine.getEntityIndex(e.name)) {
                            this.floodFill(x, y, label, labelBoard, region);
                            label += 1;
                            break;
                        }
                    }
                }
            }
        }
        var groups = [];
        for (var i = 0; i < label; i++) {
            groups.push(new Group());
            groups[i].index = i;
        }
        for (var y = 0; y < region.getHeight(); y++) {
            for (var x = 0; x < region.getWidth(); x++) {
                if (labelBoard[y][x] != -1) {
                    groups[labelBoard[y][x]].addPoint(x, y);
                }
            }
        }
        return groups;
    };
    /**
     * connect the two points
     * @param start start point for connection
     * @param end end point for connection
     * @param region current region
     * @return true if the two groups are connected and false otherwise
     */
    ConnectorGenerator.prototype.connect = function (start, end, region) {
        var blocked = {};
        var currentPosition = start;
        while (!currentPosition.equal(end)) {
            var path = AStar.getPath(currentPosition, end, this.neighbor.locations, region, function (x, y) {
                if (blocked[x + "," + y]) {
                    return true;
                }
                return false;
            });
            if (path.length == 0) {
                return false;
            }
            var i = -1;
            for (i = 1; i < path.length - 1; i++) {
                if (!this.rules.execute(i / path.length, path[i], region)) {
                    blocked[path[i].x + "," + path[i].y] = true;
                    currentPosition = path[i - 1];
                }
            }
            if (i == path.length - 1) {
                currentPosition = path[i];
            }
        }
        return true;
    };
    /**
     * connect the groups randomly
     * @param groups unconnected groups
     * @param region applied region
     */
    ConnectorGenerator.prototype.connectRandom = function (groups, region) {
        var index = 0;
        while (groups.length > 1) {
            var i1 = Random.getIntRandom(0, groups.length);
            var i2 = (i1 + Random.getIntRandom(0, groups.length - 1) + 1) % groups.length;
            this.connect(groups[i1].points[Random.getIntRandom(0, groups[i1].points.length)], groups[i2].points[Random.getIntRandom(0, groups[i2].points.length)], region);
            groups[i1].combine(groups[i2]);
            groups.splice(i2, 1);
            index += 1;
            if (index > Marahel.CONNECTOR_MAX_TRIALS) {
                throw new Error("Connector: " + this + " is taking too much time.");
            }
        }
    };
    /**
     * helper function to connect the groups using the shortest path
     * @param groups unconnected groups
     * @param region applied region
     * @return the first point and last point and the indeces of both group to be connected
     */
    ConnectorGenerator.prototype.shortestGroup = function (groups, region) {
        var c1 = groups[0].getCenter();
        var minDistance = Number.MAX_VALUE;
        var index = -1;
        for (var i = 1; i < groups.length; i++) {
            var c2 = groups[i].getCenter();
            if (Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) < minDistance) {
                index = i;
                minDistance = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
            }
        }
        groups[0].sort(groups[index].getCenter());
        groups[index].sort(c1);
        var path = AStar.getPathMultipleStartEnd(groups[0].points, groups[index].points, this.neighbor.locations, region, function (x, y) { return false; });
        return [path[0], path[path.length - 1], new Point(0, index)];
    };
    /**
     * helper function to connect the groups using one center group
     * @param groups unconnected groups
     * @param region applied region
     * @return the index of the center group that leads to the shortest distance towards other groups
     */
    ConnectorGenerator.prototype.centerGroup = function (groups, region) {
        var minDistance = Number.MAX_VALUE;
        var index = -1;
        for (var i = 0; i < groups.length; i++) {
            var c1 = groups[0].getCenter();
            var totalDistance = 0;
            for (var j = i; j < groups.length; j++) {
                var c2 = groups[i].getCenter();
                totalDistance += Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
            }
            if (totalDistance < minDistance) {
                index = i;
                minDistance = totalDistance;
            }
        }
        return index;
    };
    /**
     * connect the groups using the shortest distance
     * @param groups unconnected groups
     * @param region applied region
     */
    ConnectorGenerator.prototype.connectShort = function (groups, region) {
        var index = 0;
        while (groups.length > 1) {
            var p = this.shortestGroup(groups, region);
            this.connect(p[0], p[1], region);
            groups[p[2].x].combine(groups[p[2].y]);
            groups.splice(p[2].y, 1);
            index += 1;
            if (index > Marahel.CONNECTOR_MAX_TRIALS) {
                throw new Error("Connector: " + this + " is taking too much time.");
            }
        }
    };
    /**
     * connect the all groups together
     * @param groups unconnected groups
     * @param region applied region
     */
    ConnectorGenerator.prototype.connectFull = function (groups, region) {
        var index = 0;
        var probability = 1 / groups.length;
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var g1 = groups_1[_i];
            for (var _a = 0, groups_2 = groups; _a < groups_2.length; _a++) {
                var g2 = groups_2[_a];
                if (g1 == g2) {
                    continue;
                }
                if (Random.getRandom() > probability) {
                    probability += 1 / groups.length;
                    continue;
                }
                probability = 1 / groups.length;
                var p1 = g1.points[Random.getIntRandom(0, g1.points.length)];
                var p2 = g2.points[Random.getIntRandom(0, g2.points.length)];
                this.connect(p1, p2, region);
            }
        }
    };
    /**
     * connect the groups using hub architecture (one group is connected to the rest)
     * @param groups unconnected groups
     * @param region applied region
     */
    ConnectorGenerator.prototype.connectHub = function (groups, region) {
        var center = this.centerGroup(groups, region);
        for (var _i = 0, groups_3 = groups; _i < groups_3.length; _i++) {
            var g = groups_3[_i];
            if (g != groups[center]) {
                var path = AStar.getPathMultipleStartEnd(groups[center].points, g.points, this.neighbor.locations, region, function (x, y) { return false; });
                this.connect(path[0], path[path.length - 1], region);
            }
        }
    };
    /**
     * Apply the connector algorithm on the regions array
     */
    ConnectorGenerator.prototype.applyGeneration = function () {
        _super.prototype.applyGeneration.call(this);
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var r = _a[_i];
            var groups = this.getUnconnectedGroups(r);
            for (var _b = 0, groups_4 = groups; _b < groups_4.length; _b++) {
                var g = groups_4[_b];
                g.cleanPoints(r, this.entities, this.neighbor);
            }
            if (groups.length > 1) {
                switch (this.connectionType) {
                    case ConnectorGenerator.HUB_CONNECTION:
                        this.connectHub(groups, r);
                        break;
                    case ConnectorGenerator.RANDOM_CONNECTION:
                        this.connectRandom(groups, r);
                        break;
                    case ConnectorGenerator.SHORT_CONNECTION:
                        this.connectShort(groups, r);
                        break;
                    case ConnectorGenerator.FULL_CONNECTION:
                        this.connectFull(groups, r);
                        break;
                }
                Marahel.marahelEngine.currentMap.switchBuffers();
            }
        }
    };
    return ConnectorGenerator;
}(Generator));
/**
 * Type of connection for the shortest connections
 */
ConnectorGenerator.SHORT_CONNECTION = 0;
/**
 * Type of connection for the random connections
 */
ConnectorGenerator.RANDOM_CONNECTION = 1;
/**
 * Type of connection for the hub connections
 */
ConnectorGenerator.HUB_CONNECTION = 2;
/**
 * Type of connection for the full connections
 */
ConnectorGenerator.FULL_CONNECTION = 3;
/// <reference path="../data/Point.ts"/>
/// <reference path="Prando.ts"/>
/// <reference path="Noise.ts"/>
/// <reference path="../regionDivider/SamplingDivider.ts"/>
/// <reference path="../regionDivider/BinaryDivider.ts"/>
/// <reference path="../regionDivider/EqualDivider.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>
/// <reference path="../operator/LargerEqualOperator.ts"/>
/// <reference path="../operator/LessEqualOperator.ts"/>
/// <reference path="../operator/LargerOperator.ts"/>
/// <reference path="../operator/LessOperator.ts"/>
/// <reference path="../operator/EqualOperator.ts"/>
/// <reference path="../operator/NotEqualOperator.ts"/>
/// <reference path="../estimator/NeighborhoodEstimator.ts"/>
/// <reference path="../estimator/NumberEstimator.ts"/>
/// <reference path="../estimator/DistanceEstimator.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../generator/AutomataGenerator.ts"/>
/// <reference path="../generator/AgentGenerator.ts"/>
/// <reference path="../generator/ConnectorGenerator.ts"/>
/**
 * basic node used in the A* algorithm
 */
var LocationNode = (function () {
    /**
     * constructor
     * @param parent current parent of the node
     * @param x map x position
     * @param y map y position
     */
    function LocationNode(parent, x, y) {
        if (parent === void 0) { parent = null; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
        this.parent = parent;
    }
    /**
     * check if the current node is the end node
     * @param x end location x position
     * @param y end location y position
     * @return true if its the end location, false otherwise
     */
    LocationNode.prototype.checkEnd = function (x, y) {
        return this.x == x && this.y == y;
    };
    /**
     * get an estimate between the current node and
     * end location using manhattan distance
     * @param x end location x position
     * @param y end location y position
     * @return the manhattan distance towards the exit
     */
    LocationNode.prototype.estimate = function (x, y) {
        return Math.abs(x - this.x) + Math.abs(y - this.y);
    };
    /**
     * return printable version of the location node
     * @return
     */
    LocationNode.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    return LocationNode;
}());
/**
 * A* algorithm used by the connector generator
 */
var AStar = (function () {
    function AStar() {
    }
    /**
     * get the path from the root node to the input node
     * @param node destination node where u need path between the root and itself
     * @return a list of points that specify the path between the root and node
     */
    AStar.convertNodeToPath = function (node) {
        var points = [];
        while (node != null) {
            points.push(new Point(node.x, node.y));
            node = node.parent;
        }
        return points.reverse();
    };
    /**
     * Get path between start point and end point in a certain region
     * @param start start location
     * @param end destination
     * @param directions allowed directions for the A*
     * @param region the allowed region the algorithm should work in
     * @param checkSolid function that return true in locations not allowed
     * @return a list of points that represent the path between start and end points
     */
    AStar.getPath = function (start, end, directions, region, checkSolid) {
        var iterations = 0;
        var openNodes = [new LocationNode(null, start.x, start.y)];
        var visited = {};
        var currentNode = openNodes[0];
        while (openNodes.length > 0 && !currentNode.checkEnd(end.x, end.y)) {
            currentNode = openNodes.splice(0, 1)[0];
            if (!visited[currentNode.toString()]) {
                visited[currentNode.toString()] = true;
                for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
                    var d = directions_1[_i];
                    var p = region.getRegionPosition(currentNode.x + d.x, currentNode.y + d.y);
                    var newLocation = new LocationNode(currentNode, p.x, p.y);
                    if (newLocation.checkEnd(end.x, end.y)) {
                        return AStar.convertNodeToPath(newLocation);
                    }
                    if (!checkSolid(newLocation.x, newLocation.y) && !region.outRegion(p.x, p.y)) {
                        openNodes.push(newLocation);
                    }
                }
                openNodes.sort(function (a, b) {
                    return a.estimate(end.x, end.y) - b.estimate(end.x, end.y);
                });
            }
            iterations += 1;
            if (iterations >= Marahel.A_STAR_TRIALS) {
                break;
            }
        }
        if (currentNode.checkEnd(end.x, end.y)) {
            return AStar.convertNodeToPath(currentNode);
        }
        return [];
    };
    /**
     * get path between multiple start locations and ending location
     * @param start start location
     * @param end destination
     * @param directions allowed directions for the A*
     * @param region the allowed region the algorithm should work in
     * @param checkSolid function that return true in locations not allowed
     * @return a list of points that represent the path between start and end points
     */
    AStar.getPathMultipleStartEnd = function (start, end, directions, region, checkSolid) {
        var shortest = Number.MAX_VALUE;
        var path = [];
        for (var _i = 0, start_1 = start; _i < start_1.length; _i++) {
            var s = start_1[_i];
            var iterations = 0;
            for (var _a = 0, end_1 = end; _a < end_1.length; _a++) {
                var e = end_1[_a];
                var temp = AStar.getPath(s, e, directions, region, checkSolid);
                if (temp.length < shortest) {
                    shortest = temp.length;
                    path = temp;
                    iterations = 0;
                    if (shortest < 4) {
                        break;
                    }
                }
                else {
                    iterations += 1;
                    if (iterations > Marahel.A_STAR_MULTI_TEST_TRIALS) {
                        break;
                    }
                }
            }
            if (shortest < 4 || (shortest < Number.MAX_VALUE &&
                iterations > Marahel.A_STAR_MULTI_TEST_TRIALS)) {
                break;
            }
        }
        return path;
    };
    return AStar;
}());
/**
 * parses list of entities to an actual entity array
 * e.g solid:2|empty:3|player => [solid, solid, empty, empty, player]
 * where the array elements are entity objects
 */
var EntityListParser = (function () {
    function EntityListParser() {
    }
    /**
     * convert the user input into an array of entities
     * @param line input line by user
     * @return list of entities that is equivalent to the user input
     */
    EntityListParser.parseList = function (line) {
        if (line.trim() == "any") {
            return Marahel.marahelEngine.getAllEntities().concat([Marahel.marahelEngine.getEntity(-1)]);
        }
        var result = [];
        var eeParts = line.split("|");
        for (var _i = 0, eeParts_1 = eeParts; _i < eeParts_1.length; _i++) {
            var e = eeParts_1[_i];
            var nums = e.split(":");
            var times = 1;
            if (nums.length > 1) {
                times = parseInt(nums[1]);
            }
            for (var i = 0; i < times; i++) {
                result.push(Marahel.marahelEngine.getEntity(nums[0].trim()));
            }
        }
        return result;
    };
    return EntityListParser;
}());
/**
 * Interface for Prando and Noise classes
 */
var Random = (function () {
    function Random() {
    }
    /**
     * initialize the parameters of the system
     */
    Random.initialize = function () {
        this.rnd = new Prando();
        this.noise = new Noise();
    };
    /**
     * change noise and random seeds
     * @param seed new seed for the random and noise objects
     */
    Random.changeSeed = function (seed) {
        this.rnd = new Prando(seed);
        this.noise.seed(seed);
    };
    /**
     * get random number between 0 and 1
     * @return a random value between 0 (inclusive) and 1 (exclusive)
     */
    Random.getRandom = function () {
        return this.rnd.next();
    };
    /**
     * get random integer between min and max
     * @param min min value for the random integer
     * @param max max value for the random integer
     * @return a random integer between min (inclusive) and max (exclusive)
     */
    Random.getIntRandom = function (min, max) {
        return this.rnd.nextInt(min, max - 1);
    };
    /**
     * get 2D perlin noise value based on the location x and y
     * @param x x location
     * @param y y location
     * @return noise value based on the location x and y
     */
    Random.getNoise = function (x, y) {
        return this.noise.perlin2(x, y);
    };
    /**
     * shuffle an array in place
     * @param array input array to be shuffled
     */
    Random.shuffleArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            var i1 = this.getIntRandom(0, array.length);
            var i2 = this.getIntRandom(0, array.length);
            var temp = array[i1];
            array[i1] = array[i2];
            array[i2] = temp;
        }
    };
    return Random;
}());
/**
 * transform a string to its corresponding class
 */
var Factory = (function () {
    function Factory() {
    }
    /**
     * create an estimator based on the user input
     * @param line user input to be parsed
     * @return Number Estimator, Distance Estimator, or NeighborhoodEstimator
     */
    Factory.getEstimator = function (line) {
        var parts = line.split(/\((.+)\)/);
        if (line.match(/\((.+)\)/) == null) {
            return new NumberEstimator(line);
        }
        else if (line.match("Dist")) {
            return new DistanceEstimator(line);
        }
        return new NeighborhoodEstimator(line);
    };
    /**
     * get the correct operator based on the user input
     * @param line user input to be parsed to operator
     * @return >=, <=, >, <, == (=), or != (<>)
     */
    Factory.getOperator = function (line) {
        line = line.trim();
        switch (line) {
            case ">=":
                return new LargerEqualOperator();
            case "<=":
                return new LessEqualOperator();
            case "=":
            case "==":
                return new EqualOperator();
            case "<>":
            case "!=":
                return new NotEqualOperator();
            case ">":
                return new LargerOperator();
            case "<":
                return new LessOperator();
        }
        return null;
    };
    /**
     * get the correct divider based on the user input
     * @param type input type of the divider
     * @param numRegions number of region after division
     * @param parameters parameters for the divider
     * @return EqualDivider, BinaryDivider, or SamplingDivider
     */
    Factory.getDivider = function (type, numRegions, parameters) {
        switch (type.trim()) {
            case "equal":
                return new EqualDivider(numRegions, parameters);
            case "bsp":
                return new BinaryDivider(numRegions, parameters);
            case "sampling":
                return new SamplingDivider(numRegions, parameters);
        }
        return null;
    };
    /**
     * get the specified generator by the user
     * @param type generator type
     * @param currentRegion region applied on
     * @param parameters generator parameters
     * @param rules generator rules
     * @return AutomataGenerator, AgentGenerator, or ConnectorGenerator
     */
    Factory.getGenerator = function (type, currentRegion, parameters, rules) {
        switch (type.trim()) {
            case "automata":
                return new AutomataGenerator(currentRegion, rules, parameters);
            case "agent":
                return new AgentGenerator(currentRegion, rules, parameters);
            case "connector":
                return new ConnectorGenerator(currentRegion, rules, parameters);
        }
        return null;
    };
    return Factory;
}());
/// <reference path="data/MarahelMap.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
/// <reference path="utils/Tools.ts"/>
/**
 * core class of Marahel framework
 */
var Engine = (function () {
    /**
     * constructor where it initialize different parts of Marahel
     */
    function Engine() {
        // initialize different parts of the system
        Random.initialize();
        this.replacingType = MarahelMap.REPLACE_BACK;
        this.borderType = Region.BORDER_NONE;
    }
    /**
     * Initialize the current level generator using a JSON object
     * @param data JSON object that defines the current level generator
     */
    Engine.prototype.initialize = function (data) {
        // define the maximum and minimum sizes of the generated maps
        this.minDim = new Point(parseInt(data["metadata"]["min"].split("x")[0]), parseInt(data["metadata"]["min"].split("x")[1]));
        this.maxDim = new Point(parseInt(data["metadata"]["max"].split("x")[0]), parseInt(data["metadata"]["max"].split("x")[1]));
        // define the generator's entities 
        this.entities = [];
        this.entityIndex = {};
        for (var e in data["entity"]) {
            this.entities.push(new Entity(e, data["entity"][e]));
            this.entityIndex[e] = this.entities.length - 1;
        }
        // define the generator's neighborhoods
        this.neighbors = {};
        for (var n in data["neighborhood"]) {
            this.neighbors[n] = new Neighborhood(n, data["neighborhood"][n]);
        }
        if (!("plus" in this.neighbors)) {
            this.neighbors["plus"] = new Neighborhood("plus", "010,121,010");
        }
        if (!("all" in this.neighbors)) {
            this.neighbors["all"] = new Neighborhood("all", "111,121,111");
        }
        if (!("sequential" in this.neighbors)) {
            this.neighbors["sequential"] = new Neighborhood("sequential", "31,10");
        }
        if (!("self" in this.neighbors)) {
            this.neighbors["self"] = new Neighborhood("self", "3");
        }
        // define the generator region divider
        this.regionDivider = Factory.getDivider(data["region"]["type"], parseInt(data["region"]["number"]), data["region"]["parameters"]);
        // define the modules of the current level generator
        this.generators = [];
        for (var _i = 0, _a = data["rule"]; _i < _a.length; _i++) {
            var g = _a[_i];
            var gen = Factory.getGenerator(g["type"], g["region"], g["parameters"], g["rules"]);
            if (gen != null) {
                this.generators.push(gen);
            }
            else {
                throw new Error("Undefined generator - " + g.toString());
            }
        }
    };
    /**
     * generate a new map using the defined generator
     */
    Engine.prototype.generate = function () {
        // create a map object with randomly selected dimensions between minDim and maxDim
        this.currentMap = new MarahelMap(Random.getIntRandom(this.minDim.x, this.maxDim.x), Random.getIntRandom(this.minDim.y, this.maxDim.y));
        // define a region that covers the whole map
        var mapRegion = new Region(0, 0, this.currentMap.width, this.currentMap.height);
        // get regions from the region divider, if no divider defined the regions are the whole map
        var regions = [mapRegion];
        if (this.regionDivider != null) {
            regions = this.regionDivider.getRegions(mapRegion);
        }
        // update the map using the defined generators
        for (var _i = 0, _a = this.generators; _i < _a.length; _i++) {
            var g = _a[_i];
            g.selectRegions(mapRegion, regions);
            g.applyGeneration();
        }
    };
    /**
     * get entity object using its name or index. It returns undefined entity otherwise
     * @param value name or index of the required entity
     * @return the entity selected using "value" or "undefined" entity otherwise
     */
    Engine.prototype.getEntity = function (value) {
        if (typeof value == "string") {
            value = this.getEntityIndex(value);
        }
        if (value < 0 || value >= this.entities.length) {
            return new Entity("undefined", { "color": "0x000000" });
        }
        return this.entities[value];
    };
    /**
     * get all entities defined in the system
     * @return an array of all the entities defined in the generator
     */
    Engine.prototype.getAllEntities = function () {
        return this.entities;
    };
    /**
     * get entity index using its name. returns -1 if not found
     * @param name entity name
     * @return entity index from its name. returns -1 if not found
     */
    Engine.prototype.getEntityIndex = function (name) {
        if (name in this.entityIndex) {
            return this.entityIndex[name];
        }
        return -1;
    };
    /**
     * get a neighborhood with a certain name or self neighborhood otherwise
     * @param name neighborhood name
     * @return neighborhood object with the input name or self neighborhood otherwise
     */
    Engine.prototype.getNeighborhood = function (name) {
        if (name in this.neighbors) {
            return this.neighbors[name];
        }
        return this.neighbors["self"];
    };
    return Engine;
}());
//# sourceMappingURL=Marahel.js.map