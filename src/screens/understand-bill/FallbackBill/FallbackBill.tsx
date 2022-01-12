import numeral from "numeral";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  getCustomer,
  getFirstYearConsumptionData,
  getUtilityCompany,
  getUtilityMonthlyPayment,
} from "../../../lib/selectors";
import ConsumptionChart from "./ConsumptionChart";

const getDateInfo = () => {
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = new Date().getFullYear();
  return { lastMonthDays: new Date(currentYear, currentMonth, 0).getDate(), currentYear, lastMonth };
};

const getServiceDate = () => {
  const { currentYear, lastMonth, lastMonthDays } = getDateInfo();
  return `1/1/${currentYear.toString().substr(-2)} - ${lastMonth + 1}/${lastMonthDays}/${currentYear
    .toString()
    .substr(-2)}`;
};

const getUsageOverview = (consumptionFirstYear: number[] = [], monthlyPayment: number) => {
  const { lastMonth, lastMonthDays } = getDateInfo();
  const consumption = consumptionFirstYear[lastMonth];
  const daily = consumption / lastMonthDays;
  return { daily, hourly: monthlyPayment / daily / 24 };
};

const FallbackBill = () => {
  const customer = useSelector(getCustomer);
  const utilityCompany = useSelector(getUtilityCompany);
  const serviceDate = useMemo(() => getServiceDate(), []);
  const monthlyUtilityPayment = useSelector(getUtilityMonthlyPayment);

  const consumptionData = useSelector(getFirstYearConsumptionData);
  const usageOverview = useMemo(() => getUsageOverview(consumptionData, monthlyUtilityPayment), [
    consumptionData,
    monthlyUtilityPayment,
  ]);

  return (
    <div className="w-full flex-grow bg-white rounded-2xl shadow-md m-2 flex flex-col min-h-0">
      <div className="bg-cool-gray-200 rounded-t-2xl text-cool-gray-400 uppercase text-center p-4 text-xl font-bold">
        Not an official bill
      </div>
      <div className="px-12 pt-8 pb-12 flex flex-col flex-grow min-h-0">
        <div className="flex-grow flex flex-col">
          <div>
            <div className="text-4xl font-bold mb-8">{utilityCompany.name || "Utility Company"}</div>
            <div className="flex flex-nowrap">
              <div className="mr-10">
                <div className="text-cool-gray-400 text-xl">Service from:</div>
                <div className="font-bold mt-2 text-xl">{serviceDate}</div>
              </div>
              {customer.address && (
                <div className="mr-52">
                  <div className="text-cool-gray-400 text-xl">Service for:</div>
                  <div className="font-bold mt-2 text-xl">
                    <div>{customer.address.line1}</div>
                    <div>
                      {customer.address.city}, {customer.address.state} {customer.address.postalCode}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex my-10">
            <div className="border-t border-cool-gray-300 flex-1 mr-10" />
            <div className="p-1 shadow-lg rounded-full h-52 w-52 -mt-36 -mb-20 flex-none">
              <div className="border-4 border-primary rounded-full h-full w-full flex flex-col items-center justify-center p-6 z-20">
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl font-bold">{numeral(usageOverview.daily).format("0,0[.]0")}</div>
                  <div className="text-cool-gray-400">Daily Avg kW Usage</div>
                </div>
                <div className="mt-4 mb-2 border-t border-cool-gray-300 w-full h-0" />
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl">{numeral(usageOverview.hourly).format("$0,0[.]00")}</div>
                  <div className="text-cool-gray-400">Avg per kWh</div>
                </div>
              </div>
            </div>
          </div>
          <div className="font-bold text-3xl mb-6">Monthly Consumption</div>
          <div className="flex-grow w-full flex justify-center items-center">
            <ConsumptionChart />
          </div>
        </div>
        <div className="flex justify-between py-6 flex-shrink-1 min-h-0 items-start overflow-hidden">
          <div className="">
            <div className="bg-cool-gray-200 h-4 rounded-sm mb-3 w-72" />
            <div className="bg-cool-gray-200 h-4 rounded-sm mb-3 w-80" />
            <div className="bg-cool-gray-200 h-4 rounded-sm mb-3 w-64" />
            <div className="bg-cool-gray-200 h-4 rounded-sm mb-3 w-52" />
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-cool-gray-400 h-4 rounded-sm mb-3 w-48" />
            <div className="bg-cool-gray-400 h-4 rounded-sm mb-3 w-40" />
            <div className="bg-cool-gray-400 h-4 rounded-sm mb-3 w-44" />
            <div className="bg-cool-gray-400 h-4 rounded-sm mb-3 w-32" />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-base text-cool-gray-400 mb-1">Total Due</div>
          <div className="text-6xl font-bold">{numeral(monthlyUtilityPayment).format("$0,0[.]00")}</div>
        </div>
      </div>
    </div>
  );
};

export default FallbackBill;
