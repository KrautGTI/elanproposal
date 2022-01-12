import clsx from "clsx";
import { FC, useCallback } from "react";
import styled from "styled-components";

interface ListItemConfig {
  label: string;
  value: number;
  steps?: number[] | undefined;
}

interface UtilityBillListProps {
  step: number;
}

const items = [
  { label: "Electricity Generation", value: 49.16, steps: [2] },
  { label: "DWR Bond Charge", value: 2.36 },
  { label: "Transmission", value: 11.41, steps: [3] },
  { label: "Distribution", value: 40.91, steps: [4] },
  { label: "Public Purpose Programs", value: 5.48 },
  { label: "Nuclear Decommissioning", value: 0.18, steps: [1] },
  { label: "DWR Revenue Adjustment", value: 2.36 },
  { label: "Competition Transition Charge", value: 0.46, steps: [3, 5] },
  { label: "Local Generation Charge", value: 0.17, steps: [2] },
  { label: "Reliability Services", value: 0.11 },
  { label: "TRAC", value: 39.31, steps: [6] },
];

export const UtilityBillList: FC<UtilityBillListProps> = ({ step }) => {
  const total = items?.map(x => x.value).reduce((acc, x) => acc + x, 0) ?? 0;

  const isHighlighted = useCallback(({ steps }: ListItemConfig) => steps?.includes(step), [step]);

  return (
    <Wrapper id="utility-bill-list" style={{ width: 400, height: 510 }}>
      <div className="text-lg font-bold mb-2">Sample Utility Bill</div>
      <div className="flex-grow flex flex-col justify-evenly">
        {items.map(item => (
          <div
            key={item.label + item.value}
            className={clsx(
              "utility-bill-item",
              "px-2 flex justify-between items-center",
              isHighlighted(item) && "active bg-blue-gray-600 rounded"
            )}
            style={{ paddingTop: 2, paddingBottom: 2 }}
          >
            <div className="text-gray-400">
              <span>{item.label}</span>
            </div>
            <div className="text-right text-lg font-bold">${item.value}</div>
          </div>
        ))}
        <div className="pt-3 px-2 flex justify-between items-center border-t border-white border-opacity-40">
          <div className="text-left text-gray-400">Total</div>
          <div className="text-right text-3xl">${total.toFixed(2)}</div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div.attrs({
  className: "py-4 px-6 rounded-xl bg-blue-gray-900 text-white overflow-hidden flex flex-col shadow-xl",
})``;
