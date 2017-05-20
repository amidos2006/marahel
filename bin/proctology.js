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
var Map = (function () {
    function Map(width, height) {
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
        this.currentReplacing = Map.REPLACE_BACK;
    }
    Map.prototype.setValue = function (x, y, value) {
        if (this.currentReplacing == Map.REPLACE_SAME) {
            this.mapValues[y][x] = value;
        }
        if (this.currentReplacing == Map.REPLACE_BACK) {
            this.backValues[y][x] = value;
        }
    };
    Map.prototype.switchBuffers = function () {
        var temp = this.mapValues;
        this.mapValues = this.backValues;
        this.backValues = temp;
    };
    Map.prototype.getValue = function (x, y) {
        return this.mapValues[y][x];
    };
    return Map;
}());
Map.REPLACE_SAME = 0;
Map.REPLACE_BACK = 1;
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
    return Point;
}());
var Entity = (function () {
    function Entity(name, parameters) {
        this.name = name;
        this.color = parameters["color"];
        this.minValue = parameters["min"];
        this.maxValue = parameters["max"];
    }
    return Entity;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Point.ts"/>
var Region = (function () {
    function Region(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Region.prototype.setValue = function (x, y, value) {
    };
    Region.prototype.getValue = function (x, y) {
        return -1;
    };
    Region.prototype.getEntityNumber = function (value) {
        var result = 0;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                //TODO
            }
        }
        return result;
    };
    Region.prototype.getDistances = function (neighbor, value) {
        return [];
    };
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
/// <reference path="../Marahel.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>
var Neighborhood = (function () {
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
    Neighborhood.prototype.getTotal = function (value, center, region) {
        var result = 0;
        for (var i = 0; i < this.locations.length; i++) {
            if (region.getValue(this.locations[i].x + center.x, this.locations[i].y + center.y) == value) {
                result += 1;
            }
        }
        return result;
    };
    Neighborhood.prototype.setTotal = function (value, center, region) {
        for (var i = 0; i < this.locations.length; i++) {
            region.setValue(center.x + this.locations[i].x, center.y + this.locations[i].y, value);
        }
    };
    Neighborhood.prototype.toString = function () {
        return this.name + "\n" + this.printing + "\nRelative locations\n" + this.locations;
    };
    return Neighborhood;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Point.ts"/>
/// <reference path="../Data/Region.ts"/>
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
/// <reference path="data/Map.ts"/>
/// <reference path="data/Point.ts"/>
/// <reference path="data/Entity.ts"/>
/// <reference path="data/Neighborhood.ts"/>
/// <reference path="operator/OperatorInterface.ts"/>
/// <reference path="estimator/EstimatorInterface.ts"/>
/// <reference path="utils/Prando.ts"/>
var Marahel = (function () {
    function Marahel() {
    }
    Marahel.getRandom = function () {
        return Marahel.rnd.next();
    };
    Marahel.getIntRandom = function (min, max) {
        return Marahel.rnd.nextInt(min, max - 1);
    };
    Marahel.shuffleArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            var i1 = Marahel.getIntRandom(0, array.length);
            var i2 = Marahel.getIntRandom(0, array.length);
            var temp = array[i1];
            array[i1] = array[i2];
            array[i2] = temp;
        }
    };
    Marahel.initialize = function (data) {
        Marahel.rnd = new Prando();
        //TODO:
    };
    Marahel.generate = function (seed) {
        if (!Marahel.rnd) {
            console.log("Call initialize first.");
            return;
        }
        if (seed) {
            Marahel.rnd = new Prando(seed);
        }
        Marahel.currentMap = new Map(Marahel.getIntRandom(Marahel.minDim.x, Marahel.maxDim.x), Marahel.getIntRandom(Marahel.minDim.y, Marahel.maxDim.y));
        var mapRegion = new Region(0, 0, Marahel.currentMap.width, Marahel.currentMap.height);
        var regions = Marahel.regionDivider.getRegions(mapRegion);
        for (var _i = 0, _a = Marahel.generators; _i < _a.length; _i++) {
            var g = _a[_i];
            g.applyGeneration();
        }
    };
    Marahel.getMap = function () {
        return Marahel.currentMap;
    };
    Marahel.getEntity = function (value) {
        if (typeof value == "string") {
            return Marahel.entities[Marahel.getEntityIndex(value)];
        }
        return Marahel.entities[value];
    };
    Marahel.getEntityIndex = function (name) {
        return Marahel.entityIndex[name];
    };
    Marahel.getNeighborhood = function (name) {
        return Marahel.neighbors[name];
    };
    Marahel.getEstimator = function (line) {
        var parts = line.split(/\((.+)\)/);
        if (line.match(/\((.+)\)/) == null) {
            return new NumberEstimator(line);
        }
        else if (line.match("Dist")) {
            return new DistanceEstimator(line);
        }
        return new NeighborhoodEstimator(line);
    };
    Marahel.getOperator = function (line) {
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
    return Marahel;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="../Data/Region.ts"/>
/// <reference path="DividerInterface.ts"/>
var DiggerDivider = (function () {
    function DiggerDivider(numberOfRegions, parameters) {
        this.numberOfRegions = numberOfRegions;
        var parts = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
        this.probDir = parseFloat(parameters["probDir"]);
        this.probSpawn = parseFloat(parameters["probSpawn"]);
        this.allowIntersect = parameters["allowIntersection"] == "true";
    }
    DiggerDivider.prototype.checkIntersection = function (r, regions) {
        for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
            var cr = regions_1[_i];
            if (cr.intersect(r)) {
                return true;
            }
        }
        return false;
    };
    DiggerDivider.prototype.getRegion = function (map) {
        var width = Marahel.getIntRandom(this.minWidth, this.maxWidth);
        var height = Marahel.getIntRandom(this.minHeight, this.maxHeight);
        var x = Marahel.getIntRandom(0, map.width - this.maxWidth) - Math.floor(width / 2);
        if (x < 0) {
            x = 0;
        }
        if (x + Math.ceil(width / 2) >= map.width) {
            x = map.width - Math.ceil(width / 2);
        }
        var y = Marahel.getIntRandom(0, map.height - this.maxHeight) - Math.floor(height / 2);
        if (y < 0) {
            y = 0;
        }
        if (y + Math.ceil(height / 2) >= map.height) {
            x = map.height - Math.ceil(height / 2);
        }
        return new Region(x, y, width, height);
    };
    DiggerDivider.prototype.getRegions = function (map) {
        var results = [];
        var digger = new Point(Marahel.getIntRandom(0, map.width), Marahel.getIntRandom(0, map.height));
        var directions = [new Point(0, 1), new Point(0, -1), new Point(1, 0), new Point(-1, 0)];
        var currentDir = Marahel.getIntRandom(0, directions.length);
        var directionProb = 0;
        var spawnProb = 0;
        var acceptCounter = 0;
        while (results.length < this.numberOfRegions) {
            if (Marahel.getRandom() < directionProb || !map.intersect(new Point(digger.x + directions[currentDir].x, digger.y + directions[currentDir].y))) {
                currentDir = Marahel.getIntRandom(0, directions.length);
                directionProb = 0;
            }
            else {
                directionProb += this.probDir;
            }
            if (Marahel.getRandom() < spawnProb) {
                var r_1 = this.getRegion(map);
                if (this.allowIntersect) {
                    results.push(r_1);
                }
                else if (!this.checkIntersection(r_1, results)) {
                    results.push(r_1);
                }
                else if (acceptCounter >= DiggerDivider.ACCEPTANCE_TRIALS) {
                    results.push(r_1);
                }
                else {
                    acceptCounter += 1;
                }
                spawnProb = 0;
            }
            else {
                spawnProb += this.probSpawn;
            }
            if (map.intersect(new Point(digger.x + directions[currentDir].x, digger.y + directions[currentDir].y))) {
                digger.x += directions[currentDir].x;
                digger.y += directions[currentDir].x;
            }
        }
        return results;
    };
    return DiggerDivider;
}());
DiggerDivider.ACCEPTANCE_TRIALS = 100;
/// <reference path="../Marahel.ts"/>
/// <reference path="../estimator/EstimatorInterface.ts"/>
/// <reference path="../operator/OperatorInterface.ts"/>
var Condition = (function () {
    function Condition(line) {
        var parts = line.split(",");
        var cParts = parts[0].split(/>=|<=|==|!=|>|</);
        this.leftSide = Marahel.getEstimator(cParts[0]);
        this.operator = Marahel.getOperator(cParts[1]);
        this.rightSide = Marahel.getEstimator(cParts[2]);
        if (parts.length > 1) {
            parts.splice(0, 1);
            this.nextCondition = new Condition(parts.join(","));
        }
    }
    Condition.prototype.check = function (iteration, position, region) {
        var result = this.operator.check(this.leftSide.calculate(iteration, position, region), this.rightSide.calculate(iteration, position, region));
        if (result && this.nextCondition != null) {
            result = result && this.nextCondition.check(iteration, position, region);
        }
        return result;
    };
    return Condition;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="Neighborhood.ts"/>
/// <reference path="Entity.ts"/>
/// <reference path="Region.ts"/>
/// <reference path="Point.ts"/>
var Executer = (function () {
    function Executer(line) {
        var parts = line.split(",");
        var eParts = parts[0].split(/\((.+)\)/);
        this.neightbor = Marahel.getNeighborhood(eParts[0]);
        this.entity = Marahel.getEntity(eParts[1]);
        if (parts.length > 1) {
            parts.splice(0, 1);
            this.nextExecuter = new Executer(parts.join(","));
        }
    }
    Executer.prototype.apply = function (position, region) {
        this.neightbor.setTotal(Marahel.getEntityIndex(this.entity.name), position, region);
        if (this.nextExecuter != null) {
            this.nextExecuter.apply(position, region);
        }
    };
    return Executer;
}());
/// <reference path="../Marahel.ts"/>
/// <reference path="Condition.ts"/>
/// <reference path="Executer.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="Region.ts"/>
var Rule = (function () {
    function Rule(lines) {
        this.condition = new Condition(lines[0].split("->")[0]);
        this.executer = new Executer(lines[0].split("->")[1]);
        this.nextRule = null;
        if (lines.length > 1) {
            lines.splice(0, 1);
            this.nextRule = new Rule(lines);
        }
    }
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
/// <reference path="core/regionDivider/DiggerDivider.ts"/>
/// <reference path="core/data/Rule.ts"/>
var parameters = { "max": "30x30", "min": "15x15", "probDir": "0.02", "probSpawn": "0.05", "allowIntersection": "false" };
var r = new Rule(["all(solid) > 5 -> self(empty)"]);
console.log(r);
console.log(new DiggerDivider(20, parameters).getRegions(new Region(0, 0, 103, 103)));
/// <reference path="EstimatorInterface.ts"/>
var DistanceEstimator = (function () {
    function DistanceEstimator(line) {
        if (line.match("max")) {
            this.type = "max";
        }
        else if (line.match("min")) {
            this.type = "min";
        }
        else {
            this.type = "average";
        }
        var parts = line.split(/\((.+)\)/)[1].split(",");
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        this.entity = Marahel.getEntity(parts[1].trim());
    }
    DistanceEstimator.prototype.calculate = function (iteration, position, region) {
        var values = region.getDistances(this.neighbor, Marahel.getEntityIndex(this.entity.name));
        if (values.length > 0) {
            return -1;
        }
        var max = 0;
        var min = Number.MAX_VALUE;
        var total = 0;
        for (var i = 0; i < values.length; i++) {
            total += values[i];
            if (max < values[i]) {
                max = values[i];
            }
            if (min > values[i]) {
                min = values[i];
            }
        }
        switch (this.type) {
            case "max":
                return max;
            case "min":
                return min;
        }
        return total / values.length;
    };
    return DistanceEstimator;
}());
/// <reference path="EstimatorInterface.ts"/>
var NeighborhoodEstimator = (function () {
    function NeighborhoodEstimator(line) {
        var parts = line.split(/\((.+)\)/);
        this.neighbor = Marahel.getNeighborhood(parts[0].trim());
        this.entity = Marahel.getEntity(parts[1].trim());
    }
    NeighborhoodEstimator.prototype.calculate = function (iteration, position, region) {
        return this.neighbor.getTotal(Marahel.getEntityIndex(this.entity.name), position, region);
    };
    return NeighborhoodEstimator;
}());
/// <reference path="EstimatorInterface.ts"/>
var NumberEstimator = (function () {
    function NumberEstimator(line) {
    }
    NumberEstimator.prototype.calculate = function (iteration, position, region) {
        if (this.name == "complete") {
            return iteration;
        }
        if (this.name == "random") {
            return Marahel.getRandom();
        }
        return region.getEntityNumber(Marahel.getEntityIndex(this.name));
    };
    return NumberEstimator;
}());
/// <reference path="../data/Region.ts"/>
var Generator = (function () {
    function Generator(currentRegion, map, regions, rules) {
        currentRegion = currentRegion.trim();
        if (currentRegion == "map") {
            this.regions = [map];
        }
        else if (currentRegion == "all") {
            this.regions = regions;
        }
        else {
            this.regions = [];
            var parts = currentRegion.split(",");
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
        this.rules = [];
        for (var _a = 0, rules_1 = rules; _a < rules_1.length; _a++) {
            var r_2 = rules_1[_a];
            this.rules.push(new Rule(rules));
        }
    }
    Generator.prototype.applyGeneration = function () {
    };
    return Generator;
}());
/// <reference path="Generator.ts"/>
var AgentGenerator = (function (_super) {
    __extends(AgentGenerator, _super);
    function AgentGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AgentGenerator.prototype.applyGeneration = function () {
        throw new Error("Method not implemented.");
    };
    return AgentGenerator;
}(Generator));
/// <reference path="Generator.ts"/>
var AutomataGenerator = (function (_super) {
    __extends(AutomataGenerator, _super);
    function AutomataGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutomataGenerator.prototype.applyGeneration = function () {
        throw new Error("Method not implemented.");
    };
    return AutomataGenerator;
}(Generator));
/// <reference path="Generator.ts"/>
var ConnectorGenerator = (function (_super) {
    __extends(ConnectorGenerator, _super);
    function ConnectorGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConnectorGenerator.prototype.applyGeneration = function () {
        throw new Error("Method not implemented.");
    };
    return ConnectorGenerator;
}(Generator));
/// <reference path="OperatorInterface.ts"/>
var EqualOperator = (function () {
    function EqualOperator() {
    }
    EqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue == rightValue;
    };
    return EqualOperator;
}());
/// <reference path="OperatorInterface.ts"/>
var LargerEqualOperator = (function () {
    function LargerEqualOperator() {
    }
    LargerEqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue >= rightValue;
    };
    return LargerEqualOperator;
}());
/// <reference path="OperatorInterface.ts"/>
var LargerOperator = (function () {
    function LargerOperator() {
    }
    LargerOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue > rightValue;
    };
    return LargerOperator;
}());
/// <reference path="OperatorInterface.ts"/>
var LessEqualOperator = (function () {
    function LessEqualOperator() {
    }
    LessEqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue <= rightValue;
    };
    return LessEqualOperator;
}());
/// <reference path="OperatorInterface.ts"/>
var LessOperator = (function () {
    function LessOperator() {
    }
    LessOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue < rightValue;
    };
    return LessOperator;
}());
/// <reference path="OperatorInterface.ts"/>
var NotEqualOperator = (function () {
    function NotEqualOperator() {
    }
    NotEqualOperator.prototype.check = function (leftValue, rightValue) {
        return leftValue != rightValue;
    };
    return NotEqualOperator;
}());
/// <reference path="DividerInterface.ts"/>
var AdjustmentDivider = (function () {
    function AdjustmentDivider(numberOfRegions, parameters) {
        this.numberOfRegions = numberOfRegions;
        var parts = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
        this.allowIntersect = parameters["allowIntersection"] == "true";
    }
    AdjustmentDivider.prototype.checkIntersection = function (r, regions) {
        for (var _i = 0, regions_2 = regions; _i < regions_2.length; _i++) {
            var cr = regions_2[_i];
            if (cr.intersect(r)) {
                return true;
            }
        }
        return false;
    };
    AdjustmentDivider.prototype.changeRegion = function (map, r) {
        r.x = Marahel.getIntRandom(0, map.width - this.maxWidth);
        r.y = Marahel.getIntRandom(0, map.height - this.maxHeight);
        r.width = Marahel.getIntRandom(this.minWidth, this.maxWidth);
        r.height = Marahel.getIntRandom(this.minHeight, this.maxHeight);
    };
    AdjustmentDivider.prototype.getFitRegion = function (map, regions) {
        var r = new Region(0, 0, 0, 0);
        for (var i = 0; i < AdjustmentDivider.RETRY_TRAILS; i++) {
            this.changeRegion(map, r);
            if (!this.checkIntersection(r, regions)) {
                break;
            }
        }
        return r;
    };
    AdjustmentDivider.prototype.calculateIntersection = function (regions) {
        var results = 0;
        for (var _i = 0, regions_3 = regions; _i < regions_3.length; _i++) {
            var r_3 = regions_3[_i];
            if (this.checkIntersection(r_3, regions)) {
                results += 1;
            }
        }
        return results - regions.length;
    };
    AdjustmentDivider.prototype.adjustRegions = function (map, regions) {
        var minIntersect = this.calculateIntersection(regions);
        for (var i = 0; i < AdjustmentDivider.ADJUSTMENT_TRAILS; i++) {
            var r_4 = regions[Marahel.getIntRandom(0, regions.length)];
            var temp = new Region(r_4.x, r_4.y, r_4.width, r_4.height);
            this.changeRegion(map, r_4);
            var value = this.calculateIntersection(regions);
            if (value >= minIntersect) {
                r_4.x = temp.x;
                r_4.y = temp.y;
                r_4.width = temp.width;
                r_4.height = temp.height;
            }
            else {
                minIntersect = value;
                if (minIntersect <= 0) {
                    return;
                }
            }
        }
    };
    AdjustmentDivider.prototype.getRegions = function (map) {
        var results = [];
        while (results.length < this.numberOfRegions) {
            results.push(this.getFitRegion(map, results));
        }
        if (!this.allowIntersect && this.calculateIntersection(results) > 0) {
            this.adjustRegions(map, results);
        }
        return results;
    };
    return AdjustmentDivider;
}());
AdjustmentDivider.ADJUSTMENT_TRAILS = 1000;
AdjustmentDivider.RETRY_TRAILS = 100;
/// <reference path="DividerInterface.ts"/>
var BinaryDivider = (function () {
    function BinaryDivider(numberOfRegions, parameters) {
        this.numberOfRegions = numberOfRegions;
        var parts = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
    }
    BinaryDivider.prototype.divideWidth = function (region, allowedWidth) {
        var rWidth = this.minWidth + Marahel.getIntRandom(0, allowedWidth);
        return [new Region(region.x, region.y, rWidth, region.height),
            new Region(region.x + rWidth, region.y, region.width - rWidth, region.height)];
    };
    BinaryDivider.prototype.divideHeight = function (region, allowedHeight) {
        var rHeight = this.minHeight + Marahel.getIntRandom(0, allowedHeight);
        return [new Region(region.x, region.y, region.width, rHeight),
            new Region(region.x, region.y + rHeight, region.width, region.height - rHeight)];
    };
    BinaryDivider.prototype.testDivide = function (region) {
        return (region.width >= 2 * this.minWidth || region.height >= 2 * this.minHeight);
    };
    BinaryDivider.prototype.divide = function (region) {
        var allowedWidth = region.width - 2 * this.minWidth;
        var allowedHeight = region.height - 2 * this.minHeight;
        if (Marahel.getRandom() < 0.5) {
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
        if (region.width > region.height) {
            return this.divideWidth(region, 0);
        }
        else {
            return this.divideHeight(region, 0);
        }
    };
    BinaryDivider.prototype.checkMaxSize = function (regions) {
        for (var _i = 0, regions_4 = regions; _i < regions_4.length; _i++) {
            var r_5 = regions_4[_i];
            if (r_5.width > this.maxWidth || r_5.height > this.maxHeight) {
                return true;
            }
        }
        return false;
    };
    BinaryDivider.prototype.divideMaxSize = function (region) {
        if (Marahel.getRandom() < 0.5) {
            if (region.width >= this.maxWidth) {
                return this.divideWidth(region, 0);
            }
            if (region.height >= this.maxHeight) {
                return this.divideHeight(region, 0);
            }
        }
        else {
            if (region.height >= this.maxHeight) {
                return this.divideHeight(region, 0);
            }
            if (region.width >= this.maxWidth) {
                return this.divideWidth(region, 0);
            }
        }
        if (region.width > region.height) {
            return this.divideWidth(region, 0);
        }
        else {
            return this.divideHeight(region, 0);
        }
    };
    BinaryDivider.prototype.getRegions = function (map) {
        var results = [new Region(0, 0, map.width, map.height)];
        while (results.length < this.numberOfRegions || this.checkMaxSize(results)) {
            Marahel.shuffleArray(results);
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
        Marahel.shuffleArray(results);
        results = results.slice(0, this.numberOfRegions);
        return results;
    };
    return BinaryDivider;
}());
/// <reference path="DividerInterface.ts"/>
var EqualDivider = (function () {
    function EqualDivider(numberOfRegions, parameters) {
        this.numberOfRegions = numberOfRegions;
        var parts = parameters["min"].split("x");
        this.minWidth = parseInt(parts[0]);
        this.minHeight = parseInt(parts[1]);
        parts = parameters["max"].split("x");
        this.maxWidth = parseInt(parts[0]);
        this.maxHeight = parseInt(parts[1]);
    }
    EqualDivider.prototype.getRegions = function (map) {
        var result = [];
        var currentWidth = Marahel.getIntRandom(this.minWidth, this.maxWidth);
        var currentHeight = Marahel.getIntRandom(this.minHeight, this.maxHeight);
        var roomWidth = Math.floor(map.width / currentWidth);
        var roomHeight = Math.floor(map.height / currentHeight);
        for (var x = 0; x < this.minWidth; x++) {
            for (var y = 0; y < this.minHeight; y++) {
                var rX = x * roomWidth;
                var rY = y * roomHeight;
                var rW = roomWidth;
                var rH = roomHeight;
                if (x == currentWidth - 1) {
                    rW = map.width - rX;
                }
                if (y == currentHeight - 1) {
                    rH = map.height - rY;
                }
                result.push(new Region(rX, rY, rW, rH));
            }
        }
        Marahel.shuffleArray(result);
        result = result.slice(0, this.numberOfRegions);
        return result;
    };
    return EqualDivider;
}());
//# sourceMappingURL=proctology.js.map