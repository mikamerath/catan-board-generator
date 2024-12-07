// file:///C:/Users/marwt/Documents/code/catan-board-generator/index.html

// https://mikamerath.github.io/catan-board-generator/

/**
 * TODO
 * - improve shuffle experience - loading state, icon style, sailed past styling
 * - fix colors on mobile, and improve themes.  
 * - announce v 3.0 ... kindly report feature requests to michael or margaret, and bugs to james :grin:
 */

// SETTINGS

let limitAdjacentResourcesFlag = true;
let maxAdjacentResources = 2; // 2, 3, unlimited

let limitAdjacentDesertsFlag = true;

let requireDesertsOnEdgesFlag = true;

// rare numbers are 2, 3, 11, 12
let limitAdjacentRareNumbersFlag = true;
let maxAdjacentRareNumbers = 2; // 2, 3, unlimited

// very common numbers are 6, 8
let limitAdjacentVeryCommonNumbersFlag = true;
let maxAdjacentVeryCommonNumbers = 1; // 1, 2, unlimited

// common numbers are 5, 6, 8, 9
let requireCommonNumbersForEachResourceFlag = true;
let minCommonNumbersForEachResource = 2; // 2, 1, unrestricted

let maxAttemptsToPlaceResources = 10000;

let maxAttemptsToPlaceNumbers = 200000;

let colorTextOnlyFlag = false;
let redBackgroundFlag = false;

// the board that has been drawn
let drawnBoard = undefined;

// ONCLICK EVENTS

// function changeBackground(box) {
//     redBackgroundFlag = box.checked;
//     setBackgroundColor();
// }

// function changeColorTextOnly(box) {
//     colorTextOnlyFlag = !box.checked;
//     removeCanvas();
//     drawBoard(drawnBoard);
// }

function changeAlternateVisuals(isAlternate) {
    if (redBackgroundFlag != isAlternate) {
        redBackgroundFlag = isAlternate;

        if (redBackgroundFlag) {
            document.getElementById("sunriseredbutton").classList.add("selected-button");
            document.getElementById("ravenblackbutton").classList.remove("selected-button");
        } else {
            document.getElementById("ravenblackbutton").classList.add("selected-button");
            document.getElementById("sunriseredbutton").classList.remove("selected-button");
        }

        setBackgroundColor();

        colorTextOnlyFlag = isAlternate;
        if(drawnBoard !== undefined) drawBoard(drawnBoard);
        else drawFailure("... but the Settlers would like this new look!");
    }
}

function setPresetBalanced() {
    changeLimitAdjacentResources(2);
    changeLimitAdjacentVeryCommonNumbers(1);
    changeRequireCommonNumbersForEachResource(2);
    changeLimitAdjacentRareNumbers(2);
    changeRequireDesertsOnEdges(true);
    changeLimitAdjacentDeserts(true);

    document.getElementById("balanced").classList.add("selected-button");
    document.getElementById("spicy").classList.remove("selected-button");
    document.getElementById("wildwest").classList.remove("selected-button");
}

function setPresetSpicy() {
    changeLimitAdjacentResources(3);
    changeLimitAdjacentVeryCommonNumbers(2);
    changeRequireCommonNumbersForEachResource(1);
    changeLimitAdjacentRareNumbers(3);
    changeRequireDesertsOnEdges(false);
    changeLimitAdjacentDeserts(true);

    document.getElementById("spicy").classList.add("selected-button");
    document.getElementById("balanced").classList.remove("selected-button");
    document.getElementById("wildwest").classList.remove("selected-button");
}

function setPresetWildWest() {
    changeLimitAdjacentResources(100);
    changeLimitAdjacentVeryCommonNumbers(100);
    changeRequireCommonNumbersForEachResource(0);
    changeLimitAdjacentRareNumbers(100);
    changeRequireDesertsOnEdges(false);
    changeLimitAdjacentDeserts(false);

    document.getElementById("wildwest").classList.add("selected-button");
    document.getElementById("balanced").classList.remove("selected-button");
    document.getElementById("spicy").classList.remove("selected-button");
}

function checkPresets() {
    let isBalanced = (maxAdjacentResources == 2) && (maxAdjacentVeryCommonNumbers == 1) && (minCommonNumbersForEachResource == 2) && (maxAdjacentRareNumbers == 2) && requireDesertsOnEdgesFlag && limitAdjacentDesertsFlag;
    let isSpicy = (maxAdjacentResources == 3) && (maxAdjacentVeryCommonNumbers == 2) && (minCommonNumbersForEachResource == 1) && (maxAdjacentRareNumbers == 3) && !requireDesertsOnEdgesFlag && limitAdjacentDesertsFlag;
    let isWildWest = (maxAdjacentResources == 100) && (maxAdjacentVeryCommonNumbers == 100) && (minCommonNumbersForEachResource == 0) && (maxAdjacentRareNumbers == 100) && !requireDesertsOnEdgesFlag && !limitAdjacentDesertsFlag;

    if (isBalanced) {
        document.getElementById("balanced").classList.add("selected-button");
    } else {
        document.getElementById("balanced").classList.remove("selected-button");
    }

    if (isSpicy) {
        document.getElementById("spicy").classList.add("selected-button");
    } else {
        document.getElementById("spicy").classList.remove("selected-button");
    }

    if (isWildWest) {
        document.getElementById("wildwest").classList.add("selected-button");
    } else {
        document.getElementById("wildwest").classList.remove("selected-button");
    }
}

