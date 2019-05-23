import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Image from "react-bootstrap/Image";
import './style.css';

class Protocol extends Component {

  render() {
    // return {a0deg, a2deg, x0, tetaX0, x2, tetaX2, y2, tetaY2, y1, tetaY1, y1h, tetaY1h};

    const columns = [
      'N',
      'a0deg',
      'a2deg',
      'x0',
      'tetaX0',
      'x2',
      'tetaX2',
      'y2',
      'tetaY2',
      'y1',
      'tetaY1',
      'y1h',
      'tetaY1h',
    ].map((key, i) => {
      // const width = i < 7 ? 60 : 80;

      return {
        Header: <Image height={85} className={"header-image"} src={require(`../../images/headers/${key}.png`)}/>,
        accessor: key,
        Cell: props => <span className={`number ${key === 'N' ? 'bold' : ''}`}>{key === 'N' ? props.index+1 : props.value.toFixed(3)}</span>,
        width: i === 0 ? 30 : 85,
      };
    });

    return (
      <Col className={"Protocol d-flex px-0 pt-2 justify-content-center"}>
        <ReactTable
          data={this.props.data}
          columns={columns}
          showPageJump={false}
          minRows={5}
          showPagination={false}
          showPageSizeOptions={false}
          noDataText={'Заполните протокол!'}
          sortable={false}
          resizable={false}
          filterable={false}
        />
      </Col>
    );
  }
}

export default Protocol;