import React, {Component} from 'react';
import Magnet from "./parts/Magnet";
import Ball from "./parts/Ball";
import Disk from "./parts/Disk";
import './style.css';
import Col from "react-bootstrap/Col";

class Device extends Component {
  width = this.props.width;
  height = this.props.height;

  topShift = 15;

  ballRadius = 25;
  threadLength = 355;
  magnetSide = 50;
  ballBoundAngle = Math.atan(this.ballRadius/this.threadLength);

  static defaultActionsToTrack = [...Array(3)].fill(false);

  state = {
    balls: null,
    magnet: null,
    disk: null,
    clientX: null,
    clientY: null,
    dragging: false,
    magnetTurnedOn: false,
    actionsToTrack: Device.defaultActionsToTrack.slice(),
    angleTracking: false,
  };

  componentDidMount() {
    this.create();
    requestAnimationFrame(this.draw);
  }

  shouldComponentUpdate() {
    return false;
  }

  create() {
    this.ctx = this.refs.canvas.getContext('2d');
    this.refs.canvas.addEventListener('mousedown', this.onMouseDown);
    this.refs.canvas.addEventListener('touchstart', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchmove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('touchend', this.onMouseUp);

    const balls = [
      new Ball(this.ballRadius, this.threadLength, 0, this.width/2-this.ballRadius, this.props.m1),
      new Ball(this.ballRadius, this.threadLength, 0, this.width/2+this.ballRadius, this.props.m2),
    ];

    balls.forEach(ball => ball.reset());

    const magnet = new Magnet(this.magnetSide, this.magnetSide, this.width/2-this.ballRadius, this.threadLength, this.ballBoundAngle, -45*(Math.PI/180));

    const disk = new Disk(this.width/2, this.height/6, this.ballRadius, 0, 0, this.topShift);

    this.setState({ balls, magnet, disk });
  }

  onMouseMove = (e) => {
    const box = this.refs.canvas.getBoundingClientRect();
    const clientX = (e.targetTouches ? e.targetTouches[0].clientX : e.clientX) - box.left;
    const clientY = (e.targetTouches ? e.targetTouches[0].clientY : e.clientY) - box.top;
    this.setState({clientX, clientY});
  };

  onMouseDown = (e) => {
    const box = this.refs.canvas.getBoundingClientRect();
    this.startDragCoords = {
      x: (e.targetTouches ? e.targetTouches[0].clientX : e.clientX) - box.left,
      y: (e.targetTouches ? e.targetTouches[0].clientY : e.clientY) - box.top
    };
    this.setState({mouseDown: true});
  };

  onMouseUp = (event) => {
    this.setState({mouseDown: false});
  };

  dragAndDrop = (obj) => {
    if (this.state.dragging || obj.userBlocked) return;
    const box = this.refs.canvas.getBoundingClientRect();
    this.setState({dragging: true});
    obj.onDragStart(this.startDragCoords);
    const handleMove = (e) => {
      const x = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
      const y = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
      obj.setPosition(x - box.left, y - box.top);
    };
    const handleDrop = () => {
      obj.onDrop();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleDrop);
      document.removeEventListener('touchend', handleDrop);
      this.setState({dragging: false});
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleDrop);
    document.addEventListener('touchend', handleDrop);
  };

  hoverOn = () => {
    this.refs.canvas.style.cursor = 'pointer';
  };

  hoverOff = () => {
    this.refs.canvas.style.cursor = 'unset';
  };

  onMagnetTurnOn = () => {
    this.state.magnet.turnOn();
    this.state.magnet.userBlock();
    this.setState({magnetTurnedOn: true});
  };

  onMagnetTurnOff = () => {
    this.state.magnet.turnOff();
    this.state.magnet.userUnblock();
    this.state.balls[0].magnetUnblock();
    this.setState({magnetTurnedOn: false});
    //
    this.completeActionToTrack('go');
  };

  completeActionToTrack(key) {
    const actionsToTrack = this.state.actionsToTrack.slice();

    const actionLiterals = ['magnet', 'go', 'hit'];
    const index = actionLiterals.indexOf(key);

    if (actionsToTrack[index]) return;

    for (let i = 0; i < index; i++) {
      if (!actionsToTrack[i]) return;
    }

    actionsToTrack[index] = true;

    this.setState({actionsToTrack});
  }

