import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import colors from '../../colors.js';
import {AwesomeButton} from "react-awesome-button";
// import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import "react-awesome-button/dist/styles.css";
import './style.css';

class Controller extends Component {
  state = {
    stop: false,
  };

  // componentDidMount() {
  // }

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
      <Row className={"Controller mx-auto align-items-center shadow-sm"} style={{backgroundColor: colors.background}}>
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

          {/*<Button onClick={this.props.turnOffMagnet} className={"go"}>{"ПУСК"}</Button>*/}
        </Col>
      </Row>
    );
  }
}

export default Controller;