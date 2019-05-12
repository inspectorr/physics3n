export default (x, y, cx, cy, R) => {
  return Math.sqrt((x-cx)**2+(y-cy)**2) <= R;
}