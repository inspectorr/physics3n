import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import Device from "./Device";
import MassInput from "./MassInput";
import colors from "../../colors.js";
import './style.css';

class DevicePanel extends Component {
  width = 815;
  height = 460;

  state = {
    massEntered: true,
    m1: 45,
    m2: 131,
  };

  handleMassEnter = (m1, m2) => {
    this.setState({massEntered: true, m1, m2});
  };

  device = React.createRef();
  onMagnetTurnOn = () => this.device.current.onMagnetTurnOn();
  onMagnetTurnOff = () => this.device.current.onMagnetTurnOff();

  render() {
    const content = this.state.massEntered ?
      <Device
        addDataRow={this.props.addDataRow}
        ref={this.device}
        m1={+this.state.m1}
        m2={+this.state.m2}
        width={this.width}
        height={this.height}
      /> : <MassInput handleMassEnter={this.handleMassEnter}/>;

    return (
      <Col
        md={'auto'}
        className={"DevicePanel d-flex align-items-center p-0"}
        style={{
          // borderColor: colors.background,
          // backgroundColor: colors.background,
          width: this.width,
          minWidth: this.width,
          height: this.height,
        }}
      >
        {content}
      </Col>
    );
  }
}

export default DevicePanel;