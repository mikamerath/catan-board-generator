//let nums = []
//let resources = []

class Tile {
    constructor(resource) {
      this.resource = resource;
      this.number = undefined;
    }
  }

// generate an empty board

let board = [[undefined, undefined, undefined, undefined, null, null, null],
  [undefined, undefined, undefined, undefined, undefined, null, null],
  [undefined, undefined, undefined, undefined, undefined, undefined, null],
  [null, undefined, undefined, undefined, undefined, undefined, undefined],
  [null, null, undefined, undefined, undefined, undefined, undefined],
  [null, null, null, undefined, undefined, undefined, undefined]];

// place deserts by making those tiles null



// define resources and numbers to place

let resources_map = new Map();
resources_map.set("S", 6);
resources_map.set("W", 6);
resources_map.set("H", 6);
resources_map.set("B", 5);
resources_map.set("O", 5);
resources_map.set("D", 2);

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

// helper functions 

function randomTile() {
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

function isValidTile(r, c) {
    if (r < 0 || r > 5) return false;
    if (c < 0 || c > 6) return false;
    if (board[r][c] === null) return false;
    return true;
}

function printBoard(board) {
    let result = "";
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (isValidTile(r, c)) {
                result += board[r][c].resource + " ";
            }
            else {
                result += "- ";
            }
        }
        result += "\n";
    }
    console.log(result);
}

// place tiles with resources in the board

for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
        if (isValidTile(r, c)) {
            // pick a random resource that has at least one left in it
            let resource = randomTile();
            board[r][c] = new Tile(resource);
            resources_map.set(resource, resources_map.get(resource) - 1);
        }
    }
}

printBoard(board);
console.log([...resources_map.entries()]);

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