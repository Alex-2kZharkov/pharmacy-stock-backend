import {
  convertToNumber,
  convertToNumberWithRounding,
} from './conversion.utils';
import { APPLICABLE_PROBABILITY } from '../constants/algorithm.constants';
import { PoissonResult, WeightedProfit } from '../types/calculations.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pmf = require('@stdlib/stats-base-dists-poisson-pmf');

export const countBySimpleExponentialSmoothing = (
  factNumbers: number[],
): number[] => {
  // eslint-disable-next-line prefer-const
  let [prevFact, ...restFacts] = factNumbers;
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
  for (const fact of restFacts) {
    for (let j = 0.1; j <= 1; j += 0.1) {
      const truncIndex = convertToNumber(j, 1);
      const truncPrognosis = convertToNumber(
        resultObject[truncIndex] as number,
        4,
      );
      resultObject[truncIndex] = convertToNumber(
        prevFact * truncIndex + (1 - truncIndex) * truncPrognosis,
        4,
      );
    }
    prevFact = fact;
  }

  return Object.values(resultObject);
};

export const countByBrownDoubleSmoothing = (
  factNumbers: number[],
): number[] => {
  // метод двойного экспоненциального сглаживания

  // eslint-disable-next-line prefer-const
  let [prevFact, ...restFacts] = factNumbers;
  let S1 = prevFact,
    S2 = prevFact,
    a0 = prevFact,
    a1 = 0,
    y;

  // для всех 0 < альфа <= 0.9
  const tempObject: {
    [x: string]: {
      S1: number;
      S2: number;
      value?: number;
    };
  } = {
    '0.1': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.2': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.3': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.4': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.5': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.6': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.7': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.8': {
      S1: prevFact,
      S2: prevFact,
    },
    '0.9': {
      S1: prevFact,
      S2: prevFact,
    },
  };

  // метод простого сглаживания
  for (const fact of restFacts.slice(0, -1)) {
    for (let j = 0.1; j <= 0.9; j += 0.1) {
      const truncIndex = Number(j.toFixed(1));

      S1 = convertToNumberWithRounding(
        truncIndex * fact + (1 - truncIndex) * tempObject[truncIndex].S1,
      );

      S2 = convertToNumberWithRounding(
        truncIndex * S1 + (1 - truncIndex) * tempObject[truncIndex].S2,
      );

      a0 = convertToNumberWithRounding(2 * S1 - S2);
      a1 = convertToNumberWithRounding(
        (truncIndex / (1 - truncIndex)) * (S1 - S2),
      );
      y = convertToNumberWithRounding(a0 + a1); // т.к. 1 период планирования
      tempObject[truncIndex].value = y;
      tempObject[truncIndex].S1 = S1;
      tempObject[truncIndex].S2 = S2;
    }
    prevFact = fact;
  }
  return Object.values(tempObject).map((property) => property.value);
};

// алгоритм поиска минимального значения (минимум ищется по абсолютной разнице факта и прогноза)
export const getMinimumByTolerance = (
  fact: number,
  ...forecasts: number[]
): number => {
  let minObj = {
    tolerance: Math.abs(fact - forecasts[0]),
    prognosis: forecasts[0],
  };

  for (let i = 1; i < forecasts.length; i++) {
    const tolerance = Math.abs(fact - forecasts[i]);
    if (minObj.tolerance > tolerance) {
      minObj = {
        tolerance,
        prognosis: forecasts[i],
      };
    }
  }
  return minObj.prognosis;
};

export const countProbabilityUsingPoissonDistribution = (
  prognosis: number,
): PoissonResult[] => {
  // расчет вероятностей при помощи закона распределения Пуассона из проверенной сторонней библиотеки
  const resultObject = [];
  for (let x = 0; x <= 10 + prognosis; x++) {
    const probability = convertToNumberWithRounding(pmf(x, prognosis), 1000);
    if (probability > APPLICABLE_PROBABILITY) {
      resultObject.push({
        prognosis,
        x,
        probability,
      });
    }
  }
  return resultObject;
};

export const countExpectedMonetaryValue = (
  weightedProfits: WeightedProfit[][],
) => {
  return weightedProfits.reduce((accum, weightedProfitsByAction) => {
    const expectedMonetaryValue = weightedProfitsByAction.reduce(
      (innerAccum, weightedProfitParam) => {
        return {
          weightedProfit:
            innerAccum?.weightedProfit + weightedProfitParam.weightedProfit,
          x: weightedProfitParam.x,
        };
      },
      { weightedProfit: 0, x: null },
    );
    accum.push(expectedMonetaryValue);
    return accum;
  }, []);
};

export const countProfit = (
  prognosis: PoissonResult[],
  primaryAmount: number,
  finalAmount: number,
) => {
  const weightedProfitsObject = {};

  for (let i = 0; i < prognosis.length; i++) {
    const event = prognosis[i];
    for (let j = 0; j < prognosis.length; j++) {
      const action = prognosis[j];
      const conditionalProfit =
        event.x * finalAmount - action.x * primaryAmount;
      const weightedProfit = conditionalProfit * event.probability;
      const obj = {
        weightedProfit,
        x: action.x,
      };
      weightedProfitsObject[j] = weightedProfitsObject[j]
        ? [...weightedProfitsObject[j], obj]
        : [obj];
    }
  }
  const weightedProfits: WeightedProfit[][] = Object.values(
    weightedProfitsObject,
  );
  const expectedMonetaryValues = countExpectedMonetaryValue(weightedProfits);
  return expectedMonetaryValues;
};

export const getMaximumExpectedMonetaryValue = (
  weightedProfits: WeightedProfit[],
) => {
  let maxObj = {
    weightedProfit: weightedProfits[0].weightedProfit,
    x: weightedProfits[0].x,
  };

  for (let i = 1; i < weightedProfits.length; i++) {
    const { weightedProfit, x } = weightedProfits[i];
    if (maxObj.weightedProfit < weightedProfit) {
      maxObj = {
        weightedProfit,
        x,
      };
    }
  }
  console.log(maxObj);
};
