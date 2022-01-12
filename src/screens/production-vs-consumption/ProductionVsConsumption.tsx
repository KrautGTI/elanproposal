import React from "react";

import ProductionVsConsumptionChart from "../../charts/ProductionVsConsumptionChart";
import TitleLayout from "../../components/layouts/TitleLayout";

import type { DeckScreen } from "../../types";

interface ProductionVsConsumptionProps {
  subtitle?: string;
}

const ProductionVsConsumption: DeckScreen<ProductionVsConsumptionProps> = ({ subtitle, isActive }) => {
  return (
    <TitleLayout title="Production vs. Consumption" subtitle={subtitle}>
      <div className="w-full h-full">
        <div className="w-full h-full px-10 bg-white rounded-lg flex flex-col justify-center">
          <ProductionVsConsumptionChart active={isActive} />
        </div>
      </div>
    </TitleLayout>
  );
};

export default ProductionVsConsumption;
