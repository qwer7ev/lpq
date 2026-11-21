export function printRange(rangeStart: number, rangeStop: number) {
  let text = "";
  for (let i = rangeStart; i <= rangeStop; i++) {
    text += i + ",";
  }

  return text.slice(0, -1);
}
