import { LOCAL_STORAGE_HISTORY_KEY } from "../constant";

export interface CalculationResult {
  grossEarnings: number;
  fees: number;
  profits: number;
}

export interface OrderPayload {
  grossEarnings: number;
  fees: number;
}

export const calculateProfits = (data: OrderPayload[]): CalculationResult => {
  const result: CalculationResult = data.reduce(
    (prev: CalculationResult, current) => {
      prev.grossEarnings += current.grossEarnings;
      prev.fees += current.fees;
      return prev;
    },
    {
      grossEarnings: 0,
      fees: 0,
      profits: 0,
    }
  );

  result.profits = result.grossEarnings - result.fees;
  return result;
};

export const getLocalValue = () =>
  localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
export const setLocalValue = (value: string) =>
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, value);
export const clearLocalValue = () =>
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, "");
