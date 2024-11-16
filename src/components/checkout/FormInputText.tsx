// src/form-component/FormInputText.tsx
import { Controller, useFormContext } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { IFormCheckout, IFormVoucher } from "@/types/form";

interface FormInputTextProps {
  name: keyof IFormCheckout | keyof IFormVoucher;
  label: string;
  required?: boolean;
  textFieldProps?: TextFieldProps;
}
export const FormInputText = ({
  name,
  label,
  required,
  ...textFieldProps
}: FormInputTextProps) => {
  const { control } = useFormContext() ?? {};
  if (!control) return <></>;

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `Trường ${label} cần phải điển` : false }}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            helperText={error ? error.message : null}
            size="medium"
            id={`${name} - form checkout`}
            error={!!error}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label={`${label} ${required ? "*" : ""}`}
            variant="standard"
            {...field}
            {...textFieldProps}
          />
        </>
      )}
    />
  );
};
