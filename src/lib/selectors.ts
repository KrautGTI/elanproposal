import filter from "lodash/filter";
import forEach from "lodash/forEach";
import groupBy from "lodash/groupBy";
import includes from "lodash/includes";
import last from "lodash/last";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import range from "lodash/range";
import round from "lodash/round";
import sum from "lodash/sum";
import uniqBy from "lodash/uniqBy";

import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../rootReducer";
import { Adder, CustomAdder, Discount, LenderRate } from "../types";
import { formatKw } from "./utils";

type ActiveAdders = (Adder | CustomAdder)[];
type ActiveDiscounts = Discount[];

export const getTemplate = (state: RootState) => state.template.data!;
const getProposalState = (state: RootState) => state.proposal!;
export const getProposal = createSelector(getProposalState, proposalState => proposalState.data!);
export const getProposalError = createSelector(getProposalState, proposalState => proposalState.error);
export const getProposalLoading = createSelector(getProposalState, proposalState => proposalState.isLoading);
export const getReportHash = createSelector(getProposalState, proposalState => proposalState.reportHash!);

export const getIsProposalLoading = createSelector([getProposalState], proposalState => proposalState.isLoading);

export const getSalesCompanyLogo = createSelector(getTemplate, template => template.logo);
export const getInstallerLogo = createSelector(getTemplate, template => template.installerLogo);
export const getCompanyInfo = createSelector(getTemplate, template => template.companyInfo);
export const getOfficeInfo = createSelector(getTemplate, template => template.officeInfo);

export const getCustomer = createSelector(getProposal, proposal => proposal.customer);
export const getSalesRep = createSelector(getProposal, proposal => proposal.agent);
export const getShareLink = createSelector(getProposal, proposal => proposal.shareLink);
export const getUtilityCompany = createSelector(getProposal, proposal => ({
  name: proposal.utilityCompany,
  rateSchedule: proposal.utilityRateSchedule,
}));
export const getApplyNowUrl = createSelector(
  [getProposal, getReportHash],
  (proposal, reportHash) => proposal.links?.applyNow ?? `/survey/agreement/next/${reportHash}`
);
export const getDealUrl = createSelector(
  getProposal,
  proposal => proposal.links?.dealUrl ?? `/surveys/${proposal.surveyId}`
);
export const getPrintUrl = createSelector(getReportHash, reportHash => `/proposals/${reportHash}?print-pdf`);
export const getSlideshowUrl = createSelector(getReportHash, reportHash => `/proposals/${reportHash}`);
export const getRedesignUrl = createSelector(getProposal, proposal => `/deal/redesign/${proposal.surveyId}`);
export const getIsHelioquoteDesign = createSelector(getProposal, proposal => proposal.design.tool === "helioquote");
export const getHasArrayData = createSelector(getProposal, proposal => !!proposal.design.arrays);
export const getUtilityBillFiles = createSelector(getProposal, proposal => proposal.utilityBillFiles ?? []);
export const getEnvironmentalImpactStats = createSelector(getProposal, proposal => proposal.environmentalImpact);

export const getProposalStatus = createSelector(getProposal, proposal => proposal?.status ?? {});
export const getProposalLinks = createSelector(getProposal, proposal => proposal?.links ?? {});
export const getLenderCap = createSelector(getProposal, proposal => proposal.lenderCap);
export const getIsOptimizingDesign = createSelector(
  getProposalState,
  proposalState => proposalState.isOptimizingDesign
);

export const getIsProposalLocked = createSelector(
  [getProposalState, getProposalStatus],
  (proposalState, proposalStatus) => {
    return !!(proposalState.locked || proposalStatus.isLocked);
  }
);

export const getShouldPreventUpdates = createSelector(getProposalStatus, status => !!status.isLocked);

