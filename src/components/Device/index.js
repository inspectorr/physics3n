import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Ball from "./parts/Ball";
import './style.css';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Magnet from "./parts/Magnet";
import isPointInPolygon from "../../actions/isPointInPolygon";
import isPointInCircle from "../../actions/isPointInCircle";

class Device extends Component {
  width = 600;
  height = 400;
  ballRadius = 20;
  threadLength = 150;

  state = {
    balls: null,
    magnet: null,
    clientX: null,
    clientY: null,
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
      new Ball(this.ballRadius, this.threadLength, -Math.PI/6, this.width/2-this.ballRadius, 0.1),
      new Ball(this.ballRadius, this.threadLength, 0, this.width/2+this.ballRadius, 0.2),
    ];

    const magnet = new Magnet(50, 40, this.width/2-this.ballRadius, this.threadLength, -Math.PI/3);

    this.setState({ balls, magnet });
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
    const handleDrag = () => {
      obj.setPosition(this.state.clientX, this.state.clientY);
    };
    const handleDrop = () => {
      obj.unblock();
      this.refs.canvas.removeEventListener('mousemove', handleDrag);
      this.refs.canvas.removeEventListener('mouseup', handleDrop);
    };
    this.refs.canvas.addEventListener('mousemove', handleDrag);
    this.refs.canvas.addEventListener('mouseup', handleDrop);
  };

  hoverOn = () => {
    this.refs.canvas.style.cursor = 'pointer';
  };

  hoverOff = () => {
    this.refs.canvas.style.cursor = 'unset';
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

  update(t) {
    const {clientX, clientY, mouseDown} = this.state;

    const balls = this.state.balls.slice();
    const magnet = this.state.magnet;

    if (Device.checkBallCollision(balls[0], balls[1])) {
      Device.handleBallCollision(balls[0], balls[1]);
    }

    let hovering = false;

    if (magnet.pointOver(clientX, clientY)) {
      hovering = true;
      if (mouseDown) this.dragAndDrop(magnet);
    }

    if (magnet.pointOver(balls[0].leftPoint.x, balls[0].leftPoint.y)) {
      balls[0].magnetBlock();
    }

    balls.forEach(ball => {
      if (ball.pointOver(clientX, clientY)) {
        hovering = true;
        if (mouseDown) this.dragAndDrop(ball);
      }
      ball.update(t);
    });

    if (hovering) this.hoverOn();
    else this.hoverOff();

    this.setState({balls});
  }

  draw = (t) => {
    if (!this.state.balls || !this.state.magnet) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.update(t);

    this.state.balls.forEach(ball => ball.draw(this.ctx));
    this.state.magnet.draw(this.ctx);

    requestAnimationFrame(this.draw);
  };

  render() {
    return (
      <Container id={"container"}>
        <canvas ref={"canvas"} width={this.width} height={this.height}>HTML5 support is required to run this app</canvas>
        <TestPanel balls={this.state.balls}/>
      </Container>
    );
  }
}

const TestPanel = (props) => {
  return (
    <Row>
      {props.balls && props.balls.map((ball, i) => {
        return (
          <Col>
            <Col>{`ball${i} a: ${ball.a.toFixed(2)}`}</Col>
            <Col>{`ball${i} v: ${ball.v.toFixed(2)}`}</Col>
            <Col>{`ball${i} phi: ${(ball.phi/Math.PI*180).toFixed(2)}grad`}</Col>
            {/*<Col>{`ball${i} cx: ${ball.cx.toFixed(2)}`}</Col>*/}
            {/*<Col>{`ball${i} cy: ${ball.cy.toFixed(2)}`}</Col>*/}
          </Col>
        );
      })}
    </Row>
  );
};

export default Device;