import Row from "react-bootstrap/Row";
import React from "react";
import './style.css';
import colors from "../../colors";

export default function Header () {
  return (
    <Row
      className={"Header mb-3 mx-auto d-flex justify-content-center align-items-center flex-nowrap"}
      style={{
        zIndex: 20,
        // backgroundColor: colors.background,
      }}
    >
      Лабораторная работа №3н: "УПРУГОЕ СТОЛКНОВЕНИЕ ШАРОВ"
    </Row>
  );
}