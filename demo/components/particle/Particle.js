
export default class Particle {
  constructor() {
    this.radius = ( 0.5 + .2 * Math.random() );
    this.theta = Math.random() * Math.PI * 2 *0;
    // this.velTheta = Math.random() * Math.PI * 2 / 300;
    this.velTheta = Math.random() * Math.PI /100
    // this.freq = Math.random() * 0.12 + 0.03;
    // this.boldRate = Math.random() * .04 + .01;
    // this.randomPosX = (Math.random() * 20  - 1) * window.innerWidth / window.innerHeight;
    // this.randomPosY = Math.random() * 2 - 1;
  }
}