function changeLimitAdjacentResources(limit) {
    maxAdjacentResources = limit;
    limitAdjacentResourcesFlag = limit < 10;
    
    if (maxAdjacentResources == 2) {
        document.getElementById("adjacenttwo").classList.add("selected-button");
        document.getElementById("adjacentthree").classList.remove("selected-button");
        document.getElementById("adjacentunlimited").classList.remove("selected-button");
    } else if (maxAdjacentResources == 3) {
        document.getElementById("adjacentthree").classList.add("selected-button");
        document.getElementById("adjacenttwo").classList.remove("selected-button");
        document.getElementById("adjacentunlimited").classList.remove("selected-button");
    } else {
        document.getElementById("adjacentunlimited").classList.add("selected-button");
        document.getElementById("adjacenttwo").classList.remove("selected-button");
        document.getElementById("adjacentthree").classList.remove("selected-button");
    }

    checkPresets();
    // must reshuffle manually to see effect
}

function changeLimitAdjacentVeryCommonNumbers(limit) {
    maxAdjacentVeryCommonNumbers = limit;
    limitAdjacentVeryCommonNumbersFlag = limit < 10;
    
    if (maxAdjacentVeryCommonNumbers == 1) {
        document.getElementById("noadjacentreds").classList.add("selected-button");
        document.getElementById("twoadjacentreds").classList.remove("selected-button");
        document.getElementById("unlimitedadjacentreds").classList.remove("selected-button");
    } else if (maxAdjacentVeryCommonNumbers == 2) {
        document.getElementById("twoadjacentreds").classList.add("selected-button");
        document.getElementById("noadjacentreds").classList.remove("selected-button");
        document.getElementById("unlimitedadjacentreds").classList.remove("selected-button");
    } else {
        document.getElementById("unlimitedadjacentreds").classList.add("selected-button");
        document.getElementById("noadjacentreds").classList.remove("selected-button");
        document.getElementById("twoadjacentreds").classList.remove("selected-button");
    }

    checkPresets();
    // must reshuffle manually to see effect
}

function changeRequireCommonNumbersForEachResource(min) {
    minCommonNumbersForEachResource = min;
    requireCommonNumbersForEachResourceFlag = min > 0;
    
    if (minCommonNumbersForEachResource == 2) {
        document.getElementById("commontwo").classList.add("selected-button");
        document.getElementById("commonone").classList.remove("selected-button");
        document.getElementById("commonany").classList.remove("selected-button");
    } else if (minCommonNumbersForEachResource == 1) {
        document.getElementById("commonone").classList.add("selected-button");
        document.getElementById("commontwo").classList.remove("selected-button");
        document.getElementById("commonany").classList.remove("selected-button");
    } else {
        document.getElementById("commonany").classList.add("selected-button");
        document.getElementById("commontwo").classList.remove("selected-button");
        document.getElementById("commonone").classList.remove("selected-button");
    }

    checkPresets();
    // must reshuffle manually to see effect
}

function changeLimitAdjacentRareNumbers(limit) {
    maxAdjacentRareNumbers = limit;
    limitAdjacentRareNumbersFlag = limit < 10;
    
    if (maxAdjacentRareNumbers == 2) {
        document.getElementById("raretwo").classList.add("selected-button");
        document.getElementById("rarethree").classList.remove("selected-button");
        document.getElementById("rareunlimited").classList.remove("selected-button");
    } else if (maxAdjacentRareNumbers == 3) {
        document.getElementById("rarethree").classList.add("selected-button");
        document.getElementById("raretwo").classList.remove("selected-button");
        document.getElementById("rareunlimited").classList.remove("selected-button");
    } else {
        document.getElementById("rareunlimited").classList.add("selected-button");
        document.getElementById("raretwo").classList.remove("selected-button");
        document.getElementById("rarethree").classList.remove("selected-button");
    }

    checkPresets();
    // must reshuffle manually to see effect
}

function changeRequireDesertsOnEdges(requireDesertsOnEdges) {
    requireDesertsOnEdgesFlag = requireDesertsOnEdges;

    if (requireDesertsOnEdgesFlag) {
        document.getElementById("desertsedges").classList.add("selected-button");
        document.getElementById("desertsanywhere").classList.remove("selected-button");
    } else {
        document.getElementById("desertsanywhere").classList.add("selected-button");
        document.getElementById("desertsedges").classList.remove("selected-button");
    }

    checkPresets();
    // must reshuffle manually to see effect
}

