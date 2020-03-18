/// <reference path="WideExplorer.ts"/>

/**
 * Agent based generator
 */
class RandomWideExplorer extends WideExplorer {
    protected sortTiles(): void {
        this.locations.sort(function (l1, l2) {
            return Math.random() - 0.5;
        });
    }
}