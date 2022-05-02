export const convertToNumber = (numberParameter: number, precision = 2) =>
  Number(numberParameter.toFixed(precision));

export const convertToNumberWithRounding = (numberParameter: number): number =>
  Math.round((numberParameter + Number.EPSILON) * 10000) / 10000;
