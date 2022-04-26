import { CalculationsTypes } from '../types/calculations.types';
import { FIRST_TWENTY_FACTORIALS } from '../constants/factorial.constants';

export const countUsingSimpleExponentialSmoothing = (
  factNumber: number,
): CalculationsTypes[] => {
  const resultArray = [],
    prevPrognosis = factNumber;

  for (let i = 0.1; i <= 1; i += 0.1) {
    const newPrognosis = factNumber * i + (1 - i) * prevPrognosis;
    const prognosisObject = {
      newPrognosis,
      tolerance: Math.abs(newPrognosis - factNumber),
    };
    resultArray.push(prognosisObject);
  }
  console.log(resultArray);
  return resultArray;
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

export const findXByMinimumToleranceError = (
  ...values: CalculationsTypes[]
): number => {
  let min = values[0];

  for (let i = 1; i < values.length; i++) {
    if (min.tolerance > values[i].tolerance) {
      min = values[i];
    }
  }
  return min.newPrognosis;
};

export const countProbabilityUsingPuassonMethod = (x: number): number[] => {
  let M = x;
  const step = 5,
    resultArray = [];

  for (let i = 0; i < 100 + x; i += step) {
    const factorial = FIRST_TWENTY_FACTORIALS.find(
      (factorial) => factorial === x,
    );
    const res = (M * Math.exp(-M)) / factorial;
    resultArray.push(res);
    M = i;
  }
  return resultArray.filter((probability) => probability > 0.001);
};

export const countActions = (x: number): number[] => {
  const step = 5,
    resultArray = [];

  for (let i = 0; i < 100 + x; i += step) {
    resultArray.push(i);
  }
  return resultArray;
};

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
