export default class Ball {
  static g = 1500;
  static dt = 1/60;
  a = 0;
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
    // this.beta = 100/(2*m);
  }

  update(t) {
    this.a = -this.omega*Math.sin(this.phi);
    this.v += this.a*Ball.dt;
    this.phi += this.v*Ball.dt;

    this.phi *= Math.pow(1.001, -t/1000);

    // this.v += (-2*this.beta-this.omega*Math.sin(this.phi))*Ball.dt;
    // this.phi += this.v*Ball.dt;

    this.cx = Math.sin(this.phi)*this.L + this.offsetX;
    this.cy = Math.cos(this.phi)*this.L;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.offsetX, 0);
    ctx.lineTo(this.cx, this.cy);
    ctx.stroke();
    ctx.closePath();
    ctx.arc(this.cx, this.cy, this.R, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}