export const getDealLockStatus = createSelector([getProposalStatus, getProposalLinks], (status, links) => {
  const { hasSignedAgreement, hasApprovedFinancing } = status ?? {};

  if (hasSignedAgreement) {
    return {
      description:
        "There is a signed agreement with this proposal. Pricing cannot be modified unless the agreement is voided.",
      actionButtonText: "View Agreement",
      actionButtonUrl: links.contractPreview,
    };
  } else if (hasApprovedFinancing) {
    return {
      description:
        "There is an approved loan application for this customer. Pricing cannot be modified unless the application is voided.",
      actionButtonText: "View Application",
      actionButtonUrl: links.financeAppStatus,
    };
  }

  return null;
});

/**
 * Abilities
 */

const getAbilities = createSelector(getProposal, proposal => proposal.abilities);

export const canUserEditProposal = createSelector(
  [getProposal, (state: RootState) => state.deck.features.printMode],
  (proposal, isPrintMode) => !isPrintMode && !!proposal && !proposal.readonly
);
export const canAddCustomAdders = createSelector(getAbilities, abilities => abilities.canAddCustomAdders);
export const canAddCustomDiscounts = createSelector(getAbilities, abilities => abilities.canAddCustomDiscounts);
export const canUserManageDiscounts = createSelector(getAbilities, abilities => abilities.canAddDiscounts);
export const canUserAdjustTaxCredit = createSelector(
  [canUserEditProposal, getAbilities],
  (canEdit, abilities) => canEdit && abilities.canAdjustTaxCredit !== false
);
export const canUserEditGrossPrice = createSelector(getAbilities, abilities => abilities.editGrossPrice);
export const canUserUnlockProposal = createSelector(
  [canUserEditProposal, getProposalStatus],
  (canEdit, status) => canEdit && !status.isLocked
);
export const canShare = createSelector(getAbilities, abilities => !!abilities.canShare);
export const getCanChangeInverter = createSelector(getAbilities, abilities => !!abilities.canChangeInverter);
export const getCanChangeRateSchedule = createSelector(getAbilities, abilities => !!abilities.canChangeRateSchedule);

/**
 * Settings
 */

export const getUseSimplifiedProductionCalcs = createSelector(
  getTemplate,
  template => template.companyInfo.useSimplifiedProductionCalcs
);

/**
 * Design
 */

const getDesignData = createSelector(getProposal, proposal => proposal.design);

export const getMinPanelCount = createSelector(getDesignData, design => design.minPanelCount);
export const getMaxPanelCount = createSelector(getDesignData, design => design.maxPanelCount);
export const getPanelCount = createSelector(getDesignData, design => design.panelCount);
export const getPanelName = createSelector(getDesignData, design => design.panelName);
export const getPanelWatts = createSelector(getDesignData, design => design.panelWatts);
export const getSystemSizeInWatts = createSelector(getDesignData, design => design.systemSize ?? 0);
export const getSystemSizeInKw = createSelector(getSystemSizeInWatts, systemSize => formatKw(systemSize));
export const getEstimatedYearlyConsumption = createSelector(getDesignData, design => design.estimatedConsumption);
export const getEstimatedMonthlyConsumption = createSelector(
  getDesignData,
  design => design.estimatedMonthlyConsumption
);
export const getEstimatedYearlyProduction = createSelector(getDesignData, design => design.annualProduction);
export const getRoofImageUrl = createSelector(getDesignData, design => design.roofImageUrl);
export const getHeatMapOffImageUrl = createSelector(getDesignData, design => design.roofHeatMapOffImageUrl);
export const getHelioquoteIframeUrl = createSelector(getDesignData, design => design.iframeUrl);
export const getSolarOffset = createSelector(getDesignData, design => design.solarOffset);
export const getInverterName = createSelector(getDesignData, design => design.inverterName);
export const getInverterId = createSelector(getDesignData, design => design.inverterId);
export const getInverterManufacturerName = createSelector(getDesignData, design => design.inverterManufacturerName);
export const getHasBattery = createSelector(getDesignData, design => design.batteryName !== null);

