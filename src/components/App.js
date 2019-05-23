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
      <Container className={"mt-3 p-0"}>
        <Row className={"d-flex justify-content-center flex-nowrap"}>
          <DevicePanel ref={this.devicePanel} addDataRow={this.addDataRow}/>
          <Col className={"right-panel"}>
            <Controller turnOnMagnet={this.turnOnMagnet} turnOffMagnet={this.turnOffMagnet}/>
          </Col>
        </Row>
        <Row className={"bottom-panel d-flex justify-content-center flex-nowrap"}>
          <Protocol data={this.state.data}/>
        </Row>
      </Container>
    );
  }
}

export default App;
