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

class App extends Component {
  state = {
    stage: 0,
  };

  devicePanel = React.createRef();
  turnOnMagnet = () => this.devicePanel.current.onMagnetTurnOn();
  turnOffMagnet = () => this.devicePanel.current.onMagnetTurnOff();

  render() {
    return (
      <Container className={"mt-3"}>
        <Row className={"d-flex justify-content-center flex-nowrap"}>
          <DevicePanel ref={this.devicePanel}/>
          <Col className={"right-panel"}>
            <Controller turnOnMagnet={this.turnOnMagnet} turnOffMagnet={this.turnOffMagnet}/>
            <Protocol/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