export const getPanelOptions = createSelector(getProposal, proposal => proposal.panelOptions);
export const getInverterOptions = createSelector(getProposal, proposal => proposal.inverterOptions);
export const getFullPricingBreakdown = createSelector(getProposal, proposal => proposal.pricingBreakdown);
export const getArrayData = createSelector(getDesignData, design => design.arrays);
/**
 * Utility Costs
 */

export const getUtilityCosts = createSelector(getProposal, proposal => proposal.utilityCosts);
export const getUtilityRateIncrease = createSelector(getUtilityCosts, utilityCosts => utilityCosts.rateIncrease || 0);
export const getUtilityMonthlyPayment = createSelector(
  getUtilityCosts,
  utilityCosts => parseFloat(`${utilityCosts.monthlyPayment}`) || 0
);

/**
 * Solar Costs
 */

const getSolarCostData = createSelector(getProposal, proposal => proposal.solarCosts);

export const getMonthlyBillAfterOffset = createSelector(
  [getSolarOffset, getUtilityMonthlyPayment],
  (solarOffset, monthlyUtilityPayment) => Math.max(0, ((100 - solarOffset) * monthlyUtilityPayment) / 100)
);

export const getSolarMonthlyPayment = createSelector(getSolarCostData, x => x.monthlyPayment);
export const getCalculatedSystemCost = createSelector(getSolarCostData, x => x.systemCost);
export const getGrossSystemCost = createSelector(getSolarCostData, x => x.grossSystemCost);
export const getNeedFinancedAmount = createSelector(getSolarCostData, x => x.needsFinancing);
export const getLenderDisclaimer = createSelector(getSolarCostData, x => x.lenderDisclaimer);
export const getGrossPpw = createSelector(getSolarCostData, x => x.ppwFull);
export const getNetPpw = createSelector(getSolarCostData, x => x.ppwNet);
export const getNetSystemCost = createSelector(getSolarCostData, x => x.netSystemCost);
export const getRebates = createSelector(getSolarCostData, x => x.rebates ?? []);
export const getEscalator = createSelector(getSolarCostData, x => x.escalator);

/**
 * Adders
 */

export const getAdderOptions = createSelector(getSolarCostData, solarCosts => solarCosts.adders);
export const getCustomAdder = createSelector(getSolarCostData, solarCosts => solarCosts.customAdder);
export const getSystemAddersTotal = createSelector(getSolarCostData, solarCosts => solarCosts.systemAdders);

const getActiveAdders = createSelector(getAdderOptions, adders => filter(adders, "active"));
export const getAllActiveAdders = createSelector([getActiveAdders, getCustomAdder], (activeAdders, customAdder) =>
  ([...activeAdders, customAdder] as ActiveAdders).filter(Boolean)
);

export const getHideValueAddersPriceFromCustomer = createSelector(
  getSolarCostData,
  solarCosts => solarCosts.hideAddersCustomer
);

/**
 * Discounts
 */

export const getDiscountOptions = createSelector(getSolarCostData, solarCosts => solarCosts.discounts ?? []);
export const getCustomDiscount = createSelector(getSolarCostData, solarCosts => solarCosts.customDiscount);
export const getActiveDiscountIds = createSelector(getSolarCostData, solarCosts =>
  map(solarCosts.activeDiscounts, "id").filter(Boolean)
);
const getActiveDiscounts = createSelector(
  [getDiscountOptions, getActiveDiscountIds],
  (discountOptions, activeDiscountIds) => filter(discountOptions, discount => includes(activeDiscountIds, discount.id))
);

export const getAllActiveDiscounts = createSelector(
  [getActiveDiscounts, getCustomDiscount],
  (activeDiscounts, customDiscount) => filter([...activeDiscounts, customDiscount] as ActiveDiscounts, x => !!x)
);

export const getMonthlyPaymentSchedule = createSelector(
  getSolarCostData,
  solarCosts => solarCosts.monthlyPaymentSchedule
);

