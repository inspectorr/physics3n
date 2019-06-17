import Row from "react-bootstrap/Row";
import React from "react";
import './style.css';
import Image from "react-bootstrap/Image";
import Info from "./Info";

export default class Header extends React.Component {
  state = {
    infoOpen: false,
  };

  openInfo = () => this.setState({infoOpen: true});
  closeInfo = () => this.setState({infoOpen: false});

  render() {
    const header = <Row
      className={"Header mb-3 mx-auto d-flex justify-content-center align-items-center flex-nowrap"}
    >
      <div className="logo p-0 m-0 text-center justify-content-center align-items-center">
        <Image height={45} src={require('../../images/logo.png')}/>
      </div>
      <div className="text p-0 m-0 justify-content-center align-items-center">
        Лабораторная работа №3н: "УПРУГОЕ СТОЛКНОВЕНИЕ ШАРОВ"
      </div>
      <div className={"info-container"}>
        <span onClick={this.openInfo} className={"info-text"}>О программе...</span>
      </div>
    </Row>;

    const popup = <Info open={this.state.infoOpen} closeInfo={this.closeInfo}/>;

    return [header, popup];
  }
}