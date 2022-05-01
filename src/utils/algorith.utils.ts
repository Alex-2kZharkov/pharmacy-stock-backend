import { CalculationsTypes } from '../types/calculations.types';

export const countBySimpleExponentialSmoothing = (
  factNumbers: number[],
): void => {
  let [prevFact] = factNumbers;
  // для всех 0 < альфа <= 1
  const resultObject = {
    '0.1': prevFact,
    '0.2': prevFact,
    '0.3': prevFact,
    '0.4': prevFact,
    '0.5': prevFact,
    '0.6': prevFact,
    '0.7': prevFact,
    '0.8': prevFact,
    '0.9': prevFact,
    '1': prevFact,
  };

  // метод простого сглаживания
  for (const fact of factNumbers.slice(1)) {
    for (let j = 0.1; j <= 1; j += 0.1) {
      const truncIndex = Number(j.toFixed(1));
      const truncPrognosis = Number(
        (resultObject[truncIndex] as number).toFixed(4),
      );
      const res = Number(
        (prevFact * truncIndex + (1 - truncIndex) * truncPrognosis).toFixed(4),
      );
      resultObject[truncIndex] = res;
    }
    prevFact = fact;
  }

  // алгоритм поиска минимального значения (минимум ищется по абсолютной разнице факта и прогноза)
  const forecasts = Object.values(resultObject);
  const lastFact = factNumbers[factNumbers.length - 1];
  let minObj = {
    tolerance: Math.abs(lastFact - forecasts[0]),
    prognosis: forecasts[0],
  };

  for (let i = 1; i < forecasts.length; i++) {
    const tolerance = Math.abs(lastFact - forecasts[i]);
    if (minObj.tolerance > tolerance) {
      minObj = {
        tolerance,
        prognosis: forecasts[i],
      };
    }
  }
};

export const countUsingBrownDoubleSmoothing = (
  factNumber: number,
): CalculationsTypes[] => {
  const resultArray = [];
  let s1 = factNumber,
    s2 = factNumber;

  for (let i = 0.1; i <= 0.9; i += 0.1) {
    const newPrognosis = (i / (1 - i)) * (s2 - s1);
    const prognosisObject = {
      newPrognosis,
      tolerance: Math.abs(newPrognosis - factNumber),
    };
    resultArray.push(prognosisObject);
    s1 = i * factNumber + (1 - i) * s1;
    s2 = i * s1 + (1 - i) * s2;
  }
  console.log(resultArray);
  return resultArray;
};

// export const countProbabilityUsingPuassonMethod = (x: number): number[] => {
//   let M = x;
//   const step = 5,
//     resultArray = [];
//
//   for (let i = 0; i < 100 + x; i += step) {
//     const factorial = FIRST_TWENTY_FACTORIALS.find(
//       (factorial) => factorial === x,
//     );
//     const res = (M * Math.exp(-M)) / factorial;
//     resultArray.push(res);
//     M = i;
//   }
//   return resultArray.filter((probability) => probability > 0.001);
// };

export const createRecommendation = (
  events: number[],
  actions: number[],
): string => {
  const SALE_PRICE = 1000;
  const WHOLESALE_PRICE = 850;
  const KOL = 3;
  const SALARY = 10000;
  const RENT_COST = 20000;
  const ELECTRICITY_COST = 2000;
  const ADMIN_COST = 1000;
  const SOCIAL_COST = 2000;
  const PENSION_COST = 1500;
  const NDS = 13;

  for (let i = 0; i < actions.length; i++) {
    for (let j = 0; j < events.length; j++) {}
  }
  return '';
};
