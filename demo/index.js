const gl = require('webgl-context')()
const canvas = document.body.appendChild(gl.canvas)

const app = require('canvas-loop')(canvas, {
  scale: 1
})

const glslify = require('glslify')
const vert = glslify('./index.vert')
const frag = glslify('./index.frag')

var shaderProgram

var ratio,
  vertices,
  velocities,
  freqArr,
  cw,
  ch,
  colorLoc,
  thetaArr,
  velThetaArr,
  velRadArr,
  boldRateArr,
  drawType,
  numLines = 3000;

  var count = 0;
  var cn = 0

var target = [];
var randomTargetXArr = [], randomTargetYArr = [];
drawType = 2;

createShaders()
createVertices()
render()

// app.on('tick', render)

app.start()

setup()
setShaderVariables()

animate()


function setShaderVariables() {
  vertices = new Float32Array(vertices)
  velocities = new Float32Array(velocities)

  thetaArr = new Float32Array(thetaArr)
  velThetaArr = new Float32Array(velThetaArr)
  velRadArr = new Float32Array(velRadArr)

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // viewing frustum
  var fieldOfView = 30.0
  var aspectRatio = canvas.width / canvas.height
  var nearPlane = 1.0
  var farPlane = 10000
  var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360)
  var bottom = -top
  var right = top * aspectRatio
  var left = -right

  // glFrustum
  var a = (right + left) / (right - left);
  var b = (top + bottom) / (top - bottom);
  var c = (farPlane + nearPlane) / (farPlane - nearPlane);
  var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
  var x = (2 * nearPlane) / (right - left);
  var y = (2 * nearPlane) / (top - bottom);
  var projectionMatrix = [
    x, 0, a, 0,
    0, y, b, 0,
    0, 0, c, d,
    0, 0, -1, 0
  ];

  // modelview
  var modelViewMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  var vertexPosAttribLocation = gl.getAttribLocation(shaderProgram, "vertexPosition")
  gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0)

  var uModelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix")
  var uprojectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix")

  gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(projectionMatrix))
  gl.uniformMatrix4fv(uprojectionMatrix, false, new Float32Array(modelViewMatrix))
}

function animate() {
  requestAnimationFrame(animate);
  drawScene();
}

function drawScene() {
  draw1()


  gl.lineWidth(1)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.drawArrays(gl.LINES, 0, numLines)
  // gl.drawArrays(gl.LINES, 0, numLines)

  gl.flush()
}

function createShaders() {

  var vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vert)
  gl.compileShader(vertexShader)

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, frag)
  gl.compileShader(fragmentShader)

  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)
}

function createVertices() {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
  // gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

}

function render() {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0, 0, 0, 1)

  gl.clearDepth(1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.enable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

  // gl.disable(gl.CULL_FACE)

  // gl.drawArrays(gl.POINTS, 0, 1);
}

function setup() {
  vertices = [];
  velThetaArr = [];
  velRadArr = [];
  ratio = cw / ch;
  velocities = [];
  thetaArr = [];
  freqArr = [];
  boldRateArr = [];

  for (var i = 0; i < numLines; i++) {
    var rad = ( 0.5 + .2 * Math.random() );
    var theta = Math.random() * Math.PI * 2;
    var velTheta = Math.random() * Math.PI * 2 / 300;
    var freq = Math.random() * 0.12 + 0.03;
    var boldRate = Math.random() * .04 + .01;
    var randomPosX = (Math.random() * 20  - 1) * window.innerWidth / window.innerHeight;
    var randomPosY = Math.random() * 2 - 1;

    vertices.push(rad * Math.cos(theta), rad * Math.sin(theta), 1.83);
    vertices.push(rad * Math.cos(theta), rad * Math.sin(theta), 1.83);

    thetaArr.push(theta);
    velThetaArr.push(velTheta);
    velRadArr.push(rad);
    freqArr.push(freq);
    boldRateArr.push(boldRate);


    randomTargetXArr.push(randomPosX);
    randomTargetYArr.push(randomPosY);
  }

  freqArr = new Float32Array(freqArr);
}

function draw1() {

  var i, n = vertices.length, p, bp;
  var px, py;
  var pTheta;
  var rad;
  var num;
  var targetX, targetY;

  for (i = 0; i < numLines * 2; i += 2) {
    count += .3;
    bp = i * 3;

    vertices[bp] = vertices[bp + 3];
    vertices[bp + 1] = vertices[bp + 4];

    num = parseInt(i / 2);
    pTheta = thetaArr[num];
    rad = velRadArr[num];

    pTheta = pTheta + velThetaArr[num];
    thetaArr[num] = pTheta;

    targetX = rad * Math.cos(pTheta);
    targetY = rad * Math.sin(pTheta);

    px = vertices[bp + 3];
    px += (targetX - px) * (Math.random() * .1 + .1);
    vertices[bp + 3] = px;


    // py = (Math.sin(cn) + 1) * .2 * (Math.random() * .5 - .25);
    py = vertices[bp + 4];
    py += (targetY - py) * (Math.random() * .1 + .1);
    vertices[bp + 4] = py;
  }
}
