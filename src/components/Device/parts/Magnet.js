import isPointInPolygon from "../../../actions/isPointInPolygon";

export default class Magnet {
  constructor(width, height, offsetX, L, initPhi) {
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

    this.setAngle(initPhi);
  }

  setAngle(phi) {
    this.phi = phi;

    const x = Math.sin(phi)*this.L + this.offsetX;
    const y = Math.cos(phi)*this.L;

    const points = this.initPoints.map(point => ({
      x: point.x*Math.cos(phi) + point.y*Math.sin(phi),
      y: -point.x*Math.sin(phi) + point.y*Math.cos(phi),
    }));

    this.position = {points, center: {x, y}};
  }

  pointOver(x, y) {
    return isPointInPolygon(x, y, this.position);
  }

  setPosition(x, y) {
    if (this.userBlocked) return;
    const phi = - Math.atan2(y, x-this.offsetX) + Math.PI/2;
    // console.log(phi);
    this.setAngle(phi);
  }


  block() {
    this.userBlocked = true;
  }

  unblock() {
    this.userBlocked = false;
  }

  draw(ctx) {
    // console.log(this.phi);
    const {points, center} = this.position;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(this.offsetX, 0);
    ctx.lineTo(center.x, center.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(points[0].x + center.x, points[0].y + center.y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x + center.x, points[i].y + center.y);
    }
    ctx.fill();

    ctx.restore();
  }
}