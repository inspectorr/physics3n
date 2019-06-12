import Row from "react-bootstrap/Row";
import React from "react";
import './style.css';
import Image from "react-bootstrap/Image";

export default function Header () {
  return (
    <Row
      className={"Header mb-3 mx-auto d-flex justify-content-center align-items-center flex-nowrap"}
      style={{
        zIndex: 20,
      }}
    >
      <div className="logo p-0 m-0 text-center justify-content-center align-items-center">
        <Image height={45} src={require('../../images/logo.png')}/>
      </div>
      <div className="text p-0 m-0 justify-content-center align-items-center">
        Лабораторная работа №3н: "УПРУГОЕ СТОЛКНОВЕНИЕ ШАРОВ"
      </div>
    </Row>
  );
}