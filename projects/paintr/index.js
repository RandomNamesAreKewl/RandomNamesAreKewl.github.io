var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var primary_color = document.querySelector("#primary-color");
var secondary_color = document.querySelector("#secondary-color");
var cur_tool = document.querySelector("#cur-tool");
var zoom_selector = document.querySelector("#zoom-selector");
var undoing = [];
var redoing = [];
var held_button = -1;
var last_tool_pos = { x: 0, y: 0 };
ctx.imageSmoothingEnabled = false;
function clearCanvas() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
clearCanvas();
updateZoom();
function getZoom() {
    return parseFloat(zoom_selector.value);
}
function newImg() {
    var width = parseInt(prompt("New image width?", "160"), 10);
    var height = parseInt(prompt("New image height?", "120"), 10);
    undoing = [];
    redoing = [];
    canvas.width = width;
    canvas.height = height;
    clearCanvas();
}
function saveImg() {
    var link = document.createElement("a");
    link.download = "image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
function loadImg() {
    var fi = document.createElement("input");
    fi.type = "file";
    fi.accept = "image/png, image/jpeg";
    fi.onchange = function (e) {
        var fr = new FileReader();
        fr.onload = function (e) {
            var img = document.createElement("img");
            img.onload = function (e) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                updateZoom();
                undoing = [];
                redoing = [];
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(fi.files[0]);
    };
    fi.click();
}
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
function lerp(a, b, amount) {
    return {
        x: a.x + (b.x - a.x) * amount,
        y: a.y + (b.y - a.y) * amount
    };
}
function getToolColor() {
    if (held_button === 2)
        return secondary_color.value;
    return primary_color.value;
}
function handleTool(pos) {
    var dist = Math.max(distance(last_tool_pos, pos), 1);
    switch (cur_tool.value) {
        case "pencil":
            ctx.fillStyle = getToolColor();
            for (var i = 0; i <= dist; i++) {
                var point = lerp(last_tool_pos, pos, i / dist);
                ctx.fillRect(Math.floor(point.x), Math.floor(point.y), 1, 1);
            }
            break;
        case "brush":
            ctx.fillStyle = getToolColor();
            for (var i = 0; i <= dist; i++) {
                var point = lerp(last_tool_pos, pos, i / dist);
                ctx.fillRect(Math.floor(point.x - 2), Math.floor(point.y - 1), 5, 3);
                ctx.fillRect(Math.floor(point.x - 1), Math.floor(point.y - 2), 3, 5);
            }
            break;
        case "fill":
            console.log(hexColortoRGBColor(getToolColor()));
            floodFill(ctx, pos, hexColortoRGBColor(getToolColor()));
            break;
    }
}
canvas.addEventListener("mousedown", function (e) {
    e.preventDefault();
    if (e.button === 3)
        return;
    undoing.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoing = [];
    held_button = e.button;
    last_tool_pos.x = Math.floor(e.offsetX / getZoom());
    last_tool_pos.y = Math.floor(e.offsetY / getZoom());
    handleTool({
        x: Math.floor(e.offsetX / getZoom()),
        y: Math.floor(e.offsetY / getZoom())
    });
});
canvas.addEventListener("mousemove", function (e) {
    if (held_button != -1) {
        handleTool({
            x: Math.floor(e.offsetX / getZoom()),
            y: Math.floor(e.offsetY / getZoom())
        });
    }
    last_tool_pos.x = Math.floor(e.offsetX / getZoom());
    last_tool_pos.y = Math.floor(e.offsetY / getZoom());
});
document.addEventListener("mouseup", function (e) {
    e.preventDefault();
    held_button = -1;
});
canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
function updateZoom() {
    canvas.style.width = "".concat(canvas.width * getZoom(), "px");
}
zoom_selector.addEventListener("change", function (e) {
    updateZoom();
});
// This function expects the color to be in #RRGGBB format
function hexColortoRGBColor(color) {
    return "rgba(".concat(parseInt(color.substring(1, 3), 16), ", ").concat(parseInt(color.substring(3, 5), 16), ", ").concat(parseInt(color.substring(5, 7), 16), ", 255)");
}
function floodFill(ctx, startPos, replacementColor) {
    var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var pixelStack = [startPos];
    var baseColor = getColorAt(startPos);
    var i = 0;
    while (pixelStack.length && i < canvas.width * canvas.height) {
        var newPos = pixelStack.pop();
        var x = newPos.x;
        var y = newPos.y;
        if (checkColorMatch(x, y)) {
            setColorAt(x, y, replacementColor);
            pixelStack.push({ x: x + 1, y: y });
            pixelStack.push({ x: x - 1, y: y });
            pixelStack.push({ x: x, y: y + 1 });
            pixelStack.push({ x: x, y: y - 1 });
        }
        i++;
    }
    ctx.putImageData(imageData, 0, 0);
    function getColorAt(pos) {
        var offset = (pos.y * imageData.width + pos.x) * 4;
        var data = imageData.data;
        return "rgba(".concat(data[offset], ",").concat(data[offset + 1], ",").concat(data[offset + 2], ",").concat(data[offset + 3], ")");
    }
    function setColorAt(x, y, color) {
        var offset = (y * imageData.width + x) * 4;
        var data = imageData.data;
        var rgb = color.match(/\d+/g);
        data[offset] = parseInt(rgb[0]);
        data[offset + 1] = parseInt(rgb[1]);
        data[offset + 2] = parseInt(rgb[2]);
        data[offset + 3] = 255; // Alpha
    }
    function checkColorMatch(x, y) {
        if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
            return false;
        }
        var colorAtPoint = getColorAt({ x: x, y: y });
        return colorAtPoint === baseColor;
    }
}
document.addEventListener("keydown", function (e) {
    if (e.key == "z" && e.ctrlKey && undoing.length > 0) {
        e.preventDefault();
        redoing.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(undoing.pop(), 0, 0);
    }
    if (e.key == "y" && e.ctrlKey && redoing.length > 0) {
        e.preventDefault();
        undoing.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(redoing.pop(), 0, 0);
    }
});
