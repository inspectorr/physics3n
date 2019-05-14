import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import './style.css';
import colors from '../../colors.js';

class Controller extends Component {
  render() {
    return (
      <Row className={"Controller mx-auto align-items-center shadow-sm"} style={{backgroundColor: colors.background}}>
        <Col className={"d-flex p-0 m-0 justify-content-between"}>
          <Button onClick={this.props.turnOnMagnet} className={"stop btn-danger"}>{"СТОП"}</Button>
          <Button onClick={this.props.turnOffMagnet} className={"go"}>{"ПУСК"}</Button>
        </Col>
      </Row>
    );
  }
}

export default Controller;