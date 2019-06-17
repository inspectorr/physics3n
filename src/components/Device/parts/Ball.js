import isPointInCircle from "../../../actions/isPointInCircle";
import random from "../../../actions/random";
import CONSTANTS from '../../../PHYSICS';
const {tetaAlphaDeg, g, threadLength, integrationStep, dampingFactor} = CONSTANTS;

const tetaAlphaRad = tetaAlphaDeg/180*Math.PI;
function error() {
  return tetaAlphaRad*random(-0.5, 0.5);
}

const omega = g / threadLength;
const beta = dampingFactor;
const dt = integrationStep;

export default class Ball {
  v = 0;
  cx = null;
  cy = null;

  constructor(R, L, initPhi, offsetX, m) {
    this.R = R;
    this.L = L;
    this.phi = initPhi;
    this.offsetX = offsetX;
    this.m = m;

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

    // ПОГРЕШНОСТЬ
    this.setAngle(this.phi + error());
    this.prevPhi = this.phi;
  }

  update() {
    if (this.physicsBlocked) return;

    const {v, phi} = this;

    // this.a = -omega*Math.sin(this.phi);
    // this.v +=  this.a*Ball.dt;
    // this.phi += this.v*Ball.dt;

    this.v = v + (-2*beta*v - omega*Math.sin(phi))*dt;
    this.phi = phi + v*dt;

    this.wasMovingRight = this.isMovingRight;
    this.wasMovingLeft = this.isMovingLeft;
    this.isMovingRight = this.prevPhi < this.phi;
    this.isMovingLeft = this.prevPhi > this.phi;

    if (this.wasMovingRight && this.isMovingLeft) {
      this.maxRightPhi = this.prevPhi;
    } else if (this.wasMovingLeft && this.isMovingRight) {
      this.maxLeftPhi = this.prevPhi;
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