import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './style.css';

class Protocol extends Component {
  componentDidMount() {

  }

  componentDidUpdate() {
    const trs = this.refs.protocol.querySelectorAll('.rt-tbody .rt-tr');
    const N = this.props.data.length;
    this.blink(trs[N-1]);
  }

  blink(tr) {
    const textContainers = tr.querySelectorAll('.rt-td span');
    textContainers.forEach(blinkText);

    function blinkText(container) {
      container.style.color = 'rgba(0,123,255,1)';
      const duration = 1000;
      const one = duration/4;
      let blinking = setInterval(() => {
        container.hidden = !container.hidden;
      }, one);
      setTimeout(() => {
        clearInterval(blinking);
        container.hidden = false;
        container.style.color = 'white';
      }, duration)
    }
  }

  render() {
    const columns = [
      {
        Header: '№',
        accessor: 'N',
        Cell: props => <div><span className={`number bold`}>{props.index+1}</span></div>,
        width: 40,
      },
      {
        Header: <span>α<sub>0</sub></span>,
        accessor: 'a0deg',
        Cell: props => <div><span className={`number`}>{props.value.toFixed(1)}</span></div>,
        width: 90,
      },
      {
        Header: <span>α<sub>2</sub></span>,
        accessor: 'a2deg',
        Cell: props => <div><span className={`number`}>{props.value.toFixed(1)}</span></div>,
        width: 90,
      },
    ];

    return (
      <Col ref={"protocol"} className={"Protocol d-flex px-0 pt-2 justify-content-center"}>
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