const vert_shader =
`precision mediump float;

attribute vec2 vertPosition;
attribute vec2 vertuv;
varying vec2 uv;

void main()
{
    gl_Position = vec4(vertPosition, 0.0, 1.0);
    uv = vertuv;
}`;
const frag_shader =
`precision mediump float;

varying vec2 uv;

void main()
{
    gl_FragColor = vec4(uv, 0.0, 1.0);
}`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");

if(!gl) {
    alert("No webgl2 support?");
}


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vert_shader);
gl.shaderSource(fragmentShader, frag_shader);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);


var triangleVerts = [
    -1.0,-1.0,     0.0, 0.0,
    -1.0, 1.0,     0.0, 1.0,
     1.0, 1.0,     1.0, 1.0,
     1.0,-1.0,     1.0, 0.0,
    -1.0, -1.0,    0.0, 0.0,
     1.0, 1.0,     1.0, 1.0
];

var triBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);

var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
var uvAttributeLocation = gl.getAttribLocation(program, "vertuv");
gl.vertexAttribPointer(
    positionAttributeLocation,
    2,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    0
);
gl.vertexAttribPointer(
    uvAttributeLocation,
    2,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(uvAttributeLocation);


function Tick() {
    if(canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(Tick);
}
requestAnimationFrame(Tick);
