// SETTINGS

let limitAdjacentResourcesFlag = true;
let maxAdjacentResources = 2;

let limitAdjacentDesertsFlag = true;

let requireDesertsOnEdgesFlag = true;

let limitAdjacentRareNumbersFlag = true;
let maxAdjacentRareNumbers = 3;

let limitAdjacentVeryCommonNumbersFlag = true;
let maxAdjacentVeryCommonNumbers = 2;

let requireCommonNumbersForEachResourceFlag = true;
let minCommonNumbersForEachResource = 2;

let maxAttemptsToPlaceResources = 10000;

let maxAttemptsToPlaceNumbers = 100000;

// TILE CLASS

class Tile {
    constructor(r, c, resource) {
        this.r = r;
        this.c = c;
        this.resource = resource;
        this.number = undefined;
        this.numberCategory = undefined;
        this.adjacentTilesWithSameResource = undefined; // includes indirectly adjacent tiles, e.g. in a line
        this.countedResourceCheck = false;
        this.countedNumberCheck = false;
    }
  }

// helper functions 

function randomResource(resources_map) {
    let done = false;
    while (!done) {
        let resource_num = Math.floor(Math.random() * 30);
        if (resource_num < 6) {
            if (resources_map.get("S") > 0) {
                    return "S";
            }
        } else if (resource_num < 12) {
            if (resources_map.get("W") > 0) {
                    return "W";
            }
        } else if (resource_num < 18) {
            if (resources_map.get("H") > 0) {
                return "H";
            }
        } else if (resource_num < 23) {
            if (resources_map.get("B") > 0) {
                return "B";
            }
        } else if (resource_num < 28) {
            if (resources_map.get("O") > 0) {
                return "O";
            }
        } else {
            if (resources_map.get("D") > 0) {
                return "D";
            }
        }
    }
}

function randomNumber(numbers_map) { // Number tile, not just any number.
    let done = false;
    while (!done) {
        let number_num = Math.floor(Math.random() * 28);
        if (number_num < 2) {
            if (numbers_map.get(2) > 0) {
                    return 2;
            }
        } else if (number_num < 5) {
            if (numbers_map.get(3) > 0) {
                    return 3;
            }
        } else if (number_num < 8) {
            if (numbers_map.get(4) > 0) {
                return 4;
            }
        } else if (number_num < 11) {
            if (numbers_map.get(5) > 0) {
                return 5;
            }
        } else if (number_num < 14) {
            if (numbers_map.get(6) > 0) {
                return 6;
            }
        } else if (number_num < 17) {
            if (numbers_map.get(8) > 0) {
                    return 8;
            }
        } else if (number_num < 20) {
            if (numbers_map.get(9) > 0) {
                return 9
            }
        } else if (number_num < 23) {
            if (numbers_map.get(10) > 0) {
                return 10;
            }
        } else if (number_num < 26) {
            if (numbers_map.get(11) > 0) {
                return 11;
            }
        } else {
            if (numbers_map.get(12) > 0) {
                return 12;
            }
        }
    }
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
    let resources_map = new Map();
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
                let resource = randomResource(resources_map);
                board[r][c] = new Tile(r, c, resource);
                resources_map.set(resource, resources_map.get(resource) - 1);
            }
        }
    }

    return board;
}

function placeNumbersOnBoard(board) {
    // define Numbers to place
    let numbers_map = new Map();
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

    // place numbers
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board) && board[r][c] !== undefined && board[r][c].resource !== "D") { 
                let tile = board[r][c];
                // pick a random Number that has at least one left in it
                let number = randomNumber(numbers_map);
                tile.number = number;
                tile.numberCategory = getNumberCategory(board[r][c])
                tile.countedNumberCheck = false;
                numbers_map.set(number, numbers_map.get(number) - 1);
            }
        }
    }
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
   
    return adjacentTilesWithSameResource.length;
}

function countAdjacentTilesWithSameNumberCategory(tile, board) {
    let adjacentTilesWithSameNumberCategory = [tile];
    tile.countedNumberCheck = true;
    let tilesToProcess = [tile];

    while (tilesToProcess.length > 0) {
        let current = tilesToProcess.pop();
        let directlyAdjacentTiles = getDirectlyAdjacentTiles(current, board);
        let directlyAdjacentSameNumberCategory = directlyAdjacentTiles.filter(t => (t.numberCategory === tile.numberCategory && !t.countedNumberCheck));
        //console.log("tile at " + tile.r + "," + tile.c + " directly adjacent same resource:")
        //console.log(directlyAdjacentSameResource)
        for (i = 0; i < directlyAdjacentSameNumberCategory.length; ++i) {
            adjacentTilesWithSameNumberCategory.push(directlyAdjacentSameNumberCategory[i]);
            tilesToProcess.push(directlyAdjacentSameNumberCategory[i]);
            directlyAdjacentSameNumberCategory[i].countedNumberCheck = true;
        }
    }
   
    return adjacentTilesWithSameNumberCategory.length;
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
                    if (limitAdjacentDesertsFlag && tile.resource === "D" && numAdjacent > 1) {
                        return false;
                    } 
                    if (requireDesertsOnEdgesFlag && tile.resource === "D" && getDirectlyAdjacentTiles(tile, board).length === 6) {
                        return false;
                    }
                    if (limitAdjacentResourcesFlag && numAdjacent > maxAdjacentResources) {
                        return false;
                    }                    
                }
            }
        }
    }
    return true;
}