export const getDiscountsTotal = createSelector(getSolarCostData, solarCosts => solarCosts.discountTotal ?? 0);
export const getCanShowSolarSavings = createSelector(getSolarCostData, solarCosts => solarCosts.canShowSolarSavings);

//
// Design Portal
//
const getDesignPortalState = (state: RootState) => state.designPortal!;

export const getArrayDataTableExpanded = createSelector(
  getDesignPortalState,
  designPortal => designPortal.arrayDataTableExpanded
);

/**
 * Rebates and Credits
 */

export const getAppliedTaxCredits = createSelector(getSolarCostData, x => x.creditsApplied ?? 0);
export const getAvailableTaxCredits = createSelector(getSolarCostData, x => x.creditsAvailable ?? 0);
export const getPaydownApplied = createSelector(getSolarCostData, x => x.paydownApplied ?? 0);
export const getPercentTaxCredits = createSelector(getSolarCostData, x => x.creditsPercent ?? 0);
export const getFederalTaxCredit = createSelector(getSolarCostData, x => x.fedTaxCredit ?? 0);

type RebateOrCredit = {
  name: string;
  value: number;
};

type GrossCostRebates = {
  name: string;
  value: number;
};

export const getAllNetRebatesAndCredits = createSelector([getFederalTaxCredit, getRebates], (federalItc, rebates) => {
  const taxCredit = 0; // TODO

  const rebatesOrCredits: RebateOrCredit[] = [];

  if (!!federalItc) {
    rebatesOrCredits.push({
      name: "Federal Tax Credit",
      value: federalItc,
    });
  }

  forEach(rebates, rebate => {
    if (!rebate.applyToNetCost) return;

    rebatesOrCredits.push({
      name: rebate.name,
      value: parseFloat(`${rebate.amount}`),
    });
  });

  if (!!taxCredit) {
    rebatesOrCredits.push({
      name: "Tax Credit *",
      value: taxCredit,
    });
  }

  return rebatesOrCredits;
});

export const getAllGrossRebatesAndCredits = createSelector(getRebates, rebates => {
  const grossCostRebates: GrossCostRebates[] = [];

  forEach(rebates, rebate => {
    if (rebate.applyToLoanAmount)
      grossCostRebates.push({
        name: rebate.name,
        value: parseFloat(`${rebate.amount}`),
      });
  });

  return grossCostRebates;
});

export const getGrossCostRebatesTotal = createSelector(getRebates, rebates => {
  let grossCostRebateAmount = map(rebates, rebate => (rebate.applyToLoanAmount ? parseFloat(`${rebate.amount}`) : 0));
  return sum(grossCostRebateAmount);
});

export const getNetRebatesAndCreditsTotal = createSelector([getFederalTaxCredit, getRebates], (federalItc, rebates) => {
  const taxCredit = 0; // TODO

  let allRebateAmounts = map(rebates, rebate => (rebate.applyToNetCost ? parseFloat(`${rebate.amount}`) : 0));
  let totalRebateAmount = sum(allRebateAmounts);
  let totalRebatesCredits = federalItc + taxCredit! + totalRebateAmount;
  return totalRebatesCredits;
});

/**
 * Lender Options
 */

const getLoanProductOptionsFromProposal = createSelector(getProposal, proposal => proposal.loanProducts);
const getLoanProductOptionsFromAPI = createSelector(getProposal, proposal => []); // todo
const getSelectedLenderRate = createSelector(getSolarCostData, solarCosts => solarCosts.lenderRate);

export const getIsLeaseOrPpa = createSelector(getSelectedLenderRate, lenderRate => !!lenderRate?.lease);
export const getIsPpa = createSelector(getSelectedLenderRate, rate => !!rate?.code.includes("PPA"));

export const getAllPossibleLenders = createSelector(
  [getLoanProductOptionsFromProposal, getLoanProductOptionsFromAPI],
  (loanProductsFromProposal, loanProductsFromApi) => {
    if (loanProductsFromProposal?.length) {
      return uniqBy(
        loanProductsFromProposal.map(product => product.lender),
        lender => lender.id
      );
    }

    return loanProductsFromApi ?? [];
  }
);

