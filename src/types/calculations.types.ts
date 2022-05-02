export interface PoissonResult {
  prognosis: number;
  x: number;
  probability: number;
}

export interface WeightedProfit {
  weightedProfit: number;
  x: number;
}

export interface ConditionalProfit {
  conditionalProfit: number;
  x: number;
  probability: number;
  length?: 0;
}

export interface ConditionalProfitByEvent {
  [x: string]: ConditionalProfit[] | ConditionalProfit;
}
