import { addClass, removeClass } from "dom-helpers";
import numeral from "numeral";
import { Adder, CustomAdder, Discount } from "../types";

export function getCookie(cname: string) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function getCompoundingAmounts(numbers: number[]) {
  let total = 0;
  let curve: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
    curve[i] = Math.round(total);
  }

  return curve;
}

export function formatDollarsAndCents(dollars?: number, defaultVal: string = "") {
  return dollars || dollars === 0 ? numeral(dollars).format("$0,0.00") : defaultVal;
}

export function formatWholeDollars(dollars?: number, defaultVal: string = "") {
  return dollars || dollars === 0 ? numeral(dollars).format("$0,0") : defaultVal;
}

export function getCostForAdder(adder: Adder | CustomAdder) {
  if (adder["costAfterFees"]) return adder["costAfterFees"];

  return adder.cost ?? 0;
}

export function formatKw(value: number): number {
  const trimmedValue = numeral(value / 1000).format("0.000");
  return numeral(trimmedValue).value() ?? 0;
}

export function toFixedNumber(num: string | number, digits: number, base = 10) {
  var pow = Math.pow(base, digits);
  return Math.round((typeof num === "string" ? parseFloat(num) : num) * pow) / pow;
}

export function getFormattedDiscountAmount(discount: Discount) {
  if (discount.fixedAmount) return numeral(discount.fixedAmount).format("$0,0.00");
  if (discount.ppwDiscount) return `${numeral(discount.ppwDiscount).format("$0,0.00")} ppw`;
  if (discount.amount) {
    if (discount.id) {
      return `${numeral(discount.amount).format("0,0.00")}%`;
    } else {
      // custom discount
      return numeral(discount.amount).format("$0.00");
    }
  }

  return "";
}

export function lockScreen({ bodyClassName }: { bodyClassName?: string } = {}) {
  if (bodyClassName) {
    addClass(document.body, bodyClassName);
  }

  document.body.setAttribute("data-prevent-swipe", "");
}

export function unlockScreen({ bodyClassName }: { bodyClassName?: string } = {}) {
  if (bodyClassName) {
    removeClass(document.body, bodyClassName);
  }

  document.body.removeAttribute("data-prevent-swipe");
}

export type ShowAdderPriceConditions = {
  isProposalLocked: boolean;
  hideAddersPriceFromCustomerEpcSetting: boolean;
  isRepOnlyView: boolean;
};

export function showAdderPrice(
  adderOrCustomAdder: Adder | CustomAdder,
  showPriceConditions: ShowAdderPriceConditions
): boolean {
  const { isProposalLocked, hideAddersPriceFromCustomerEpcSetting, isRepOnlyView } = showPriceConditions;

  // if custom adder
  if (!("id" in adderOrCustomAdder)) {
    return showCustomAdderPrice(showPriceConditions);
  }

  const adder = adderOrCustomAdder as Adder;

  // never show it under any circumstances
  if (adder.hidePriceFromRep) {
    return false;
  }

  // We can show price when the rep is editing, or looking at a non-customer facing screen
  if (isRepOnlyView || !isProposalLocked) {
    return true;
  }

  // Hide based on the normal "hide from customer" settings
  if (adder.hidePrice || hideAddersPriceFromCustomerEpcSetting) {
    return false;
  }

  return true;
}

export function showCustomAdderPrice(showPriceConditions: ShowAdderPriceConditions): boolean {
  const { isProposalLocked, hideAddersPriceFromCustomerEpcSetting, isRepOnlyView } = showPriceConditions;

  if (isRepOnlyView || !isProposalLocked) {
    return true;
  }

  if (hideAddersPriceFromCustomerEpcSetting) {
    return false;
  }

  return true;
}
