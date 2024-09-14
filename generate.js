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

let colorTextOnlyFlag = true;
let redBackgroundFlag = false;

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
    let resources_arr = [];
    for (let i = 0; i < 6; ++i) {
        resources_arr.push("S"); // Sheep
        resources_arr.push("W"); // Wood
        resources_arr.push("H"); // Wheat
    }
    for (let i = 0; i < 5; ++i) {
        resources_arr.push("B"); // Brick
        resources_arr.push("O"); // Ore
    }
    for (let i = 0; i < 2; ++i) {
        resources_arr.push("D"); // Desert
    }

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
                // pick a random resource 
                let randIndex = Math.floor(Math.random() * resources_arr.length);
                let resource = resources_arr[randIndex];
                resources_arr = resources_arr.filter((_, j) => j != randIndex); // remove item at that index (no replacement)
                board[r][c] = new Tile(r, c, resource);
            }
        }
    }

    return board;
}

function placeNumbersOnBoard(board) {
    // define Numbers to 
    let numbers_arr = [];
    for (let i = 0; i < 2; ++i) {
        numbers_arr.push(2);
        numbers_arr.push(12);
    }
    for (let i = 0; i < 3; ++i) {
        numbers_arr.push(3);
        numbers_arr.push(4);
        numbers_arr.push(5);
        numbers_arr.push(6);
        numbers_arr.push(8);
        numbers_arr.push(9);
        numbers_arr.push(10);
        numbers_arr.push(11);
    }

    // place numbers
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c, board) && board[r][c] !== undefined && board[r][c].resource !== "D") { 
                let tile = board[r][c];
                // pick a random Number that has at least one left in it
                let randIndex = Math.floor(Math.random() * numbers_arr.length);
                let number = numbers_arr[randIndex];
                numbers_arr = numbers_arr.filter((_, j) => j != randIndex); // remove item at that index (no replacement)
                tile.number = number;
                tile.numberCategory = getNumberCategory(board[r][c])
                tile.countedNumberCheck = false;
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

/////////// Hex grid drawing code adapted from https://eperezcosano.github.io/hex-grid/ 
const a = 2 * Math.PI / 6;
const r = 50;

function drawGrid(width, height, ctx, board) {
    let hexToTile_map = new Map([
        [0, undefined],
        [1, undefined],
        [2, undefined],
        [3, board[0][3]],
        [4, undefined],
        [5, undefined],
        [6, undefined],
        [7, undefined],
        [8, board[0][1]],
        [9, board[0][2]],
        [10, board[1][3]],
        [11, board[1][4]],
        [12, board[2][5]],
        [13, undefined],
        [14, board[0][0]],
        [15, board[1][1]],
        [16, board[1][2]],
        [17, board[2][3]],
        [18, board[2][4]],
        [19, board[3][5]],
        [20, board[3][6]],
        [21, board[1][0]],
        [22, board[2][1]],
        [23, board[2][2]],
        [24, board[3][3]],
        [25, board[3][4]],
        [26, board[4][5]],
        [27, board[4][6]],
        [28, board[2][0]],
        [29, board[3][1]],
        [30, board[3][2]],
        [31, board[4][3]],
        [32, board[4][4]],
        [33, board[5][5]],
        [34, board[5][6]],
        [35, undefined],
        [36, undefined],
        [37, board[4][2]],
        [38, board[5][3]],
        [39, board[5][4]],
        [40, undefined],
        [41, undefined],
    ]);


    let hexNum = 0;
    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
            let maybeTile = hexToTile_map.get(hexNum)
            if (maybeTile !== undefined) {
                drawHexagon(x, y, maybeTile, ctx);
                //ctx.fillText(hexNum, x, y - 25); // todo remove this after building non-expansion support
                if (maybeTile.resource != "D") drawCircle(x, y, ctx);
                drawText(x, y, maybeTile, ctx)
            }
            hexNum++;
        }
    }
}

function drawCircle(x, y, ctx) {
    ctx.fillStyle = "linen";
    ctx.beginPath();
    ctx.arc(x, y + 21, 12, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
  
function drawHexagon(x, y, tile, ctx) {
    // create linear gradient
    let gradient = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    if (colorTextOnlyFlag) {
        gradient.addColorStop(0, "oldlace");
        gradient.addColorStop(1, "white");
    } else {
        let colors = getResourceColors(tile.resource);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
    }
    
    ctx.fillStyle = gradient;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#dccfb7";
    //ctx.fillStyle = "white";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function getResourceName(resource) {
    switch (resource) {
        case "S":
            return "SHEEP";
        case "W":
            return "WOOD";
        case "H":
            return "WHEAT";
        case "B":
            return "BRICK";
        case "O":
            return "ORE";
        case "D":
            return "DESERT";                                                             
    }
}

function getResourceColors(resource) { // dark, light
    switch (resource) {
        case "S":
            return ["#619d3b", "#dcd569"];
        case "W":
            return ["#2d4716", "#89b936"];
        case "H":
            return ["#975a1f", "#fdd051"];
        case "B":
            return ["#603822", "#e68531"];
        case "O":
            return ["#443a62", "#b8ab93"];
        case "D":
            return ["#deb977", "#cfc2ac"];                                                             
    }
}

function drawText(x, y, tile, ctx) {
    let resourceName = getResourceName(tile.resource);
    ctx.font = "bold 18px Georgia, serif";
    if (colorTextOnlyFlag) {
        // define gradient
        let colors = getResourceColors(tile.resource);
        let gradient = ctx.createLinearGradient(x - r, y - r/2, x + r, y);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = "white";
    }
    
    let resourceY = !tile.number ? y + 3 : y - 2;
    ctx.fillText(resourceName, x, resourceY);
    if (tile.numberCategory === "vhi") {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.font = "bold 15px Georgia, serif";
    if (tile.number !== undefined) ctx.fillText(tile.number, x, y + 25);
}

/////// end code from https://eperezcosano.github.io/hex-grid/

//// adapted from https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
function createHiPPICanvas(width, height, pixelRatio) {
    const canvas = document.createElement("canvas");
    
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").scale(pixelRatio, pixelRatio);
    
    canvas.style.width = (width / pixelRatio) + "px";
    canvas.style.height = (height / pixelRatio) + "px";
    
    return canvas;
}

function drawBoard(board) {
    const pixelRatio = window.devicePixelRatio;
    console.log("Device pixel ratio: " + pixelRatio);
    
    const targetWidth = 650;
    const targetHeight = 650;
    const canvas = createHiPPICanvas(targetWidth * pixelRatio, targetHeight * pixelRatio, pixelRatio);
    
    const parent = document.getElementById("visualboard");
    parent.appendChild(canvas);  
    const ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    drawGrid(targetWidth, targetHeight, ctx, board);
}

// set page background color
if (redBackgroundFlag) {
    document.documentElement.style.setProperty("background-color", "#be1d23");
} else {
    document.documentElement.style.setProperty("background-color", "black");
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
        drawBoard(board)
        console.log("Done!");
    } else {
        console.log("Could not find a valid number placement :(");
    }

} else {
    console.log("Could not find a valid resource placement :(");
}