export const getLenderRateOptionsMap = createSelector(
  getLoanProductOptionsFromProposal,
  (loanProducts): Record<number, undefined | LenderRate[]> => groupBy(orderBy(loanProducts, "code"), x => x.lender.id)
);

interface CurrentLenderInfo {
  id?: number;
  name?: string;
  isCash: boolean;
}

export const getCurrentLenderInfo = createSelector(
  getSolarCostData,
  solarCosts =>
  ({
    id: solarCosts.lenderId,
    name: solarCosts.lenderName,
    isCash: solarCosts.lenderName === "Cash",
  } as CurrentLenderInfo)
);
export const getCurrentLenderRateInfo = createSelector(getSolarCostData, solarCosts => ({
  id: solarCosts.lenderRateId,
}));
export const getDownPayment = createSelector(getSolarCostData, solarCosts => solarCosts.downPayment ?? 0);
export const getLoanTermYears = createSelector(getSolarCostData, solarCosts => solarCosts.lenderRate?.term_years);
export const getSelectedLoanProductName = createSelector(getSelectedLenderRate, rate => {
  if (!rate) return "None";

  return `${rate.lender.name} - ${rate.term_years}yrs @ ${rate.apr}%`;
});
export const getLenderFootnote = createSelector(getSolarCostData, solarCosts => solarCosts.lenderFootnote);
export const getItcPercentage = createSelector(getSolarCostData, solarCosts => solarCosts.itcPercentage);

/**
 * Chart Data
 */

export const getChartData = createSelector(getProposal, proposal => proposal.chartData);

export const getCompoundingSolarRatesData = createSelector(getChartData, x => x.compoundingSolarRates);
export const getCompoundingUtilityRatesData = createSelector(getChartData, x => x.compoundingUtilityRates);
export const getFirstYearProductionData = createSelector(getChartData, x => x.solarProductionFirstYear ?? []);
export const getFirstYearConsumptionData = createSelector(getChartData, x => x.consumptionFirstYear ?? []);
export const getLocalUtilityRatesData = createSelector(getChartData, x => x.localUtilityRates);
export const getSolarRatesData = createSelector(getChartData, x => x.solarRates);
export const getUtilityWithOffsetData = createSelector(getChartData, x => x.utilityCostWithOffset ?? []);
export const getNationalUtilityRatesData = createSelector(getChartData, x => x.nationalUtilityRates);

export const getPastUtilityData = createSelector(getChartData, x => x.pastUtilityData);
export const getPast30YearUtilityRates = createSelector(getPastUtilityData, x => x.prev30YearRates);
export const getYearsInHome = createSelector(getPastUtilityData, x => x.yearsInHome || 10);

export const getCostOfDoingNothing = createSelector(getCompoundingUtilityRatesData, data => last(data) ?? 0);

/**
 * Deck
 */

const getDeckState = (state: RootState) => state.deck;

export const selectDeckFeatureFlags = createSelector(getDeckState, deck => deck.features);
export const getDeckReady = createSelector(getDeckState, deck => deck.ready);

/**
 * Feature Flags
 */

export const getShowArrayDataPopup = createSelector(
  [getHasArrayData, getIsHelioquoteDesign, getArrayData],
  (hasArrayData, isHelioquoteDesign, arrayData) => {
    return (
      hasArrayData &&
      !isHelioquoteDesign &&
      // If no arrays have production no need to show. Right now only PvWatts gets us this, but some day Aurora might as well
      arrayData?.some(array => !!array.active_panel_count && array.active_panel_production > 0)
    );
  }
);

export const getShowVoluntaryPrepaymentMessage = createSelector([getSolarCostData], solarCosts => {
  if (solarCosts.lenderName === "Mosaic") {
    if (solarCosts.monthlyPaymentSchedule?.intro.payment !== solarCosts.monthlyPayment) {
      return true;
    }

    return !solarCosts.deferredPeriod && !!solarCosts.monthlyPaymentEscalated;
  }

  return true;
});

