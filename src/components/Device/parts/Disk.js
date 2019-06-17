import formatAngle from "../../../actions/formatAngle";

export default class Disk {
  constructor(cx, radius, ballRadius, initLeftAngle, initRightAngle, shift) {
    this.cx = cx;
    this.radius = radius;
    this.ballRadius = ballRadius;

    this.shift = shift;

    this.leftAngle = initLeftAngle;
    this.rightAngle = initRightAngle;
  }

  setAngles(leftAngle, rightAngle) {
    this.leftAngle = leftAngle;
    this.rightAngle = rightAngle;
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.cx, 0);

    const {radius, ballRadius, shift} = this;

    ctx.beginPath();

    ctx.moveTo(-radius-ballRadius, -shift);
    ctx.lineTo(-radius-ballRadius, 0);
    ctx.arcTo(-radius-ballRadius, radius, -ballRadius, radius, radius);
    ctx.lineTo(ballRadius, radius);
    ctx.arcTo(radius + ballRadius, radius, ballRadius+radius, 0, radius);
    ctx.lineTo(radius + ballRadius, -shift);

    ctx.fillStyle = 'rgb(242, 242, 242)';
    ctx.strokeStyle = 'rgb(170,170,170)';
    ctx.lineWidth = 0.5;
    ctx.fill();
    ctx.stroke();

    const arcWidth = 5;

    ctx.lineWidth = arcWidth;
    ctx.font = '24px Russo One';

    // left angle
    ctx.strokeStyle = 'rgba(220,53,69,0.76)';
    ctx.fillStyle = 'rgba(220,53,69,0.76)';
    ctx.beginPath();
    if (this.leftAngle < 0) ctx.arc(-ballRadius, 0, radius-arcWidth/2, Math.PI/2, Math.PI/2 - this.leftAngle);
    ctx.stroke();
    ctx.fillText(formatAngle(this.leftAngle), -ballRadius*2.7, 0.4*radius);

    // right angle
    ctx.strokeStyle = 'rgba(0,123,255,0.76)';
    ctx.fillStyle = 'rgba(0,123,255,0.76)';
    ctx.beginPath();
    if (this.rightAngle > 0) ctx.arc(ballRadius, 0, radius-arcWidth/2, Math.PI/2, Math.PI/2 - this.rightAngle, true);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(formatAngle(this.rightAngle), ballRadius*2.7, 0.4*radius);

    ctx.restore();
  }
}