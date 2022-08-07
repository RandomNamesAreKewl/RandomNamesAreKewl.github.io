const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
var tiles;
// The NUMBER state should dynamically change based on the number of mines surrounding the tile.
const TILE_STATE = {
    HIDDEN: 0,
    FLAG: 1,
    QUESTION: 2,
    FHWMINE: 3,
    IFLAG: 4,
    MINE: 5,
    NUMBER: 6,
    HMINE: 7,
    HIFLAG: 8,
    MQUESTION: 9
};
const TILE_COUNTED = [
    TILE_STATE.HMINE,
    TILE_STATE.FLAG,
    TILE_STATE.MQUESTION,
    TILE_STATE.FHWMINE,
    TILE_STATE.MINE
]
var map = [];
var mapWidth = 10;
var mapHeight = 10;
var mineCount = 10;
var firstTurn = true;
var gameOver = false;
var time = 0;
NewGame(true);


document.querySelector("#minesweeper-content").appendChild(canvas);


document.querySelector("#new-game").addEventListener("click", e => {NewGame();});
function NewGame(use_defaults = false) {
    map = [];
    if(use_defaults) {
        mapWidth = 9;
        mapHeight = 9;
        mineCount = 10;
    } else {
        mapWidth = +prompt("Width:", 9);
        mapHeight = +prompt("Height:", 9);
        mineCount = +prompt("Mines:", 10);
    }
    firstTurn = true;
    gameOver = false;
    time = 0;
    canvas.width = mapWidth * 16;
    canvas.height = mapHeight * 16;

    for(var i=0; i<mapHeight; i++) {
        map.push(new Array(mapWidth).fill(TILE_STATE.HIDDEN));
    }

    // Stop dumb mine counts
    mineCount = (mineCount > mapWidth * mapHeight - 1) ? mapWidth * mapHeight - 1 : mineCount;
    mineCount = (mineCount < 1) ? 1 : mineCount;
    // For if we couldn't place all the mines
    var minesOnMap = 0;
    let Attempts = 0;
    for(var i=0; i<mineCount; i++) {
        var x = Math.floor(Math.random() * mapWidth);
        var y = Math.floor(Math.random() * mapHeight);
        if(map[y][x] !== TILE_STATE.HMINE) {
            map[y][x] = TILE_STATE.HMINE;
            minesOnMap++;
        } else {
            i--;
        }
        Attempts++;
        if(Attempts > mineCount * 8) {
            console.error("ABORTING: Couldn't find a free place to put the mines.");
            break;
        }
    }
    setTimeout(TickTimer, 1000);
}


function TickTimer() {
    if(!gameOver) {
        time++;
        setTimeout(TickTimer, 1000);
    }
}


