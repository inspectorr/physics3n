// import random from "./random";
import formatAngle from "./formatAngle";
//
// const N = 5;
// const Bpn = 0.51;
// const tetaAlphaDeg = 2.5;
// const tetaAlphaRad = tetaAlphaDeg/180*Math.PI;
// const m1 = 45;
// const m2 = 131;
// const L = 23.9;
//
// function error(alphaRad) {
//   return alphaRad + tetaAlphaRad*random(-0.5, 0.5);
// }

export default function (a0, a2) {
  // [a0, a2] = [Math.abs(a0), Math.abs(a2)];

  // имитация неточности измерений
  // a2 = error(a2);

  // const a0deg = a0/Math.PI*180;
  // const a2deg = a2/Math.PI*180;

  const a0deg = formatAngle(a0);
  const a2deg = formatAngle(a2);

  // const x0 = Math.cos(a0);
  // const tetaX0 = Math.sin(a0)*tetaAlphaDeg;
  // const x2 = Math.cos(a2);
  // const tetaX2 = Math.sin(a2)*tetaAlphaDeg;
  // const y2 = 1 - (2*m1/(m1+m2))**2 * (1-x0);
  // const tetaY2 = (2*m1/(m1+m2))**2 * tetaX0;
  // const y1 = 1 - ((m1-m2)/(m1+m2))**2 * (1-x0);
  // const tetaY1 = ((m1-m2)/(m1+m2))**2 * tetaX0;
  // const y1h = 1 - ((m1-m2)/(2*m1))**2 * (1-x2);
  // const tetaY1h = ((m1-m2)/(2*m1))**2 * tetaX2;

  // return {a0deg, a2deg, x0, tetaX0, x2, tetaX2, y2, tetaY2, y1, tetaY1, y1h, tetaY1h};
  return {a0deg, a2deg};
}

