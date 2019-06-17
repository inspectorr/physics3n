import React, {Component} from 'react';
import Popup from "reactjs-popup";
import './style.css';

class Info extends Component {
  render() {
    return (
      <Popup
        open={this.props.open}
        closeOnDocumentClick
        onClose={this.props.closeInfo}
        contentStyle={{
          width: 400,
          padding: 0,
        }}
      >
        <div className="hat">
          О программе
          <span className="popup-close" onClick={this.props.closeInfo}>&times;</span>
        </div>
        <div className="popup-text">
          {"Сайт разработан\nВерхотуровым Романом Георгиевичем,\nкафедра САПР факультета КТИ\nпод руководством\nк.ф.-м.н. доцента кафедры физики\nШейнмана Ильи Львовича.\n"}
          <div className='uni'>{"Санкт-Петербургский Государственный\nЭлектротехнический Университет"}</div>
        </div>
      </Popup>
    );
  }
}

export default Info;