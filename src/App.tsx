import {
  Box,
  Container,
  createTheme,
  Grid2,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "./App.css";
import { ActionBar } from "./component/actionBar";
import { HistoryInput } from "./component/historyInput";
import { ProfitResult } from "./component/result";
import { Title } from "./component/title";
import {
  calculateProfits,
  CalculationResult,
  clearLocalValue,
  getLocalValue,
  OrderPayload,
  setLocalValue,
} from "./util";
import { FormValues } from "./util/form";

const theme = createTheme({
  components: {
    MuiIcon: {
      styleOverrides: {},
    },
  },
});

function App() {
  const [result, setCalculationResult] = useState<CalculationResult>();

  const defaultValues = useMemo(() => {
    try {
      const value = getLocalValue();
      const parsedValue = JSON.parse(value as string);
      if (parsedValue) {
        return parsedValue;
      }
    } catch (e) {}
    return {
      feeDiscountPercent: 0,
      historyList: [{ value: "" }],
    };
  }, []);
  const { control, watch, reset, register, handleSubmit } = useForm<FormValues>(
    {
      defaultValues,
    }
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "historyList",
  });

  const feeDiscountPercent = watch("feeDiscountPercent");

  const onReset = () => {
    setCalculationResult(undefined);
    clearLocalValue();
    reset({ feeDiscountPercent: 0, historyList: [{ value: "" }] });
  };

  const onSubmit = handleSubmit((values) => {
    try {
      const data = values.historyList
        .map((item) => (item.value ? JSON.parse(item.value).orders : null))
        .filter((item) => item)
        .flat();
      const result = calculateProfits(data as unknown as OrderPayload[]);
      setCalculationResult(result);
      setLocalValue(JSON.stringify(values));
    } catch (e) {
      alert("Invalid Data");
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Grid2 container spacing={2}>
          <Grid2 size={12} mt={4}>
            <Title />

            <form onSubmit={onSubmit}>
              <ActionBar
                onAddNew={() => append({ value: "" })}
                onReset={onReset}
              />

              <Stack spacing={2} mt={4}>
                <Box>
                  <TextField
                    type="number"
                    label="Fee discount"
                    size="small"
                    {...register("feeDiscountPercent")}
                    sx={{ width: "10rem" }}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: 100,
                      },
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <HistoryInput
                      index={index}
                      field={field}
                      register={register}
                      onRemoe={(idx) => remove(idx)}
                    />
                  ))}
                </Stack>
              </Stack>
            </form>

            {result && (
              <ProfitResult
                result={result}
                feeDiscountPercent={feeDiscountPercent}
              />
            )}
          </Grid2>
        </Grid2>
      </Container>
    </ThemeProvider>
  );
}

export default App;
