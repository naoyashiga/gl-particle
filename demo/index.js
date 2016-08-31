import Projection from './components/transformation/Projection'
import ModelView from './components/transformation/ModelView'

import ParticleSystem from './components/particle/ParticleSystem'

const gl = require('webgl-context')()
const canvas = document.body.appendChild(gl.canvas)

const app = require('canvas-loop')(canvas, {
  scale: 1
})

const glslify = require('glslify')
const vert = glslify('./index.vert')
const frag = glslify('./index.frag')

const particleSystem = new ParticleSystem()

let shaderProgram

createShaders()
glSetup()

app.on('tick', drawScene)
app.start()

prepareParticle()
setShaderVariables()

function prepareParticle() {
  for (let i = 0; i < particleSystem.numLines; i++) {
    particleSystem.addParticle()
  }

  particleSystem.setup()
}

function setShaderVariables() {
  const projectionMatrix = new Projection(canvas).matrix
  const modelViewMatrix = new ModelView().matrix

  const vertexPosAttribLocation = gl.getAttribLocation(shaderProgram, "vertexPosition")
  gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0)

  const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix")
  const uprojectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix")

  gl.bufferData(gl.ARRAY_BUFFER, particleSystem.vertices, gl.DYNAMIC_DRAW)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(projectionMatrix))
  gl.uniformMatrix4fv(uprojectionMatrix, false, new Float32Array(modelViewMatrix))
}

function drawScene() {
  particleSystem.draw()

  gl.lineWidth(1)
  gl.bufferData(gl.ARRAY_BUFFER, particleSystem.vertices, gl.DYNAMIC_DRAW)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.drawArrays(gl.LINES, 0, particleSystem.numLines)

  gl.flush()
}

function createShaders() {

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  const buffer = gl.createBuffer();

  gl.shaderSource(vertexShader, vert)
  gl.compileShader(vertexShader)

  gl.shaderSource(fragmentShader, frag)
  gl.compileShader(fragmentShader)

  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");

  gl.enableVertexAttribArray(vertexPosition);
}

function glSetup() {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0, 0, 0, 1)

  gl.clearDepth(1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.enable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

  // gl.disable(gl.CULL_FACE)
}
