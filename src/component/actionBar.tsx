import { Button, Stack } from "@mui/material";

export interface ActionBarProps {
  onAddNew: () => void;
  onReset: () => void;
}
export const ActionBar = ({ onAddNew, onReset }: ActionBarProps) => {
  return (
    <Stack direction="row" justifyContent="end" mt={2} spacing={2}>
      <Button color="warning" variant="contained" onClick={onReset}>
        Reset
      </Button>
      <Button color="success" variant="contained" onClick={onAddNew}>
        Add history
      </Button>
      <Button type="submit" color="primary" variant="contained">
        Submit
      </Button>
    </Stack>
  );
};
