
export default class Particle {
  constructor() {
    this.radius = ( 0.5 + .2 * Math.random() );
    this.theta = Math.random() * Math.PI * 2 *0;
    this.velTheta = Math.random() * Math.PI /100
  }
}
