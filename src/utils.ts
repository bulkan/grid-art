export const pipe = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)), fn1);

export const fitSquares = (width: number, height: number, n): number => {
  let sx = 0;
  let sy = 0;

  const px = Math.ceil(Math.sqrt((n * width) / height));

  if (Math.floor((px * height) / width) * px < n) {
    sx = height / Math.ceil((px * height) / width);
  } else {
    sx = width / px;
  }

  const py = Math.ceil(Math.sqrt((n * height) / width));

  if (Math.floor((py * width) / height) * py < n) {
    sy = width / Math.ceil((width * py) / height);
  } else {
    sy = height / py;
  }

  return Math.max(sx, sy);
};
