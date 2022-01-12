import { PropsOf } from "@headlessui/react/dist/types";
import dynamic from "next/dynamic";

import ManageAddersDrawer from "./components/forms/ManageAdders/ManageAddersDrawer";
import ManageDiscountsDrawer from "./components/forms/ManageDiscounts/ManageDiscountsDrawer";
import ManageGrossSystemCostModal from "./components/forms/ManageGrossSystemCost/ManageGrossSystemCostModal";
import ManageLenderModal from "./components/forms/ManageLender/ManageLenderModal";
import ManageSystemCostModal from "./components/forms/ManageSystemCost/ManageSystemCostModal";
import ManageTaxCreditModal from "./components/forms/ManageTaxCredits/ManageTaxCreditModal";
import ManageUtilityRateScheduleModal from "./components/forms/ManageUtilityRateSchedule/ManageUtilityRateScheduleModal";
import ConfirmActionModal from "./components/global/ConfirmActionModal";
import DealLockedModal from "./components/global/DealLockedModal";
import AuroraViewOptionsModal from "./components/global/DesignPortal/aurora/AuroraViewOptionsModal";
import SaveAuroraDesignModal from "./components/global/DesignPortal/aurora/SaveAuroraDesignModal";
import SelectAuroraDesignModal from "./components/global/DesignPortal/aurora/SelectAuroraDesignModal";
import DesignPortalModal from "./components/global/DesignPortal/DesignPortalModal";
import FullPriceBreakdownDrawer from "./components/global/FullPriceBreakdownDrawer/FullPriceBreakdownDrawer";
import ShareModal from "./components/global/Share/ShareModal";

import type { GlobalDialogProps } from "./features/dialogs/types";

const OptimizeByMetricModal = dynamic(() => import("./components/forms/OptimizeByMetric/OptimizeByMetricModal"));

const registry = {
  CONFIRM_ACTION: {
    component: ConfirmActionModal,
  },
  DESIGN_PORTAL: {
    component: DesignPortalModal,
  },
  OPTIMIZE_BY_METRIC: {
    component: OptimizeByMetricModal,
  },
  MANAGE_ADDERS_DRAWER: {
    component: ManageAddersDrawer,
  },
  MANAGE_DISCOUNTS_DRAWER: {
    component: ManageDiscountsDrawer,
  },
  MANAGE_GROSS_SYSTEM_COST: {
    component: ManageGrossSystemCostModal,
  },
  MANAGE_LENDER: {
    component: ManageLenderModal,
  },
  MANAGE_SYSTEM_COST: {
    component: ManageSystemCostModal,
  },
  MANAGE_TAX_CREDIT: {
    component: ManageTaxCreditModal,
  },
  MANAGE_UTILITY_RATE_SCHEDULE: {
    component: ManageUtilityRateScheduleModal,
  },
  FULL_PRICE_BREAKDOWN_DRAWER: {
    component: FullPriceBreakdownDrawer,
  },
  SHARE: {
    component: ShareModal,
  },
  DEAL_LOCKED: {
    component: DealLockedModal,
  },
  SAVE_AURORA_DESIGN: {
    component: SaveAuroraDesignModal,
  },
  AURORA_SDK_VIEW_OPTIONS: {
    component: AuroraViewOptionsModal,
  },
  SELECT_AURORA_DESIGN: {
    component: SelectAuroraDesignModal,
  },
};

export type RegisteredDialog = keyof typeof registry;

type RegistryComponentProps<T extends RegisteredDialog> = PropsOf<typeof registry[T]["component"]>;

export type RegisteredDialogProps<T extends RegisteredDialog> = Omit<
  RegistryComponentProps<T>,
  keyof GlobalDialogProps
>;

export function getRegisteredDialog<T extends RegisteredDialog>(key: T): typeof registry[T] {
  return registry[key];
}
