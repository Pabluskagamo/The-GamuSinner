import EasyStar from 'easystarjs'

export default class Finder{

    constructor(map, tiles, layers){
        this.map = map;
        this.tiles = tiles;
        this.layers = layers;
        this.initFinder();
    }


    initFinder(){
		this.finder = new EasyStar.js();

		var grid = [];
		for(var y = 0; y < this.map.height; y++){
			var col = [];
			for(var x = 0; x < this.map.width; x++){
				// In each cell we store the ID of the tile, which corresponds
				// to its index in the tileset of the map ("ID" field in Tiled)
				col.push(this.getTileID(x,y));
			}
			grid.push(col);
		}
		this.finder.setGrid(grid);

		console.log(grid);

		var tileset = this.map.tilesets[0];
		var properties = tileset.tileProperties;

		console.log('Propierties', properties);

		var acceptableTiles = [];

		for(var i = tileset.firstgid-1; i < this.tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
			if(!properties.hasOwnProperty(i)) {
				// If there is no property indicated at all, it means it's a walkable tile
				acceptableTiles.push(i+1);
				continue;
			}
			if(!properties[i].collide) acceptableTiles.push(i+1);
			if(properties[i].cost) this.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
		}

		console.log('Acceptable', acceptableTiles);

		this.finder.setAcceptableTiles(acceptableTiles);
	}

	calculatePath(){
		var toX = 10;
		var toY = 12;
		var fromX = 0;
		var fromY = 0;
		console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

		this.finder.findPath(fromX, fromY, toX, toY, function( path ) {
			if (path === null) {
				console.warn("Path was not found.");
			} else {
				console.log('Path to go ',path);
			}
		});

		this.finder.calculate();
	}

    getTileID(x,y){
		var tile = null 
		let i = 0;

		while(tile === null && i < this.layers.length){
			tile = this.map.getTileAt(x, y, false, this.layers[i]);
			i++;
		}

    	return tile.index;
	}


}