function Tick() {
    requestAnimationFrame(Tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let won = true;
    let ShownMineCount = mineCount;
    for(var x=0; x<mapWidth; x++) {
        for(var y=0; y<mapHeight; y++) {
            switch(map[y][x]) {
            case TILE_STATE.NUMBER:
                // Should be calculated based on the number of mines surrounding the tile.
                let surroundingMines = 0;
                for(var i=-1; i<2; i++) {
                    for(var j=-1; j<2; j++) {
                        if(i == 0 && j == 0) continue;
                        if(map[y+i] && map[y+i][x+j] && TILE_COUNTED.includes(map[y+i][x+j])) surroundingMines++;
                    }
                }
                ctx.drawImage(tiles,
                    0, (15 - surroundingMines) * 16, 16, 16,
                    x * 16, y * 16, 16, 16);
                break;
            case TILE_STATE.HMINE:
                ctx.drawImage(tiles,
                    0, 0, 16, 16,
                    x * 16, y * 16, 16, 16);
                if(currentCode.length == SecretCode.length) ctx.fillRect(x * 16, y * 16, 2, 2);
                won = false;
                break;
            case TILE_STATE.HIFLAG:
                ctx.drawImage(tiles,
                    0, 16, 16, 16,
                    x * 16, y * 16, 16, 16);
                ShownMineCount--;
                won = false;
                break;
            case TILE_STATE.MQUESTION:
                ctx.drawImage(tiles,
                    0, TILE_STATE.QUESTION * 16, 16, 16,
                    x * 16, y * 16, 16, 16);
                won = false;
                break;
            case TILE_STATE.FLAG:
                ShownMineCount--;
                ctx.drawImage(tiles,
                    0, 16, 16, 16,
                    x * 16, y * 16, 16, 16);
                break;
            case TILE_STATE.QUESTION:
                won = false;
            default:
                ctx.drawImage(tiles,
                    0, map[y][x] * 16, 16, 16,
                    x * 16, y * 16, 16, 16);
            }
        }
    }
    document.querySelector("#mine-counter").innerText = "Mines: " + ShownMineCount;
    document.querySelector("#timer").innerText = "Time: " + time;
    if(won && !gameOver) {
        alert("You won!");
        gameOver = true;
        for(var x=0; x<mapWidth; x++) {
            for(var y=0; y<mapHeight; y++) {
                switch(map[y][x]) {
                case TILE_STATE.HMINE:
                    map[y][x] = TILE_STATE.MINE;
                    break;
                case TILE_STATE.HIDDEN:
                    map[y][x] = TILE_STATE.NUMBER;
                    break;
                case TILE_STATE.HIFLAG:
                    map[y][x] = TILE_STATE.IFLAG;
                    break;
                case TILE_STATE.MQUESTION:
                    map[y][x] = TILE_STATE.MINE;
                    break;
                }
            }
        }
    }
}

// For easier clearing out large areas of tiles
function clearTile(x, y) {
    if(x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return;
    if(map[y][x] !== TILE_STATE.HIDDEN) return;
    map[y][x] = TILE_STATE.NUMBER;
    for(var i=-1; i<2; i++) {
        for(var j=-1; j<2; j++) {
            if(!(map[y + i] && map[y + i][x + j])) continue;
            if(TILE_COUNTED.includes(map[y+i][x+j])) return;
        }
    }
    clearTile(x-1, y-1);
    clearTile(x, y-1);
    clearTile(x+1, y-1);
    clearTile(x-1, y);
    clearTile(x+1, y);
    clearTile(x-1, y+1);
    clearTile(x, y+1);
    clearTile(x+1, y+1);
}

canvas.addEventListener("click", e => {
    if(gameOver) return;
    switch(map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)]) {
    case TILE_STATE.HIDDEN:
        clearTile(Math.floor(e.offsetX / 16), Math.floor(e.offsetY / 16));
        break;
    case TILE_STATE.HMINE:
        if(firstTurn) {
            firstTurn = false;
            let moved = false;
            let Attempts = 0;
            while(!moved) {
                let x = Math.floor(Math.random() * mapWidth);
                let y = Math.floor(Math.random() * mapHeight);
                if(map[y][x] === TILE_STATE.HIDDEN) {
                    map[y][x] = TILE_STATE.HMINE;
                    moved = true;
                    break;
                }
                Attempts++;
                if(Attempts > mapWidth * mapHeight * 8) {
                    console.error("ABORTING: Couldn't find a free place to move the mine.");
                }
            }
            map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.HIDDEN;
            clearTile(Math.floor(e.offsetX / 16), Math.floor(e.offsetY / 16));
            break;
        }
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.FHWMINE;
        gameOver = true;
        for(var x=0; x<mapWidth; x++) {
            for(var y=0; y<mapHeight; y++) {
                switch(map[y][x]) {
                case TILE_STATE.HMINE:
                    map[y][x] = TILE_STATE.MINE;
                    break;
                case TILE_STATE.HIDDEN:
                    map[y][x] = TILE_STATE.NUMBER;
                    break;
                case TILE_STATE.HIFLAG:
                    map[y][x] = TILE_STATE.IFLAG;
                    break;
                case TILE_STATE.MQUESTION:
                    map[y][x] = TILE_STATE.MINE;
                    break;
                }
            }
        }
        break;
    default:
        break;
    }
    firstTurn = false;
});
canvas.addEventListener("contextmenu", e => {
    if(gameOver) return;
    switch(map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)]) {
    case TILE_STATE.HIDDEN:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.HIFLAG;
        break;
    case TILE_STATE.HMINE:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.FLAG;
        break;
    case TILE_STATE.HIFLAG:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.QUESTION;
        break;
    case TILE_STATE.FLAG:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.MQUESTION;
        break;
    case TILE_STATE.QUESTION:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.HIDDEN;
        break;
    case TILE_STATE.MQUESTION:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.HMINE;
        break;
    default:
        break;
    }
    e.preventDefault();
});
const SecretCode = "xyzzy";
var currentCode = "";
document.addEventListener("keydown", e => {
    if(e.key != SecretCode[currentCode.length]) {
        currentCode = "";
    } else {
        currentCode += e.key;
    }
});

var tiles = new Image();
tiles.src = "tiles.png";
tiles.onload = () => {
    Tick();
}
