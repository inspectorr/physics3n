import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Magnet from "./parts/Magnet";
import Ball from "./parts/Ball";
import Disk from "./parts/Disk";
import './style.css';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class Device extends Component {
  width = this.props.width;
  height = this.props.height;

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

  create() {
    this.ctx = this.refs.canvas.getContext('2d');
    this.refs.canvas.addEventListener('mousemove', this.onMouseMove);
    this.refs.canvas.addEventListener('mousedown', this.onMouseDown);
    this.refs.canvas.addEventListener('mouseup', this.onMouseUp);

    const balls = [
      new Ball(this.ballRadius, this.threadLength, 0, this.width/2-this.ballRadius, this.props.m1),
      new Ball(this.ballRadius, this.threadLength, 0, this.width/2+this.ballRadius, this.props.m2),
    ];

    const magnet = new Magnet(this.magnetSide, this.magnetSide, this.width/2-this.ballRadius, this.threadLength, this.ballBoundAngle, -Math.PI/3);

    const disk = new Disk(this.width/2, this.height/6, this.ballRadius, 0, 0);

    this.setState({ balls, magnet, disk });
  }

  onMouseMove = (event) => {
    const box = this.refs.canvas.getBoundingClientRect();
    const clientX = event.clientX - box.left;
    const clientY = event.clientY - box.top;
    this.setState({clientX, clientY});
  };

  onMouseDown = (event) => {
    this.setState({mouseDown: true});
  };

  onMouseUp = (event) => {
    this.setState({mouseDown: false});
  };

  dragAndDrop = (obj) => {
    if (this.state.dragging || obj.userBlocked) return;
    this.setState({dragging: true});
    const preventSelect = (e) => {
      e.preventDefault();
    };
    const handleMove = () => {
      obj.onDragStart();
      obj.setPosition(this.state.clientX, this.state.clientY);
    };
    const handleDrop = () => {
      obj.onDrop();
      this.refs.canvas.removeEventListener('mousemove', handleMove);
      this.refs.canvas.removeEventListener('mouseup', handleDrop);
      this.setState({dragging: false});
    };
    this.refs.canvas.addEventListener('mousemove', handleMove);
    this.refs.canvas.addEventListener('mouseup', handleDrop);
  };

  hoverOn = () => {
    this.refs.canvas.style.cursor = 'pointer';
  };

  hoverOff = () => {
    this.refs.canvas.style.cursor = 'unset';
  };

  onMagnetUserBlock = () => {
    this.state.magnet.userBlock();
  };

  onMagnetUserUnblock = () => {
    this.state.magnet.userUnblock();
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

  static checkBallCollision(ball1, ball2) {
    return Math.sqrt((ball1.cx-ball2.cx)**2+(ball1.cy-ball2.cy)**2) <= ball1.R + ball2.R;
  }

  static handleBallCollision(ball1, ball2) {
    const [m1, v1] = [ball1.m, ball1.v];
    const [m2, v2] = [ball2.m, ball2.v];
    const u1 = ((m1-m2)*v1 + 2*m2*v2)/(m1+m2);
    const u2 = ((m2-m1)*v2 + 2*m1*v1)/(m1+m2);
    [ball1.v, ball2.v] = [u1, u2];
  }

  static checkMagnetAndBallRightCollision(magnet, ball) {
    return magnet.phi + magnet.boundAngle >= ball.phi - ball.boundAngle*2;
  }

  completeActionToTrack(key) {
    const actionsToTrack = this.state.actionsToTrack.slice();

    const actionLiterals = ['magnet', 'go', 'hit'];
    const index = actionLiterals.indexOf(key);
    // console.log(index);
    if (actionsToTrack[index]) return;

    for (let i = 0; i < index; i++) {
      if (!actionsToTrack[i]) return;
    }

    actionsToTrack[index] = true;

    this.setState({actionsToTrack});
    console.log(actionsToTrack);
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

  update(t) {
    const {clientX, clientY, mouseDown} = this.state;

    const balls = this.state.balls.slice();
    const { magnet, disk } = this.state;

    if (Device.checkBallCollision(balls[0], balls[1])) {
      Device.handleBallCollision(balls[0], balls[1]);
      this.completeActionToTrack('hit');
    }

    let hovering = false;

    if (magnet.pointOver(clientX, clientY)) {
      hovering = true;
      if (mouseDown) this.dragAndDrop(magnet);
    }

    if (this.state.magnetTurnedOn && Device.checkMagnetAndBallRightCollision(magnet, balls[0])) {
      balls[0].setAngle(magnet.ballCollisionRightAngle);
      balls[0].magnetBlock();
      this.completeActionToTrack('magnet');
    }

    if (this.checkActionsCompleted()) this.startAngleTracking();

    if (this.state.angleTracking && balls[1].phi < balls[1].prevPhi) {
      // alert(balls[1].prevPhi);
      this.props.addDataRow(magnet.ballCollisionRightAngle, balls[1].prevPhi);
      this.stopAngleTracking();
    }

    balls.forEach(ball => {
      if (ball.pointOver(clientX, clientY)) {
        hovering = true;
        if (mouseDown) this.dragAndDrop(ball);
      }
      ball.update(t);
    });

    disk.update(magnet.ballCollisionRightAngle, balls[1].phi);

    if (hovering) this.hoverOn();
    else this.hoverOff();

    this.setState({balls});
  }

  draw = (t) => {
    if (!this.state.balls || !this.state.magnet) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.update(t);

    this.state.magnet.draw(this.ctx);
    this.state.balls.forEach(ball => ball.draw(this.ctx));
    this.state.disk.draw(this.ctx);

    requestAnimationFrame(this.draw);
  };

  render() {
    return (
      <div className={'Device'}>
        <canvas ref={"canvas"} width={this.width} height={this.height}>HTML5 support is required to run this app</canvas>
        <Col className={'unselectable m-0 p-0 text-center stop-balls'}><span onClick={this.stopBalls}>Остановить</span></Col>
      </div>
    );
  }

  stopBalls = () => {
    this.state.balls.forEach(ball => {
      if (ball.physicsBlocked || ball.userBlocked) return;
      ball.setAngle(0);
      ball.v = 0
    });
  }
}

// const TestPanel = (props) => {
//   return (
//     <Row>
//       {props.balls && props.balls.map((ball, i) => {
//         return (
//           <Col>
//             <Col>{`ball${i} a: ${ball.a.toFixed(2)}`}</Col>
//             <Col>{`ball${i} v: ${ball.v.toFixed(2)}`}</Col>
//             <Col>{`ball${i} phi: ${(ball.phi/Math.PI*180).toFixed(2)}grad`}</Col>
//             {/*<Col>{`ball${i} cx: ${ball.cx.toFixed(2)}`}</Col>*/}
//             {/*<Col>{`ball${i} cy: ${ball.cy.toFixed(2)}`}</Col>*/}
//           </Col>
//         );
//       })}
//     </Row>
//   );
// };

export default Device;