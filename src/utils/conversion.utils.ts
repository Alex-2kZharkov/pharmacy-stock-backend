export const convertToNumber = (numberParameter: number, precision = 2) =>
  Number(numberParameter.toFixed(precision));

export const convertToNumberWithRounding = (
  numberParameter: number,
  rounding = 10000,
): number =>
  Math.round((numberParameter + Number.EPSILON) * rounding) / rounding;
