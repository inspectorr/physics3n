import React, {Component} from 'react';
import { Form, Text } from 'informed';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import './style.css';
import Row from "react-bootstrap/Row";


class MassInput extends Component {
  render() {
    return (
      <Col className={"MassInput d-flex justify-content-center"}>
        <Form
          onSubmit={(ms) => this.props.handleMassEnter(ms.m1, ms.m2)}
          initialValues={{
            m1: 100,
            m2: 300,
          }}
        >
          <Row className={'m-1 p-0'}>
            <Col className={'m-0 p-0'}>Масса первого шарика:</Col>
            <Col md={'auto'} className={'m-0 p-0'}><Text field="m1"/> г</Col>
          </Row>
          <Row className={'m-1 p-0'}>
            <Col className={'m-0 p-0'}>Масса второго шарика:</Col>
            <Col md={'auto'} className={'m-0 p-0'}><Text field="m2"/> г</Col>
          </Row>
          <Row className={'m-1 p-0'}>
            <Button type="submit">НАЧАТЬ</Button>
          </Row>
        </Form>
      </Col>
    );
  }
}

export default MassInput;