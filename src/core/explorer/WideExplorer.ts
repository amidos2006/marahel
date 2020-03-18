    /// <reference path="Explorer.ts"/>

    /**
     * Agent based generator
     */
    abstract class WideExplorer extends Explorer {
        protected locations:Point[];

        protected abstract sortTiles():void;

        protected restartRepeat(region:Region): Point {
            this.locations = region.getRegionLocations();
            this.sortTiles();
            return this.locations.splice(0, 1)[0];
        }

        protected getNextLocation(currentLocation: Point, region: Region): Point {
            this.sortTiles();
            return this.locations.splice(0, 1)[0];
        }

        protected checkRepeatTermination(region:Region): boolean {
            return this.locations.length == 0 || super.checkRepeatTermination(region);
        }

        protected getSinglePercentage(region:Region): number {
            if (this.max_tiles < region.getHeight() * region.getWidth()) {
                return this.visited_tiles / this.max_tiles;
            }
            return this.locations.length / (region.getWidth() * region.getHeight());
        }
    }