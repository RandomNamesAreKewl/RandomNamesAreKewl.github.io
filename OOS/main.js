function string2Html(text) {
    let template = document.createElement('template');
    template.innerHTML = text;
    return template.content.firstChild;
}
function createWindow(title, content, width, height, centered = true, closeable = true) {
    let window = string2Html(`<div class="window" style="width: ${width}rem; height: ${height + 2}rem;${(centered)?' top: 50%; left: 50%; transform: translate(-50%, -50%);':''}"><div class="window-titlebar"><p class="window-titlebar-title">${title}</p><div class="window-titlebar-controls">${(closeable)?'<button aria-label="Close"></button>':''}</div></div><iframe class="window-content" src="${content}" style="width: ${width}rem; height: ${height}rem;"></iframe></div>`);
    document.body.appendChild(window);
    latestWindow = window;
}

var programs = {};
var latestWindow = null;
createWindow('Test', './applications/terminal.html', 20, 20);
var dragging = null;
var dragOffset = {x: 0, y: 0};

document.addEventListener("mousedown", e => {
    if(e.target.classList.contains("window-titlebar")) {
        dragging = e.target.parentElement;
        dragOffset.x = e.clientX - dragging.offsetLeft;
        dragOffset.y = e.clientY - dragging.offsetTop;
    }
});

document.addEventListener("mousemove", e => {
    if (dragging) {
        dragging.style.left = e.clientX - dragOffset.x + "px";
        dragging.style.top = e.clientY - dragOffset.y + "px";
    }
});

document.addEventListener("mouseup", e => {
    dragging = null;
});

window.addEventListener("message", e => {
    let data = JSON.parse(e.data);
    switch(data.action) {
    case 'uuid':
        var gen_uuid = crypto.randomUUID();
        programs[gen_uuid] = latestWindow;
        latestWindow.querySelector(".window-content").contentWindow.postMessage(JSON.stringify({action: 'r-uuid', uuid: gen_uuid}), '*');
        latestWindow = null;
        break;
    case 'execute':
        // TODO: make a command system instead of using eval
        console.log(programs[data.origin]);
        programs[data.origin].querySelector(".window-content").contentWindow.postMessage(JSON.stringify({
            action: 'return',
            value: "Command prompt not implemented yet"
        }), '*');
        break;
    }
});
