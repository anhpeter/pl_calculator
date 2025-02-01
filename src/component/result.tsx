import { Alert, Box, Stack } from "@mui/material";
import { useMemo } from "react";
import { CalculationResult } from "../util";

export interface ProfitResultProps {
  result: CalculationResult;
  feeDiscountPercent?: number;
}
export const ProfitResult = ({
  result,
  feeDiscountPercent = 0,
}: ProfitResultProps) => {
  const feeDiscountContent = useMemo(() => {
    const discount = (result.fees * feeDiscountPercent) / 100;
    return result.fees > 0 && feeDiscountPercent > 0 ? (
      <span>
        {" "}
        + {discount} <i>(fee discount)</i> = {result.profits + discount}
      </span>
    ) : null;
  }, [feeDiscountPercent, result.fees, result.profits]);

  return (
    <Stack mt={4}>
      <Alert
        variant="outlined"
        severity={result.profits >= 0 ? "success" : "error"}
      >
        <Stack width="100%">
          <Stack direction="row" spacing={4}>
            <Stack>
              <Box>Gross Earnings:</Box>
              <Box>Fees:</Box>
              <Box>Profits:</Box>
            </Stack>
            <Stack>
              <Box>{result?.grossEarnings}</Box>
              <Box>{result?.fees}</Box>
              <Box>
                {result?.profits}
                {feeDiscountContent}
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Alert>
    </Stack>
  );
};
