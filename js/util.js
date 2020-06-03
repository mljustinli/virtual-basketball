function collision(
  colA: number,
  rowA: number,
  widthA: number,
  heightA: number,
  colB: number,
  rowB: number,
  widthB: number,
  heightB: number
): boolean {
  return (
    rowA < rowB + heightB - 1 &&
    rowA + heightA - 1 > rowB &&
    colA < colB + widthB - 1 &&
    colA + widthA - 1 > colB
  );
}
