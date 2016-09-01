import Particle from './Particle'

export default class ParticleSystem {
  constructor() {

    this.vertices = [];
    this.velThetaArr = [];
    this.velRadArr = [];
    this.thetaArr = [];

    this.particles = []

    this.numLines = 4000
  }

  addParticle() {
    this.particles.push(new Particle())
  }

  setup() {

    this.particles.forEach((p) => {

      this.vertices.push(p.radius * Math.cos(p.theta), p.radius * Math.sin(p.theta), 1.83);
      this.vertices.push(p.radius * Math.cos(p.theta), p.radius * Math.sin(p.theta), 1.83);

      this.thetaArr.push(p.theta);
      this.velThetaArr.push(p.velTheta);
      this.velRadArr.push(p.radius);
    })

    this.vertices = new Float32Array(this.vertices)

    this.thetaArr = new Float32Array(this.thetaArr)
    this.velThetaArr = new Float32Array(this.velThetaArr)
    this.velRadArr = new Float32Array(this.velRadArr)
  }

  draw() {
    var i, n = this.vertices.length, p, bp;
    var px, py;
    var pTheta;
    var rad;
    var num;
    var targetX, targetY;

    for (let i = 0; i < this.numLines * 2; i += 2) {
      // this.count += .3;
      bp = i * 3;

      this.vertices[bp] = this.vertices[bp + 3]
      this.vertices[bp + 1] = this.vertices[bp + 4]

      num = parseInt(i / 2)
      pTheta = this.thetaArr[num]
      rad = this.velRadArr[num]

      this.vertices[bp] = rad * Math.cos(pTheta)
      this.vertices[bp + 1] = rad * Math.sin(pTheta)

      pTheta = pTheta + this.velThetaArr[num]
      this.thetaArr[num] = pTheta

      targetX = rad * Math.cos(pTheta)
      targetY = rad * Math.sin(pTheta)

      px = this.vertices[bp + 3]
      px += (targetX - px) * (Math.random() * .1 + .1)
      this.vertices[bp + 3] = px

      py = this.vertices[bp + 4]
      py += (targetY - py) * (Math.random() * .1 + .1)
      this.vertices[bp + 4] = py
    }
  }
}
