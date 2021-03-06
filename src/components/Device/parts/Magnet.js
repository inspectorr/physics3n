import isPointInPolygon from "../../../actions/isPointInPolygon";
import formatAngle from "../../../actions/formatAngle";

export default class Magnet {
  constructor(width, height, offsetX, L, ballBoundAngle, initPhi) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.L = L;

    this.initPoints = [
      {x: -this.width/2, y: -this.height/2},
      {x: this.width/2, y: -this.height/2},
      {x: this.width/2, y: this.height/2},
      {x: -this.width/2, y: this.height/2},
    ];

    this.boundAngle = Math.atan(this.width/2/this.L);
    this.ballBoundAngle = ballBoundAngle;
    this.setAngle(initPhi-ballBoundAngle-this.boundAngle);
  }

  setAngle(phi) {
    this.phi = phi;
    this.ballCollisionRightAngle = this.getBallCollisionRightAngle();

    const x = Math.sin(phi)*this.L + this.offsetX;
    const y = Math.cos(phi)*this.L;

    const points = this.initPoints.map(point => ({
      x: point.x*Math.cos(phi) + point.y*Math.sin(phi),
      y: -point.x*Math.sin(phi) + point.y*Math.cos(phi),
    }));

    this.position = {points, center: {x, y}};
  }

  getBallCollisionRightAngle() {
    return this.phi + this.boundAngle + this.ballBoundAngle;
  }

  pointOver(x, y) {
    return isPointInPolygon(x, y, this.position);
  }

  onDragStart(coords) {
    const {x, y} = coords;
    this.offsetPhi = this.getPhi(x, y) - this.phi;
  }

  onDrop() {

  }

  setPosition(x, y) {
    const phi = this.getPhi(x, y);
    this.setAngle(phi-this.offsetPhi);
  }

  getPhi(x, y) {
    return -Math.atan2(y, x-this.offsetX) + Math.PI/2;
  }

  userBlock() {
    this.userBlocked = true;
  }

  userUnblock() {
    this.userBlocked = false;
  }

  turnOn() {
    this.active = true;
  }

  turnOff() {
    this.active = false;
  }

  draw(ctx) {
    const {points, center} = this.position;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(this.offsetX, 0);
    ctx.lineTo(center.x, center.y);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgb(99, 99, 99)';
    ctx.stroke();

    ctx.save();
    ctx.translate(this.offsetX, 0);
    ctx.rotate(3*Math.PI/2-this.phi);
    ctx.font = '24px Russo One';
    ctx.fillStyle = 'rgba(220,53,69,0.76)';
    ctx.fillText(formatAngle(this.ballCollisionRightAngle), -150, -15);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(points[0].x + center.x, points[0].y + center.y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x + center.x, points[i].y + center.y);
    }

    let radGrad = ctx.createRadialGradient(center.x, center.y, this.height/5, center.x, center.y, this.width*2);
    if (this.active) {
      radGrad.addColorStop(0, 'rgb(239,255,142)');
      radGrad.addColorStop(0.05*Math.random(), 'rgb(239,255,142)');
      radGrad.addColorStop(0.4, 'rgb(200, 35, 51)');
      radGrad.addColorStop(1, 'rgb(200, 35, 51)');
    } else {
      radGrad.addColorStop(0, 'rgb(180,180,180)');
      radGrad.addColorStop(0.5, 'rgb(128,128,128)');
      radGrad.addColorStop(1, 'rgb(99,99,99)');
    }

    ctx.fillStyle = radGrad;
    ctx.fill();
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = 'rgb(99,99,99)';
    ctx.stroke();

    if (this.active) {
      let radGrad = ctx.createRadialGradient(center.x, center.y, this.height/5, center.x, center.y, this.width*2);

      radGrad.addColorStop(0, 'rgba(239,255,142, 0.5)');
      radGrad.addColorStop(0.4+0.05*Math.random(), 'rgba(239,255,142, 0.1)');
      radGrad.addColorStop(0.6, 'rgba(200, 35, 51, 0.05)');
      radGrad.addColorStop(1, 'rgba(200, 35, 51, 0.005)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(center.x, center.y, this.width+20+20*Math.random(), 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  }
}