import React, {Component} from 'react';
import Device from "./DevicePanel/Device";
import Controller from "./Controller";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import './style.css';
import hints from '../hints.js';
import Protocol from "./Protocol";
import DevicePanel from "./DevicePanel";
import getDataRow from "../actions/getDataRow";
import Header from "./Header";

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
    const row = getDataRow(a0, a2);
    if (data.length === 5) data.shift();
    data.push(row);
    this.setState({data});
  };

  devicePanel = React.createRef();
  turnOnMagnet = () => this.devicePanel.current.onMagnetTurnOn();
  turnOffMagnet = () => this.devicePanel.current.onMagnetTurnOff();

  render() {
    return (
      <Container fluid className={"justify-content-center m-0 p-0"}>
        <Header/>
        <Row className={"Main mx-auto d-flex justify-content-between flex-nowrap"} style={{height: 435}}>
          <DevicePanel ref={this.devicePanel} addDataRow={this.addDataRow}/>
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
