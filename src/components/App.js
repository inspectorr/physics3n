import React, {Component} from 'react';
import Controller from "./Controller";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import './style.css';
import Protocol from "./Protocol";
import Header from "./Header";
import Device from "./Device";
import CONSTANTS from "../PHYSICS";
import formatAngle from "../actions/formatAngle";

document.addEventListener('mousedown', (e) => e.preventDefault());

const Info = () => {
  return (
    <Col className={'Info p-0 mt-2'}>
      <Col className={'p-0'}>Константы эксперимента:</Col>
      <Col className={'p-0'}>L = (23.9 ± 0.1) см</Col>
      <Col className={'p-0'}>m<sub>1</sub> = (45 ± 1) г</Col>
      <Col className={'p-0'}>m<sub>2</sub> = (131 ± 1) г</Col>
      <Col className={'p-0'}>θ<sub>α</sub> = 2.5°</Col>
    </Col>
  );
};

class App extends Component {
  static N = 5;

  state = {
    stage: 0,
    data: [],
  };

  addDataRow = (a0, a2) => {
    const data = this.state.data.slice();
    const row = {a0deg: formatAngle(a0), a2deg: formatAngle(a2)};
    if (data.length === 5) data.shift();
    data.push(row);
    this.setState({data});
  };

  device = React.createRef();
  turnOnMagnet = () => this.device.current.onMagnetTurnOn();
  turnOffMagnet = () => this.device.current.onMagnetTurnOff();

  render() {
    return (
      <Container fluid className={"justify-content-center m-0 p-0"}>
        <Header/>
        <Row className={"Main mx-auto d-flex justify-content-between flex-nowrap"}>
          <Device m1={CONSTANTS.m1} m2={CONSTANTS.m2} ref={this.device} addDataRow={this.addDataRow}/>
          <Col className={"right-panel p-0 m-0"}>
            <Controller turnOnMagnet={this.turnOnMagnet} turnOffMagnet={this.turnOffMagnet}/>
            <Info/>
            <Protocol data={this.state.data}/>
          </Col>
        </Row>
        <Row className={"bottom-panel d-flex justify-content-center flex-nowrap"}>

        </Row>
      </Container>
    );
  }
}

export default App;