  checkActionsCompleted() {
    return !this.state.actionsToTrack.includes(false);
  }

  resetActionsToTrack() {
    const actionsToTrack = Device.defaultActionsToTrack.slice();
    this.setState({actionsToTrack});
  }

  startAngleTracking() {
    this.setState({angleTracking: true});
  }

  stopAngleTracking() {
    this.setState({angleTracking: false});
    this.resetActionsToTrack();
  }

  handleMouseActions() {
    const {clientX, clientY, mouseDown} = this.state;
    const { magnet, balls } = this.state;

    let hovering = false;

    if (magnet.pointOver(clientX, clientY)) {
      hovering = true;
      if (mouseDown) this.dragAndDrop(magnet);
    }

    balls.forEach(ball => {
      if (ball.pointOver(clientX, clientY)) {
        hovering = true;
        if (mouseDown) this.dragAndDrop(ball);
      }
    });

    if (hovering) this.hoverOn();
    else this.hoverOff();
  }

  static checkBallCollision(ball1, ball2) {
    if (ball1.phi > ball2.phi) {
      if (ball1.physicsBlocked) ball2.setUserAngle(ball1.phi);
      else if (ball2.physicsBlocked) ball1.setUserAngle(ball2.phi);
      else ball1.setAngle(ball2.phi);
      return true;
    } else return false;
    // return Math.sqrt((ball1.cx-ball2.cx)**2+(ball1.cy-l2.cy)**2) <= ball1.R + ball2.R;
  }

  static handleBallCollision(ball1, ball2) {
    const [m1, v1] = [ball1.m, ball1.v];
    const [m2, v2] = [ball2.m, ball2.v];
    // const u1 = ((m1-m2)*v1 + 2*m2*v2)/(m1+m2);
    // const u2 = ((m2-m1)*v2 + 2*m1*v1)/(m1+m2);

    const k = 0.95;
    let u1 = (k*m2*(v2-v1) + m1*v1 + m2*v2)/(m1+m2);
    let u2 = (k*m1*(v1-v2) + m1*v1 + m2*v2)/(m1+m2);

    [ball1.v, ball2.v] = [u1, u2];
  }

  static checkMagnetAndBallRightCollision(magnet, ball) {
    return magnet.phi + magnet.boundAngle >= ball.phi - ball.boundAngle*2;
  }

  update(t) {
    const { magnet, disk, balls } = this.state;

    if (this.checkActionsCompleted()) this.startAngleTracking();

    if (this.state.angleTracking && balls[1].isMovingLeft && balls[1].wasMovingRight) {
      this.props.addDataRow(magnet.ballCollisionRightAngle, balls[1].maxRightPhi);
      this.stopAngleTracking();
    }

    disk.update(balls[0].maxLeftPhi, balls[1].maxRightPhi);

    balls.forEach(ball => ball.update());

    if (Device.checkBallCollision(balls[0], balls[1])) {
      Device.handleBallCollision(balls[0], balls[1]);
      // balls.forEach(ball => ball.update());
      this.completeActionToTrack('hit');
    }

    if (this.state.magnetTurnedOn && Device.checkMagnetAndBallRightCollision(magnet, balls[0])) {
      balls[0].setUserAngle(magnet.ballCollisionRightAngle);
      balls[0].magnetBlock();
      this.completeActionToTrack('magnet');
    }

    this.handleMouseActions();
  }

  draw = (t) => {
    if (!this.state.balls || !this.state.magnet) return;
    this.ctx.save();

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(0, this.topShift);

    this.update(t);

    this.state.magnet.draw(this.ctx);
    this.state.balls.forEach(ball => ball.draw(this.ctx));
    this.state.disk.draw(this.ctx);

    this.ctx.restore();
    requestAnimationFrame(this.draw);
  };

  stopBalls = () => {
    const balls = this.state.balls.slice();
    balls.forEach(ball => {
      if (ball.physicsBlocked || ball.userBlocked) return;
      ball.reset();
    });
    this.setState(balls);
  };

  render() {
    return (
      <div className={'Device'}>
        <canvas ref={"canvas"} width={this.width} height={this.height} style={{zIndex: 1}}>HTML5 support is required to
          run this app
        </canvas>
        <Col className={'unselectable m-0 p-0 text-center stop-balls'}><span onClick={this.stopBalls}>Остановить</span></Col>
      </div>
    );
  }
}

export default Device;