function getNumberCategory(tile) {
    if (tile === undefined || tile.number === undefined) {
        return undefined;
    }

    switch (tile.number) {
        case 2:
        case 3:
        case 11:
        case 12:
            return "lo";
        case 6:
        case 8:
            return "vhi";
        case 5:
        case 9:
            return "hi";
        default:
            return "med";
    }
}

function isValidNumberPlacement(board) {
    // no 4 of 2 3 11 12 adjacent (lo)
    // no 2 of 6 8 adjacent (vhi)
    // each resource needs at least 2 of 5 6 8 9 (hi + vhi)

    let resourceHiNumbers_map = new Map(); // hi or vhi
    resourceHiNumbers_map.set("S", 0)
    resourceHiNumbers_map.set("W", 0)
    resourceHiNumbers_map.set("H", 0)
    resourceHiNumbers_map.set("B", 0)
    resourceHiNumbers_map.set("O", 0)

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board) && board[r][c] !== undefined && board[r][c].resource !== "D") {
                let tile = board[r][c]
                if (!tile.countedNumberCheck) {
                    if (tile.numberCategory === "hi" || tile.numberCategory === "vhi") {
                        resourceHiNumbers_map.set(tile.resource, resourceHiNumbers_map.get(tile.resource) + 1);
                    }
                    let numAdjacent = countAdjacentTilesWithSameNumberCategory(tile, board);
                    //tile.adjacentTilesWithSameResource = numAdjacent; // not actually necessary to save this.
                    if (limitAdjacentRareNumbersFlag && tile.numberCategory === "lo" && numAdjacent > maxAdjacentRareNumbers) {
                        return false;
                    }
                    if (limitAdjacentVeryCommonNumbersFlag && tile.numberCategory === "vhi" && numAdjacent > maxAdjacentVeryCommonNumbers) {
                        return false;
                    }                     
                }
            }
        }
    }

    if (requireCommonNumbersForEachResourceFlag) {
        if (resourceHiNumbers_map.get("S") < minCommonNumbersForEachResource) return false;
        if (resourceHiNumbers_map.get("W") < minCommonNumbersForEachResource) return false;
        if (resourceHiNumbers_map.get("H") < minCommonNumbersForEachResource) return false;
        if (resourceHiNumbers_map.get("B") < minCommonNumbersForEachResource) return false;
        if (resourceHiNumbers_map.get("O") < minCommonNumbersForEachResource) return false;
    }

    return true;
}

// prints the board to the console
function printBoard(board, attemptCountResources, attemptCountNumbers, isValid) {
    let result = "Board #" + attemptCountResources + " with numbers placement #" + attemptCountNumbers + " " + isValid + "\n";
    let visualColumnOffset = "            ";
    for (let r = 0; r < 6; r++) {
        result += visualColumnOffset;
        visualColumnOffset = visualColumnOffset.substring(0, visualColumnOffset.length - 2);
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board)) {
                //console.log(board[r][c]);
                let adjacentMark = board[r][c].number === undefined ? " " : board[r][c].number; 
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

let areResourcesValid = false;
let areNumbersValid = false;
let attemptCountResources = 0;
let attemptCountNumbers = 0;
let board = undefined;

while (!areResourcesValid && attemptCountResources < maxAttemptsToPlaceResources) {
    board = createBoardWithResources(); // Generate board
    attemptCountResources++;
    areResourcesValid = isValidResourcePlacement(board);
}

if (areResourcesValid) {
    while (!areNumbersValid && attemptCountNumbers < maxAttemptsToPlaceNumbers) {
        placeNumbersOnBoard(board);
        attemptCountNumbers++;
        areNumbersValid = isValidNumberPlacement(board);
    }

    if (areNumbersValid) {
        printBoard(board, attemptCountResources, attemptCountNumbers, areResourcesValid && areNumbersValid);
        console.log("Done!");
    } else {
        console.log("Could not find a valid number placement :(");
    }

} else {
    console.log("Could not find a valid resource placement :(");
}