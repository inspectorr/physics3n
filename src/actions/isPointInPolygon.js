export default (x, y, position) => {
  const points = position.points.map(point => ({
    x: point.x + position.center.x,
    y: point.y + position.center.y,
  }));
  const N = points.length;
  let j = N - 1;
  let c = 0;
  for (let i = 0; i < N; i++){
    if ((((points[i].y<=y) && (y<points[j].y)) || ((points[j].y<=y) && (y<points[i].y))) &&
      (x > (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
      c = !c;
    }
    j = i;
  }
  return c;
}