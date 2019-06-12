import isPointInCircle from "../../../actions/isPointInCircle";
import random from "../../../actions/random";

const tetaAlphaDeg = 2.5;
const tetaAlphaRad = tetaAlphaDeg/180*Math.PI;

function error() {
  return tetaAlphaRad*random(-0.5, 0.5);
}

export default class Ball {
  static g = 2000;
  static dt = 0.02;
  v = 0;
  cx = null;
  cy = null;

  constructor(R, L, initPhi, offsetX, m) {
    this.R = R;
    this.L = L;
    this.omega = Ball.g / L;
    this.phi = initPhi;
    this.offsetX = offsetX;
    this.m = m;
    this.beta = 1/20;

    this.boundAngle = Math.atan(this.R/this.L);

    this.setAngle(initPhi);
  }

  pointOver(x, y) {
    return isPointInCircle(x, y, this.cx, this.cy, this.R);
  }

  onDragStart(coords) {
    const {x, y} = coords;
    this.offsetPhi = this.getPhi(x, y) - this.phi;
    this.physicsBlocked = true;
    this.v = 0;
  }

  setPosition(x, y) {
    if (this.userBlocked) return;
    const phi = this.getPhi(x, y);
    this.setUserAngle(phi-this.offsetPhi);
  }

  getPhi(x, y) {
    return -Math.atan2(y, x-this.offsetX) + Math.PI/2;
  }

  setAngle(phi) {
    this.phi = phi;
    this.cx = Math.sin(phi)*this.L + this.offsetX;
    this.cy = Math.cos(phi)*this.L;
  }

  setUserAngle(phi) {
    this.setAngle(phi);
    this.v = 0;
    this.prevPhi = phi;
    this.maxLeftPhi = this.maxRightPhi = this.phi;
  }

  onDrop() {
    this.physicsBlocked = false;
  }

  magnetBlock() {
    this.v = 0;
    this.physicsBlocked = true;
    this.userBlocked = true;
  }

  magnetUnblock() {
    this.physicsBlocked = false;
    this.userBlocked = false;
  }

  update() {
    if (this.physicsBlocked) return;

    const {v, phi, beta, omega} = this;

    // this.a = -omega*Math.sin(this.phi);
    // this.v +=  this.a*Ball.dt;
    // this.phi += this.v*Ball.dt;

    this.v = v + (-2*beta*v - omega*Math.sin(phi))*Ball.dt;
    this.phi = phi + v*Ball.dt;

    this.wasMovingRight = this.isMovingRight;
    this.wasMovingLeft = this.isMovingLeft;
    this.isMovingRight = this.prevPhi < this.phi;
    this.isMovingLeft = this.prevPhi > this.phi;

    if (this.wasMovingRight && this.isMovingLeft) {
      this.maxRightPhi = this.prevPhi + error();
    } else if (this.wasMovingLeft && this.isMovingRight) {
      this.maxLeftPhi = this.prevPhi + error();
    }

    this.prevPhi = phi;

    this.setAngle(this.phi);

  }

  reset() {
    this.setAngle(0);
    this.phi = 0;
    this.prevPhi = 0;
    this.v = 0;
    this.maxLeftPhi = 0;
    this.maxRightPhi = 0;
    this.wasMovingRight = false;
    this.isMovingRight = false;
    this.wasMovingLeft = false;
    this.isMovingLeft = false;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.offsetX, 0);
    ctx.lineTo(this.cx, this.cy);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();

    ctx.arc(this.cx, this.cy, this.R, 0, Math.PI*2);

    const radGrad = ctx.createRadialGradient(this.cx, this.cy, this.R/8, this.cx, this.cy, this.R);
    radGrad.addColorStop(0, 'rgb(255,255,255)');
    radGrad.addColorStop(0.66, 'rgb(172,172,172)');
    radGrad.addColorStop(1, 'rgb(103,103,103)');

    ctx.fillStyle = radGrad;

    ctx.fill();
    ctx.restore();
  }
}