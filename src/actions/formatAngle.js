export default function formatAngle(rad) {
  return Math.abs(Math.round(rad/Math.PI*180*10)/10).toFixed(1) + '°';
}