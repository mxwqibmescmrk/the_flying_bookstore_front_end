"use client";
import Step1 from "@/components/checkout/Step1";
import Step3 from "@/components/checkout/Step3";
import { useStoreCart } from "@/hooks/cart";
import {
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useState } from "react";
import { useStoreStep } from "../../../hooks/step";
import Step2 from "../../../components/checkout/Step2";
import Step2Buy from "../../../components/checkout/Step2Buy";

const steps = ["Điền thông tin", "Xuất đơn hàng", "Lấy hàng"];

const Checkout = () => {

  const { changeStep, step, tabNum } = useStoreStep();
  const { removeCartRent, removeCartBuy } = useStoreCart();

  const handleNext = () => {
    changeStep(step + 1);
    if (tabNum == 1) {
      removeCartBuy();
    } else {
      removeCartRent();
    }
  };

  const chooseStep = () => {
    switch (step) {
      case 0:
        return <Step1 handleNext={handleNext} />;
      case 1:
        if (tabNum == 1) {
          return <Step2Buy />;
        } else {
          return <Step2 handleNext={handleNext} />;
        }
      case 2:
        return <Step3 />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Stepper activeStep={step}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {chooseStep()}
    </>
  );
};

export default Checkout;
