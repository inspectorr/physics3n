import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Ball from "./Ball";
import './style.css';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class Device extends Component {
  width = 600;
  height = 400;
  ballRadius = 20;
  threadLength = 150;

  state = {
    balls: null,
  };

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    const balls = [
      new Ball(this.ballRadius, this.threadLength, -Math.PI/2, this.width/2-this.ballRadius, 0.1),
      new Ball(this.ballRadius, this.threadLength, 0, this.width/2+this.ballRadius, 0.2),
    ];
    this.setState({balls});
    requestAnimationFrame(this.draw);
  }

  static ballCollision(ball1, ball2) {
    return Math.sqrt((ball1.cx-ball2.cx)**2+(ball1.cy-ball2.cy)**2) <= ball1.R + ball2.R;
  }

  update(t) {
    const balls = this.state.balls.slice();

    if (Device.ballCollision(balls[0], balls[1])) {
      const [m1, v1] = [balls[0].m, balls[0].v];
      const [m2, v2] = [balls[1].m, balls[1].v];
      const u1 = ((m1-m2)*v1 + 2*m2*v2)/(m1+m2);
      const u2 = ((m2-m1)*v2 + 2*m1*v1)/(m1+m2);
      [balls[0].v, balls[1].v] = [u1, u2];
    }

    balls.forEach(ball => ball.update(t));

    this.setState({balls});
  }

  draw = (t) => {
    if (!this.state.balls) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update(t);

    this.state.balls.forEach(ball => ball.draw(this.ctx));

    requestAnimationFrame(this.draw);
  };

  render() {
    return (
      <Container>
        <canvas ref={"canvas"} width={this.width} height={this.height}>HTML5 support required for this app</canvas>
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