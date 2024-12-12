'use client'
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ICreateVoucher, IFormVoucher } from "../../types/form";
import { useStoreAlert } from "../../hooks/alert";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { createVoucherShop, getVoucherShopDetail, updateVoucherShop } from "../../api/voucher/voucherShop";
import { FormInputText } from "../checkout/FormInputText";
import { DatePicker, LocalizationProvider, viVN } from "@mui/x-date-pickers";
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./../checkout/Step.scss"

const VoucherForm = ({ voucherId }: { voucherId?: string }) => {
  const methods = useForm<IFormVoucher>({ defaultValues: { voucherType: 0 } });
  const { control, reset, handleSubmit, watch, resetField } = methods;
  const watchVoucherType = watch("voucherType");
  const { callAlert, callErrorAlert } = useStoreAlert()
  const [cleared, setCleared] = useState<boolean>(false);
  const router = useRouter()
  useEffect(() => {
    const callApiGetVoucher = async () => {
      if (voucherId === undefined) return;
      try {
        const voucher = await getVoucherShopDetail(voucherId);
        if (typeof voucher != "string") {
          callAlert("Lấy chi tiết voucher thành công");
          const correct = {
            ...voucher,
            endDate: dayjs(voucher.endDate),
            startDate: dayjs(voucher.startDate),
          }
          reset(correct)
        } else {
          callAlert("Lấy chi tiết voucher thất bại");
        }
      } catch (error) {
        callAlert("Lấy chi tiết voucher thất bại");

      }
    }
    callApiGetVoucher()
  }, [callAlert, reset, voucherId])

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => { };
  }, [cleared]);

  const addNewVoucher = async (voucherData: ICreateVoucher) => {
    try {
      const response = await createVoucherShop(voucherData);
      if (typeof response != "string") {
        callAlert("Tạo voucher thành công!");
        console.log(response?.data);
        router.push("/manager-voucher")
      } else {
        callErrorAlert(response);
      }
    } catch (error) {
      callErrorAlert("Thất bại");
      console.error(error);
    }
  }
  const editVoucher = async (voucherData: ICreateVoucher) => {
    if(voucherId === undefined) {
      return callErrorAlert("Không lấy được VoucherId")
    }
    try {
      const response = await updateVoucherShop(voucherId, voucherData);
      if (typeof response != "string") {
        callAlert("Sửa voucher thành công!");
        console.log(response?.data);
        router.push("/manager-voucher")
      } else {
        callErrorAlert(response);
      }
    } catch (error) {
      callErrorAlert("Thất bại");
      console.error(error);
    }
  }
  const onSubmit = async (data: IFormVoucher) => {
    const voucherData: ICreateVoucher = {
      ...data,
      createdDate: dayjs().format("YYYY-MM-DD"),
      startDate: data.startDate.format("YYYY-MM-DD"),
      endDate: data.endDate.format("YYYY-MM-DD"),
    };
    console.log({ voucherData });

    if (voucherId === undefined) {
      return await addNewVoucher(voucherData)
    } else {
      return await editVoucher(voucherData)
    }
  };
  const renderSampleData = () => {
    const random = {
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountAmount: 100 * (Math.floor(Math.random() * 10) + 1),
      endDate: dayjs().add(Math.floor(Math.random() * 30) + 1, 'day'),
      startDate: dayjs().subtract(Math.floor(Math.random() * 30) + 1, 'day'),
      name: `Random Voucher ${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      minValue: 1000 * (Math.floor(Math.random() * 100) + 10),
      voucherType: 0,
    }
    const correct = {
      code: "XTRA12",
      discountAmount: 12000,
      discountPercentage: 0,
      voucherType: 0,
      endDate: dayjs().add(1, 'month'),
      startDate: dayjs().subtract(1, 'month'),
      name: "Content Xtra for Noel",
      minValue: 100000
    }
    reset(correct)

  }
  const onReset = () => {
    reset({
      code: "",
      discountAmount: 0,
      voucherType: 0,
      name: "",
      minValue: 0
    })
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="step mt-5 ">
          <div className="card">
            <h3>{voucherId === undefined ? "Sửa" : "Tạo"} Voucher mới</h3>
            <div className="row-2">
              <FormInputText name="name" label="Tên Voucher" required />
              <FormInputText name="code" label="Mã Voucher" required />
            </div>
            <LocalizationProvider
              dateAdapter={AdapterDayjs} localeText={
                viVN.components.MuiLocalizationProvider.defaultProps.localeText
              }>
              <div className="row-2">
                <Controller
                  control={control}
                  name="startDate"
                  rules={{
                    required: "Trường Ngày bắt đầu khuyến mãi cần phải điền",
                  }}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <Stack>
                      <DatePicker
                        label="Ngày bắt đầu khuyến mãi"
                        value={value}
                        onChange={onChange}
                        inputRef={ref}
                        format="DD/MM/YYYY"
                        onAccept={onChange}
                        slotProps={{
                          field: {
                            clearable: true,
                            onClear: () => setCleared(true),
                          },
                        }}
                      />
                      {error && (
                        <FormHelperText style={{ color: "#d32f2f" }}>
                          {error.message}
                        </FormHelperText>
                      )}
                    </Stack>
                  )}
                />

                <Controller
                  control={control}
                  name="endDate"
                  rules={{
                    required: "Trường Ngày kết thúc khuyến mãi cần phải điền",
                  }}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <Stack>
                      <DatePicker
                        label="Ngày kết thúc khuyến mãi"
                        value={value}
                        inputRef={ref}
                        format="DD/MM/YYYY"
                        onAccept={onChange}
                        onChange={onChange}
                        slotProps={{
                          field: {
                            clearable: true,
                            onClear: () => setCleared(true),
                          },
                        }}
                      />
                      {error && (
                        <FormHelperText style={{ color: "#d32f2f" }}>
                          {error.message}
                        </FormHelperText>
                      )}
                    </Stack>
                  )}
                />
              </div>
            </LocalizationProvider>


            <Controller
              control={control}
              name="voucherType"
              render={({
                field
              }) => (
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Loại voucher</FormLabel>
                  <RadioGroup row
                    aria-labelledby="demo-radio-buttons-group-label"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      resetField("discountAmount", { defaultValue: 0 });
                      resetField("discountPercentage", { defaultValue: 0 });
                    }}
                  >
                    <FormControlLabel value={0} control={<Radio />} label="Giảm theo tiền" />
                    <FormControlLabel value={1} control={<Radio />} label="Giảm theo phần trăm" />
                  </RadioGroup>
                </FormControl>
              )}
            />
            <div className="row-2">
              {watchVoucherType == 0 ? (
                <FormInputText name="discountAmount" required={watchVoucherType == 0} label="Số tiền giảm" textFieldProps={{ type: "number" }} />
              ) : (
                <FormInputText
                  name="discountPercentage"
                  label="Phần trăm giảm"
                  required={watchVoucherType == 1}
                  textFieldProps={{ type: "number" }}
                />
              )}
              <FormInputText name="minValue" label="Số tiền tối thiểu" required textFieldProps={{ type: "number" }} />
            </div>


            <Box display="flex" justifyContent="space-between" mt={2}>
              <Stack spacing={2} direction={"row"}>
                <Button size="large" type="submit" variant="contained">
                  {voucherId !== undefined ? "Sửa" : "Tạo"} Voucher
                </Button>
                <Button type="reset" sx={{ opacity: 0 }} size="large" variant="outlined" onClick={onReset}>Xóa</Button>
              </Stack>
              <p className="opacity-0" onClick={renderSampleData}>Hahhddddddddda</p>
            </Box>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default VoucherForm