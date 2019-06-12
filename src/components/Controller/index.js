import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AwesomeButton} from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import './style.css';

class Controller extends Component {
  state = {
    stop: false,
  };

  onStopPress = () => {
    this.props.turnOnMagnet();
    this.setState({stop: true});
  };

  onGoPress = () => {
    this.props.turnOffMagnet();
    this.setState({stop: false});
  };

  render() {
    return (
      <div className={"outer d-flex justify-content-start"}>
      <Row className={"Controller mx-auto align-items-center"}>
        <Col className={"d-flex p-0 m-0 justify-content-between"}>
          <AwesomeButton
            className={`stop ${this.state.stop ? 'aws-btn--active' : ''}`}
            onPress={this.onStopPress}
            type="primary"
          >
            {"СТОП"}
          </AwesomeButton>
          <AwesomeButton
            className={`go ${!this.state.stop ? 'aws-btn--active' : ''}`}
            onPress={this.onGoPress}
            type="primary"
          >
            {"ПУСК"}
          </AwesomeButton>
        </Col>
      </Row>
      </div>
    );
  }
}

export default Controller;