import React, {Component} from 'react';
import Col from "react-bootstrap/Col";

class Protocol extends Component {

  render() {

    // const data = [{
    //   a0: 1,
    //   a2: 1,
    // }];
    //
    // const columns = [{
    //   Header: 'a0',
    //   accessor: 'a0' // String-based value accessors!
    // }, {
    //   Header: 'a2',
    //   accessor: 'a2',
    //   Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    // }, {
    //   id: 'friendName', // Required because our accessor is not a string
    //   Header: 'Friend Name',
    //   accessor: d => d.friend.name // Custom value accessors!
    // }, {
    //   Header: props => <span>Friend Age</span>, // Custom header components!
    //   accessor: 'friend.age'
    // }];

    return (
      <Col className={"Protocol d-flex p-0 justify-content-center"}>

      </Col>
    );
  }
}

export default Protocol;