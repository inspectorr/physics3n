import isPointInCircle from "../../../../actions/isPointInCircle";

export default class Ball {
  static g = 1500;
  static dt = 1/60;
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

  update(t) {
    if (this.physicsBlocked) return;


    const {v, phi, beta, omega} = this;

    this.v = v + (-2*beta*v - omega*Math.sin(phi))*Ball.dt;
    this.phi = phi + v*Ball.dt;

    // this.a = -this.omega*Math.sin(this.phi);
    // this.v += this.a*Ball.dt;
    // this.phi += this.v*Ball.dt;
    //
    // this.phi *= Math.pow(1.001, -t/1000);

    this.setAngle(this.phi);

    // const {v}

    // this.v += (-2*this.beta-this.omega*Math.sin(this.phi))*Ball.dt;
    // this.phi += this.v*Ball.dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.offsetX, 0);
    ctx.lineTo(this.cx, this.cy);
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.closePath();

    ctx.arc(this.cx, this.cy, this.R, 0, Math.PI*2);

    const radGrad = ctx.createRadialGradient(this.cx, this.cy, this.R/8, this.cx, this.cy, this.R);
    radGrad.addColorStop(0, 'rgb(240, 240, 240)');
    radGrad.addColorStop(0.2, 'rgb(235, 235, 235)');
    radGrad.addColorStop(1, 'rgb(200, 200, 200)');

    ctx.fillStyle = radGrad;

    ctx.fill();
    ctx.restore();
  }
}