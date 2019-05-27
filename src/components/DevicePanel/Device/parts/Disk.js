export default class Disk {
  constructor(cx, radius, ballRadius, initLeftAngle, initRightAngle) {
    this.cx = cx;
    this.radius = radius;
    this.ballRadius = ballRadius;

    this.leftAngle = initLeftAngle;
    this.rightAngle = initRightAngle;
  }

  update(leftAngle, rightAngle) {
    this.leftAngle = leftAngle;
    this.rightAngle = rightAngle;
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.cx, 0);

    const {radius, ballRadius} = this;

    ctx.beginPath();

    ctx.moveTo(-radius-ballRadius, 0);
    ctx.arcTo(-radius-ballRadius, radius, -ballRadius, radius, radius);
    ctx.lineTo(ballRadius, radius);
    ctx.arcTo(radius + ballRadius, radius, ballRadius+radius, 0, radius);

    // ctx.closePath();

    ctx.fillStyle = 'rgb(242, 242, 242)';
    ctx.strokeStyle = 'rgb(170,170,170)';
    ctx.lineWidth = 0.5;
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.font = '20px Russo One';

    // left angle
    ctx.strokeStyle = 'rgba(220,53,69,0.76)';
    ctx.fillStyle = 'rgba(220,53,69,0.76)';
    ctx.beginPath();
    if (this.leftAngle < 0) ctx.arc(-ballRadius, 0, radius, Math.PI/2, Math.PI/2 - this.leftAngle);
    ctx.stroke();
    ctx.fillText(formatAngle(this.leftAngle), -ballRadius*2.3, radius/2);

    // right angle
    ctx.strokeStyle = 'rgba(0,123,255,0.76)';
    ctx.fillStyle = 'rgba(0,123,255,0.76)';
    ctx.beginPath();
    if (this.rightAngle > 0) ctx.arc(ballRadius, 0, radius, Math.PI/2, Math.PI/2 - this.rightAngle, true);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(formatAngle(this.rightAngle), ballRadius*2.4, radius/2);

    ctx.restore();
  }
}

function formatAngle(rad) {
  return Math.abs(Math.round(rad/Math.PI*180*10)/10).toFixed(1) + '°';
}