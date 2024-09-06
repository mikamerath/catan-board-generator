//let nums = []
//let resources = []

class Tile {
    constructor(r, c, resource) {
        this.r = r;
        this.c = c;
        this.resource = resource;
        this.number = undefined;
        this.adjacentTilesWithSameResource = undefined; // includes indirectly adjacent tiles, e.g. in a line
        this.countedResourceCheck = false;
    }
  }

let resources_map = new Map();
let numbers_map = new Map(); // TODO move the setting INTO function that uses it, so it resets each time
numbers_map.set(2, 2);
numbers_map.set(3, 3);
numbers_map.set(4, 3);
numbers_map.set(5, 3);
numbers_map.set(6, 3);
numbers_map.set(8, 3);
numbers_map.set(9, 3);
numbers_map.set(10, 3);
numbers_map.set(11, 3);
numbers_map.set(12, 2);

// helper functions 

function randomResource() {
    let done = false;
    while (!done) {
        let resource_num = Math.floor(Math.random() * 6);
        switch(resource_num) {
            case 0:
                if (resources_map.get("S") > 0) {
                    return "S";
                }
                break;
            case 1:
                if (resources_map.get("W") > 0) {
                    return "W";
                }
                break;
            case 2:
                if (resources_map.get("H") > 0) {
                    return "H";
                }
                break;
            case 3:
                if (resources_map.get("B") > 0) {
                    return "B";
                }
                break;
            case 4:
                if (resources_map.get("O") > 0) {
                    return "O";
                }
                break;
            case 5:
                if (resources_map.get("D") > 0) {
                    return "D";
                }
                break; 
        }
    }
}

function randomNum() {

}

// returns true if the location on the board is a valid place to put a tile
// (within bounds and not null)
function isValidTile(r, c, board) {
    if (r < 0 || r > 5) return false;
    if (c < 0 || c > 6) return false;
    if (board[r][c] === null) return false;
    return true;
}

// place tiles with resources in the board
function createBoardWithResources() {
    // define resources to place
    resources_map.set("S", 6); // Sheep
    resources_map.set("W", 6); // Wood
    resources_map.set("H", 6); // Wheat
    resources_map.set("B", 5); // Brick
    resources_map.set("O", 5); // Ore
    resources_map.set("D", 2); // Desert

    // generate an empty board
    let board = [[undefined, undefined, undefined, undefined, null, null, null],
        [undefined, undefined, undefined, undefined, undefined, null, null],
        [undefined, undefined, undefined, undefined, undefined, undefined, null],
        [null, undefined, undefined, undefined, undefined, undefined, undefined],
        [null, null, undefined, undefined, undefined, undefined, undefined],
        [null, null, null, undefined, undefined, undefined, undefined]];

    // place resources
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board)) {
                // pick a random resource that has at least one left in it
                let resource = randomResource();
                board[r][c] = new Tile(r, c, resource);
                resources_map.set(resource, resources_map.get(resource) - 1);
            }
        }
    }

    return board;
}

// get the directly adjacent tiles in hex grid
function getDirectlyAdjacentTiles(tile, board) {
    let r = tile.r;
    let c = tile.c;
    let adjacentList = new Array();
    if (isValidTile(r-1, c, board)) adjacentList.push(board[r-1][c]);
    if (isValidTile(r-1, c-1, board)) adjacentList.push(board[r-1][c-1]);
    if (isValidTile(r, c-1, board)) adjacentList.push(board[r][c-1]);
    if (isValidTile(r, c+1, board)) adjacentList.push(board[r][c+1]);
    if (isValidTile(r+1, c, board)) adjacentList.push(board[r+1][c]);
    if (isValidTile(r+1, c+1, board)) adjacentList.push(board[r+1][c+1]);
    //console.log("tile at " + tile.r + "," + tile.c + " has adjacent " + adjacentList.length);
    //console.log(adjacentList);
    return adjacentList;
}

