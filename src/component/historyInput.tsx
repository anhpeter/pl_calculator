import { Delete } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { FieldArrayWithId, UseFormRegister } from "react-hook-form";
import { FormValues } from "../util/form";

export interface HistoryInputProps {
  index: number;
  field: FieldArrayWithId<FormValues, "historyList", "id">;
  register: UseFormRegister<FormValues>;
  onRemoe: (idx: number) => void;
}
export const HistoryInput = ({
  index,
  field,
  register,
  onRemoe,
}: HistoryInputProps) => {
  const name = `history-${index + 1}`;
  const displayName = `History ${index + 1}`;

  return (
    <FormControl fullWidth variant="outlined" key={field.id}>
      <InputLabel htmlFor={name}>{displayName}</InputLabel>
      <OutlinedInput
        autoComplete="off"
        {...register(`historyList.${index}.value` as any)}
        type="text"
        endAdornment={
          index > 0 ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={name}
                onClick={() => onRemoe(index)}
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
};
