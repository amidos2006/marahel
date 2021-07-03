var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Map class that represent the current generated map
 */
var MarahelMap = /** @class */ (function () {
    /**
     * constructor for the map class
     * @param width width of the map
     * @param height height of the map
     */
    function MarahelMap(width, height) {
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
        Marahel.marahelEngine.replacingType = MarahelMap.REPLACE_SAME;
    }
    /**
     * set a certain location with an entity index
     * @param x x position
     * @param y y position
     * @param value entity index
     */
    MarahelMap.prototype.setValue = function (x, y, value) {
        var e = Marahel.marahelEngine.getEntity(value);
        if (Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_SAME) {
            this.mapValues[y][x] = value;
        }
        if (Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_BACK) {
            this.backValues[y][x] = value;
        }
    };
    MarahelMap.prototype.initializeBackBuffer = function () {
        for (var y = 0; y < this.mapValues.length; y++) {
            for (var x = 0; x < this.mapValues[y].length; x++) {
                this.backValues[y][x] = this.mapValues[y][x];
            }
        }
    };
    /**
     * switch the two buffers
     */
    MarahelMap.prototype.reflectBackBuffer = function () {
        if (Marahel.marahelEngine.replacingType == MarahelMap.REPLACE_BACK) {
            for (var y = 0; y < this.backValues.length; y++) {
                for (var x = 0; x < this.backValues[y].length; x++) {
                    this.mapValues[y][x] = this.backValues[y][x];
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
     * string representation for the current map
     * @return string corresponding to the 2D matrix of indexes
     */
    MarahelMap.prototype.toString = function () {
        var result = "";
        for (var y = 0; y < this.mapValues.length; y++) {
            for (var x = 0; x < this.mapValues[y].length; x++) {
                result += this.mapValues[y][x];
            }
            result += "\n";
        }
        return result;
    };
    /**
     * static value to define same place replacing technique
     */
    MarahelMap.REPLACE_SAME = 0;
    /**
     * static value to define back buffer replacing technique
     */
    MarahelMap.REPLACE_BACK = 1;
    return MarahelMap;
}());
/**
 * Point class carries the x and y position of the point
 */
var Point = /** @class */ (function () {
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
var Entity = /** @class */ (function () {
    /**
     * Constructor for the entity class
     * @param name entity name
     * @param parameters entity parameters such as color,
     *                   minimum number, and/or maximum number
     */
    function Entity(name, index) {
        this.name = name;
        this.index = index;
    }
    return Entity;
}());
/// <reference path="Engine.ts"/>
/**
 * the main interface for Marahel with the users
 */
var Marahel = /** @class */ (function () {
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
    Marahel.generate = function (indeces, callback, seed) {
        if (!Marahel.marahelEngine) {
            throw new Error("Call initialize first.");
        }
        if (seed) {
            Random.changeSeed(seed);
        }
        this.marahelEngine.generate(callback);
        if (indeces) {
            return this.marahelEngine.currentMap.getIndexMap();
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
/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>
/**
 *
 */
var Region = /** @class */ (function () {
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
        this.regionLocations = [];
        for (var x_1 = 0; x_1 < this.width; x_1++) {
            for (var y_1 = 0; y_1 < this.height; y_1++) {
                this.regionLocations.push(new Point(x_1 + this.x, y_1 + this.y));
            }
        }
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
     * get x position of the region
     * @return x position
     */
    Region.prototype.getX = function () {
        return this.x;
    };
    /**
     * get y position of the region
     * @return y position
     */
    Region.prototype.getY = function () {
        return this.y;
    };
    /**
     * get width of the region
     * @return width of the region
     */
    Region.prototype.getWidth = function () {
        return this.width;
    };
    /**
     * get height of the region
     * @return height of the region
     */
    Region.prototype.getHeight = function () {
        return this.height;
    };
    Region.prototype.getRegionLocations = function () {
        return this.regionLocations;
    };
    /**
     * check if the input point is in region or not
     * @param x input x position
     * @param y input y position
     * @return true if the input location in the region or false otherwise
     */
    Region.prototype.inRegion = function (x, y) {
        return (x >= this.getX() && y >= this.getY() &&
            x < this.getX() + this.getWidth() && y < this.getY() + this.getHeight());
    };
    /**
     * set the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @param value
     */
    Region.prototype.setValue = function (x, y, value) {
        if (!this.inRegion(x, y)) {
            return;
        }
        Marahel.marahelEngine.currentMap.setValue(x, y, value);
    };
    /**
     * Get the value of a certain location in this region
     * @param x input x position
     * @param y input y position
     * @return entity index of the specified location
     */
    Region.prototype.getValue = function (x, y) {
        if (!this.inRegion(x, y)) {
            return Marahel.marahelEngine.outValue;
        }
        return Marahel.marahelEngine.currentMap.getValue(x, y);
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
     * Get estimated manhattan distance between start point and certain entity index
     * @param start starting location
     * @param value entity index
     * @return array of distances between current location and all entities with index "value"
     */
    Region.prototype.getDistances = function (start, value) {
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
                this.intersect(new Point(pr.x + pr.width - 1, pr.y)) ||
                this.intersect(new Point(pr.x, pr.y + this.height - 1)) ||
                this.intersect(new Point(pr.x + this.width - 1, pr.y + this.height - 1)) ||
                pr.intersect(new Point(this.x, this.y)) ||
                pr.intersect(new Point(this.x + this.width - 1, this.y)) ||
                pr.intersect(new Point(this.x, this.y + this.height - 1)) ||
                pr.intersect(new Point(this.x + this.width - 1, this.y + this.height - 1));
        }
        else {
            return pr.x >= this.x && pr.y >= this.y &&
                pr.x < this.x + this.width && pr.y < this.y + this.height;
        }
    };
    return Region;
}());
/// <reference path="Point.ts"/>
/**
 * Group class is a helper class to the connector algorithm
 */
var Group = /** @class */ (function () {
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
            result.y += p.y;
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
                return Random.getRandom() - 0.5;
            }
            return d1 - d2;
        });
    };
    Group.prototype.rankSelection = function () {
        if (this.points.length == 0) {
            return null;
        }
        var prob = [];
        var total = this.points.length;
        prob.push(this.points.length);
        for (var i = 1; i < this.points.length; i++) {
            prob.push(this.points.length - i + prob[i - 1]);
            total += this.points.length - i;
        }
        var random = Random.getRandom();
        for (var i = 0; i < this.points.length; i++) {
            if (random < prob[i] / total) {
                return this.points[i];
            }
        }
        return this.points[this.points.length - 1];
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
/// <reference path="../Marahel.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="Group.ts"/>
/**
 * Neighborhood class carries information about the user defined neighborhoods
 */
var Neighborhood = /** @class */ (function () {
    /**
     * Constructor for neighborhood class
     * @param name name of the neighborhood
     * @param line input definition of the neighborhood
     */
    function Neighborhood(name, line) {
        if (line.trim().length == 0) {
            throw new Error("Neighborhood " + name + " should have a definition matrix.");
        }
        line = line.replace("\n", "");
        line = line.replace("\t", "");
        line = line.replace(" ", "");
        if (line.match(/[^0-3\,]+/)) {
            throw new Error("Neighborhoods must only contain numbers from 0 to 3 and commas.");
        }
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
        var temp = Marahel.marahelEngine.outValue;
        if (value == -2) {
            Marahel.marahelEngine.outValue = -2;
        }
        var result = 0;
        for (var i = 0; i < this.locations.length; i++) {
            if (region.getValue(this.locations[i].x + center.x, this.locations[i].y + center.y) == value) {
                result += 1;
            }
        }
        if (value == -2) {
            Marahel.marahelEngine.outValue = temp;
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
            var p = new Point(x + l.x, y + l.y);
            if (region.inRegion(p.x, p.y)) {
                result.push(p);
            }
        }
        return result;
    };
    /**
     * flood fill algorithm to label the map and get unconnected groups and areas
     * @param x x position
     * @param y y position
     * @param label current label
     * @param labelBoard current labelling board to change
     * @param region current region
     */
    Neighborhood.prototype.floodFill = function (x, y, entities, label, labelBoard, region) {
        if (labelBoard[y][x] != -1) {
            return;
        }
        labelBoard[y][x] = label;
        var neighborLocations = this.getNeighbors(x, y, region);
        for (var _i = 0, neighborLocations_1 = neighborLocations; _i < neighborLocations_1.length; _i++) {
            var p = neighborLocations_1[_i];
            if (entities.indexOf(region.getValue(p.x, p.y)) >= 0) {
                this.floodFill(p.x, p.y, entities, label, labelBoard, region);
            }
        }
    };
    /**
     * Get all unconnected groups
     * @param region current applied region
     * @return an array of all unconnected groups
     */
    Neighborhood.prototype.getGroups = function (entities, region) {
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
                    if (entities.indexOf(region.getValue(x + region.getX(), y + region.getY())) >= 0) {
                        this.floodFill(x, y, entities, label, labelBoard, region);
                        label += 1;
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
     * get a string representation for this neighborhood
     * @return a string represent this neighborhood
     */
    Neighborhood.prototype.toString = function () {
        return this.name + "\n" + this.printing + "\nRelative locations\n" + this.locations;
    };
    return Neighborhood;
}());
// https://github.com/zeh/prando
var Prando = /** @class */ (function () {
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
    Prando.MIN = -2147483648; // Int32 min
    Prando.MAX = 2147483647; // Int32 max
    return Prando;
}());
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
var Grad = /** @class */ (function () {
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
var Noise = /** @class */ (function () {
    function Noise(seed) {
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
        this.seed(seed);
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
        if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 1;
            j1 = 0;
        }
        else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
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
var SamplingDivider = /** @class */ (function () {
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
        this.samplingTrials = -1;
        if (parameters) {
            var parts = [];
            if (parameters["min"]) {
                parts = parameters["min"].split("x");
                this.minWidth = parseInt(parts[0]);
                this.minHeight = this.minWidth;
                if (parts.length > 1) {
                    this.minHeight = parseInt(parts[1]);
                }
                this.maxWidth = this.minWidth;
                this.maxHeight = this.minHeight;
            }
            if (parameters["max"]) {
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = this.maxWidth;
                if (parts.length > 1) {
                    this.maxHeight = parseInt(parts[1]);
                }
            }
            if (parameters["trials"]) {
                this.samplingTrials = parseInt(parameters["trials"]);
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
            if (cr == r)
                continue;
            if (cr.intersect(r)) {
                return cr;
            }
        }
        return null;
    };
    /**
     * change the current region to a new one
     * @param map generated map region to define the map boundaries
     * @param r region object to be changed
     */
    SamplingDivider.prototype.randomChange = function (r, map) {
        var x = r.getX();
        var y = r.getY();
        var w = r.getWidth();
        var h = r.getHeight();
        if (Random.getRandom() < 0.7) {
            if (Random.getRandom() < 0.7) {
                var v = Random.getIntRandom(0, 4);
                switch (v) {
                    case 0:
                        r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
                        break;
                    case 1:
                        r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
                        break;
                    case 2:
                        r.setWidth(Random.getIntRandom(this.minWidth, Math.min(this.maxWidth, map.getWidth() - r.getX())));
                        break;
                    case 3:
                        r.setHeight(Random.getIntRandom(this.minHeight, Math.min(this.maxHeight, map.getHeight() - r.getY())));
                        break;
                }
            }
            else {
                if (Random.getRandom() < 0.7) {
                    r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
                    r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
                }
                else {
                    r.setWidth(Random.getIntRandom(this.minWidth, Math.min(this.maxWidth, map.getWidth() - r.getX())));
                    r.setHeight(Random.getIntRandom(this.minHeight, Math.min(this.maxHeight, map.getHeight() - r.getY())));
                }
            }
        }
        else {
            r.setWidth(Random.getIntRandom(this.minWidth, this.maxWidth));
            r.setHeight(Random.getIntRandom(this.minHeight, this.maxHeight));
            r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
            r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
        }
        return x != r.getX() || y != r.getY() || w != r.getWidth() || h != r.getHeight();
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
        var r = new Region(0, 0, Random.getIntRandom(this.minWidth, this.maxWidth), Random.getIntRandom(this.minHeight, this.maxHeight));
        r.setX(Random.getIntRandom(0, map.getWidth() - r.getWidth()));
        r.setY(Random.getIntRandom(0, map.getHeight() - r.getHeight()));
        for (var i = 0; i < this.samplingTrials; i++) {
            var cr = this.checkIntersection(r, regions);
            if (cr == null) {
                break;
            }
            var change = false;
            while (!change) {
                var value = Random.getRandom();
                if (value < 0.6) {
                    change = change || this.moveRegions(r, cr, map);
                }
                else if (value < 0.9) {
                    change = change || this.randomChange(r, map);
                }
                else {
                    change = change || this.adjustRegions(r, cr);
                }
            }
        }
        return r;
    };
    SamplingDivider.prototype.moveRegions = function (r1, r2, map) {
        var x1 = r1.getX();
        var y1 = r1.getY();
        var w1 = r1.getWidth();
        var h1 = r1.getHeight();
        var x2 = r2.getX();
        var y2 = r2.getY();
        var w2 = r2.getWidth();
        var h2 = r2.getHeight();
        var dx = r1.getX() + r1.getWidth() - r2.getX();
        var dy = r1.getY() + r1.getHeight() - r2.getY();
        if (Random.getRandom() < 0.5) {
            if (Random.getRandom() < 0.5) {
                r1.setX(Math.max(0, r1.getX() - dx));
            }
            else {
                r1.setY(Math.max(0, r1.getY() - dy));
            }
        }
        else {
            if (Random.getRandom() < 0.5) {
                r2.setX(Math.min(r2.getX() + dx, map.getWidth() - r2.getWidth()));
            }
            else {
                r2.setY(Math.min(r2.getY() + dy, map.getHeight() - r2.getHeight()));
            }
        }
        return x1 != r1.getX() || y1 != r1.getY() || w1 != r1.getWidth() || h1 != r1.getHeight() ||
            x2 != r2.getX() || y2 != r2.getY() || w2 != r2.getWidth() || h2 != r2.getHeight();
    };
    SamplingDivider.prototype.adjustRegions = function (r1, r2) {
        var x1 = r1.getX();
        var y1 = r1.getY();
        var w1 = r1.getWidth();
        var h1 = r1.getHeight();
        var x2 = r2.getX();
        var y2 = r2.getY();
        var w2 = r2.getWidth();
        var h2 = r2.getHeight();
        var dx = Math.abs(r1.getX() + r1.getWidth() - r2.getX());
        var dy = Math.abs(r1.getY() + r1.getHeight() - r2.getY());
        if (Random.getRandom() < 0.5) {
            if (Random.getRandom() < 0.5) {
                r1.setWidth(Random.getIntRandom(this.minWidth, Math.max(this.minWidth, r1.getWidth() - dx)));
            }
            else {
                r1.setHeight(Random.getIntRandom(this.minHeight, Math.max(this.minHeight, r1.getHeight() - dy)));
            }
        }
        else {
            if (Random.getRandom() < 0.5) {
                r2.setWidth(Random.getIntRandom(this.minWidth, Math.max(this.minWidth, r2.getWidth() - dx)));
            }
            else {
                r2.setHeight(Random.getIntRandom(this.minHeight, Math.max(this.minHeight, r2.getHeight() - dy)));
            }
        }
        return x1 != r1.getX() || y1 != r1.getY() || w1 != r1.getWidth() || h1 != r1.getHeight() ||
            x2 != r2.getX() || y2 != r2.getY() || w2 != r2.getWidth() || h2 != r2.getHeight();
    };
    /**
     * divide the map into different regions using sampling
     * @param map generated map
     * @return an array of regions that are selected using sampling methodology
     */
    SamplingDivider.prototype.getRegions = function (map) {
        var autoSampling = false;
        if (this.samplingTrials == -1) {
            autoSampling = true;
            this.samplingTrials = Math.pow(10, Math.pow(this.numberOfRegions, 2) /
                ((map.getWidth() * map.getHeight()) / (this.minWidth * this.minHeight)));
            this.samplingTrials = Math.min(10000, Math.max(100, this.samplingTrials));
        }
        var results = [];
        while (results.length < this.numberOfRegions) {
            results.push(this.getFitRegion(map, results));
        }
        var noIntersection = false;
        var trials = 0;
        while (!noIntersection && trials < this.samplingTrials) {
            noIntersection = true;
            trials += 1;
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var r = results_1[_i];
                var cr = this.checkIntersection(r, results);
                if (cr != null) {
                    noIntersection = false;
                    var change = false;
                    while (!change) {
                        var value = Random.getRandom();
                        if (value < 0.6) {
                            change = change || this.moveRegions(r, cr, map);
                        }
                        else if (value < 0.9) {
                            change = change || this.randomChange(r, map);
                        }
                        else {
                            change = change || this.adjustRegions(r, cr);
                        }
                    }
                }
            }
        }
        if (autoSampling) {
            this.samplingTrials = -1;
        }
        return results;
    };
    return SamplingDivider;
}());
/// <reference path="DividerInterface.ts"/>
/**
 * Binary Space Partitioning Algorithm
 */
var BinaryDivider = /** @class */ (function () {
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
                this.minHeight = this.minWidth;
                if (parts.length > 1) {
                    this.minHeight = parseInt(parts[1]);
                }
            }
            if (parameters["max"]) {
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = this.maxWidth;
                if (parts.length > 1) {
                    this.maxHeight = parseInt(parts[1]);
                }
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
        var rWidth = this.minWidth + Random.getIntRandom(0, allowedWidth + 1);
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
        var rHeight = this.minHeight + Random.getIntRandom(0, allowedHeight + 1);
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
     * maxWidth or maxHeight
     * @param regions all the regions
     * @return true if any of the regions have the width or the height
     *         bigger than maxWidth or maxHeight
     */
    BinaryDivider.prototype.checkMaxSize = function (regions) {
        for (var _i = 0, regions_2 = regions; _i < regions_2.length; _i++) {
            var r = regions_2[_i];
            if (r.getWidth() > this.maxWidth || r.getHeight() > this.maxHeight) {
                return true;
            }
        }
        return false;
    };
    /**
     * divided the on the maximum size dimension
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
            if (prevLength == results.length) {
                var max_index = 0;
                var max_value = 0;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].getWidth() > max_value) {
                        max_index = i;
                        max_value = results[i].getWidth();
                    }
                    if (results[i].getHeight() > max_value) {
                        max_index = i;
                        max_value = results[i].getHeight();
                    }
                }
                results.concat(this.divideMaxSize(results.splice(max_index, 1)[0]));
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
var EqualDivider = /** @class */ (function () {
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
                this.minHeight = this.minWidth;
                if (parts.length > 1) {
                    this.minHeight = parseInt(parts[1]);
                }
                this.maxWidth = this.minWidth;
                this.maxHeight = this.minHeight;
            }
            if (parameters["max"]) {
                parts = parameters["max"].split("x");
                this.maxWidth = parseInt(parts[0]);
                this.maxHeight = this.maxWidth;
                if (parts.length > 1) {
                    this.maxHeight = parseInt(parts[1]);
                }
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
        for (var x = 0; x < currentWidth; x++) {
            for (var y = 0; y < currentHeight; y++) {
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
var LargerEqualOperator = /** @class */ (function () {
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
var LessEqualOperator = /** @class */ (function () {
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
var LargerOperator = /** @class */ (function () {
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
var LessOperator = /** @class */ (function () {
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
var EqualOperator = /** @class */ (function () {
    function EqualOperator() {
    }
    /**
     * check the leftValue is equal to the rightValue
     * @param leftValue the value on the left hand side
     * @param rightValue the value on the right hand side
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
var NotEqualOperator = /** @class */ (function () {
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
var NeighborhoodEstimator = /** @class */ (function () {
    /**
     * Constructor for the neighborhood estimator
     * @param line user input
     */
    function NeighborhoodEstimator(line) {
        var parts = line.split(/\((.+)\)/);
        if (parts.length <= 1) {
            throw new Error("Neighborhood estimator is not in the correct format: NeighborhoodName(entity).");
        }
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
    NeighborhoodEstimator.prototype.calculate = function (singleperc, changeperc, repeatperc, position, region) {
        var result = 0;
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            result += this.neighbor.getTotal(entity.index, position, region);
        }
        return result;
    };
    NeighborhoodEstimator.prototype.numberOfOnes = function () {
        return this.neighbor.locations.length;
    };
    return NeighborhoodEstimator;
}());
/// <reference path="EstimatorInterface.ts"/>
/**
 * Number estimator is most common used estimator. It can return completion percentage,
 * random value, noise value, constant value, or number of entities in the selected region
 */
var NumberEstimator = /** @class */ (function () {
    /**
     * Constructor for Number Estimator
     * @param line user input
     */
    function NumberEstimator(line) {
        this.name = line;
        if (this.name != "percent" && this.name != "rpercent" && this.name != "cperct" &&
            this.name != "random" && this.name.indexOf("noise") == -1 &&
            isNaN(parseFloat(this.name)) &&
            Marahel.marahelEngine.getEntityIndex(this.name) == -1) {
            throw new Error("Undefined name estimator.");
        }
    }
    /**
     * Calculates the value for the specified name
     * @param iteration completion percentage
     * @param position current position
     * @param region current region
     * @return estimated value for the name
     */
    NumberEstimator.prototype.calculate = function (singleperc, changeperc, repeatperc, position, region) {
        if (this.name == "percent") {
            return singleperc;
        }
        if (this.name == "cpercent") {
            return changeperc;
        }
        if (this.name == "rpercent") {
            return repeatperc;
        }
        if (this.name == "random") {
            return Random.getRandom();
        }
        if (this.name == "noise") {
            return Random.getNoise((position.x - region.getX()) / region.getWidth(), (position.y - region.getY()) / region.getHeight());
        }
        if (this.name == "noise2") {
            return Random.getNoise((position.x - region.getX()) / (2 * region.getWidth()), (position.y - region.getY()) / (2 * region.getHeight()));
        }
        if (isNaN(parseFloat(this.name))) {
            if (this.name == "out") {
                return 0;
            }
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
var DistanceEstimator = /** @class */ (function () {
    /**
     * Constructor for the distance estimator
     * @param line input line by user
     */
    function DistanceEstimator(line) {
        var parts = line.split(/\((.+)\)/);
        if (parts.length <= 1) {
            throw new Error("Distance estimator is not in the correct format: DistanceEstimatorName(entity)");
        }
        this.entities = EntityListParser.parseList(parts[0]);
        this.hasOut = false;
        if (this.entities.length == 1 && this.entities[0].name == "out") {
            this.hasOut = true;
        }
    }
    /**
     * get the distance from the current location to a specified sprite
     * @param iteration percentage of the current generator
     * @param position current position
     * @param region current region
     * @return distance from the current position to the specified entity
     */
    DistanceEstimator.prototype.calculate = function (singleperc, changeperc, repeatperc, position, region) {
        if (this.hasOut) {
            var min_1 = position.x - region.getX();
            if (position.y - region.getY() < min_1) {
                min_1 = position.y - region.getY();
            }
            if (region.getWidth() - (position.x - region.getX()) < min_1) {
                min_1 = region.getWidth() - (position.x - region.getX());
            }
            if (region.getHeight() - (position.y - region.getY()) < min_1) {
                min_1 = region.getHeight() - (position.y - region.getY());
            }
            return min_1;
        }
        var min = -1;
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            var dists = region.getDistances(position, e.index);
            for (var _b = 0, dists_1 = dists; _b < dists_1.length; _b++) {
                var d = dists_1[_b];
                if (min == -1 || d < min) {
                    min = d;
                }
            }
        }
        return min;
    };
    return DistanceEstimator;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>
/**
 * Condition class is used as a part of the Rule class (Left hand side of any rule)
 */
var Condition = /** @class */ (function () {
    /**
     * Constructor for the condition class
     * @param line user input line
     */
    function Condition(line) {
        if (line.trim().length == 0) {
            line = "self(any)";
        }
        var cParts = line.split(/>=|<=|==|!=|>|</);
        this.leftSide = Factory.getEstimator(cParts[0].trim());
        if (cParts.length > 1) {
            this.operator = Factory.getOperator(line.match(/>=|<=|==|!=|>|</)[0].trim());
            this.rightSide = Factory.getEstimator(cParts[1].trim());
        }
        else {
            this.operator = Factory.getOperator(">");
            this.rightSide = Factory.getEstimator("0");
            if (this.leftSide instanceof NeighborhoodEstimator) {
                this.rightSide = Factory.getEstimator((this.leftSide.
                    numberOfOnes() - 1).toString());
            }
        }
    }
    /**
     * Check if the condition is true or false including all the anded conditions
     * @param iteration the percentage of completion of the generator
     * @param position the current position where the algorithm is testing
     * @param region allowed region to check on
     * @return true if all conditions are true and false otherwise
     */
    Condition.prototype.check = function (singleperc, changeperc, repeatperc, position, region) {
        var left = this.leftSide.calculate(singleperc, changeperc, repeatperc, position, region);
        var right = this.rightSide.calculate(singleperc, changeperc, repeatperc, position, region);
        if ((this.leftSide instanceof DistanceEstimator && left == -1) ||
            (this.rightSide instanceof DistanceEstimator && right == -1)) {
            return true;
        }
        return this.operator.check(left, right);
    };
    return Condition;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../data/Neighborhood.ts"/>
/// <reference path="../data/Entity.ts"/>
/**
 * Executer class (Right hand side of the rule)
 */
var Executer = /** @class */ (function () {
    /**
     * Constructor for the executer class
     * @param line user input data
     */
    function Executer(line) {
        if (line.trim().length == 0) {
            line = "self(any)";
        }
        var eParts = line.split(/\((.+)\)/);
        this.neighbor = Marahel.marahelEngine.getNeighborhood(eParts[0].trim());
        this.entities = EntityListParser.parseList(eParts[1].trim());
    }
    /**
     * Apply all the executers on the current selected region
     * @param position current position of the generator
     * @param region allowed region to apply the executer
     */
    Executer.prototype.apply = function (position, region) {
        var entity = this.entities[Random.getIntRandom(0, this.entities.length)].index;
        this.neighbor.setTotal(entity, position, region);
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
var Rule = /** @class */ (function () {
    /**
     * Constructor for the Rule class
     * @param lines user input rules
     */
    function Rule(line) {
        var parts = line.split("->");
        if (parts.length < 0) {
            throw new Error("Rules should have -> in it.");
        }
        this.conditions = [];
        var conditions = parts[0].split(",");
        for (var _i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
            var c = conditions_1[_i];
            this.conditions.push(new Condition(c));
        }
        this.executers = [];
        var executers = parts[1].split(",");
        for (var _a = 0, executers_1 = executers; _a < executers_1.length; _a++) {
            var e = executers_1[_a];
            this.executers.push(new Executer(e));
        }
    }
    /**
     * Execute the rule chain on the current region
     * @param iteration the percentage of the finished generator
     * @param position the current position of the generator
     * @param region current selected region
     * @return true if any of the rules has been applied and false otherwise
     */
    Rule.prototype.execute = function (singleperc, changePerc, repeatperc, position, region) {
        var result = true;
        for (var _i = 0, _a = this.conditions; _i < _a.length; _i++) {
            var c = _a[_i];
            result = result && c.check(singleperc, changePerc, repeatperc, position, region);
        }
        if (result) {
            for (var _b = 0, _c = this.executers; _b < _c.length; _b++) {
                var e = _c[_b];
                e.apply(position, region);
            }
            return true;
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
var Explorer = /** @class */ (function () {
    /**
     * Constructor for the generator class
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     */
    function Explorer(regionNames, parameters, rules) {
        this.regionNames = regionNames;
        this.rules = [];
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var r = rules_1[_i];
            this.rules.push(new Rule(r));
        }
        this.replacingType = MarahelMap.REPLACE_SAME;
        if (parameters["replace"]) {
            if (parameters["replace"].trim() == "buffer") {
                this.replacingType = MarahelMap.REPLACE_BACK;
            }
        }
        this.outValue = Engine.OUT_VALUE;
        if (parameters["out"]) {
            this.outValue = Marahel.marahelEngine.getEntityIndex(parameters["out"]);
        }
        this.max_repeats = 1;
        if (parameters["repeats"]) {
            this.max_repeats = parseInt(parameters["repeats"]);
        }
        this.visited_tiles = 0;
        this.max_tiles = -1;
        if (parameters["tiles"]) {
            this.max_tiles = parseInt(parameters["tiles"]);
        }
        this.changed_tiles = 0;
        this.max_changed_tiles = -1;
        if (parameters["changes"]) {
            this.max_changed_tiles = parseInt(parameters["changes"]);
        }
    }
    Explorer.prototype.getTilesPercentage = function (region) {
        if (this.max_tiles == -1) {
            return this.visited_tiles / region.getWidth() * region.getHeight();
        }
        return this.visited_tiles / this.max_tiles;
    };
    Explorer.prototype.getChangePercentage = function (region) {
        if (this.max_changed_tiles == -1) {
            return this.changed_tiles / region.getWidth() * region.getHeight();
        }
        return this.changed_tiles / this.max_changed_tiles;
    };
    Explorer.prototype.getRepeatPercentage = function () {
        return this.repeats / this.max_repeats;
    };
    Explorer.prototype.checkRepeatTermination = function (region) {
        return this.getTilesPercentage(region) >= 1 ||
            this.getChangePercentage(region) >= 1;
    };
    /**
     * Apply the generation algorithm on the regions array
     */
    Explorer.prototype.applyRepeat = function (region) {
        var currentLocation = this.restartRepeat(region);
        while (!this.checkRepeatTermination(region)) {
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var r = _a[_i];
                if (r.execute(this.getTilesPercentage(region), this.getChangePercentage(region), this.getRepeatPercentage(), currentLocation, region)) {
                    this.changed_tiles += 1;
                    break;
                }
            }
            currentLocation = this.getNextLocation(currentLocation, region);
            this.visited_tiles += 1;
        }
    };
    Explorer.prototype.applyRegion = function (mapRegion, regions) {
        this.regions = [];
        for (var _i = 0, _a = this.regionNames; _i < _a.length; _i++) {
            var r = _a[_i];
            if (r.trim() == "map") {
                this.regions.push(mapRegion);
            }
            if (r.trim() == "all") {
                if (regions.length == 0) {
                    this.regions.push(mapRegion);
                }
                else {
                    this.regions = this.regions.concat(regions);
                }
            }
            if (!isNaN(parseInt(r.trim()))) {
                if (regions.length == 0) {
                    this.regions.push(mapRegion);
                }
                else {
                    this.regions.push(regions[parseInt(r.trim())]);
                }
            }
        }
        if (this.max_tiles == -1 || this.max_changed_tiles == -1) {
            var maxArea = 0;
            for (var _b = 0, _c = this.regions; _b < _c.length; _b++) {
                var r = _c[_b];
                var tempArea = r.getWidth() * r.getHeight();
                if (tempArea > maxArea) {
                    maxArea = tempArea;
                }
            }
            if (this.max_tiles == -1) {
                this.max_tiles = maxArea;
            }
            if (this.max_changed_tiles == -1) {
                this.max_changed_tiles = maxArea;
            }
        }
    };
    /**
     * Run the explorer
     */
    Explorer.prototype.runExplorer = function () {
        Marahel.marahelEngine.outValue = this.outValue;
        Marahel.marahelEngine.replacingType = this.replacingType;
        this.repeats = 0;
        while (this.getRepeatPercentage() < 1) {
            for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
                var r = _a[_i];
                Marahel.marahelEngine.currentMap.initializeBackBuffer();
                this.visited_tiles = 0;
                this.changed_tiles = 0;
                this.applyRepeat(r);
                if (this.replacingType == MarahelMap.REPLACE_BACK) {
                    Marahel.marahelEngine.currentMap.reflectBackBuffer();
                }
            }
            this.repeats += 1;
        }
    };
    return Explorer;
}());
/// <reference path="Explorer.ts"/>
/**
 * Automata Generator class
 */
var NarrowExplorer = /** @class */ (function (_super) {
    __extends(NarrowExplorer, _super);
    function NarrowExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NarrowExplorer.prototype.restartRepeat = function (region) {
        return new Point(Random.getIntRandom(region.getX(), region.getX() + region.getWidth()), Random.getIntRandom(region.getY(), region.getY() + region.getHeight()));
    };
    return NarrowExplorer;
}(Explorer));
/// <reference path="NarrowExplorer.ts"/>
var HorizontalNarrowExplorer = /** @class */ (function (_super) {
    __extends(HorizontalNarrowExplorer, _super);
    function HorizontalNarrowExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HorizontalNarrowExplorer.prototype.getNextLocation = function (currentLocation, region) {
        var newPoint = new Point(currentLocation.x, currentLocation.y);
        newPoint.x += 1;
        if (!region.inRegion(newPoint.x, newPoint.y)) {
            newPoint.x -= region.getWidth();
            newPoint.y += 1;
            if (!region.inRegion(newPoint.x, newPoint.y)) {
                newPoint.y -= region.getHeight();
            }
        }
        return newPoint;
    };
    return HorizontalNarrowExplorer;
}(NarrowExplorer));
/// <reference path="NarrowExplorer.ts"/>
var VerticalNarrowExplorer = /** @class */ (function (_super) {
    __extends(VerticalNarrowExplorer, _super);
    function VerticalNarrowExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerticalNarrowExplorer.prototype.getNextLocation = function (currentLocation, region) {
        var newPoint = new Point(currentLocation.x, currentLocation.y);
        newPoint.y += 1;
        if (!region.inRegion(newPoint.x, newPoint.y)) {
            newPoint.y -= region.getHeight();
            newPoint.x += 1;
            if (!region.inRegion(newPoint.x, newPoint.y)) {
                newPoint.x -= region.getWidth();
            }
        }
        return newPoint;
    };
    return VerticalNarrowExplorer;
}(NarrowExplorer));
/// <reference path="NarrowExplorer.ts"/>
var RandomNarrowExplorer = /** @class */ (function (_super) {
    __extends(RandomNarrowExplorer, _super);
    function RandomNarrowExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RandomNarrowExplorer.prototype.getNextLocation = function (currentLocation, region) {
        return new Point(Random.getIntRandom(region.getX(), region.getX() + region.getWidth()), Random.getIntRandom(region.getY(), region.getY() + region.getHeight()));
    };
    return RandomNarrowExplorer;
}(NarrowExplorer));
/// <reference path="Explorer.ts"/>
/**
 * Agent based generator
 */
var TurtleExplorer = /** @class */ (function (_super) {
    __extends(TurtleExplorer, _super);
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    function TurtleExplorer(regionNames, parameters, rules) {
        var _this = _super.call(this, regionNames, parameters, rules) || this;
        _this.directions = Marahel.marahelEngine.getNeighborhood("plus");
        if (parameters["directions"]) {
            _this.directions = Marahel.marahelEngine.getNeighborhood(parameters["directions"]);
        }
        return _this;
    }
    TurtleExplorer.prototype.restartRepeat = function (region) {
        return new Point(Random.getIntRandom(region.getX(), region.getX() + region.getWidth()), Random.getIntRandom(region.getY(), region.getY() + region.getHeight()));
    };
    return TurtleExplorer;
}(Explorer));
/// <reference path="TurtleExplorer.ts"/>
var DrunkTurtleExplorer = /** @class */ (function (_super) {
    __extends(DrunkTurtleExplorer, _super);
    function DrunkTurtleExplorer(regionNames, parameters, rules) {
        var _this = _super.call(this, regionNames, parameters, rules) || this;
        _this.change_prob = 0.1;
        if (parameters["dirprob"]) {
            _this.change_prob = parseFloat(parameters["dirprob"]);
        }
        return _this;
    }
    DrunkTurtleExplorer.prototype.restartRepeat = function (region) {
        var dir = Random.choiceArray(this.directions.locations);
        this.dir = new Point(dir.x, dir.y);
        return _super.prototype.restartRepeat.call(this, region);
    };
    DrunkTurtleExplorer.prototype.getNextLocation = function (currentLocation, region) {
        var newX = currentLocation.x + this.dir.x;
        var newY = currentLocation.y + this.dir.y;
        if (Random.getRandom() < this.change_prob || !region.inRegion(newX, newY)) {
            var dir = Random.choiceArray(this.directions.locations);
            this.dir.x = dir.x;
            this.dir.y = dir.y;
        }
        newX = currentLocation.x + this.dir.x;
        newY = currentLocation.y + this.dir.y;
        if (region.inRegion(newX, newY)) {
            return new Point(newX, newY);
        }
        return currentLocation;
    };
    return DrunkTurtleExplorer;
}(TurtleExplorer));
/// <reference path="TurtleExplorer.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
var HeuristicTurtleExplorer = /** @class */ (function (_super) {
    __extends(HeuristicTurtleExplorer, _super);
    function HeuristicTurtleExplorer(regionNames, parameters, rules) {
        var _this = _super.call(this, regionNames, parameters, rules) || this;
        _this.estimators = [];
        var parts = parameters["heuristics"].split(",");
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var p = parts_1[_i];
            _this.estimators.push(Factory.getEstimator(p));
        }
        return _this;
    }
    HeuristicTurtleExplorer.prototype.getNextLocation = function (currentLocation, region) {
        var newlocs = this.directions.getNeighbors(currentLocation.x, currentLocation.y, region);
        newlocs.sort(function (l1, l2) {
            for (var _i = 0, _a = this.estimators; _i < _a.length; _i++) {
                var e = _a[_i];
                var v1 = e.calculate(this.getTilesPercentage(region), this.getChangePercentage(region), this.getRepeatPercentage(), l1, region);
                var v2 = e.calculate(this.getTilesPercentage(region), this.getChangePercentage(region), this.getRepeatPercentage(), l2, region);
                if (v1 != v2) {
                    return v1 - v2;
                }
            }
            return Random.getRandom() - 0.5;
        }.bind(this));
        return newlocs[0];
    };
    return HeuristicTurtleExplorer;
}(TurtleExplorer));
/// <reference path="TurtleExplorer.ts"/>
/// <reference path="../data/Group.ts"/>
/// <reference path="../Marahel.ts"/>
var ConnectTurtleExplorer = /** @class */ (function (_super) {
    __extends(ConnectTurtleExplorer, _super);
    function ConnectTurtleExplorer(regionNames, parameters, rules) {
        var _this = _super.call(this, regionNames, parameters, rules) || this;
        var entities = EntityListParser.parseList("entity");
        if (parameters["entities"]) {
            entities = EntityListParser.parseList(parameters["entities"]);
        }
        _this.entities = [];
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var e = entities_1[_i];
            _this.entities.push(e.index);
        }
        return _this;
    }
    ConnectTurtleExplorer.prototype.restartRepeat = function (region) {
        this.tie_breaker = 2 * Random.getIntRandom(0, 2) - 1;
        var groups = this.directions.getGroups(this.entities, region);
        if (groups.length == 0) {
            this.waypoints = [];
            this.total_waypoints = 1;
            return new Point(region.getX(), region.getY());
        }
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var g = groups_1[_i];
            g.sort(g.getCenter());
        }
        var centers = new Group();
        for (var _a = 0, groups_2 = groups; _a < groups_2.length; _a++) {
            var g = groups_2[_a];
            var p = g.rankSelection();
            centers.addPoint(p.x, p.y);
        }
        Random.shuffleArray(centers.points);
        this.waypoints = [];
        var prevPoint = centers.points[0];
        var currentPoint = centers.points[0];
        while (centers.points.length > 0) {
            centers.points.splice(centers.points.indexOf(currentPoint), 1);
            this.waypoints.push(currentPoint);
            if (Random.getRandom() < 0.25) {
                this.waypoints.push(new Point(prevPoint.x, prevPoint.y));
                currentPoint = new Point(prevPoint.x, prevPoint.y);
            }
            centers.sort(currentPoint);
            prevPoint = currentPoint;
            currentPoint = centers.rankSelection();
        }
        if (Random.getRandom() < 0.5 && this.waypoints.length > 1) {
            var p = Random.choiceArray(this.waypoints.slice(0, this.waypoints.length - 1));
            this.waypoints.push(new Point(p.x, p.y));
        }
        this.total_waypoints = this.waypoints.length;
        return new Point(this.waypoints[0].x, this.waypoints[0].y);
    };
    ConnectTurtleExplorer.prototype.getNextLocation = function (currentLocation, region) {
        var target = this.waypoints[0];
        if (currentLocation.x == target.x && currentLocation.y == target.y) {
            this.waypoints.splice(0, 1);
            if (this.waypoints.length == 0) {
                return currentLocation;
            }
            target = this.waypoints[0];
        }
        var newlocs = this.directions.getNeighbors(currentLocation.x, currentLocation.y, region);
        newlocs.sort(function (l1, l2) {
            var dist1 = Math.abs(l1.x - target.x) + Math.abs(l1.y - target.y);
            var dist2 = Math.abs(l2.x - target.x) + Math.abs(l2.y - target.y);
            if (dist1 == dist2) {
                return this.tie_breaker;
            }
            return dist1 - dist2;
        });
        return newlocs[0];
    };
    ConnectTurtleExplorer.prototype.checkRepeatTermination = function (region) {
        return _super.prototype.checkRepeatTermination.call(this, region) || this.waypoints.length == 0;
    };
    ConnectTurtleExplorer.prototype.getTilesPercentage = function () {
        return (this.total_waypoints - this.waypoints.length) / this.total_waypoints;
    };
    return ConnectTurtleExplorer;
}(TurtleExplorer));
/// <reference path="Explorer.ts"/>
/**
 * Agent based generator
 */
var WideExplorer = /** @class */ (function (_super) {
    __extends(WideExplorer, _super);
    function WideExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WideExplorer.prototype.restartRepeat = function (region) {
        this.locations = region.getRegionLocations();
        this.sortTiles(region);
        return this.locations.splice(0, 1)[0];
    };
    WideExplorer.prototype.getNextLocation = function (currentLocation, region) {
        this.sortTiles(region);
        return this.locations.splice(0, 1)[0];
    };
    WideExplorer.prototype.checkRepeatTermination = function (region) {
        return this.locations.length == 0 || _super.prototype.checkRepeatTermination.call(this, region);
    };
    WideExplorer.prototype.getTilesPercentage = function (region) {
        if (this.max_tiles < region.getHeight() * region.getWidth()) {
            return this.visited_tiles / this.max_tiles;
        }
        return this.locations.length / (region.getWidth() * region.getHeight());
    };
    return WideExplorer;
}(Explorer));
/// <reference path="WideExplorer.ts"/>
/**
 * Agent based generator
 */
var HeuristicWideExplorer = /** @class */ (function (_super) {
    __extends(HeuristicWideExplorer, _super);
    /**
     * Constructor for the agent generator
     * @param currentRegion java object contain information about the applied region(s)
     * @param rules list of rules entered by the user
     * @param parameters for the agent generator
     */
    function HeuristicWideExplorer(regionNames, parameters, rules) {
        var _this = _super.call(this, regionNames, parameters, rules) || this;
        _this.estimators = [];
        var parts = parameters["heuristics"].split(",");
        for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
            var p = parts_2[_i];
            _this.estimators.push(Factory.getEstimator(p));
        }
        return _this;
    }
    HeuristicWideExplorer.prototype.sortTiles = function (region) {
        this.locations.sort(function (l1, l2) {
            for (var _i = 0, _a = this.estimators; _i < _a.length; _i++) {
                var e = _a[_i];
                var v1 = e.calculate(this.getTilesPercentage(region), this.getChangePercentage(region), this.getRepeatPercentage(), l1, region);
                var v2 = e.calculate(this.getTilesPercentage(region), this.getChangePercentage(region), this.getRepeatPercentage(), l2, region);
                if (v1 != v2) {
                    return v1 - v2;
                }
            }
            return Random.getRandom() - 0.5;
        }.bind(this));
    };
    return HeuristicWideExplorer;
}(WideExplorer));
/// <reference path="WideExplorer.ts"/>
/**
 * Agent based generator
 */
var RandomWideExplorer = /** @class */ (function (_super) {
    __extends(RandomWideExplorer, _super);
    function RandomWideExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RandomWideExplorer.prototype.sortTiles = function (region) {
        this.locations.sort(function (l1, l2) {
            return Random.getRandom() - 0.5;
        });
    };
    return RandomWideExplorer;
}(WideExplorer));
/// <reference path="../data/Point.ts"/>
/// <reference path="Prando.ts"/>
/// <reference path="Noise.ts"/>
/// <reference path="../regionDivider/SamplingDivider.ts"/>
/// <reference path="../regionDivider/BinaryDivider.ts"/>
/// <reference path="../regionDivider/EqualDivider.ts"/>
/// <reference path="../operator/LargerEqualOperator.ts"/>
/// <reference path="../operator/LessEqualOperator.ts"/>
/// <reference path="../operator/LargerOperator.ts"/>
/// <reference path="../operator/LessOperator.ts"/>
/// <reference path="../operator/EqualOperator.ts"/>
/// <reference path="../operator/NotEqualOperator.ts"/>
/// <reference path="../estimator/NeighborhoodEstimator.ts"/>
/// <reference path="../estimator/NumberEstimator.ts"/>
/// <reference path="../estimator/DistanceEstimator.ts"/>
/// <reference path="../explorer/HorizontalNarrowExplorer.ts"/>
/// <reference path="../explorer/VerticalNarrowExplorer.ts"/>
/// <reference path="../explorer/RandomNarrowExplorer.ts"/>
/// <reference path="../explorer/DrunkTurtleExplorer.ts"/>
/// <reference path="../explorer/HeuristicTurtleExplorer.ts"/>
/// <reference path="../explorer/ConnectTurtleExplorer.ts"/>
/// <reference path="../explorer/HeuristicWideExplorer.ts"/>
/// <reference path="../explorer/RandomWideExplorer.ts"/>
/**
 * parses list of entities to an actual entity array
 * e.g solid:2|empty:3|player => [solid, solid, empty, empty, player]
 * where the array elements are entity objects
 */
var EntityListParser = /** @class */ (function () {
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
        if (line.trim() == "entity") {
            return Marahel.marahelEngine.getAllEntities();
        }
        if (line.trim() == "out") {
            return [new Entity("out", -2)];
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
var Random = /** @class */ (function () {
    function Random() {
    }
    /**
     * initialize the parameters of the system
     */
    Random.initialize = function () {
        this.rnd = new Prando();
        this.noise = new Noise(this.rnd.next());
    };
    /**
     * change noise and random seeds
     * @param seed new seed for the random and noise objects
     */
    Random.changeSeed = function (seed) {
        if (this.rnd == null || this.noise == null)
            this.initialize();
        this.rnd = new Prando(seed);
        this.noise.seed(seed);
    };
    /**
     * get random number between 0 and 1
     * @return a random value between 0 (inclusive) and 1 (exclusive)
     */
    Random.getRandom = function () {
        if (this.rnd == null || this.noise == null)
            this.initialize();
        return this.rnd.next();
    };
    /**
     * get random integer between min and max
     * @param min min value for the random integer
     * @param max max value for the random integer
     * @return a random integer between min (inclusive) and max (exclusive)
     */
    Random.getIntRandom = function (min, max) {
        if (this.rnd == null || this.noise == null)
            this.initialize();
        if (max <= min)
            return min;
        var value = this.rnd.nextInt(min, max - 1);
        if (value < min) {
            value = min;
        }
        if (value >= max) {
            value = max - 1;
        }
        return value;
    };
    /**
     * get 2D perlin noise value based on the location x and y
     * @param x x location
     * @param y y location
     * @return noise value based on the location x and y
     */
    Random.getNoise = function (x, y) {
        if (this.rnd == null || this.noise == null)
            this.initialize();
        return this.noise.perlin2(x, y);
    };
    /**
     * shuffle an array in place
     * @param array input array to be shuffled
     */
    Random.shuffleArray = function (array) {
        if (this.rnd == null || this.noise == null)
            this.initialize();
        for (var i = 0; i < array.length; i++) {
            var i1 = this.getIntRandom(0, array.length);
            var i2 = this.getIntRandom(0, array.length);
            var temp = array[i1];
            array[i1] = array[i2];
            array[i2] = temp;
        }
    };
    /**
     * get a random value from the array
     * @param array the input array
     * @return a random value from the array
     */
    Random.choiceArray = function (array) {
        if (this.rnd == null || this.noise == null)
            this.initialize();
        return array[Random.getIntRandom(0, array.length)];
    };
    return Random;
}());
/**
 * transform a string to its corresponding class
 */
var Factory = /** @class */ (function () {
    function Factory() {
    }
    /**
     * create an estimator based on the user input
     * @param line user input to be parsed
     * @return Number Estimator, Distance Estimator, or NeighborhoodEstimator
     */
    Factory.getEstimator = function (line) {
        if (line.match(/\((.+)\)/) == null) {
            return new NumberEstimator(line);
        }
        else if (line.match("dist")) {
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
            case "sample":
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
    Factory.getGenerator = function (type, regions, parameters, rules) {
        var regionNames = regions.split(",");
        switch (type.trim()) {
            case "narrow":
            case "narrow_horz":
            case "horz":
            case "horizontal":
                return new HorizontalNarrowExplorer(regionNames, parameters, rules);
            case "narrow_vert":
            case "vert":
            case "vertical":
                return new VerticalNarrowExplorer(regionNames, parameters, rules);
            case "narrow_rand":
            case "rand":
            case "random":
                return new RandomNarrowExplorer(regionNames, parameters, rules);
            case "turtle":
            case "turtle_drunk":
            case "drunk":
            case "digger":
                return new DrunkTurtleExplorer(regionNames, parameters, rules);
            case "turtle_heur":
            case "greedy":
            case "agent":
                return new HeuristicTurtleExplorer(regionNames, parameters, rules);
            case "turtle_connect":
            case "connect":
                return new ConnectTurtleExplorer(regionNames, parameters, rules);
            case "wide":
            case "wide_heur":
            case "heuristic":
            case "order":
                return new HeuristicWideExplorer(regionNames, parameters, rules);
            case "wide_rand":
            case "rorder":
            case "rand_order":
                return new RandomWideExplorer(regionNames, parameters, rules);
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
var Engine = /** @class */ (function () {
    /**
     * constructor where it initialize different parts of Marahel
     */
    function Engine() {
        // initialize different parts of the system
        Random.initialize();
        this.replacingType = MarahelMap.REPLACE_SAME;
        this.outValue = Engine.OUT_VALUE;
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
        for (var i = 0; i < data["entities"].length; i++) {
            this.entities.push(new Entity(data["entities"][i], i));
            this.entityIndex[data["entities"][i]] = i;
        }
        // define the generator's neighborhoods
        this.neighbors = {};
        for (var n in data["neighborhoods"]) {
            this.neighbors[n] = new Neighborhood(n, data["neighborhoods"][n]);
        }
        if (!("plus" in this.neighbors)) {
            this.neighbors["plus"] = new Neighborhood("plus", "010,131,010");
        }
        if (!("all" in this.neighbors)) {
            this.neighbors["all"] = new Neighborhood("all", "111,131,111");
        }
        if (!("left" in this.neighbors)) {
            this.neighbors["left"] = new Neighborhood("left", "000,120,000");
        }
        if (!("right" in this.neighbors)) {
            this.neighbors["right"] = new Neighborhood("right", "000,021,000");
        }
        if (!("up" in this.neighbors)) {
            this.neighbors["up"] = new Neighborhood("up", "010,020,000");
        }
        if (!("down" in this.neighbors)) {
            this.neighbors["down"] = new Neighborhood("down", "000,020,010");
        }
        if (!("horz" in this.neighbors)) {
            this.neighbors["horz"] = new Neighborhood("horz", "000,121,000");
        }
        if (!("vert" in this.neighbors)) {
            this.neighbors["vert"] = new Neighborhood("vert", "010,020,010");
        }
        if (!("self" in this.neighbors)) {
            this.neighbors["self"] = new Neighborhood("self", "3");
        }
        // define the generator region divider
        if (data["regions"]) {
            this.regionDivider = Factory.getDivider(data["regions"]["type"], parseInt(data["regions"]["number"]), data["regions"]["parameters"]);
        }
        // define the modules of the current level generator
        this.explorers = [];
        for (var _i = 0, _a = data["explorers"]; _i < _a.length; _i++) {
            var e = _a[_i];
            var exp = Factory.getGenerator(e["type"] ? e["type"] : "horizontal", e["region"] ? e["region"] : "map", e["parameters"] ? e["parameters"] : {}, e["rules"]);
            if (exp != null) {
                this.explorers.push(exp);
            }
            else {
                throw new Error("Undefined generator - " + e.toString());
            }
        }
    };
    /**
     * generate a new map using the defined generator
     */
    Engine.prototype.generate = function (callback) {
        // create a map object with randomly selected dimensions between minDim and maxDim
        this.currentMap = new MarahelMap(Random.getIntRandom(this.minDim.x, this.maxDim.x), Random.getIntRandom(this.minDim.y, this.maxDim.y));
        // define a region that covers the whole map
        var mapRegion = new Region(0, 0, this.currentMap.width, this.currentMap.height);
        // get regions from the region divider, if no divider defined the regions are the whole map
        var regions = [];
        if (this.regionDivider != null) {
            regions = this.regionDivider.getRegions(mapRegion);
        }
        // update the map using the defined generators
        for (var _i = 0, _a = this.explorers; _i < _a.length; _i++) {
            var e = _a[_i];
            e.applyRegion(mapRegion, regions);
            e.runExplorer();
            if (callback) {
                callback(this.currentMap.getIndexMap());
            }
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
        if (value == -1) {
            return new Entity("undefined", -1);
        }
        if (value == -2) {
            return new Entity("out", -2);
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
        if (name.trim() == "out") {
            return -2;
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
    /**
     * The value for out tiles
     */
    Engine.OUT_VALUE = -2;
    /**
     * The value for unknown tiles
     */
    Engine.UNKNOWN_VALUE = -1;
    return Engine;
}());
//# sourceMappingURL=Marahel.js.map