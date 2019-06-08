import isPointInCircle from "../../../../actions/isPointInCircle";

export default class Ball {
  static g = 2300;
  static dt = 0.02;
  // a = 0;
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
    // this.beta = 0.01/(2*m/1000);
    this.beta = 1/10;

    this.initLeftPoint = {
      x: -this.R,
      y: 0,
    };

    this.boundAngle = Math.atan(this.R/this.L);

    this.setAngle(initPhi);
  }

  pointOver(x, y) {
    return isPointInCircle(x, y, this.cx, this.cy, this.R);
  }

  setPosition(x, y) {
    if (this.userBlocked) return;
    const phi = -Math.atan2(y, x-this.offsetX) + Math.PI/2;
    this.setAngle(phi);
  }

  setAngle(phi) {
    this.phi = phi;
    this.cx = Math.sin(phi)*this.L + this.offsetX;
    this.cy = Math.cos(phi)*this.L;

    this.leftPoint = {
      x: this.initLeftPoint.x*Math.cos(phi) + this.initLeftPoint.y*Math.sin(phi) + this.cx,
      y: -this.initLeftPoint.x*Math.sin(phi) + this.initLeftPoint.y*Math.cos(phi) + this.cy,
    }
  }

  onDragStart() {
    this.physicsBlocked = true;
    this.v = 0;
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

  vs = [];

  update(t) {
    if (this.physicsBlocked) return;

    const {v, phi, beta, omega} = this;

    // this.a = -omega*Math.sin(this.phi);
    // this.v +=  this.a*Ball.dt;
    // this.phi += this.v*Ball.dt;

    this.v = v + (-2*beta*v - omega*Math.sin(phi))*Ball.dt;
    this.phi = phi + v*Ball.dt;

    this.wasMovingRight = this.isMovingRight;
    this.isMovingRight = this.prevPhi < this.phi;
    if (this.wasMovingRight && !this.isMovingRight) {
      this.maxRightPhi = this.prevPhi;
    } else if (!this.wasMovingRight && this.isMovingRight) {
      this.maxLeftPhi = this.prevPhi;
    }

    this.prevPhi = phi;

    this.setAngle(this.phi);

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