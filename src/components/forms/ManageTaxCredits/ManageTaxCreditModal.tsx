import clsx from "clsx";
import range from "lodash/range";
import toNumber from "lodash/toNumber";
import noUiSlider, { API } from "nouislider";
import numeral from "numeral";
import React, { useEffect, useMemo, useRef } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { faSync } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { getAppliedTaxCredits, getAvailableTaxCredits, getPaydownApplied } from "../../../lib/selectors";
import ZoomDialog from "../../ZoomDialog";
import { useManageTaxCreditForm } from "./useManageTaxCreditForm";

const ManageTaxCreditModal = ({ open, onClose, afterLeave }: WithGlobalDialogProps) => {
  const paydownApplied = useSelector(getPaydownApplied);
  const creditsAvailable = useSelector(getAvailableTaxCredits);
  const creditsApplied = useSelector(getAppliedTaxCredits);

  const {
    form: formMethods,
    handleCreditsChange,
    handlePaydownChange,
    onSubmit,
  } = useManageTaxCreditForm({
    onSubmitSuccess: () => {
      onClose();
    },
  });

  const isLoading = formMethods.formState.isSubmitting;

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave} data-cy="manage-tax-credit-modal">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className="flex flex-col p-4">
            <ZoomDialog.Header
              title={
                <div>
                  Total Credits Available:{" "}
                  <span className="text-2xl font-bold">{numeral(creditsAvailable).format("$0,0[.]00")}</span>
                </div>
              }
              onClose={onClose}
            />
            <div className="flex-grow px-4 pt-8 pb-4 text-base">
              <div className="pb-4 border-b border-gray-300 mb-4">
                <Controller
                  control={formMethods.control}
                  name="creditsPercent"
                  render={({ field }) => (
                    <>
                      <Slider
                        value={field.value ?? 1}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={value => {
                          formMethods.setValue(
                            "creditsApplied",
                            numeral(numeral((creditsAvailable ?? 0) * (value as number)).format("0[.]00")).value()!
                          );

                          return field.onChange(value);
                        }}
                        disabled={isLoading}
                      />
                      <div className="text-xl text-center font-bold">{numeral(field.value ?? 0).format("0,0%")}</div>
                    </>
                  )}
                />
              </div>
              <div className="flex justify-center items-center pb-4 border-b border-gray-300 mb-4">
                <div className="w-1/2 font-bold text-base">Total Credits Applied</div>
                <div className="w-1/2">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Controller
                      name="creditsApplied"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder={numeral(creditsApplied).format("0,0[.]00")}
                          disabled={isLoading}
                          onChange={e => {
                            field.onChange(e.target.value);

                            handleCreditsChange(e.target.value);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center mb-4">
                <div className="w-1/2 font-bold text-base">Additional Paydown*</div>
                <div className="w-1/2">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Controller
                      name="paydownApplied"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder={numeral(paydownApplied).format("0,0[.]00")}
                          disabled={isLoading}
                          onChange={e => {
                            field.onChange(parseFloat(e.target.value));

                            handlePaydownChange(e.target.value);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                * This is not your down payment and is used for illustrative purposes only.
              </div>
            </div>
            <div className="text-xl pt-4 border-t border-gray-300 text-right">
              <button type="button" className="btn-gray rounded-md py-3 px-6 font-bold mr-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary rounded-md py-3 px-6 font-bold" disabled={isLoading}>
                {isLoading ? <FontAwesomeIcon icon={faSync} spin /> : "Save"}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </ZoomDialog>
  );
};

export default ManageTaxCreditModal;

interface SliderProps {
  min: number;
  max: number;
  value: string | number;
  step?: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

const Slider = ({ min, max, step = 1, value, onChange, disabled }: SliderProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<API | null>(null);

  const rangeValues = useMemo(() => {
    const all = range(min, max + 1);

    return { all, min, max, step };
  }, [min, max, step]);

  useEffect(() => {
    function createSlider(el: HTMLElement | null) {
      if (!el) return null;

      const initialOptions = {
        start: value,
        range: {
          min: rangeValues.min,
          max: rangeValues.max,
        },
        step: rangeValues.step,
        format: {
          to: function (value) {
            return value;
          },
          from: function (value) {
            return Number(value.replace(",-", ""));
          },
        },
      };

      return noUiSlider.create(el, initialOptions);
    }

    if (!sliderRef.current) {
      sliderRef.current = createSlider(wrapperRef.current);
    } else {
      sliderRef.current.set(value, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sliderRef.current) return;

    const newOptions = {
      range: {
        min: rangeValues.min,
        max: rangeValues.max,
      },
      step: rangeValues.step,
    };
    sliderRef.current.updateOptions(newOptions, false);
  }, [rangeValues, step]);

  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.setHandle(0, value);
  }, [value]);

  const currentValueRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    function handleUpdate(values: (number | string)[]) {
      const value = values[0];

      if (value !== currentValueRef.current) {
        currentValueRef.current = value;

        onChange(toNumber(value));
      }
    }

    sliderRef.current.on("update", handleUpdate);

    return () => {
      sliderRef.current?.off("update");
    };
  }, [onChange]);

  useEffect(() => {
    // Destroy the slider when component unmounts
    return () => {
      sliderRef.current?.destroy();
      sliderRef.current = null;
    };
  }, []);

  return <Wrapper ref={wrapperRef} className={clsx("slider", disabled && "pointer-events-none")} data-prevent-swipe />;
};

const Wrapper = styled.div`
  height: 18px;
  margin-bottom: 2rem;
  background: rgba(var(--rgb-gray-light), 1);
  border: 0;
  border-radius: 0;
  box-shadow: none;

  .noUi-handle {
    background: rgba(var(--rgb-primary), 1);
    box-shadow: inset 0 0 1px #fff, inset 0 1px 7px rgba(var(--rgb-primary-dark), 0.6),
      0 3px 4px -3px rgba(var(--rgb-primary-light), 1);
    border-color: #fff;
    border-radius: 50%;

    width: 34px;
    height: 34px;
    right: -17px;
    top: -9px;
  }

  .noUi-handle:before,
  .noUi-handle:after {
    top: 9px;
  }
`;
