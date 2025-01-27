import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  createTheme,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "./App.css";

const LOCAL_STORAGE_HISTORY_KEY = "historyList";
const theme = createTheme({
  components: {
    MuiIcon: {
      styleOverrides: {},
    },
  },
});

const getLocalValue = () => localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
const setLocalValue = (value: string) =>
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, value);
const clearLocalValue = () =>
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, "");

type FormValues = {
  historyList: { value: string }[];
};

interface CalculationResult {
  grossEarnings: number;
  fees: number;
  profits: number;
}

interface OrderPayload {
  grossEarnings: number;
  fees: number;
}

const calculateProfits = (data: OrderPayload[]): CalculationResult => {
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

function App() {
  const [result, setCalculationResult] = useState<CalculationResult>();

  const defaultValues = useMemo(() => {
    let historyList = [{ value: "" }];
    try {
      const value = getLocalValue();
      historyList = JSON.parse(value as string);
    } catch (e) {}

    return {
      historyList,
    };
  }, []);
  const { control, reset, register, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "historyList",
  });

  const onReset = () => {
    setCalculationResult(undefined);
    clearLocalValue();
    reset({ historyList: [{ value: "" }] });
  };

  const onSubmit = handleSubmit((values) => {
    try {
      const data = values.historyList
        .map((item) => (item.value ? JSON.parse(item.value).orders : null))
        .filter((item) => item)
        .flat();
      const result = calculateProfits(data as unknown as OrderPayload[]);
      setCalculationResult(result);
      setLocalValue(JSON.stringify(values.historyList));
    } catch (e) {
      alert("Invalid Data");
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Grid2 container spacing={2}>
          <Grid2 size={12} mt={4}>
            {/* TITLE */}
            <Stack direction="row">
              <Typography variant="h3">P&L Calculator</Typography>
            </Stack>

            <form onSubmit={onSubmit}>
              {/* ACTION BAR */}
              <Stack direction="row" justifyContent="end" mt={2} spacing={2}>
                <Button color="warning" variant="contained" onClick={onReset}>
                  Reset
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => append({ value: "" })}
                >
                  Add history
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Submit
                </Button>
              </Stack>

              <Stack spacing={2} mt={4}>
                {fields.map((field, index) => {
                  const name = `history-${index + 1}`;
                  const displayName = `History ${index + 1}`;
                  return (
                    <FormControl fullWidth variant="outlined" key={field.id}>
                      <InputLabel htmlFor={name}>{displayName}</InputLabel>
                      <OutlinedInput
                        {...register(`historyList.${index}.value` as any)}
                        type="text"
                        endAdornment={
                          index > 0 ? (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={name}
                                onClick={() => remove(index)}
                                edge="end"
                              >
                                <Delete />
                              </IconButton>
                            </InputAdornment>
                          ) : undefined
                        }
                        label={displayName}
                      />
                    </FormControl>
                  );
                })}
              </Stack>
            </form>

            {/* RESULT */}
            {result && (
              <Stack mt={4}>
                <Alert
                  variant="outlined"
                  severity={result.profits >= 0 ? "success" : "error"}
                >
                  <Stack width="100%">
                    <Box>Gross Earnings: {result?.grossEarnings}</Box>
                    <Box>Fees: {result?.fees}</Box>
                    <Box>Profits: {result?.profits} </Box>
                  </Stack>
                </Alert>
              </Stack>
            )}
          </Grid2>
        </Grid2>
      </Container>
    </ThemeProvider>
  );
}

export default App;