/**
 * Deal states to notify user about
 */

export const getMissingLenderRate = createSelector([getSolarCostData], solarCosts => !solarCosts.lenderRate);

/**
 * Modals / Dialogs
 */

export const getDialogStack = (state: RootState) => state.dialogs.stack;

/**
 * Chart Derivatives
 */

const ALLOWED_LOOKAHEAD_YEARS = 20;

const getChartProportions = createSelector([getFirstYearConsumptionData], consumptionFirstYear => {
  const total = sum(consumptionFirstYear);
  return (consumptionFirstYear ?? [])?.map(month => month / total);
});

export const getMaxBillForChart = createSelector(
  [getLocalUtilityRatesData, getChartProportions],
  (utilityRates, proportions) => {
    const futureAnnualRate = utilityRates[ALLOWED_LOOKAHEAD_YEARS - 1];
    return Math.max(...proportions.map(factor => futureAnnualRate * factor));
  }
);

export const getFirstYearChartData = createSelector(
  [getLocalUtilityRatesData, getChartProportions],
  (utilityRates, proportions) => {
    const annualRate = utilityRates[0];
    return proportions.map(factor => annualRate * factor);
  }
);

export const getSelectedYearRateFactory = createSelector(
  [getLocalUtilityRatesData, getChartProportions],
  (utilityRates, proportions) => {
    return (year: number) => {
      const annualRate = utilityRates[year];
      return proportions.map(factor => annualRate * factor);
    };
  }
);

export const getCostOfSolarData = createSelector([getLoanTermYears, getSolarMonthlyPayment], (years, monthlyPayment) =>
  range(0, years ?? 0, 1).map(() => round(monthlyPayment * 12, 2))
);

/*
 * Draw Mode
 */

const getDrawState = (state: RootState) => state.drawMode;

export const getDrawBoards = createSelector([getDrawState], drawState => drawState?.boards);
export const getActiveBoard = createSelector([getDrawState], drawState => drawState?.activeBoardId);

/*
 * Content
 */

export const getFaq = createSelector([getTemplate], templateState => templateState.faq);

/*
 * Aurora
 */

const getAurora = (state: RootState) => state.aurora;

export const getIsAuroraDesign = createSelector(getProposal, proposal => proposal.design.tool === "aurora");
export const getAuroraDesignId = createSelector(getProposal, proposal => proposal.design.auroraDesignId);

// this is currently a beta/test thing for Pat to demo to partners.
export const getUseAuroraSdk = createSelector(getTemplate, template => template.companyInfo.useAuroraSdk);
export const getRepDoesAuroraDesigns = createSelector(
  getTemplate,
  template => template.companyInfo.repDoesAuroraDesigns
);
export const getHasAuroraSdkChanges = createSelector(getAurora, aurora => aurora.sdkHasChanges);

export const getShowAuroraHasChangesWarning = createSelector(
  [getUseAuroraSdk, getHasAuroraSdkChanges, getIsAuroraDesign, canUserEditProposal],
  (useAuroraSdk, hasAuroraSdkChanges, isAuroraDesgn, canEdit) =>
    useAuroraSdk && hasAuroraSdkChanges && isAuroraDesgn && canEdit
);

export const getActiveAuroraDesign = createSelector(getAurora, aurora => {
  return aurora?.designs?.find(d => d.use_with_proposal);
});

export const getActiveAuroraDesignName = createSelector(getActiveAuroraDesign, design => design?.name);
export const getAuroraReadyDesigns = createSelector(
  getAurora,
  aurora => aurora?.designs?.filter(d => d.is_ready) || []
);

export const getAuroraDesignPortalUrl = createSelector(
  getProposal,
  proposal => `/deal/design/aurora/status/${proposal.surveyId}`
);

/**
 * Proposal Comparison
 */

export const getProposalsToCompare = createSelector(getProposal, proposal => proposal.compareProposals ?? []);
