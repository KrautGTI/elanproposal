import { ComponentType } from "react";

import { MaintenanceBreakdown } from "./breakdowns/Maintenance";
import { MovingBreakdown } from "./breakdowns/Moving";
import { NetMeteringBreakdown } from "./breakdowns/NetMetering";
import { TaxCreditBreakdown } from "./breakdowns/TaxCredit";
//import { TimeOfUseBreakdown } from "./breakdowns/TimeOfUse";
import { UpfrontCostBreakdown } from "./breakdowns/UpfrontCost";
import { WarrantyBreakdown } from "./breakdowns/Warranty";
import { MaintenanceIcon } from "./svg/Maintenance";
import { MovingIcon } from "./svg/Moving";
import { NetMeteringIcon } from "./svg/NetMetering";
import { TaxCreditIcon } from "./svg/TaxCredit";
//import { TimeOfUseIcon } from "./svg/TimeOfUse";
import { UpfrontCostIcon } from "./svg/UpfrontCost";
import { WarrantyIcon } from "./svg/Warranty";

interface FaqTab {
  id: string;
  title: string;
  icon: ComponentType<any>;
  component: ComponentType<any>;
}

export const faqs: FaqTab[] = [
  { id: "net-metering", title: "Net Metering", icon: NetMeteringIcon, component: NetMeteringBreakdown },
  { id: "upfront-cost", title: "Upfront Cost", icon: UpfrontCostIcon, component: UpfrontCostBreakdown },
  { id: "warranty", title: "Warranty", icon: WarrantyIcon, component: WarrantyBreakdown },
  { id: "moving", title: "Moving", icon: MovingIcon, component: MovingBreakdown },
  { id: "maintenance", title: "Maintenance", icon: MaintenanceIcon, component: MaintenanceBreakdown },
  { id: "tax-credit", title: "Tax Credit", icon: TaxCreditIcon, component: TaxCreditBreakdown },
  //{ id: "time-of-use", title: "Time of Use", icon: TimeOfUseIcon, component: TimeOfUseBreakdown },
];
