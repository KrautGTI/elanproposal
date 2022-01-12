import enUS from "date-fns/locale/en-US";

export const getAllShortMonthNames = () => {
  return new Array(12).fill("*").map((_, idx) => {
    return enUS.localize?.month(idx, { width: "abbreviated" });
  });
};

export const getYearsListStartingWith = (startYear: number, numYears: number) => {
  return new Array(numYears).fill("*").map((_, idx) => {
    return startYear + idx;
  });
};