function changeLimitAdjacentDeserts(limitAdjacentDeserts) {
    limitAdjacentDesertsFlag = limitAdjacentDeserts;

    if (limitAdjacentDesertsFlag) {
        document.getElementById("noadjacentdeserts").classList.add("selected-button");
        document.getElementById("adjacentdeserts").classList.remove("selected-button");
    } else {
        document.getElementById("adjacentdeserts").classList.add("selected-button");
        document.getElementById("noadjacentdeserts").classList.remove("selected-button");
    }

    checkPresets();
    // must reshuffle manually to see effect
}

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
                    // count adjacent tiles with same resource
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
const r = 33;

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
    ctx.arc(x, y + 13, 10, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
  
function drawHexagon(x, y, tile, ctx) {
    // create linear gradient
    let gradient = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    if (colorTextOnlyFlag) {
        gradient.addColorStop(0, "oldlace");
        gradient.addColorStop(1, "white");
        ctx.strokeStyle = "#dccfb7";
    } else {
        let colors = getResourceColors(tile.resource);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        ctx.strokeStyle = "black";
    }
    
    ctx.fillStyle = gradient;

    ctx.lineWidth = 1.5;
    //ctx.strokeStyle = "#dccfb7";
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
            return ["#6fb61e", "#dcd569"];
        case "W":
            return ["#16472f", "#6bbb2e"];
        case "H":
            return ["#a47612", "#fbda48"];
        case "B":
            return ["#77341d", "#e68531"];
        case "O":
            return ["#443a62", "#b8ab93"];
        case "D":
            return ["#deb977", "#e5e0d8"];                                                             
    }
}

function drawText(x, y, tile, ctx) {
    // resource
    let resourceName = getResourceName(tile.resource);
    let resourceY = !tile.number ? y + 3 : y - 4;
    if (colorTextOnlyFlag) {
        ctx.font = "bold 12px Georgia, serif";
        resourceY = !tile.number ? y + 3 : y - 1;
        // define gradient
        let colors = getResourceColors(tile.resource);
        let gradient = ctx.createLinearGradient(x - r, y - r/2, x + r, y);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        ctx.fillStyle = gradient;
    } else {
        ctx.font = "bold 10px Georgia, serif";
        ctx.fillStyle = "white";
    }
    ctx.fillText(resourceName, x, resourceY);

    // number
    if (tile.numberCategory === "vhi") {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.font = "bold 14px Georgia, serif";
    if (tile.number !== undefined) ctx.fillText(tile.number, x, y + 17);
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
    removeCanvas();
    const pixelRatio = window.devicePixelRatio;
    
    const targetWidth = 380; // 650 if r = 50
    const targetHeight = 380; // 650 if r = 50
    const canvas = createHiPPICanvas(targetWidth * pixelRatio, targetHeight * pixelRatio, pixelRatio);
    
    const parent = document.getElementById("visualboard");
    parent.appendChild(canvas);  
    const ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    drawGrid(targetWidth, targetHeight, ctx, board);

    drawnBoard = board;
}

function drawFailure(message) {
    removeCanvas();
    const pixelRatio = window.devicePixelRatio;
    
    const targetWidth = 380;
    const targetHeight = 380;
    const canvas = createHiPPICanvas(targetWidth * pixelRatio, targetHeight * pixelRatio, pixelRatio);
    
    const parent = document.getElementById("visualboard");
    parent.appendChild(canvas);  
    const ctx = canvas.getContext("2d");
    //ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Georgia, serif";
    ctx.fillText("You have sailed past Catan", 55, 80);
    ctx.font = "10px Georgia, serif";
    ctx.fillText(message, 50, 120);
    ctx.font = "italic 10px Georgia, serif";
    ctx.fillText("Reshuffle to try again.", 130, 140);
}

function setBackgroundColor() {
    console.log("Setting background to red: " + redBackgroundFlag)
    // set page background color
    if (redBackgroundFlag) {
        document.documentElement.style.setProperty("background-color", "#d12828"); // be1d23 on my laptop, but phone looks bright red
    } else {
        document.documentElement.style.setProperty("background-color", "black");
    }
}

function removeCanvas() {
    // remove existing canvas, if any
    const parent = document.getElementById("visualboard");
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function regenerateBoard() {
    drawnBoard = undefined;

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
            drawBoard(board);
        } else {
            drawFailure("Could not place numbers as requested in " + maxAttemptsToPlaceNumbers + " attempts.");
            console.log("Could not find a valid number placement :(");
        }

    } else {
        drawFailure("Could not place resources as requested in " + maxAttemptsToPlaceResources + " attempts.");
        console.log("Could not find a valid resource placement :(");
    }
}

setBackgroundColor();
regenerateBoard();

