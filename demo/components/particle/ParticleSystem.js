import Particle from './Particle'

export default class ParticleSystem {
  constructor() {

    this.vertices = [];
    this.velThetaArr = [];
    this.velRadArr = [];
    this.velocities = [];
    this.thetaArr = [];
    this.freqArr = [];
    this.boldRateArr = [];

    this.randomTargetXArr = []
    this.randomTargetYArr = []

    this.particles = []

    this.numLines = 3000

    this.count = 0
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
      this.freqArr.push(p.freq);
      this.boldRateArr.push(p.boldRate);


      this.randomTargetXArr.push(p.randomPosX);
      this.randomTargetYArr.push(p.randomPosY);
    })

    this.freqArr = new Float32Array(this.freqArr);
    this.vertices = new Float32Array(this.vertices)
    this.velocities = new Float32Array(this.velocities)

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

    for (i = 0; i < this.numLines * 2; i += 2) {
      this.count += .3;
      bp = i * 3;

      this.vertices[bp] = this.vertices[bp + 3];
      this.vertices[bp + 1] = this.vertices[bp + 4];

      num = parseInt(i / 2);
      pTheta = this.thetaArr[num];
      rad = this.velRadArr[num];

      pTheta = pTheta + this.velThetaArr[num];
      this.thetaArr[num] = pTheta;

      targetX = rad * Math.cos(pTheta);
      targetY = rad * Math.sin(pTheta);

      px = this.vertices[bp + 3];
      px += (targetX - px) * (Math.random() * .1 + .1);
      this.vertices[bp + 3] = px;


      // py = (Math.sin(cn) + 1) * .2 * (Math.random() * .5 - .25);
      py = this.vertices[bp + 4];
      py += (targetY - py) * (Math.random() * .1 + .1);
      this.vertices[bp + 4] = py;
    }
  }
}
