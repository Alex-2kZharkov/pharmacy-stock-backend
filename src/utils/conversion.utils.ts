export const convertToNumber = (numberParameter: number, precision = 2) =>
  Number(numberParameter.toFixed(precision));
