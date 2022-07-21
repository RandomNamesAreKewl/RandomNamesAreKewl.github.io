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
canvas.width = mapWidth * 16;
canvas.height = mapHeight * 16;

for(var i=0; i<mapHeight; i++) {
    map.push(new Array(mapWidth).fill(TILE_STATE.HIDDEN));
}

// Stop dumb mine counts
mineCount = (mineCount > mapWidth * mapHeight) ? mapWidth * mapHeight - 1 : mineCount;
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


document.querySelector("#minesweeper-content").appendChild(canvas);


function Tick() {
    requestAnimationFrame(Tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                break;
            case TILE_STATE.HIFLAG:
                ctx.drawImage(tiles,
                    0, 16, 16, 16,
                    x * 16, y * 16, 16, 16);
                break;
            case TILE_STATE.MQUESTION:
                ctx.drawImage(tiles,
                    0, TILE_STATE.QUESTION * 16, 16, 16,
                    x * 16, y * 16, 16, 16);
                break;
            default:
                ctx.drawImage(tiles,
                    0, map[y][x] * 16, 16, 16,
                    x * 16, y * 16, 16, 16);
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
    switch(map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)]) {
    case TILE_STATE.HIDDEN:
        clearTile(Math.floor(e.offsetX / 16), Math.floor(e.offsetY / 16));
        break;
    case TILE_STATE.HMINE:
        map[Math.floor(e.offsetY / 16)][Math.floor(e.offsetX / 16)] = TILE_STATE.FHWMINE;
        break;
    default:
        break;
    }
});
canvas.addEventListener("contextmenu", e => {
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

var tiles = new Image();
tiles.src = "tiles.png";
tiles.onload = () => {
    Tick();
}