function countAdjacentTilesWithSameResource(tile, board) {
    let adjacentTilesWithSameResource = [tile];
    tile.countedResourceCheck = true;
    let tilesToProcess = [tile];

    while (tilesToProcess.length > 0) {
        let current = tilesToProcess.pop();
        let directlyAdjacentTiles = getDirectlyAdjacentTiles(current, board);
        let directlyAdjacentSameResource = directlyAdjacentTiles.filter(t => (t.resource === tile.resource && !t.countedResourceCheck));
        //console.log("tile at " + tile.r + "," + tile.c + " directly adjacent same resource:")
        //console.log(directlyAdjacentSameResource)
        for (i = 0; i < directlyAdjacentSameResource.length; ++i) {
            adjacentTilesWithSameResource.push(directlyAdjacentSameResource[i]);
            tilesToProcess.push(directlyAdjacentSameResource[i]);
            directlyAdjacentSameResource[i].countedResourceCheck = true;
        }
    }
   
    // repeat with directlyAdjacentSameResource

    // at end...
    //adjacentTilesWithSameResource.forEach(x => x.numAdjacent = adjacentTilesWithSameResource.length);
    //console.log(adjacentTilesWithSameResource)

    return adjacentTilesWithSameResource.length;
}

function isValidResourcePlacement(board) {
    // deserts must be on the edge
    // deserts cannot be adjacent
    // no 3 of same resource adjacent

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board)) {
                let tile = board[r][c]
                if (!tile.countedResourceCheck) {
                    // count adjacent tiles with same resource TODO
                    let numAdjacent = countAdjacentTilesWithSameResource(tile, board);
                    tile.adjacentTilesWithSameResource = numAdjacent; // not actually necessary to save this.
                    if (tile.resource === "D" && numAdjacent > 1) {
                        return false;
                    } else if (tile.resource === "D" && getDirectlyAdjacentTiles(tile, board).length === 6) {
                        return false
                    } else if (numAdjacent > 2) {
                        return false;
                    }

                    
                }
                

            }
        }
    }
    return true;
}

// prints the board to the console
function printBoard(board, attemptNum, isValid) {
    let result = "Board #" + attemptNum + " " + isValid + "\n";
    let visualColumnOffset = "            ";
    for (let r = 0; r < 6; r++) {
        result += visualColumnOffset;
        visualColumnOffset = visualColumnOffset.substring(0, visualColumnOffset.length - 2);
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board)) {
                //console.log(board[r][c]);
                let adjacentMark = board[r][c].adjacentTilesWithSameResource === undefined ? " " : board[r][c].adjacentTilesWithSameResource; 
                result += board[r][c].resource + adjacentMark +  " ";
            }
            else {
                result += "-- ";
            }
        }
        result += "\n";
    }
    console.log(result);
}

let isValid = false;
let attemptNum = 0;
while (!isValid && attemptNum < 1000) {
    let board = createBoardWithResources(); // Generate board
    attemptNum++;
    isValid = isValidResourcePlacement(board);
    printBoard(board, attemptNum, isValid);
}

if (isValid) console.log("Done! FOUND A BOARD WITH VALID RESOURCE PLACEMENT!!")
else console.log("Done... and gave up :(")


//console.log([...resources_map.entries()]);

// 6 Sheep
// 5 Brick
// 5 Ore
// 6 Wood
// 6 Wheat
// 2 Desert

// let dummy_board = [["S2", "S2", "S3", "S3", "X", "X", "X"],
//                    ["S3", "S4", "B4", "B4", "B5", "X", "X"],
//                    ["B5", "B5", "O6", "O6", "O6", "O8", "X"],
//                    ["X", "O8", "W8", "W9", "W9", "W9", "W10"],
//                    ["X", "X", "W10", "H10", "H11", "H11", "H11"],
//                    ["X", "X", "X", "H12", "H12", "D", "D"]]