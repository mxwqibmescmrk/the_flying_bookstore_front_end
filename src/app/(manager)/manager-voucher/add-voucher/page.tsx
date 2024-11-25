"use client";
import { useState } from "react";
import { Box, Button, Alert, FormHelperText } from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { DatePicker, LocalizationProvider, viVN } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { FormInputText } from "../../../../components/checkout/FormInputText";
import { IFormVoucher } from "../../../../types/form";


const CreateNewVoucher = () => {
  const methods = useForm<IFormVoucher>();
  const { control, handleSubmit, formState } = methods;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: IFormVoucher) => {
    const voucherData = {
      ...data,
      createdDate: data.createdDate.format("YYYY-MM-DD"),
      startDate: data.startDate.format("YYYY-MM-DD"),
      endDate: data.endDate.format("YYYY-MM-DD"),
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/voucher-shop",
      headers: {
        "Content-Type": "application/json",
      },
      data: voucherData,
    };

    try {
      const response = await axios.request(config);
      setSuccessMessage("Voucher created successfully!");
      setErrorMessage(null);
      console.log(response.data);
    } catch (error) {
      setErrorMessage("Failed to create voucher.");
      setSuccessMessage(null);
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="step mt-8 ">
          <div className="card">
            <h3>Tạo Voucher mới</h3>
            <div className="row-2">
              <FormInputText name="name" label="Tên Voucher" required />
              <FormInputText name="code" label="Mã Voucher" required />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="row-2">
                <Controller
                  control={control}
                  name="startDate"
                  rules={{
                    required: "Start date is required",
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <DatePicker
                        label="Ngày bắt đầu khuyến mãi"
                        value={value}
                        onChange={onChange}
                      />
                      {error && (
                        <FormHelperText style={{ color: "#d32f2f" }}>
                          {error.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="endDate"
                  rules={{
                    required: "End date is required",
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <DatePicker
                        label="Ngày kết thúc khuyến mãi"
                        value={value}
                        onChange={onChange}
                      />
                      {error && (
                        <FormHelperText style={{ color: "#d32f2f" }}>
                          {error.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </div>
            </LocalizationProvider>

            <div className="grid grid-cols-1 mt-5">
              <FormInputText name="minValue" label="Minimum Value" required textFieldProps={{ type: "number" }} />
            </div>

            <FormInputText name="discountAmount" label="Discount Amount" textFieldProps={{ type: "number" }} />

            <FormInputText
              name="discountPercentage"
              label="Discount Percentage"
              textFieldProps={{ type: "number" }}
            />

            <FormInputText name="voucherType" label="Voucher Type" textFieldProps={{ type: "number" }} required />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button size="large" type="submit" variant="contained">
                Create Voucher
              </Button>
            </Box>

            {/* Success/Error Messages */}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateNewVoucher;
