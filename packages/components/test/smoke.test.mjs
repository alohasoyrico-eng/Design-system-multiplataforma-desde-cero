import assert from "node:assert/strict";
import {
  createBadge,
  createButton,
  createCard,
  createCardSummary,
  createChartPanel,
  hydrateChartPanel,
  createCheckbox,
  createChip,
  createCombobox,
  createAccordion,
  createAuditEvent,
  createAvatar,
  createBiometricPrompt,
  createCardExpiryInput,
  createCardNumberInput,
  createCardSecurityCodeInput,
  createCountrySelector,
  createDialog,
  createDrawer,
  createIconButton,
  createBreadcrumbs,
  createEmptyState,
  createErrorPanel,
  createFloatingActionButton,
  createInlineValidation,
  createKpiTile,
  createList,
  createAnimatedMoment,
  createMovementRow,
  createMenu,
  createMotionBoundary,
  createCodeInput,
  createPagination,
  createPhoneInput,
  createPopover,
  createProgressIndicator,
  createQuickAction,
  createRadioButton,
  createRouteSummary,
  createSelect,
  createSegmentedControl,
  createSkeleton,
  createSpinner,
  createSlider,
  createStationPin,
  createStepper,
  createSwitch,
  createTable,
  createTag,
  createTabs,
  createTreeView,
  createDatePicker,
  createDateRangePicker,
  createTextArea,
  createInput,
  createToast,
  createTooltip,
  createChartsPrimitive,
  listCountryFlags,
  hydrateCardExpiryInput,
  hydrateCardNumberInput,
  hydrateCardSecurityCodeInput,
  hydrateCombobox,
  hydrateCountrySelector,
} from "../src/index.js";
import { componentContractVersion, componentContracts } from "../src/contracts.js";

class TestNode {
  constructor(tagName = "") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.alt = "";
    this.dataset = {};
    this.className = "";
    this.checked = false;
    this.disabled = false;
    this.hidden = false;
    this.id = "";
    this.href = "";
    this.indeterminate = false;
    this.maxLength = -1;
    this.max = "";
    this.min = "";
    this.name = "";
    this.required = false;
    this.rows = 0;
    this.selected = false;
    this.src = "";
    this.step = "";
    this.style = "";
    this.tabIndex = 0;
    this.textContent = "";
    this.type = "";
    this.value = "";
    this.placeholder = "";
    this.eventListeners = {};
    this.parentNode = null;
    this.offsetLeft = 0;
    this.offsetWidth = 0;
  }

  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === "string") {
        const textNode = new TestText(node);
        textNode.parentNode = this;
        this.children.push(textNode);
      } else {
        node.parentNode = this;
        this.children.push(node);
      }
    }
    this.textContent = this.children.map((node) => node.textContent ?? "").join("");
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "hidden") this.hidden = true;
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  addEventListener(type, listener) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  }

  dispatchEvent(event) {
    event.target = event.target ?? this;
    event.currentTarget = this;
    for (const listener of this.eventListeners[event.type] ?? []) listener(event);
    return !event.defaultPrevented;
  }

  click() {
    this.dispatchEvent({ type: "click" });
  }

  focus() {
    globalThis.document.activeElement = this;
  }

  contains(node) {
    if (node === this) return true;
    return this.children.some((child) => child?.contains?.(node));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (node) => {
      if (node instanceof TestText) return;
      if (selector.startsWith(".") && node.className.split(" ").includes(selector.slice(1))) {
        matches.push(node);
      } else if (!selector.startsWith(".") && node.tagName.toLowerCase() === selector.toLowerCase()) {
        matches.push(node);
      }
      for (const child of node.children) visit(child);
    };
    visit(this);
    return matches;
  }
}

class TestText {
  constructor(text) {
    this.textContent = text;
    this.parentNode = null;
  }

  contains(node) {
    return node === this;
  }
}

globalThis.document = {
  activeElement: null,
  eventListeners: {},
  addEventListener(type, listener) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  },
  dispatchEvent(event) {
    for (const listener of this.eventListeners[event.type] ?? []) listener(event);
  },
  createElement(tagName) {
    return new TestNode(tagName);
  },
  createTextNode(text) {
    return new TestText(text);
  },
};

assert.equal(componentContractVersion, "0.1.0");
assert.deepEqual(Object.keys(componentContracts), ["button", "iconButton", "input", "cardNumberInput", "cardExpiryInput", "cardSecurityCodeInput", "select", "combobox", "card", "checkbox", "switch", "radioButton", "textArea", "badge", "chip", "tag", "tabs", "tooltip", "toast", "progressIndicator", "spinner", "accordion", "slider", "avatar", "skeleton", "dialog", "menu", "drawer", "table", "biometricPrompt", "treeView", "motionBoundary", "animatedMoment", "emptyState", "list", "kpiTile", "floatingActionButton", "breadcrumbs", "pagination", "auditEvent", "errorPanel", "inlineValidation", "stepper", "chartPanel", "stationPin", "routeSummary", "codeInput", "phoneInput", "countrySelector", "datePicker", "dateRangePicker", "segmentedControl", "popover", "cardSummary", "movementRow", "quickAction"]);
assert.equal(componentContracts.button.factory, "createButton");
assert.equal(componentContracts.iconButton.factory, "createIconButton");
assert.equal(componentContracts.input.factory, "createInput");
assert.equal(componentContracts.cardNumberInput.factory, "createCardNumberInput");
assert.equal(componentContracts.cardExpiryInput.factory, "createCardExpiryInput");
assert.equal(componentContracts.cardSecurityCodeInput.factory, "createCardSecurityCodeInput");
assert.equal(componentContracts.select.factory, "createSelect");
assert.equal(componentContracts.combobox.factory, "createCombobox");
assert.equal(componentContracts.card.factory, "createCard");
assert.equal(componentContracts.checkbox.factory, "createCheckbox");
assert.equal(componentContracts.switch.factory, "createSwitch");
assert.equal(componentContracts.radioButton.factory, "createRadioButton");
assert.equal(componentContracts.textArea.factory, "createTextArea");
assert.equal(componentContracts.badge.factory, "createBadge");
assert.equal(componentContracts.chip.factory, "createChip");
assert.equal(componentContracts.tag.factory, "createTag");
assert.equal(componentContracts.tabs.factory, "createTabs");
assert.equal(componentContracts.tooltip.factory, "createTooltip");
assert.equal(componentContracts.toast.factory, "createToast");
assert.equal(componentContracts.progressIndicator.factory, "createProgressIndicator");
assert.equal(componentContracts.spinner.factory, "createSpinner");
assert.equal(componentContracts.accordion.factory, "createAccordion");
assert.equal(componentContracts.slider.factory, "createSlider");
assert.equal(componentContracts.avatar.factory, "createAvatar");
assert.equal(componentContracts.skeleton.factory, "createSkeleton");
assert.equal(componentContracts.dialog.factory, "createDialog");
assert.equal(componentContracts.menu.factory, "createMenu");
assert.equal(componentContracts.drawer.factory, "createDrawer");
assert.equal(componentContracts.table.factory, "createTable");
assert.equal(componentContracts.biometricPrompt.factory, "createBiometricPrompt");
assert.equal(componentContracts.treeView.factory, "createTreeView");
assert.equal(componentContracts.motionBoundary.factory, "createMotionBoundary");
assert.equal(componentContracts.animatedMoment.factory, "createAnimatedMoment");
assert.equal(componentContracts.emptyState.factory, "createEmptyState");
assert.equal(componentContracts.list.factory, "createList");
assert.equal(componentContracts.kpiTile.factory, "createKpiTile");
assert.equal(componentContracts.floatingActionButton.factory, "createFloatingActionButton");
assert.equal(componentContracts.breadcrumbs.factory, "createBreadcrumbs");
assert.equal(componentContracts.pagination.factory, "createPagination");
assert.equal(componentContracts.auditEvent.factory, "createAuditEvent");
assert.equal(componentContracts.errorPanel.factory, "createErrorPanel");
assert.equal(componentContracts.inlineValidation.factory, "createInlineValidation");
assert.equal(componentContracts.stepper.factory, "createStepper");
assert.equal(componentContracts.chartPanel.factory, "createChartPanel");
assert.equal(componentContracts.stationPin.factory, "createStationPin");
assert.equal(componentContracts.routeSummary.factory, "createRouteSummary");
assert.equal(componentContracts.codeInput.factory, "createCodeInput");
assert.equal(componentContracts.phoneInput.factory, "createPhoneInput");
assert.equal(componentContracts.countrySelector.factory, "createCountrySelector");
assert.equal(componentContracts.datePicker.factory, "createDatePicker");
assert.equal(componentContracts.dateRangePicker.factory, "createDateRangePicker");
assert.equal(componentContracts.segmentedControl.factory, "createSegmentedControl");
assert.equal(componentContracts.popover.factory, "createPopover");
assert.equal(componentContracts.cardSummary.factory, "createCardSummary");
assert.equal(componentContracts.movementRow.factory, "createMovementRow");
assert.equal(componentContracts.quickAction.factory, "createQuickAction");
for (const contract of Object.values(componentContracts)) {
  assert.ok(contract.purpose.length > 20);
  assert.ok(contract.props.length >= 5);
  assert.ok(contract.accessibility.length >= 3);
}

const button = createButton({ label: "Approve", icon: "check", trailingIcon: "arrow_forward", variant: "outlined", density: "sm", fullWidth: true, state: "pressed" });
assert.equal(button.tagName, "BUTTON");
assert.equal(button.type, "button");
assert.equal(button.disabled, false);
assert.equal(button.className, "button button--outlined");
assert.equal(button.dataset.density, "sm");
assert.equal(button.dataset.fullWidth, "true");
assert.equal(button.dataset.state, "pressed");
assert.equal(button.querySelector(".button__icon").attributes["aria-hidden"], "true");
assert.equal(button.querySelector(".button__icon--trailing").textContent, "arrow_forward");
assert.equal(button.querySelector(".button__label").textContent, "Approve");
const loadingButton = createButton({ label: "Saving", loading: true });
assert.equal(loadingButton.disabled, true);
assert.equal(loadingButton.attributes["aria-busy"], "true");
assert.equal(loadingButton.querySelector(".spinner").attributes["aria-hidden"], "true");
assert.equal(loadingButton.querySelector(".button__label").textContent, "Saving");

const iconButton = createIconButton({ ariaLabel: "Open filters", icon: "tune", variant: "tonal", density: "sm", selected: true, badge: true });
assert.equal(iconButton.tagName, "BUTTON");
assert.equal(iconButton.className, "icon-button icon-button--tonal");
assert.equal(iconButton.attributes["aria-label"], "Open filters");
assert.equal(iconButton.attributes["aria-pressed"], "true");
assert.equal(iconButton.dataset.density, "sm");
assert.equal(iconButton.querySelector(".icon-button__icon").attributes["aria-hidden"], "true");
assert.equal(iconButton.querySelector(".icon-button__badge").attributes["aria-hidden"], "true");

const input = createInput({
  label: "Driver",
  helper: "Search by name or vehicle",
  name: "driver",
  placeholder: "Alex Rivera",
  value: "Alex",
  density: "sm",
  icon: "badge",
  suffix: "ID",
  mono: true,
});
assert.equal(input.tagName, "LABEL");
assert.equal(input.dataset.state, "filled");
assert.equal(input.dataset.density, "sm");
assert.equal(input.dataset.mono, "true");
assert.equal(input.querySelector(".field__label").textContent, "Driver");
assert.equal(input.querySelector(".field__helper").textContent, "Search by name or vehicle");
assert.equal(input.querySelector(".field__icon").attributes["aria-hidden"], "true");
assert.equal(input.querySelector(".field__suffix").attributes["aria-hidden"], "true");
assert.equal(input.querySelector(".field__suffix").textContent, "ID");
assert.equal(input.querySelector("input").className, "input");
assert.equal(input.querySelector("input").placeholder, "Alex Rivera");
assert.equal(input.querySelector("input").value, "Alex");
assert.equal(input.querySelector("input").attributes["aria-describedby"], input.querySelector(".field__helper").id);

const inputError = createInput({ label: "Plate", value: "ABC", error: "Use format ABC-123" });
assert.equal(inputError.dataset.state, "error");
assert.equal(inputError.querySelector("input").attributes["aria-invalid"], "true");
assert.equal(inputError.querySelector(".field__helper").textContent, "Use format ABC-123");
assert.equal(inputError.querySelector(".field__helper").attributes.role, "alert");

const emailInput = createInput({ label: "Fleet admin email", value: "ops@fleet.mx", variant: "email" });
assert.equal(emailInput.dataset.variant, "email");
assert.equal(emailInput.querySelector("input").type, "email");
assert.equal(emailInput.querySelector("input").attributes.autocomplete, "email");
assert.equal(emailInput.querySelector("input").attributes.inputmode, "email");

const currencyInput = createInput({ label: "Monthly limit", value: "2400.00", variant: "currency", prefix: "$", suffix: "MXN", mono: true });
assert.equal(currencyInput.dataset.variant, "currency");
assert.equal(currencyInput.dataset.align, "end");
assert.equal(currencyInput.dataset.mono, "true");
assert.equal(currencyInput.querySelector(".field__prefix").textContent, "$");
assert.equal(currencyInput.querySelector(".field__suffix").textContent, "MXN");
assert.equal(currencyInput.querySelector("input").value, "2,400.00");
assert.equal(currencyInput.querySelector("input").attributes.inputmode, "decimal");

let currencyChangeMeta = null;
const interactiveCurrencyInput = createInput({
  label: "Monthly limit",
  variant: "currency",
  onValueChange: (value, meta) => {
    currencyChangeMeta = { value, meta };
  },
});
interactiveCurrencyInput.querySelector("input").value = "2,950.50";
interactiveCurrencyInput.querySelector("input").dispatchEvent({ type: "input" });
assert.deepEqual(currencyChangeMeta, {
  value: "2950.50",
  meta: {
    value: "2950.50",
    displayValue: "2,950.50",
    rawValue: "2,950.50",
    numericValue: 2950.5,
  },
});

const passwordInput = createInput({ label: "Password", value: "Miel2026!", variant: "password" });
const passwordField = passwordInput.querySelector("input");
const revealButton = passwordInput.querySelector(".field-action");
assert.equal(passwordField.type, "password");
assert.equal(revealButton.dataset.fieldAction, "reveal");
assert.equal(revealButton.attributes["aria-label"], "Show value");
revealButton.click();
assert.equal(passwordField.type, "text");
assert.equal(revealButton.attributes["aria-label"], "Hide value");
assert.equal(revealButton.attributes["aria-pressed"], "true");
revealButton.click();
assert.equal(passwordField.type, "password");
assert.equal(revealButton.attributes["aria-pressed"], "false");

let cardNumberMeta = null;
const cardNumberInput = createCardNumberInput({
  label: "Card number",
  value: "4111111111111111",
  helper: "Use the number printed on the front of the card.",
  onValueChange: (digits, meta) => { cardNumberMeta = { digits, meta }; },
});
const cardField = cardNumberInput.querySelector("input");
const cardBrand = cardNumberInput.querySelector(".card-number-input__brand");
assert.equal(cardNumberInput.className, "field card-number-input");
assert.equal(cardNumberInput.dataset.state, "valid");
assert.equal(cardNumberInput.dataset.validity, "valid");
assert.equal(cardNumberInput.dataset.brand, "Visa");
assert.equal(cardNumberInput.dataset.mono, "true");
assert.equal(cardField.value, "4111 1111 1111 1111");
assert.equal(cardField.attributes.inputmode, "numeric");
assert.equal(cardField.attributes.autocomplete, "cc-number");
assert.equal(cardField.attributes.pattern, "[0-9 ]*");
assert.equal(cardField.attributes.enterkeyhint, "next");
assert.equal(cardField.attributes["aria-labelledby"], cardNumberInput.querySelector(".field__label").id);
assert.equal(cardField.attributes["aria-describedby"], cardNumberInput.querySelector(".field__helper").id);
assert.equal(cardBrand.textContent, "Visa");
assert.equal(cardBrand.hidden, false);
assert.equal(cardNumberMeta.digits, "4111111111111111");
assert.equal(cardNumberMeta.meta.luhnValid, true);

cardField.value = "4111111111111112";
cardField.dispatchEvent({ type: "input" });
assert.equal(cardNumberInput.dataset.validity, "invalid");
assert.equal(cardNumberInput.dataset.state, "error");
assert.equal(cardField.attributes["aria-invalid"], "true");
assert.equal(cardNumberInput.querySelector(".field__helper").textContent, "Check the card number.");
assert.equal(cardNumberInput.querySelector(".field__helper").attributes.role, "alert");

cardField.value = "5555555555554444";
cardField.dispatchEvent({ type: "input" });
assert.equal(cardNumberInput.dataset.validity, "valid");
assert.equal(cardNumberInput.dataset.state, "valid");
assert.equal(cardNumberInput.dataset.brand, "Mastercard");
assert.equal(cardBrand.textContent, "Mastercard");
assert.equal(cardNumberInput.querySelector(".field__helper").textContent, "Use the number printed on the front of the card.");
assert.equal(cardNumberInput.querySelector(".field__helper").attributes.role, undefined);

hydrateCardNumberInput(cardNumberInput);
assert.equal(cardNumberInput.dataset.cardNumberHydrated, "true");

let cardExpiryMeta = null;
const cardExpiryInput = createCardExpiryInput({
  label: "Expiry date",
  value: "1228",
  helper: "Use the expiry printed on the card.",
  onValueChange: (value, meta) => { cardExpiryMeta = { value, meta }; },
});
const expiryField = cardExpiryInput.querySelector("input");
assert.equal(cardExpiryInput.className, "field card-expiry-input");
assert.equal(cardExpiryInput.dataset.state, "valid");
assert.equal(cardExpiryInput.dataset.validity, "valid");
assert.equal(cardExpiryInput.dataset.mono, "true");
assert.equal(expiryField.value, "12/28");
assert.equal(expiryField.attributes.inputmode, "numeric");
assert.equal(expiryField.attributes.autocomplete, "cc-exp");
assert.equal(expiryField.attributes.pattern, "[0-9/ ]*");
assert.equal(expiryField.attributes.enterkeyhint, "next");
assert.equal(expiryField.attributes.maxlength, "5");
assert.equal(expiryField.maxLength, 5);
assert.equal(expiryField.attributes["aria-labelledby"], cardExpiryInput.querySelector(".field__label").id);
assert.equal(expiryField.attributes["aria-describedby"], cardExpiryInput.querySelector(".field__helper").id);
assert.equal(cardExpiryMeta.value, "12/28");
assert.equal(cardExpiryMeta.meta.month, "12");
assert.equal(cardExpiryMeta.meta.year, "28");
assert.equal(cardExpiryMeta.meta.expired, false);

expiryField.value = "1328";
expiryField.dispatchEvent({ type: "input" });
assert.equal(expiryField.value, "13/28");
assert.equal(cardExpiryInput.dataset.validity, "invalid");
assert.equal(cardExpiryInput.dataset.state, "error");
assert.equal(expiryField.attributes["aria-invalid"], "true");
assert.equal(cardExpiryInput.querySelector(".field__helper").textContent, "Check the expiry date.");
assert.equal(cardExpiryInput.querySelector(".field__helper").attributes.role, "alert");

expiryField.value = "0125";
expiryField.dispatchEvent({ type: "input" });
assert.equal(expiryField.value, "01/25");
assert.equal(cardExpiryInput.dataset.validity, "expired");
assert.equal(cardExpiryInput.dataset.state, "error");
assert.equal(cardExpiryInput.querySelector(".field__helper").textContent, "Use a card that has not expired.");

expiryField.value = "0329";
expiryField.dispatchEvent({ type: "input" });
assert.equal(expiryField.value, "03/29");
assert.equal(cardExpiryInput.dataset.validity, "valid");
assert.equal(cardExpiryInput.dataset.state, "valid");
assert.equal(expiryField.attributes["aria-invalid"], undefined);
assert.equal(cardExpiryInput.querySelector(".field__helper").textContent, "Use the expiry printed on the card.");
assert.equal(cardExpiryInput.querySelector(".field__helper").attributes.role, undefined);

hydrateCardExpiryInput(cardExpiryInput);
assert.equal(cardExpiryInput.dataset.cardExpiryHydrated, "true");

let cardSecurityCodeMeta = null;
const cardSecurityCodeInput = createCardSecurityCodeInput({
  label: "Security code",
  value: "48a2",
  helper: "Use the code printed on the card.",
  onValueChange: (digits, meta) => { cardSecurityCodeMeta = { digits, meta }; },
});
const securityCodeField = cardSecurityCodeInput.querySelector("input");
const securityCodeReveal = cardSecurityCodeInput.querySelector("button");
assert.equal(cardSecurityCodeInput.className, "field card-security-code-input");
assert.equal(cardSecurityCodeInput.dataset.state, "valid");
assert.equal(cardSecurityCodeInput.dataset.validity, "valid");
assert.equal(cardSecurityCodeInput.dataset.mono, "true");
assert.equal(cardSecurityCodeInput.dataset.expectedLength, "3");
assert.equal(cardSecurityCodeInput.querySelector(".card-security-code-input__icon").textContent, "pin");
assert.equal(securityCodeField.value, "482");
assert.equal(securityCodeField.type, "password");
assert.equal(securityCodeField.attributes.inputmode, "numeric");
assert.equal(securityCodeField.attributes.autocomplete, "cc-csc");
assert.equal(securityCodeField.attributes.maxlength, "3");
assert.equal(securityCodeField.attributes.pattern, "[0-9]*");
assert.equal(securityCodeField.attributes.enterkeyhint, "next");
assert.equal(securityCodeField.attributes["aria-labelledby"], cardSecurityCodeInput.querySelector(".field__label").id);
assert.equal(securityCodeField.attributes["aria-describedby"], cardSecurityCodeInput.querySelector(".field__helper").id);
assert.equal(cardSecurityCodeMeta.digits, "482");
assert.equal(cardSecurityCodeMeta.meta.complete, true);
assert.equal(cardSecurityCodeMeta.meta.expectedLength, 3);
assert.equal(securityCodeReveal.className, "field-action card-security-code-input__action");
assert.equal(securityCodeReveal.dataset.fieldAction, "reveal");
assert.equal(securityCodeReveal.querySelector(".field-action__icon").className, "field-action__icon field__icon card-security-code-input__action-icon");
assert.equal(securityCodeReveal.attributes["aria-label"], "Show security code");
assert.equal(securityCodeReveal.attributes["aria-pressed"], "false");
securityCodeReveal.click();
assert.equal(securityCodeField.type, "text");
assert.equal(securityCodeReveal.querySelector(".field-action__icon").textContent, "visibility_off");
assert.equal(securityCodeReveal.attributes["aria-label"], "Hide security code");
assert.equal(securityCodeReveal.attributes["aria-pressed"], "true");

securityCodeField.value = "12";
securityCodeField.dispatchEvent({ type: "input" });
assert.equal(cardSecurityCodeInput.dataset.validity, "incomplete");
assert.equal(cardSecurityCodeInput.dataset.state, "filled");

securityCodeField.value = "482";
securityCodeField.dispatchEvent({ type: "input" });
assert.equal(cardSecurityCodeInput.dataset.validity, "valid");
assert.equal(cardSecurityCodeInput.dataset.state, "valid");
assert.equal(securityCodeField.attributes["aria-invalid"], undefined);
assert.equal(cardSecurityCodeInput.querySelector(".field__helper").attributes.role, undefined);

const controlledSecurityCodeError = createCardSecurityCodeInput({
  label: "Security code",
  value: "12",
  state: "error",
});
assert.equal(controlledSecurityCodeError.dataset.state, "error");
assert.equal(controlledSecurityCodeError.querySelector("input").attributes["aria-invalid"], "true");
assert.equal(controlledSecurityCodeError.querySelector(".field__helper").textContent, "Enter the security code.");
assert.equal(controlledSecurityCodeError.querySelector(".field__helper").attributes.role, "alert");

const fourDigitSecurityCode = createCardSecurityCodeInput({
  label: "Security code",
  value: "1234",
  expectedLength: 4,
});
assert.equal(fourDigitSecurityCode.dataset.expectedLength, "4");
assert.equal(fourDigitSecurityCode.dataset.validity, "valid");
assert.equal(fourDigitSecurityCode.querySelector("input").attributes.maxlength, "4");

const disabledSecurityCode = createCardSecurityCodeInput({ label: "Security code", value: "482", state: "disabled" });
assert.equal(disabledSecurityCode.dataset.state, "disabled");
assert.equal(disabledSecurityCode.querySelector("input").disabled, true);
assert.equal(disabledSecurityCode.querySelector("button").disabled, true);

const loadingSecurityCode = createCardSecurityCodeInput({ label: "Security code", value: "482", state: "loading" });
assert.equal(loadingSecurityCode.dataset.state, "loading");
assert.equal(loadingSecurityCode.querySelector("input").disabled, true);
assert.equal(loadingSecurityCode.querySelector(".field__icon--loading").className.includes("spinner"), true);
assert.equal(loadingSecurityCode.querySelector(".field__icon--loading").attributes["aria-hidden"], "true");
assert.equal(securityCodeField.attributes["aria-invalid"], undefined);

hydrateCardSecurityCodeInput(cardSecurityCodeInput);
assert.equal(cardSecurityCodeInput.dataset.cardSecurityCodeHydrated, "true");

const select = createSelect({
  label: "Fleet",
  helper: "Choose a fleet",
  icon: "local_taxi",
  name: "fleet",
  value: "north",
  density: "sm",
  state: "focus",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
  ],
});
assert.equal(select.tagName, "LABEL");
assert.equal(select.className, "field");
assert.equal(select.dataset.density, "sm");
assert.equal(select.dataset.state, "focus");
assert.equal(select.querySelector(".field__label").textContent, "Fleet");
assert.equal(select.querySelector(".field__helper").textContent, "Choose a fleet");
assert.equal(select.querySelector(".select-control").className, "select-control");
assert.equal(select.querySelector(".select-control").dataset.state, "focus");
assert.equal(select.querySelector(".select-control").dataset.density, "sm");
assert.equal(select.querySelector(".select-control__icon").textContent, "local_taxi");
assert.equal(select.querySelector(".select-control__icon").attributes["aria-hidden"], "true");
assert.equal(select.querySelector(".select-control__trigger").attributes.role, "combobox");
assert.equal(select.querySelector(".select-control__trigger").attributes["aria-expanded"], "false");
assert.equal(select.querySelector(".select-control__trigger").attributes["aria-activedescendant"], select.querySelectorAll(".select-control__option")[0].id);
assert.equal(select.querySelector(".select-control__trigger").textContent, "local_taxiNorthexpand_more");
assert.equal(select.querySelector("input").type, "hidden");
assert.equal(select.querySelector("input").name, "fleet");
assert.equal(select.querySelector("input").value, "north");
assert.equal(select.querySelectorAll(".select-control__option").length, 2);
assert.equal(select.querySelectorAll(".select-control__option")[0].dataset.selected, "true");
assert.equal(select.querySelectorAll(".select-control__option")[1].dataset.disabled, "true");
const inlineSelect = createSelect({
  label: "Country code",
  variant: "inline",
  value: "MX",
  options: [
    { label: "Mexico", value: "MX", meta: "+52" },
    { label: "Cuba", value: "CU", meta: "+53" },
  ],
});
assert.equal(inlineSelect.querySelector(".select-control").className, "select-control select-control--inline");
assert.equal(inlineSelect.querySelector(".select-control__trigger").attributes.role, "combobox");
assert.equal(inlineSelect.querySelector(".select-control__trigger").textContent, "Mexico+52expand_more");
assert.equal(inlineSelect.querySelectorAll(".select-control__option").length, 2);
assert.equal(inlineSelect.querySelector(".select-control__option").dataset.selected, "true");
let selectChange = null;
const interactiveSelect = createSelect({
  label: "Fleet",
  value: "north",
  onValueChange(value, meta) {
    selectChange = { value, meta };
  },
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
    { label: "West", value: "west", meta: "3" },
  ],
});
const interactiveSelectControl = interactiveSelect.querySelector(".select-control");
const interactiveSelectTrigger = interactiveSelect.querySelector(".select-control__trigger");
const interactiveSelectOptions = interactiveSelect.querySelectorAll(".select-control__option");
interactiveSelectTrigger.dispatchEvent({ type: "keydown", key: "ArrowDown", preventDefault() {} });
assert.equal(interactiveSelectControl.dataset.open, "true");
interactiveSelectOptions[0].dispatchEvent({ type: "keydown", key: "ArrowDown", preventDefault() {} });
assert.equal(interactiveSelectTrigger.attributes["aria-activedescendant"], interactiveSelectOptions[2].id);
interactiveSelectOptions[2].dispatchEvent({ type: "keydown", key: "Enter", preventDefault() {} });
assert.equal(interactiveSelect.querySelector(".select-control__value").textContent, "West");
assert.equal(selectChange.value, "west");
assert.equal(selectChange.meta.meta, "3");

let comboboxChange = null;
const combobox = createCombobox({
  label: "Vehicle",
  helper: "Search by plate or driver",
  value: "mx-4821",
  name: "vehicle",
  onValueChange(value, meta) {
    comboboxChange = { value, meta };
  },
  options: [
    { label: "MX-4821 - Ana Gomez", value: "mx-4821", meta: "Driver" },
    { label: "MX-8840 - Luis Perez", value: "mx-8840", meta: "Vehicle" },
    { label: "North Region Fleet", value: "north-region", meta: "Fleet" },
  ],
});
assert.equal(combobox.tagName, "LABEL");
assert.equal(combobox.className, "field");
assert.equal(combobox.querySelector(".field__label").textContent, "Vehicle");
assert.equal(combobox.querySelector(".field__helper").textContent, "Search by plate or driver");
assert.equal(combobox.querySelector(".combobox").dataset.value, "mx-4821");
assert.equal(combobox.querySelector(".combobox__input").attributes.role, "combobox");
assert.equal(combobox.querySelector(".combobox__input").attributes["aria-autocomplete"], "list");
assert.equal(combobox.querySelector(".combobox__input").attributes["aria-expanded"], "false");
assert.equal(combobox.querySelector(".combobox__input").attributes["aria-controls"], combobox.querySelector(".combobox__listbox").id);
assert.equal(combobox.querySelectorAll(".combobox__option").length, 3);
assert.equal(combobox.querySelector(".combobox__option").dataset.selected, "true");
const comboboxInput = combobox.querySelector(".combobox__input");
const comboboxControl = combobox.querySelector(".combobox");
comboboxInput.value = "Luis";
comboboxInput.dispatchEvent({ type: "input" });
assert.equal(comboboxControl.dataset.open, "true");
assert.equal(combobox.querySelectorAll(".combobox__option")[0].hidden, true);
assert.equal(combobox.querySelectorAll(".combobox__option")[1].hidden, false);
comboboxInput.dispatchEvent({ type: "keydown", key: "Enter", preventDefault() {} });
assert.equal(comboboxInput.value, "MX-8840 - Luis Perez");
assert.equal(comboboxChange.value, "mx-8840");
combobox.querySelector(".combobox__clear").dispatchEvent({ type: "click" });
assert.equal(comboboxInput.value, "");
assert.equal(comboboxControl.dataset.value, "");
hydrateCombobox(combobox);
assert.equal(combobox.querySelector(".combobox").__comboboxHydrated, true);

let selectedCountryMeta = null;
const countrySelector = createCountrySelector({
  label: "Country",
  value: "MX",
  onValueChange: (countryCode, meta) => { selectedCountryMeta = { countryCode, meta }; },
});
assert.equal(countrySelector.className, "select-control country-selector");
assert.equal(countrySelector.dataset.country, "MX");
assert.equal(countrySelector.querySelector(".country-selector__trigger").attributes.role, "combobox");
assert.equal(countrySelector.querySelector(".country-selector__trigger").attributes["aria-expanded"], "false");
assert.equal(countrySelector.querySelector(".country-selector__label").textContent, "Mexico");
assert.equal(countrySelector.querySelector(".country-selector__code").textContent, "+52");
assert.equal(countrySelector.querySelectorAll(".country-selector__option").length, 10);
assert.equal(countrySelector.querySelector(".country-selector__option-check").textContent, "check");
countrySelector.querySelector(".country-selector__trigger").click();
assert.equal(countrySelector.dataset.open, "true");
countrySelector.querySelector(".country-selector__search-input").value = "zzzz";
countrySelector.querySelector(".country-selector__search-input").dispatchEvent({ type: "input" });
assert.equal(countrySelector.querySelector(".country-selector__empty").hidden, false);
const cubaCountryOption = countrySelector.querySelectorAll(".country-selector__option")[9];
cubaCountryOption.dispatchEvent({ type: "keydown", key: "Enter", preventDefault() { this.defaultPrevented = true; } });
assert.equal(countrySelector.dataset.country, "CU");
assert.equal(countrySelector.dataset.value, "CU");
assert.equal(countrySelector.querySelector(".country-selector__label").textContent, "Cuba");
assert.equal(countrySelector.querySelector(".country-selector__code").textContent, "+53");
assert.equal(selectedCountryMeta.countryCode, "CU");
assert.equal(selectedCountryMeta.meta.callingCode, "+53");
hydrateCountrySelector(countrySelector);
assert.equal(countrySelector.__countrySelectorHydrated, true);

let localizedPhoneMeta = null;
const localizedPhoneInput = createPhoneInput({
  label: "Mobile phone",
  country: "MX",
  value: "5518429011",
  helper: "Used for OTP and support recovery.",
  onValueChange: (digits, meta) => { localizedPhoneMeta = { digits, meta }; },
});
const localizedPhoneField = localizedPhoneInput.querySelector(".phone-input__input");
const localizedPhoneTrigger = localizedPhoneInput.querySelector(".phone-input__country-trigger");
const localizedPhoneListbox = localizedPhoneInput.querySelector(".phone-input__country-listbox");
const localizedPhoneOptions = localizedPhoneInput.querySelectorAll(".phone-input__country-option");
assert.equal(localizedPhoneInput.className, "field phone-input");
assert.equal(localizedPhoneInput.dataset.state, "default");
assert.equal(localizedPhoneField.type, "tel");
assert.equal(localizedPhoneField.attributes.inputmode, "tel");
assert.equal(localizedPhoneField.attributes.autocomplete, "tel-national");
assert.equal(localizedPhoneField.attributes["aria-labelledby"], `${localizedPhoneField.id}-label`);
assert.equal(localizedPhoneField.attributes["aria-describedby"], localizedPhoneInput.querySelector(".field__helper").id);
assert.equal(localizedPhoneField.value, "55 1842 9011");
assert.equal(localizedPhoneTrigger.attributes.role, "combobox");
assert.equal(localizedPhoneTrigger.attributes["aria-expanded"], "false");
assert.equal(localizedPhoneTrigger.attributes["aria-controls"], localizedPhoneListbox.id);
assert.equal(localizedPhoneTrigger.attributes["aria-label"], "Mobile phone country code, Mexico +52");
assert.equal(localizedPhoneOptions.length, 10);
assert.equal(localizedPhoneOptions[4].dataset.countryCode, "MX");
assert.equal(localizedPhoneOptions[4].dataset.selected, "true");
localizedPhoneTrigger.click();
assert.equal(localizedPhoneInput.querySelector(".phone-input__country").dataset.open, "true");
assert.equal(localizedPhoneTrigger.attributes["aria-expanded"], "true");
assert.equal(localizedPhoneTrigger.attributes["aria-activedescendant"], localizedPhoneOptions[4].id);
localizedPhoneOptions[9].dispatchEvent({ type: "keydown", key: "Enter", preventDefault() { this.defaultPrevented = true; } });
assert.equal(localizedPhoneInput.querySelector(".phone-input__country").dataset.country, "CU");
assert.equal(localizedPhoneInput.querySelector(".phone-input__prefix").textContent, "+53");
assert.equal(localizedPhoneField.value, "55 1842 90");
assert.equal(localizedPhoneMeta.digits, "55184290");
assert.equal(localizedPhoneMeta.meta.e164, "+5355184290");
localizedPhoneField.value = "+52 55 5123 4567";
localizedPhoneField.dispatchEvent({ type: "input" });
assert.equal(localizedPhoneInput.querySelector(".phone-input__country").dataset.country, "MX");
assert.equal(localizedPhoneInput.querySelector(".phone-input__prefix").textContent, "+52");
assert.equal(localizedPhoneField.value, "55 5123 4567");

const card = createCard({
  title: "Fleet spend",
  value: "$42,800",
  detail: "Above threshold",
  status: "Review",
  icon: "monitoring",
  variant: "elevated",
  state: "selected",
  density: "sm",
  fullWidth: true,
  actions: [{ label: "Open" }, { label: "Export", variant: "secondary" }],
});
assert.equal(card.tagName, "ARTICLE");
assert.equal(card.className, "card");
assert.equal(card.dataset.variant, "elevated");
assert.equal(card.dataset.state, "selected");
assert.equal(card.dataset.density, "sm");
assert.equal(card.dataset.fullWidth, "true");
assert.equal(card.dataset.interactive, "false");
assert.equal(card.querySelector(".card__icon").textContent, "monitoring");
assert.equal(card.querySelector(".card__title").textContent, "Fleet spend");
assert.equal(card.querySelector(".card__value").textContent, "$42,800");
assert.equal(card.querySelector(".card__status").textContent, "Review");
assert.equal(card.querySelectorAll("button").length, 2);

const iconActionCard = createCard({
  title: "Vehicle",
  actions: [{ ariaLabel: "Edit vehicle", icon: "edit", iconOnly: true }],
});
assert.equal(iconActionCard.querySelector(".icon-button").dataset.density, "md");
assert.equal(iconActionCard.querySelector(".icon-button__icon").textContent, "edit");
assert.equal(iconActionCard.dataset.interactive, "false");

let cardActionCount = 0;
const interactiveCard = createCard({ title: "Station detail", interactive: true, onAction: () => { cardActionCount += 1; } });
assert.equal(interactiveCard.dataset.interactive, "true");
assert.equal(interactiveCard.dataset.variant, "default");
assert.equal(interactiveCard.getAttribute("role"), "button");
interactiveCard.dispatchEvent({ type: "click" });
interactiveCard.dispatchEvent({ type: "keydown", key: "Enter", preventDefault() {} });
assert.equal(cardActionCount, 2);

const loadingCard = createCard({ title: "Fleet spend", state: "loading" });
assert.equal(loadingCard.getAttribute("aria-busy"), "true");
assert.equal(loadingCard.querySelector(".spinner").dataset.density, "sm");

const compactCard = createCard({ title: "Tarjeta ****4102", status: "Activa", composition: "compact", density: "sm" });
assert.equal(compactCard.dataset.composition, "compact");

const mediaCard = createCard({ title: "Programa", detail: "Beneficios de viaje", composition: "media", media: "/media/card.jpg", mediaAlt: "Driver benefits" });
assert.equal(mediaCard.dataset.composition, "media");
assert.equal(mediaCard.querySelector(".card__media").getAttribute("alt"), "Driver benefits");
assert.equal(mediaCard.children[0].className, "card__media");
assert.equal(mediaCard.children[1].className, "card__body");
assert.equal(mediaCard.querySelector(".card__body").querySelector(".card__title").textContent, "Programa");

const statsCard = createCard({ title: "Ingresos del mes", value: "2,450", unit: "$", status: "+12.5%", trend: "up", composition: "stats" });
assert.equal(statsCard.dataset.composition, "stats");
assert.equal(statsCard.querySelector(".card__title").textContent, "Ingresos del mes");
assert.equal(statsCard.querySelector(".card__value").textContent, "$2,450");
assert.equal(statsCard.querySelector(".card__status").dataset.trend, "up");

const checkbox = createCheckbox({
  label: "Send receipt",
  description: "Email copy to driver",
  checked: true,
  name: "receipt",
});
assert.equal(checkbox.tagName, "LABEL");
assert.equal(checkbox.className, "choice checkbox");
assert.equal(checkbox.dataset.checked, "true");
assert.equal(checkbox.querySelector("input").type, "checkbox");
assert.equal(checkbox.querySelector("input").checked, true);
assert.equal(checkbox.querySelector("input").name, "receipt");
assert.equal(checkbox.querySelector(".choice__label").textContent, "Send receipt");
assert.equal(checkbox.querySelector(".choice__description").textContent, "Email copy to driver");

const switchControl = createSwitch({
  label: "Route alerts",
  description: "Notify before balance changes",
  checked: true,
});
assert.equal(switchControl.tagName, "LABEL");
assert.equal(switchControl.className, "switch");
assert.equal(switchControl.querySelector("input").attributes.role, "switch");
assert.equal(switchControl.querySelector("input").attributes["aria-checked"], "true");
assert.equal(switchControl.querySelector(".switch__label").textContent, "Route alerts");

const radioButton = createRadioButton({
  label: "Weekly",
  description: "Best for operations review",
  checked: true,
  name: "cadence",
  value: "weekly",
});
assert.equal(radioButton.tagName, "LABEL");
assert.equal(radioButton.className, "choice radio");
assert.equal(radioButton.querySelector("input").type, "radio");
assert.equal(radioButton.querySelector("input").name, "cadence");
assert.equal(radioButton.querySelector("input").value, "weekly");
assert.equal(radioButton.querySelector("input").checked, true);

const textArea = createTextArea({
  label: "Driver notes",
  helper: "Visible to support",
  value: "Needs receipt",
  rows: 4,
  maxLength: 120,
  density: "lg",
  state: "filled",
});
assert.equal(textArea.tagName, "LABEL");
assert.equal(textArea.dataset.density, "lg");
assert.equal(textArea.dataset.state, "filled");
assert.equal(textArea.querySelector("textarea").className, "text-area");
assert.equal(textArea.querySelector("textarea").rows, 4);
assert.equal(textArea.querySelector("textarea").maxLength, 120);
assert.equal(textArea.querySelector("textarea").value, "Needs receipt");
assert.equal(textArea.querySelector(".text-area__surface").dataset.hasCounter, "true");
assert.ok(textArea.querySelector(".text-area__surface").contains(textArea.querySelector(".text-area__counter")));
assert.equal(textArea.querySelector("textarea").attributes["aria-describedby"], `${textArea.querySelector(".field__helper").id} ${textArea.querySelector(".text-area__counter").id}`);
assert.equal(textArea.querySelector(".text-area__counter").textContent, "13/120");

let textAreaChangeValue = "";
const interactiveTextArea = createTextArea({
  label: "Support note",
  value: "",
  maxLength: 40,
  onChange: (nextValue) => {
    textAreaChangeValue = nextValue;
  },
});
interactiveTextArea.querySelector("textarea").value = "Receipt pending.";
interactiveTextArea.querySelector("textarea").dispatchEvent({ type: "input" });
assert.equal(textAreaChangeValue, "Receipt pending.");
assert.equal(interactiveTextArea.querySelector(".text-area__counter").textContent, "16/40");

const textAreaError = createTextArea({ label: "Policy exception", value: "Ok", error: "Use at least 20 characters." });
assert.equal(textAreaError.dataset.state, "error");
assert.equal(textAreaError.querySelector("textarea").attributes["aria-invalid"], "true");
assert.equal(textAreaError.querySelector(".field__helper").textContent, "Use at least 20 characters.");

const badge = createBadge({ label: "3", variant: "count", tone: "danger", live: true, ariaLabel: "3 alerts" });
assert.equal(badge.tagName, "SPAN");
assert.equal(badge.className, "badge");
assert.equal(badge.dataset.variant, "count");
assert.equal(badge.dataset.tone, "danger");
assert.equal(badge.dataset.state, "default");
assert.equal(badge.attributes.role, "status");
assert.equal(badge.attributes["aria-live"], "polite");
assert.equal(badge.attributes["aria-label"], "3 alerts");
assert.equal(badge.dataset.live, "true");
assert.equal(badge.querySelector(".badge__live").attributes["aria-hidden"], "true");
assert.equal(badge.querySelector(".badge__label").textContent, "3");
assert.equal(badge.textContent, "3");
const iconBadge = createBadge({ label: "!", variant: "icon", tone: "warning", icon: "priority_high", state: "focus" });
assert.equal(iconBadge.dataset.variant, "icon");
assert.equal(iconBadge.dataset.tone, "warning");
assert.equal(iconBadge.dataset.state, "focus");
assert.equal(iconBadge.querySelector(".badge__icon").textContent, "priority_high");
assert.equal(iconBadge.querySelector(".badge__icon").attributes["aria-hidden"], "true");
const dotBadge = createBadge({ label: "Unread", variant: "dot", ariaLabel: "Unread updates" });
assert.equal(dotBadge.dataset.variant, "dot");
assert.equal(dotBadge.attributes["aria-label"], "Unread updates");
assert.equal(dotBadge.querySelector(".badge__label").textContent, "");
const hiddenBadge = createBadge({ label: "0", hidden: true });
assert.equal(hiddenBadge.hidden, true);
assert.equal(hiddenBadge.dataset.state, "hidden");
const disabledBadge = createBadge({ label: "4", state: "disabled" });
assert.equal(disabledBadge.attributes["aria-disabled"], "true");

const chip = createChip({ label: "Active", variant: "filter", tone: "warning", state: "selected", selected: true, removable: true, icon: "filter_alt" });
assert.equal(chip.tagName, "BUTTON");
assert.equal(chip.className, "chip");
assert.equal(chip.dataset.variant, "filter");
assert.equal(chip.dataset.tone, "warning");
assert.equal(chip.dataset.state, "selected");
assert.equal(chip.dataset.selected, "true");
assert.equal(chip.attributes["aria-pressed"], "true");
assert.equal(chip.attributes["aria-label"], "Remove Active");
assert.equal(chip.querySelector(".chip__icon").attributes["aria-hidden"], "true");
assert.equal(chip.querySelector(".chip__remove").textContent, "close");
const assistChip = createChip({ label: "Export ready", variant: "assist", interactive: true, state: "focus" });
assert.equal(assistChip.tagName, "BUTTON");
assert.equal(assistChip.dataset.variant, "assist");
assert.equal(assistChip.dataset.state, "focus");
let chipSelected = null;
const interactiveChip = createChip({
  label: "Active",
  selected: false,
  interactive: true,
  onSelectedChange(selected) {
    chipSelected = selected;
  },
});
interactiveChip.click();
assert.equal(chipSelected, true);
assert.equal(interactiveChip.dataset.selected, "true");
assert.equal(interactiveChip.dataset.state, "selected");
assert.equal(interactiveChip.attributes["aria-pressed"], "true");
let removedChip = "";
const removableChip = createChip({
  label: "Diesel",
  removable: true,
  onRemove(label) {
    removedChip = label;
  },
});
removableChip.click();
assert.equal(removedChip, "Diesel");
assert.equal(removableChip.hidden, true);

const tag = createTag({ label: "Policy", variant: "link", tone: "info", state: "focus", icon: "verified" });
assert.equal(tag.tagName, "BUTTON");
assert.equal(tag.className, "tag");
assert.equal(tag.dataset.variant, "link");
assert.equal(tag.dataset.tone, "info");
assert.equal(tag.dataset.state, "focus");
assert.equal(tag.dataset.interactive, "true");
assert.equal(tag.disabled, false);
assert.equal(tag.querySelector(".tag__icon").textContent, "verified");
const staticTag = createTag({ label: "Mobile", variant: "platform", tone: "neutral" });
assert.equal(staticTag.tagName, "SPAN");
assert.equal(staticTag.dataset.variant, "platform");
assert.equal(staticTag.dataset.tone, "neutral");
const disabledTag = createTag({ label: "Disabled", variant: "link", state: "disabled" });
assert.equal(disabledTag.tagName, "BUTTON");
assert.equal(disabledTag.disabled, true);
assert.equal(disabledTag.dataset.state, "disabled");

const tabs = createTabs({
  label: "Fleet views",
  selectedKey: "cards",
  items: [
    { key: "drivers", label: "Drivers", icon: "person" },
    { key: "cards", label: "Cards", count: 8 },
  ],
});
assert.equal(tabs.tagName, "DIV");
assert.equal(tabs.attributes.role, "tablist");
assert.equal(tabs.attributes["aria-label"], "Fleet views");
assert.equal(tabs.dataset.variant, "default");
assert.equal(tabs.querySelectorAll("button")[1].attributes["aria-selected"], "true");
assert.equal(tabs.querySelectorAll("button")[1].tabIndex, 0);
assert.equal(tabs.querySelectorAll("button")[0].tabIndex, -1);
assert.equal(tabs.querySelectorAll("button")[0].attributes["data-tabs-item"], "");
assert.equal(tabs.querySelector(".tabs__icon").textContent, "person");
assert.equal(tabs.querySelector(".badge").textContent, "8");
const underlineTabs = createTabs({
  label: "Detail sections",
  variant: "underline",
  items: [{ key: "overview", label: "Overview" }, { key: "events", label: "Events" }],
});
assert.equal(underlineTabs.dataset.variant, "underline");
let tabChange = "";
const interactiveTabs = createTabs({
  items: [
    { key: "drivers", label: "Drivers" },
    { key: "cards", label: "Cards" },
    { key: "limits", label: "Limits", disabled: true },
  ],
  onValueChange(value) {
    tabChange = value;
  },
});
interactiveTabs.querySelectorAll("button")[0].offsetLeft = 8;
interactiveTabs.querySelectorAll("button")[0].offsetWidth = 80;
interactiveTabs.querySelectorAll("button")[1].offsetLeft = 92;
interactiveTabs.querySelectorAll("button")[1].offsetWidth = 72;
interactiveTabs.querySelectorAll("button")[1].click();
assert.equal(interactiveTabs.querySelectorAll("button")[1].attributes["aria-selected"], "true");
assert.equal(interactiveTabs.querySelectorAll("button")[1].tabIndex, 0);
assert.equal(tabChange, "cards");
assert.equal(interactiveTabs.dataset.indicatorSynced, "true");
assert.equal(interactiveTabs.style, "--comp-tabs-indicator-left: 92px; --comp-tabs-indicator-width: 72px");
interactiveTabs.querySelectorAll("button")[1].dispatchEvent({ type: "keydown", key: "ArrowRight", preventDefault() { this.defaultPrevented = true; } });
assert.equal(interactiveTabs.querySelectorAll("button")[0].attributes["aria-selected"], "true");
assert.equal(globalThis.document.activeElement, interactiveTabs.querySelectorAll("button")[0]);
assert.equal(interactiveTabs.style, "--comp-tabs-indicator-left: 8px; --comp-tabs-indicator-width: 80px");

const tooltip = createTooltip({ triggerLabel: "Info", content: "Short help", id: "tip-1" });
assert.equal(tooltip.tagName, "SPAN");
assert.equal(tooltip.className, "tooltip");
assert.equal(tooltip.dataset.density, "md");
assert.equal(tooltip.dataset.state, "default");
assert.equal(tooltip.dataset.variant, "default");
assert.equal(tooltip.querySelector("button").attributes["aria-describedby"], undefined);
assert.equal(tooltip.querySelector(".tooltip__bubble").hidden, true);
assert.equal(tooltip.querySelector(".tooltip__bubble").attributes.role, "tooltip");
assert.equal(tooltip.querySelector(".tooltip__bubble").id, "tip-1");
let tooltipOpen = null;
const interactiveTooltip = createTooltip({
  triggerLabel: "Help",
  content: "Details",
  onOpenChange(open) {
    tooltipOpen = open;
  },
});
interactiveTooltip.querySelector("button").dispatchEvent({ type: "focus" });
assert.equal(interactiveTooltip.dataset.open, "true");
assert.equal(interactiveTooltip.dataset.state, "focus");
assert.equal(interactiveTooltip.querySelector("button").attributes["aria-describedby"], "tooltip-help");
assert.equal(tooltipOpen, true);
interactiveTooltip.querySelector("button").dispatchEvent({ type: "keydown", key: "Escape", preventDefault() { this.defaultPrevented = true; } });
assert.equal(interactiveTooltip.dataset.open, "false");
assert.equal(interactiveTooltip.dataset.state, "dismissed");
assert.equal(tooltipOpen, false);
const metricTooltip = createTooltip({ triggerLabel: "Cost", content: "Cost per km", variant: "metric", placement: "right", state: "open" });
assert.equal(metricTooltip.dataset.variant, "metric");
assert.equal(metricTooltip.dataset.placement, "right");
assert.equal(metricTooltip.dataset.open, "true");
assert.equal(metricTooltip.querySelector(".tooltip__bubble").hidden, false);
const compactTooltip = createTooltip({ triggerLabel: "Compact", content: "Short help", density: "sm" });
assert.equal(compactTooltip.dataset.density, "sm");

const toast = createToast({ label: "Saved", description: "Policy updated", tone: "success", actionLabel: "Undo", dismissible: true, density: "sm" });
assert.equal(toast.tagName, "ARTICLE");
assert.equal(toast.attributes.role, "status");
assert.equal(toast.attributes["aria-live"], "polite");
assert.equal(toast.dataset.tone, "success");
assert.equal(toast.dataset.variant, "status");
assert.equal(toast.dataset.state, "visible");
assert.equal(toast.dataset.density, "sm");
assert.equal(toast.querySelector(".toast__icon").textContent, "check_circle");
assert.equal(toast.querySelector(".toast__icon").attributes["aria-hidden"], "true");
assert.equal(toast.querySelector(".toast__content").textContent, "SavedPolicy updated");
assert.equal(toast.querySelectorAll("button").length, 2);
assert.equal(toast.querySelector(".toast__action").className.includes("button"), true);
assert.equal(toast.querySelector(".toast__action").dataset.density, "sm");
const warningToast = createToast({ label: "Offline", tone: "warning", state: "stacked", variant: "warning" });
assert.equal(warningToast.attributes.role, "alert");
assert.equal(warningToast.attributes["aria-live"], "assertive");
assert.equal(warningToast.dataset.state, "stacked");
assert.equal(warningToast.dataset.variant, "warning");
const defaultToast = createToast({ label: "None", state: "default" });
assert.equal(defaultToast.hidden, true);
let toastAction = false;
let toastDismissed = false;
const interactiveToast = createToast({
  label: "Saved",
  actionLabel: "Undo",
  dismissible: true,
  onAction() {
    toastAction = true;
  },
  onDismiss() {
    toastDismissed = true;
  },
});
interactiveToast.querySelector(".toast__action").click();
assert.equal(toastAction, true);
interactiveToast.querySelector(".toast__dismiss").click();
assert.equal(interactiveToast.hidden, true);
assert.equal(toastDismissed, true);

const progress = createProgressIndicator({ label: "Upload", value: 30, max: 60, showValue: true, tone: "success", state: "active", density: "sm", fullWidth: true });
assert.equal(progress.tagName, "DIV");
assert.equal(progress.attributes.role, "progressbar");
assert.equal(progress.dataset.tone, "success");
assert.equal(progress.dataset.state, "active");
assert.equal(progress.dataset.density, "sm");
assert.equal(progress.dataset.fullWidth, "true");
assert.equal(progress.querySelector(".progress__label").textContent, "Upload");
assert.equal(progress.attributes["aria-labelledby"], progress.querySelector(".progress__label").id);
assert.equal(progress.attributes["aria-valuenow"], "30");
assert.equal(progress.attributes["aria-valuemin"], "0");
assert.equal(progress.attributes["aria-valuemax"], "60");
assert.equal(progress.querySelector(".progress__fill").style, "--progress-value: 50%");
assert.equal(progress.querySelector(".progress__value").textContent, "50%");
assert.equal(progress.querySelector(".spinner"), null);
const clampedProgress = createProgressIndicator({ label: "Overflow", value: 120, max: 100, showValue: true });
assert.equal(clampedProgress.attributes["aria-valuenow"], "100");
assert.equal(clampedProgress.querySelector(".progress__fill").style, "--progress-value: 100%");
assert.equal(clampedProgress.querySelector(".progress__value").textContent, "100%");
const pausedProgress = createProgressIndicator({ label: "Paused upload", value: 25, max: 100, state: "paused", showValue: true });
assert.equal(pausedProgress.attributes["aria-valuetext"], "Paused at 25%");
const completeProgress = createProgressIndicator({ label: "Done", value: 100, max: 100, state: "complete" });
assert.equal(completeProgress.attributes["aria-valuetext"], "Complete");
const completeProgressClamped = createProgressIndicator({ label: "Done anyway", value: 20, max: 100, state: "complete", showValue: true });
assert.equal(completeProgressClamped.attributes["aria-valuenow"], "100");
assert.equal(completeProgressClamped.querySelector(".progress__fill").style, "--progress-value: 100%");
assert.equal(completeProgressClamped.querySelector(".progress__value").textContent, "100%");
const completeProgressOverridesIndeterminate = createProgressIndicator({ label: "Done", indeterminate: true, state: "complete", showValue: true });
assert.equal(completeProgressOverridesIndeterminate.dataset.indeterminate, "false");
assert.equal(completeProgressOverridesIndeterminate.attributes["aria-valuenow"], "100");
const disabledProgress = createProgressIndicator({ label: "Unavailable", state: "disabled" });
assert.equal(disabledProgress.attributes["aria-disabled"], "true");
assert.equal(disabledProgress.attributes["aria-valuetext"], "Unavailable");
const indeterminateProgress = createProgressIndicator({ label: "Syncing", state: "indeterminate", showValue: true });
assert.equal(indeterminateProgress.dataset.indeterminate, "true");
assert.equal(indeterminateProgress.dataset.state, "indeterminate");
assert.equal(indeterminateProgress.querySelector(".progress__label").textContent, "Syncing");
assert.equal(indeterminateProgress.attributes["aria-valuenow"], undefined);
assert.equal(indeterminateProgress.attributes["aria-valuemax"], undefined);
assert.equal(indeterminateProgress.attributes["aria-valuetext"], "In progress");
assert.equal(indeterminateProgress.querySelector(".progress__value"), null);
assert.equal(indeterminateProgress.querySelector(".spinner"), null);

const spinner = createSpinner({ label: "Checking value", density: "sm", tone: "ink" });
assert.equal(spinner.className, "spinner");
assert.equal(spinner.attributes.role, "status");
assert.equal(spinner.attributes["aria-label"], "Checking value");
assert.equal(spinner.dataset.density, "sm");
assert.equal(spinner.dataset.tone, "ink");
assert.equal(spinner.dataset.state, "loading");
assert.equal(spinner.querySelector(".spinner__svg").tagName, "SVG");
assert.equal(spinner.querySelector(".spinner__track").tagName, "CIRCLE");
assert.equal(spinner.querySelector(".spinner__arc").tagName, "CIRCLE");
assert.equal(spinner.querySelector(".spinner__track").attributes.pathLength, "100");
assert.equal(spinner.querySelector(".spinner__arc").attributes.pathLength, "100");
const decorativeSpinner = createSpinner({ decorative: true });
assert.equal(decorativeSpinner.attributes["aria-hidden"], "true");
assert.equal(decorativeSpinner.attributes.role, undefined);

const accordion = createAccordion({
  density: "sm",
  items: [
    { title: "Documents", content: "Insurance", open: true, id: "docs-panel", icon: "description", meta: "3 of 4" },
    { title: "Limits", content: "Fuel rules", icon: "speed", meta: "2 rules" },
  ],
});
assert.equal(accordion.tagName, "DIV");
assert.equal(accordion.className, "accordion");
assert.equal(accordion.dataset.density, "sm");
assert.equal(accordion.querySelector(".accordion__trigger").attributes["aria-expanded"], "true");
assert.equal(accordion.querySelector(".accordion__trigger").attributes["aria-controls"], "docs-panel");
assert.equal(accordion.querySelector(".accordion__icon").textContent, "description");
assert.equal(accordion.querySelector(".accordion__title").textContent, "Documents");
assert.equal(accordion.querySelector(".accordion__meta").textContent, "3 of 4");
assert.equal(accordion.querySelector(".accordion__chevron").textContent, "expand_more");
assert.equal(accordion.querySelector(".accordion__panel").hidden, false);
assert.equal(accordion.querySelector(".accordion__panel-body").textContent, "Insurance");
assert.equal(accordion.querySelectorAll(".accordion__panel")[1].hidden, true);
let expandedPanels = [];
const interactiveAccordion = createAccordion({
  items: [
    { title: "Documents", content: "Insurance", open: true, id: "docs-panel" },
    { title: "Limits", content: "Fuel rules", id: "limits-panel" },
  ],
  onExpandedChange(ids) {
    expandedPanels = ids;
  },
});
interactiveAccordion.querySelectorAll(".accordion__trigger")[1].click();
assert.equal(interactiveAccordion.querySelectorAll(".accordion__trigger")[0].attributes["aria-expanded"], "false");
assert.equal(interactiveAccordion.querySelectorAll(".accordion__panel")[0].hidden, true);
assert.equal(interactiveAccordion.querySelectorAll(".accordion__trigger")[1].attributes["aria-expanded"], "true");
assert.deepEqual(expandedPanels, ["limits-panel"]);

const slider = createSlider({ label: "Radius", value: 25, min: 0, max: 50, step: 5, valueLabel: "25 km" });
assert.equal(slider.tagName, "LABEL");
assert.equal(slider.className, "slider");
assert.equal(slider.dataset.value, "25");
assert.equal(slider.dataset.density, "md");
assert.equal(slider.querySelector("input").type, "range");
assert.equal(slider.querySelector("input").attributes["data-slider-input"], "");
assert.equal(slider.querySelector("input").value, 25);
assert.equal(slider.querySelector("input").min, 0);
assert.equal(slider.querySelector("input").max, 50);
assert.equal(slider.querySelector("input").step, 5);
assert.equal(slider.querySelector(".slider__value").textContent, "25 km");
assert.equal(slider.querySelector(".slider__value").attributes["data-slider-output"], "");
assert.equal(slider.querySelector(".slider__control").className, "slider__control");
assert.equal(slider.querySelector(".slider__track").attributes["aria-hidden"], "true");
assert.equal(slider.querySelector(".slider__fill").attributes["aria-hidden"], "true");
assert.equal(slider.querySelector(".slider__thumb").attributes["aria-hidden"], "true");
let sliderValue = 0;
const interactiveSlider = createSlider({
  label: "Radius",
  value: 10,
  min: 0,
  max: 50,
  formatValue(value) {
    return `${value} km`;
  },
  onValueChange(value) {
    sliderValue = value;
  },
});
interactiveSlider.querySelector("input").value = "25";
interactiveSlider.querySelector("input").dispatchEvent({ type: "input" });
assert.equal(interactiveSlider.dataset.value, "25");
assert.equal(interactiveSlider.dataset.pct, "50");
assert.equal(interactiveSlider.getAttribute("style"), null);
assert.equal(interactiveSlider.querySelector(".slider__value").textContent, "25 km");
assert.equal(sliderValue, 25);
interactiveSlider.querySelector("input").dispatchEvent({ type: "pointerdown" });
assert.equal(interactiveSlider.dataset.dragging, "true");
interactiveSlider.querySelector("input").dispatchEvent({ type: "pointerup" });
assert.equal(interactiveSlider.dataset.dragging, "false");
const compactSlider = createSlider({ label: "Compact radius", density: "sm" });
assert.equal(compactSlider.dataset.density, "sm");
assert.equal(compactSlider.getAttribute("style"), null);
const roomySlider = createSlider({ label: "Roomy radius", density: "lg" });
assert.equal(roomySlider.dataset.density, "lg");
assert.equal(roomySlider.getAttribute("style"), null);

const avatar = createAvatar({ name: "Ana Sosa", status: "online" });
assert.equal(avatar.tagName, "SPAN");
assert.equal(avatar.className, "avatar avatar--md");
assert.equal(avatar.dataset.status, "online");
assert.equal(avatar.dataset.state, "online");
assert.equal(avatar.attributes["aria-label"], "Ana Sosa");
assert.equal(avatar.querySelector(".avatar__initials").textContent, "AS");
assert.equal(avatar.querySelector(".avatar__status").attributes["aria-hidden"], "true");
const largeAvatar = createAvatar({ name: "Luis Vera", density: "xl", status: "busy" });
assert.equal(largeAvatar.className, "avatar avatar--xl");
assert.equal(largeAvatar.dataset.state, "busy");
const unknownAvatar = createAvatar({ name: "", state: "unknown" });
assert.equal(unknownAvatar.attributes["aria-label"], "Unknown avatar");
assert.equal(unknownAvatar.querySelector(".avatar__initials").textContent, "?");

const skeleton = createSkeleton({ label: "Loading cards", variant: "card", lines: 2 });
assert.equal(skeleton.tagName, "DIV");
assert.equal(skeleton.className, "skeleton skeleton--card");
assert.equal(skeleton.attributes.role, "status");
assert.equal(skeleton.attributes["aria-busy"], "true");
assert.equal(skeleton.querySelectorAll(".skeleton__bone").length, 2);
const loadedSkeleton = createSkeleton({ label: "Loaded cards", variant: "card", state: "loaded" });
assert.equal(loadedSkeleton.attributes["aria-busy"], "false");
const disabledSkeleton = createSkeleton({ label: "Disabled loading", variant: "text", state: "disabled" });
assert.equal(disabledSkeleton.attributes["aria-busy"], "false");
const circleSkeleton = createSkeleton({ label: "Loading avatar", variant: "circle", width: 36, height: 36 });
assert.equal(circleSkeleton.className, "skeleton skeleton--circle");
assert.equal(circleSkeleton.style, "--skeleton-width: 36px; --skeleton-height: 36px");
assert.equal(circleSkeleton.querySelectorAll(".skeleton__bone").length, 1);
const titleSkeleton = createSkeleton({ label: "Loading title", variant: "title", width: "70%" });
assert.equal(titleSkeleton.className, "skeleton skeleton--title");
assert.equal(titleSkeleton.style, "--skeleton-width: 70%");
const tableSkeleton = createSkeleton({ label: "Loading table", variant: "table", rows: 3, columns: 4 });
assert.equal(tableSkeleton.className, "skeleton skeleton--table");
assert.equal(tableSkeleton.dataset.rows, "3");
assert.equal(tableSkeleton.dataset.columns, "4");
assert.equal(tableSkeleton.querySelectorAll(".skeleton__row").length, 3);
assert.equal(tableSkeleton.querySelectorAll(".skeleton__cell").length, 12);
assert.equal(tableSkeleton.querySelector(".skeleton__cell").attributes["aria-hidden"], "true");

const dialog = createDialog({
  label: "Freeze card?",
  description: "Driver cannot spend",
  variant: "destructive",
  tone: "danger",
  density: "sm",
  fields: [{ label: "Reason", value: "Risk review" }],
  actions: [{ label: "Confirm", variant: "danger" }],
});
assert.equal(dialog.tagName, "DIV");
assert.equal(dialog.className, "dialog dialog--danger");
assert.equal(dialog.dataset.variant, "destructive");
assert.equal(dialog.dataset.state, "open");
assert.equal(dialog.dataset.tone, "danger");
assert.equal(dialog.dataset.density, "sm");
assert.equal(dialog.querySelector(".dialog__trigger").attributes["aria-haspopup"], "dialog");
assert.equal(dialog.querySelector(".dialog__trigger").dataset.density, "sm");
assert.equal(dialog.querySelector(".dialog__trigger").attributes["data-overlay-open"], "");
assert.equal(dialog.querySelector(".dialog__overlay").attributes["data-overlay-dismiss"], "");
assert.equal(dialog.querySelector(".dialog__panel").attributes.role, "dialog");
assert.equal(dialog.querySelector(".dialog__panel").attributes["aria-modal"], "true");
assert.equal(dialog.querySelector(".dialog__icon").textContent, "warning");
assert.equal(dialog.querySelector(".field").dataset.density, "sm");
assert.equal(dialog.querySelector("footer").querySelector("button").textContent, "Confirm");
assert.equal(dialog.querySelector("footer").querySelector("button").className, "button button--primary button--danger");
assert.equal(dialog.querySelector("footer").querySelector("button").dataset.density, "sm");
let dialogOpen = null;
let dialogAction = "";
const interactiveDialog = createDialog({
  label: "Freeze card?",
  open: false,
  actions: [{ key: "confirm", label: "Confirm" }],
  onOpenChange(open) {
    dialogOpen = open;
  },
  onAction(key) {
    dialogAction = key;
  },
});
interactiveDialog.querySelector(".dialog__trigger").click();
assert.equal(interactiveDialog.querySelector(".dialog__overlay").hidden, false);
assert.equal(interactiveDialog.querySelector(".dialog__trigger").attributes["aria-expanded"], "true");
assert.equal(globalThis.document.activeElement, interactiveDialog.querySelector(".dialog__close"));
assert.equal(dialogOpen, true);
interactiveDialog.querySelector("footer").querySelector("button").click();
assert.equal(dialogAction, "confirm");
assert.equal(interactiveDialog.querySelector(".dialog__overlay").hidden, true);
assert.equal(globalThis.document.activeElement, interactiveDialog.querySelector(".dialog__trigger"));
interactiveDialog.querySelector(".dialog__trigger").click();
interactiveDialog.dispatchEvent({ type: "keydown", key: "Escape", preventDefault() { this.defaultPrevented = true; } });
assert.equal(interactiveDialog.querySelector(".dialog__overlay").hidden, true);

const menu = createMenu({ triggerLabel: "Actions", items: [{ label: "Edit" }, { separator: true }, { label: "Suspend", tone: "danger" }] });
assert.equal(menu.tagName, "SPAN");
assert.equal(menu.className, "menu");
assert.equal(menu.dataset.variant, "actions");
assert.equal(menu.dataset.density, "md");
assert.equal(menu.dataset.state, "default");
assert.equal(menu.dataset.open, "false");
assert.equal(menu.querySelector(".menu__trigger").attributes["aria-haspopup"], "menu");
assert.equal(menu.querySelector(".menu__trigger").attributes["data-menu-trigger"], "");
assert.equal(menu.querySelector(".menu__trigger").attributes["aria-expanded"], "false");
assert.equal(menu.querySelector(".menu__panel").attributes["data-menu-panel"], "");
assert.equal(menu.querySelector(".menu__panel").hidden, true);
assert.equal(menu.querySelector(".menu__panel").attributes.role, "menu");
assert.equal(menu.querySelectorAll(".menu__item").length, 2);
assert.equal(menu.querySelector(".menu__separator").attributes.role, "separator");
assert.equal(menu.querySelectorAll(".menu__item")[1].dataset.tone, "danger");
assert.equal(menu.querySelectorAll(".menu__item")[1].textContent, "Suspend");
let menuOpen = null;
let menuSelection = null;
const interactiveMenu = createMenu({
  open: false,
  variant: "grouped",
  density: "sm",
  align: "end",
  items: [{ key: "edit", label: "Edit", icon: "edit" }, "divider", { key: "suspend", label: "Suspend", tone: "danger", shortcut: "⌘D" }],
  onOpenChange(open) {
    menuOpen = open;
  },
  onSelect(item) {
    menuSelection = item;
  },
});
assert.equal(interactiveMenu.dataset.variant, "grouped");
assert.equal(interactiveMenu.dataset.density, "sm");
assert.equal(interactiveMenu.dataset.align, "end");
assert.equal(interactiveMenu.querySelector(".menu__trigger").dataset.density, "sm");
interactiveMenu.querySelector(".menu__trigger").click();
assert.equal(interactiveMenu.querySelector(".menu__panel").hidden, false);
assert.equal(interactiveMenu.querySelector(".menu__trigger").attributes["aria-expanded"], "true");
assert.equal(menuOpen, true);
assert.equal(globalThis.document.activeElement, interactiveMenu.querySelectorAll(".menu__item")[0]);
interactiveMenu.querySelector(".menu__panel").dispatchEvent({
  type: "keydown",
  key: "ArrowDown",
  target: interactiveMenu.querySelectorAll(".menu__item")[0],
  preventDefault() { this.defaultPrevented = true; },
});
assert.equal(globalThis.document.activeElement, interactiveMenu.querySelectorAll(".menu__item")[1]);
interactiveMenu.querySelectorAll(".menu__item")[1].click();
assert.equal(menuSelection.key, "suspend");
assert.equal(interactiveMenu.querySelector(".menu__panel").hidden, true);
assert.equal(globalThis.document.activeElement, interactiveMenu.querySelector(".menu__trigger"));

const drawer = createDrawer({ label: "Card controls", description: "Review limits", fields: [{ label: "Limit", value: "$900" }], actions: [{ label: "Save" }] });
assert.equal(drawer.tagName, "DIV");
assert.equal(drawer.className, "drawer drawer--neutral");
assert.equal(drawer.dataset.variant, "side-sheet");
assert.equal(drawer.dataset.state, "closed");
assert.equal(drawer.dataset.density, "md");
assert.equal(drawer.dataset.open, "false");
assert.equal(drawer.querySelector(".drawer__trigger").attributes["aria-haspopup"], "dialog");
assert.equal(drawer.querySelector(".drawer__trigger").attributes["data-overlay-open"], "");
assert.equal(drawer.querySelector(".drawer__overlay").attributes["data-overlay-dismiss"], "");
assert.equal(drawer.querySelector(".drawer__panel").attributes.role, "dialog");
assert.equal(drawer.querySelector(".field__label").textContent, "Limit");
const detailDrawer = createDrawer({
  label: "Ana Sosa",
  content: [
    { type: "badge", label: "En ruta", tone: "success" },
    { type: "progress", label: "Documentos", value: 75, max: 100, showValue: true },
  ],
  actions: [{ label: "Cerrar", variant: "ghost" }, { label: "Guardar" }],
});
assert.equal(detailDrawer.querySelector(".badge__label").textContent, "En ruta");
assert.equal(detailDrawer.querySelector(".progress__label").textContent, "Documentos");
assert.equal(detailDrawer.querySelector(".progress").attributes["aria-valuenow"], "75");
assert.equal(detailDrawer.querySelector("footer").querySelector(".button--ghost").textContent, "Cerrar");
let drawerOpen = null;
let drawerAction = "";
const interactiveDrawer = createDrawer({
  label: "Card controls",
  open: false,
  density: "sm",
  variant: "filter",
  side: "left",
  fields: [{ label: "Limit", value: "$900" }],
  actions: [{ key: "save", label: "Save" }],
  onOpenChange(open) {
    drawerOpen = open;
  },
  onAction(key) {
    drawerAction = key;
  },
});
assert.equal(interactiveDrawer.dataset.density, "sm");
assert.equal(interactiveDrawer.dataset.variant, "filter");
assert.equal(interactiveDrawer.dataset.side, "left");
assert.equal(interactiveDrawer.querySelector(".drawer__trigger").dataset.density, "sm");
interactiveDrawer.querySelector(".drawer__trigger").click();
assert.equal(interactiveDrawer.querySelector(".drawer__overlay").hidden, false);
assert.equal(drawerOpen, true);
assert.equal(globalThis.document.activeElement, interactiveDrawer.querySelector(".drawer__close"));
interactiveDrawer.querySelector("footer").querySelector("button").click();
assert.equal(drawerAction, "save");
assert.equal(interactiveDrawer.querySelector(".drawer__overlay").hidden, true);
interactiveDrawer.querySelector(".drawer__trigger").click();
interactiveDrawer.querySelector(".drawer__overlay").dispatchEvent({ type: "click", target: interactiveDrawer.querySelector(".drawer__overlay") });
assert.equal(interactiveDrawer.querySelector(".drawer__overlay").hidden, true);

const table = createTable({
  label: "Fleet spend",
  rowKey: "id",
  variant: "sortable",
  density: "sm",
  sortKey: "spend",
  selectedKey: "mx-1",
  columns: [{ key: "plate", label: "Plate", sortable: true }, { key: "spend", label: "Spend", align: "right" }],
  rows: [{ id: "mx-1", plate: "JMX-214-B", spend: "$842" }],
});
assert.equal(table.tagName, "DIV");
assert.equal(table.className, "table");
assert.equal(table.dataset.variant, "sortable");
assert.equal(table.dataset.density, "sm");
assert.equal(table.querySelector("table").attributes["aria-label"], "Fleet spend");
assert.equal(table.querySelector("th").attributes["aria-sort"], "none");
assert.equal(table.querySelector(".table__sort").attributes["data-table-sort"], "");
assert.equal(table.querySelector("tbody").querySelector("tr").dataset.selected, "true");
const badgeTable = createTable({
  label: "Status table",
  rowKey: "id",
  columns: [{ key: "status", label: "Status" }],
  rows: [{ id: "mx-1", status: { label: "Active", tone: "success" } }],
});
assert.equal(badgeTable.querySelector(".badge").textContent, "Active");
let tableSort = null;
let tableRow = "";
const interactiveTable = createTable({
  label: "Fleet spend",
  rowKey: "id",
  columns: [{ key: "plate", label: "Plate", sortable: true }, { key: "spend", label: "Spend" }],
  rows: [{ id: "mx-1", plate: "JMX-214-B", spend: "$842" }, { id: "mx-2", plate: "KMX-219-C", spend: "$100" }],
  onSortChange(sort) {
    tableSort = sort;
  },
  onRowSelect(key) {
    tableRow = key;
  },
});
interactiveTable.querySelector(".table__sort").click();
assert.deepEqual(tableSort, { key: "plate", direction: "ascending" });
assert.equal(interactiveTable.querySelector("th").attributes["aria-sort"], "ascending");
interactiveTable.querySelector(".table__sort").click();
assert.deepEqual(tableSort, { key: "plate", direction: "descending" });
assert.equal(interactiveTable.querySelector(".table__sort").dataset.dir, "desc");
const selectableTable = createTable({
  label: "Fleet spend",
  rowKey: "id",
  variant: "selectable",
  columns: [{ key: "plate", label: "Plate" }, { key: "spend", label: "Spend" }],
  rows: [{ id: "mx-1", plate: "JMX-214-B", spend: "$842" }, { id: "mx-2", plate: "KMX-219-C", spend: "$100" }],
  onRowSelect(key) {
    tableRow = key;
  },
});
const mx2TableRow = [...selectableTable.querySelectorAll("tr")].find((row) => row.dataset.key === "mx-2");
mx2TableRow.click();
assert.equal(tableRow, "mx-2");
assert.equal(mx2TableRow.dataset.selected, "true");
let expandedTableKey = "";
const expandableTable = createTable({
  label: "Expandable table",
  rowKey: "id",
  variant: "expandable",
  columns: [{ key: "plate", label: "Plate" }],
  rows: [{ id: "mx-1", plate: "JMX-214-B", detail: "Policy active" }],
  onExpandedChange(key) {
    expandedTableKey = key;
  },
});
assert.equal(expandableTable.querySelector("tbody").querySelector("tr").attributes["aria-expanded"], "false");
assert.equal(expandableTable.querySelector(".table__detail-row").hidden, true);
expandableTable.querySelector(".table__expander").click();
assert.equal(expandedTableKey, "mx-1");
assert.equal(expandableTable.querySelector("tbody").querySelector("tr").attributes["aria-expanded"], "true");
assert.equal(expandableTable.querySelector(".table__detail-row").hidden, false);
assert.equal(expandableTable.querySelector(".table__detail").textContent, "Policy active");

const biometricPrompt = createBiometricPrompt({ label: "Confirm it is you", variant: "face", state: "authenticating" });
assert.equal(biometricPrompt.tagName, "SECTION");
assert.equal(biometricPrompt.className, "biometric-prompt");
assert.equal(biometricPrompt.attributes.role, "group");
assert.equal(biometricPrompt.dataset.variant, "face");
assert.equal(biometricPrompt.querySelector(".biometric-prompt__fallback").textContent, "Use passcode instead");
assert.equal(biometricPrompt.querySelector(".biometric-prompt__fallback").attributes["data-biometric-fallback"], "");

const treeView = createTreeView({ label: "Fleet tree", density: "lg", nodes: [{ label: "Fleet North", level: 1, expanded: true, icon: "account_tree" }, { label: "Cards", level: 2, selected: true }, { label: "Cards ending 4821", level: 5 }] });
assert.equal(treeView.tagName, "UL");
assert.equal(treeView.className, "tree-view");
assert.equal(treeView.dataset.density, "lg");
assert.equal(treeView.attributes.role, "tree");
assert.equal(treeView.querySelectorAll(".tree-view__item").length, 3);
assert.equal(treeView.querySelector(".tree-view__item").attributes["data-tree-item"], "");
assert.equal(treeView.querySelector(".tree-view__item").getAttribute("aria-expanded"), "true");
assert.equal(treeView.querySelector(".tree-view__control").attributes["data-tree-control"], "");
assert.equal(treeView.querySelector(".tree-view__control").dataset.density, "lg");
assert.equal(treeView.querySelector(".tree-view__control").querySelector(".button__icon").textContent, "account_tree");
assert.equal(treeView.querySelector(".tree-view__control").querySelector(".button__icon--trailing").textContent, "expand_more");
assert.equal(treeView.querySelectorAll(".tree-view__control")[1].querySelector(".button__icon"), null);
assert.equal(treeView.querySelectorAll(".tree-view__item")[2].getAttribute("aria-level"), "5");
let treeSelection = "";
let treeExpanded = [];
const interactiveTree = createTreeView({
  label: "Fleet tree",
  nodes: [
    { key: "fleet", label: "Fleet North", level: 1, expanded: true },
    { key: "cards", label: "Cards", level: 2, selected: true },
    { key: "limits", label: "Limits", level: 2 },
  ],
  onSelect(key) {
    treeSelection = key;
  },
  onExpandedChange(keys) {
    treeExpanded = keys;
  },
});
interactiveTree.querySelectorAll(".tree-view__control")[1].dispatchEvent({ type: "keydown", key: "ArrowUp", preventDefault() { this.defaultPrevented = true; } });
assert.equal(globalThis.document.activeElement, interactiveTree.querySelectorAll(".tree-view__control")[0]);
interactiveTree.querySelectorAll(".tree-view__control")[0].dispatchEvent({ type: "keydown", key: "ArrowLeft", preventDefault() { this.defaultPrevented = true; } });
assert.deepEqual(treeExpanded, []);
assert.equal(interactiveTree.querySelectorAll(".tree-view__item")[0].getAttribute("aria-expanded"), "false");
assert.equal(interactiveTree.querySelectorAll(".tree-view__control")[0].getAttribute("aria-expanded"), "false");
assert.equal(interactiveTree.querySelector(".button__icon--trailing").textContent, "expand_more");
assert.equal(interactiveTree.querySelectorAll(".tree-view__item")[1].hidden, true);
interactiveTree.querySelectorAll(".tree-view__control")[0].click();
assert.equal(treeSelection, "fleet");
assert.deepEqual(treeExpanded, ["fleet"]);
assert.equal(interactiveTree.querySelectorAll(".tree-view__item")[0].getAttribute("aria-expanded"), "true");
assert.equal(interactiveTree.querySelectorAll(".tree-view__control")[0].getAttribute("aria-expanded"), "true");
assert.equal(interactiveTree.querySelector(".button__icon--trailing").textContent, "expand_more");
assert.equal(interactiveTree.querySelectorAll(".tree-view__item")[1].hidden, false);

const motionBoundary = createMotionBoundary({ label: "Panel transition", state: "entering", reducedMotion: true });
assert.equal(motionBoundary.tagName, "DIV");
assert.equal(motionBoundary.className, "motion-boundary");
assert.equal(motionBoundary.attributes.role, "group");
assert.equal(motionBoundary.dataset.variant, "fade");
assert.equal(motionBoundary.dataset.state, "reduced-motion");
assert.equal(motionBoundary.dataset.reducedMotion, "true");
const motionBoundaryContent = motionBoundary.querySelector(".motion-boundary__content");
assert.equal(motionBoundary.attributes["aria-labelledby"], motionBoundaryContent.children[0].id);
assert.equal(motionBoundary.attributes["aria-describedby"].includes(motionBoundaryContent.children[1].id), true);
assert.equal(motionBoundary.attributes["aria-describedby"].includes(motionBoundary.querySelector(".motion-boundary__state").id), true);
assert.equal(motionBoundary.querySelector(".motion-boundary__state").textContent, "Reduced motion");
assert.equal(motionBoundary.querySelector(".motion-boundary__cue").attributes["data-motion-cue"], "");
assert.equal(motionBoundary.querySelector(".motion-boundary__cue").attributes["aria-hidden"], "true");

const exitingMotionBoundary = createMotionBoundary({ label: "Exit", variant: "route", state: "exiting" });
assert.equal(exitingMotionBoundary.dataset.variant, "route");
assert.equal(exitingMotionBoundary.dataset.state, "exiting");
assert.equal(exitingMotionBoundary.querySelector(".motion-boundary__state").textContent, "Exiting");

const disabledMotionBoundary = createMotionBoundary({ label: "Disabled", variant: "nonsense", state: "disabled", reducedMotion: true });
assert.equal(disabledMotionBoundary.dataset.variant, "fade");
assert.equal(disabledMotionBoundary.dataset.state, "disabled");
assert.equal(disabledMotionBoundary.attributes["aria-disabled"], "true");
assert.equal(disabledMotionBoundary.querySelector(".motion-boundary__state").textContent, "Disabled");

const animatedMoment = createAnimatedMoment({ label: "Action complete", state: "complete", reducedMotionFallback: "Static success" });
assert.equal(animatedMoment.tagName, "DIV");
assert.equal(animatedMoment.className, "animated-moment");
assert.equal(animatedMoment.attributes.role, "img");
assert.equal(animatedMoment.dataset.variant, "success");
assert.equal(animatedMoment.dataset.state, "complete");
assert.equal(animatedMoment.dataset.density, "md");
assert.equal(animatedMoment.dataset.fullWidth, "false");
assert.equal(animatedMoment.attributes["aria-label"], "Action complete: Complete");
assert.equal(animatedMoment.querySelector(".animated-moment__icon").textContent, "shield");
assert.equal(animatedMoment.querySelector(".animated-moment__stage").attributes["data-animated-moment-stage"], "");
assert.equal(animatedMoment.querySelector(".animated-moment__stage").children.length, 3);
assert.equal(animatedMoment.querySelector(".animated-moment__state").textContent, "Complete");
assert.equal(animatedMoment.querySelector(".animated-moment__cue").attributes["data-animated-moment-cue"], "");
assert.equal(animatedMoment.querySelector(".animated-moment__cue").attributes["aria-hidden"], "true");

const disabledAnimatedMoment = createAnimatedMoment({ label: "Offline", variant: "nonsense", state: "disabled" });
assert.equal(disabledAnimatedMoment.dataset.variant, "success");
assert.equal(disabledAnimatedMoment.dataset.state, "disabled");
assert.equal(disabledAnimatedMoment.attributes["aria-disabled"], "true");
assert.equal(disabledAnimatedMoment.attributes["aria-label"], "Offline: Disabled");
assert.equal(disabledAnimatedMoment.querySelector(".animated-moment__state").textContent, "Disabled");

const fullAnimatedMoment = createAnimatedMoment({ label: "Desktop cue", density: "sm", fullWidth: true });
assert.equal(fullAnimatedMoment.dataset.density, "sm");
assert.equal(fullAnimatedMoment.dataset.fullWidth, "true");

let emptyStateAction = "";
const emptyState = createEmptyState({
  title: "No vehicles",
  description: "Connect one to begin",
  icon: "inbox",
  variant: "search-empty",
  state: "action",
  density: "lg",
  fullWidth: true,
  action: { label: "Add vehicle", key: "add-vehicle" },
  onAction(key) {
    emptyStateAction = key;
  },
});
assert.equal(emptyState.tagName, "SECTION");
assert.equal(emptyState.className, "empty-state");
assert.equal(emptyState.dataset.variant, "search-empty");
assert.equal(emptyState.dataset.state, "action");
assert.equal(emptyState.dataset.density, "lg");
assert.equal(emptyState.dataset.fullWidth, "true");
assert.equal(emptyState.querySelector(".empty-state__title").textContent, "No vehicles");
assert.equal(emptyState.querySelector("button").textContent, "Add vehicle");
assert.equal(emptyState.querySelector("button").dataset.density, "lg");
emptyState.querySelector("button").click();
assert.equal(emptyStateAction, "add-vehicle");
const loadingEmptyState = createEmptyState({ title: "Resolving", icon: "hourglass_empty", state: "loading" });
assert.equal(loadingEmptyState.querySelector(".spinner").attributes["aria-hidden"], "true");

const list = createList({
  label: "Movements",
  density: "sm",
  variant: "action",
  state: "selected",
  items: [{ key: "fuel", label: "Fuel purchase", meta: "Today", value: "$842", icon: "local_gas_station" }],
});
assert.equal(list.tagName, "UL");
assert.equal(list.dataset.variant, "action");
assert.equal(list.dataset.state, "selected");
assert.equal(list.dataset.density, "sm");
assert.equal(list.attributes.role, "list");
assert.equal(list.attributes["aria-label"], "Movements");
assert.equal(list.querySelector(".list__item").tagName, "BUTTON");
assert.equal(list.querySelector(".list__item").attributes["aria-current"], "true");
assert.equal(list.querySelector(".list__value").textContent, "$842");

const kpiTile = createKpiTile({ label: "Fuel spend", value: "$84.2k", delta: "+12%", trend: "up", icon: "payments", variant: "delta" });
assert.equal(kpiTile.tagName, "ARTICLE");
assert.equal(kpiTile.className, "kpi-tile kpi-tile--neutral");
assert.equal(kpiTile.dataset.variant, "delta");
assert.equal(kpiTile.querySelector("strong").textContent, "$84.2k");
assert.equal(kpiTile.querySelector(".kpi-tile__icon").attributes["aria-hidden"], "true");
assert.equal(kpiTile.querySelector(".kpi-tile__trend-icon").textContent, "trending_up");

const kpiSparkline = createKpiTile({ label: "Resolved cases", value: "94%", variant: "sparkline", values: [20, 28, 36] });
assert.equal(kpiSparkline.children.find((child) => child.attributes?.class === "kpi-tile__sparkline").attributes["aria-hidden"], "true");

const kpiDrillIn = createKpiTile({ label: "Cards at risk", value: "18", variant: "drill-in", href: "#cards", state: "selected" });
assert.equal(kpiDrillIn.tagName, "A");
assert.equal(kpiDrillIn.attributes.href, "#cards");
assert.equal(kpiDrillIn.querySelector(".kpi-tile__affordance").textContent, "arrow_forward");

const kpiLoading = createKpiTile({ label: "Loading", value: "0", loading: true });
assert.equal(kpiLoading.dataset.state, "loading");
assert.equal(kpiLoading.querySelector(".kpi-tile__loading").attributes["aria-hidden"], "true");

const fab = createFloatingActionButton({ label: "Add movement", icon: "add", extended: true });
assert.equal(fab.tagName, "BUTTON");
assert.equal(fab.className, "fab");
assert.equal(fab.dataset.extended, "true");
assert.equal(fab.attributes["aria-label"], "Add movement");
assert.equal(fab.querySelector(".fab__label").textContent, "Add movement");

const breadcrumbs = createBreadcrumbs({ items: [{ label: "Fleet", href: "#fleet" }, { label: "Cards", current: true }] });
assert.equal(breadcrumbs.tagName, "NAV");
assert.equal(breadcrumbs.attributes["aria-label"], "Breadcrumbs");
assert.equal(breadcrumbs.querySelector("a").href, "#fleet");
assert.equal(breadcrumbs.querySelector("[aria-current=\"page\"]")?.textContent, undefined);
assert.equal(breadcrumbs.querySelectorAll("li").length, 2);

const overflowBreadcrumbs = createBreadcrumbs({
  variant: "overflow",
  maxItems: 4,
  items: [
    { label: "Fleet", href: "#fleet" },
    { label: "Regions", href: "#regions" },
    { label: "North", href: "#north" },
    { label: "Units", href: "#units" },
    { label: "JMX-214-B", current: true },
  ],
});
assert.equal(overflowBreadcrumbs.dataset.variant, "overflow");
assert.equal(overflowBreadcrumbs.querySelectorAll("li").length, 4);
assert.equal(overflowBreadcrumbs.querySelectorAll("li").some((item) => item.dataset.collapsed === "true"), true);

const mobileBreadcrumbs = createBreadcrumbs({
  variant: "mobile",
  density: "lg",
  items: [{ label: "Fleet" }, { label: "Units" }, { label: "JMX-214-B" }],
});
assert.equal(mobileBreadcrumbs.dataset.variant, "mobile");
assert.equal(mobileBreadcrumbs.dataset.density, "lg");
assert.equal(mobileBreadcrumbs.querySelectorAll("li").length, 2);

const disabledBreadcrumbs = createBreadcrumbs({ disabled: true, items: [{ label: "Fleet" }, { label: "Cards" }] });
assert.equal(disabledBreadcrumbs.dataset.state, "disabled");
assert.equal(disabledBreadcrumbs.attributes["aria-disabled"], "true");
assert.equal(disabledBreadcrumbs.querySelector("a"), null);

const pagination = createPagination({ page: 2, pageCount: 3 });
assert.equal(pagination.tagName, "NAV");
assert.equal(pagination.attributes["aria-label"], "Pagination");
assert.equal(pagination.querySelectorAll("button").length, 5);
assert.equal(pagination.querySelectorAll("button")[2].attributes["aria-current"], "page");
const longPagination = createPagination({ page: 6, pageCount: 12, density: "sm" });
assert.equal(longPagination.dataset.variant, "numbered");
assert.equal(longPagination.dataset.density, "sm");
assert.equal(longPagination.querySelectorAll(".pagination__ellipsis").length, 2);
assert.equal(longPagination.querySelectorAll("button").find((button) => button.attributes["aria-current"] === "page").textContent, "6");
longPagination.querySelectorAll("button").find((button) => button.dataset.kind === "next").click();
assert.equal(longPagination.dataset.page, "7");
assert.equal(longPagination.querySelectorAll("button").find((button) => button.attributes["aria-current"] === "page").textContent, "7");
let pageChange = 0;
const interactivePagination = createPagination({
  page: 1,
  pageCount: 3,
  onPageChange(page) {
    pageChange = page;
  },
});
interactivePagination.querySelectorAll("button")[4].click();
assert.equal(pageChange, 2);
assert.equal(interactivePagination.querySelectorAll("button")[2].attributes["aria-current"], "page");
assert.equal(interactivePagination.querySelectorAll("button")[0].disabled, false);
interactivePagination.querySelectorAll("button")[3].click();
assert.equal(pageChange, 3);
assert.equal(interactivePagination.querySelectorAll("button")[4].disabled, true);

const auditEvent = createAuditEvent({ label: "Limit changed", description: "Ana updated card limit", meta: "Today", status: "Logged", icon: "history" });
assert.equal(auditEvent.tagName, "ARTICLE");
assert.equal(auditEvent.className, "audit-event");
assert.equal(auditEvent.querySelector(".audit-event__content").textContent, "Limit changedAna updated card limitTodayLogged");
assert.equal(auditEvent.querySelector(".audit-event__meta").querySelector("small").textContent, "Today");
assert.equal(auditEvent.querySelector("em").textContent, "Logged");
assert.equal(auditEvent.querySelector(".audit-event__meta").querySelector("em").textContent, "Logged");
assert.equal(auditEvent.dataset.tone, "neutral");
assert.equal(auditEvent.dataset.state, "default");
assert.equal(auditEvent.dataset.density, "md");
const criticalAuditEvent = createAuditEvent({ label: "Document rejected", state: "critical", density: "sm", timestamp: "10:21", icon: "warning" });
assert.equal(criticalAuditEvent.dataset.tone, "danger");
assert.equal(criticalAuditEvent.dataset.state, "critical");
assert.equal(criticalAuditEvent.dataset.density, "sm");
assert.equal(criticalAuditEvent.querySelector(".audit-event__time").textContent, "10:21");
assert.equal(criticalAuditEvent.querySelector("em").textContent, "Critical");

let errorPanelAction = "";
const errorPanel = createErrorPanel({
  label: "Could not load",
  description: "Try again",
  variant: "blocking",
  state: "critical",
  density: "sm",
  fullWidth: true,
  icon: "priority_high",
  action: { label: "Retry", key: "retry" },
  onAction(key) {
    errorPanelAction = key;
  },
});
assert.equal(errorPanel.tagName, "SECTION");
assert.equal(errorPanel.attributes.role, "alert");
assert.equal(errorPanel.className, "error-panel error-panel--critical");
assert.equal(errorPanel.dataset.variant, "blocking");
assert.equal(errorPanel.dataset.state, "critical");
assert.equal(errorPanel.dataset.density, "sm");
assert.equal(errorPanel.dataset.fullWidth, "true");
assert.equal(errorPanel.querySelector(".error-panel__icon").textContent, "priority_high");
assert.equal(errorPanel.querySelector("button").textContent, "Retry");
assert.equal(errorPanel.querySelector("button").dataset.density, "sm");
errorPanel.querySelector("button").click();
assert.equal(errorPanelAction, "retry");
const warningPanel = createErrorPanel({ label: "Limited access", state: "warning", role: "status" });
assert.equal(warningPanel.attributes.role, "status");
const loadingPanel = createErrorPanel({ label: "Loading", state: "loading", icon: "sync" });
assert.equal(loadingPanel.querySelector(".spinner").attributes["aria-hidden"], "true");

const inlineValidation = createInlineValidation({ label: "Plate", value: "ABC-123", message: "Required", state: "error", id: "plate" });
assert.equal(inlineValidation.tagName, "DIV");
assert.equal(inlineValidation.className, "inline-validation");
assert.equal(inlineValidation.dataset.state, "error");
assert.equal(inlineValidation.querySelector("input").id, "plate");
assert.equal(inlineValidation.querySelector("input").attributes["aria-invalid"], "true");
assert.equal(inlineValidation.querySelector(".inline-validation__message").id, "plate-message");
const inlineValidationMessage = createInlineValidation({ label: "Phone number", message: "Enter a valid phone number.", state: "warning", id: "phone" });
assert.equal(inlineValidationMessage.dataset.field, "false");
assert.equal(inlineValidationMessage.querySelector("input"), null);
assert.equal(inlineValidationMessage.querySelector(".inline-validation__message").id, "phone-message");
assert.equal(inlineValidationMessage.querySelector(".inline-validation__message").attributes.role, undefined);
const inlineValidationLive = createInlineValidation({ label: "Vehicle ID", value: "MX-4832", message: "Vehicle ID is available.", state: "success", id: "vehicle", live: true });
assert.equal(inlineValidationLive.querySelector(".inline-validation__message").attributes.role, "status");
const inlineValidationLiveError = createInlineValidation({ label: "Driver email", value: "ana@", message: "Enter a complete email address.", state: "error", id: "driver-email", live: true });
assert.equal(inlineValidationLiveError.querySelector(".inline-validation__message").attributes.role, "alert");

const stepper = createStepper({ current: 1, steps: [{ label: "Start" }, { label: "Review", description: "Check limits" }] });
assert.equal(stepper.tagName, "OL");
assert.equal(stepper.attributes["aria-label"], "Progress");
assert.equal(stepper.dataset.orientation, "horizontal");
assert.equal(stepper.dataset.density, "md");
assert.equal(stepper.querySelectorAll(".stepper__item")[0].dataset.state, "complete");
assert.equal(stepper.querySelectorAll(".stepper__item")[1].attributes["aria-current"], "step");
assert.equal(stepper.querySelector(".stepper__marker").textContent, "check");
const verticalStepper = createStepper({ current: 0, orientation: "vertical", density: "lg", steps: [{ label: "Vehicle" }, { label: "Driver" }, { label: "Confirm" }] });
assert.equal(verticalStepper.dataset.orientation, "vertical");
assert.equal(verticalStepper.dataset.density, "lg");
assert.equal(verticalStepper.querySelectorAll(".stepper__item")[0].dataset.state, "active");
assert.equal(verticalStepper.querySelectorAll(".stepper__item")[1].dataset.state, "pending");

const chartPanel = createChartPanel({ label: "Spend", value: "$12k", caption: "Last 7 days", values: [3, 6, 9] });
assert.equal(chartPanel.tagName, "ARTICLE");
assert.equal(chartPanel.className, "chart-panel");
assert.equal(chartPanel.dataset.chartPrimitive, "charts");
assert.equal(chartPanel.dataset.chartEngine, "echarts-option");
assert.equal(chartPanel.dataset.variant, "sparkline");
assert.equal(chartPanel.querySelector("output").textContent, "$12k");
assert.equal(chartPanel.querySelector("figure").attributes.role, "group");
assert.equal(chartPanel.querySelector(".chart-panel__plot").attributes.role, "list");
assert.equal(chartPanel.querySelector(".chart-panel__svg").tagName, "SVG");
assert.equal(chartPanel.querySelectorAll(".chart-panel__hit-dot").length, 3);
const chartPanelModel = JSON.parse(chartPanel.querySelector(".chart-panel__option").textContent);
assert.equal(chartPanelModel.engine, "apache-echarts");
assert.equal(chartPanelModel.echartsOption.series[0].type, "line");
assert.equal(chartPanelModel.tableFallback.length, 3);
const primitiveChart = createChartsPrimitive({ type: "donut", label: "Mix", segments: [{ label: "Fuel", value: 7 }, { label: "EV", value: 3 }] });
assert.equal(primitiveChart.echartsOption.series[0].type, "pie");
assert.equal(primitiveChart.legendModel.length, 2);
let hydratedOption;
const hydratedChart = hydrateChartPanel(chartPanel, {
  echarts: {
    init(node, theme, options) {
      assert.equal(node.className, "chart-panel__echarts");
      assert.equal(options.renderer, "svg");
      return {
        setOption(option) {
          hydratedOption = option;
        },
      };
    },
  },
});
assert.ok(hydratedChart);
assert.equal(hydratedOption.series[0].type, "line");
assert.equal(chartPanel.querySelector(".chart-panel__plot").attributes.hidden, "true");
const chartPanelLine = createChartPanel({ label: "Spend trend", variant: "line", state: "warning", density: "sm", fullWidth: true, values: [2, 5, 4] });
assert.equal(chartPanelLine.dataset.variant, "line");
assert.equal(chartPanelLine.dataset.state, "warning");
assert.equal(chartPanelLine.dataset.density, "sm");
assert.equal(chartPanelLine.dataset.fullWidth, "true");
const chartPanelBars = createChartPanel({ label: "Spend bars", variant: "bar", values: [3, 6, 9] });
assert.equal(chartPanelBars.dataset.variant, "bars");
assert.equal(chartPanelBars.querySelectorAll(".chart-panel__bar-group").length, 3);
assert.equal(chartPanelBars.querySelectorAll(".chart-panel__bar").length, 3);
assert.equal(chartPanelBars.querySelectorAll(".chart-panel__bar")[2].dataset.max, "true");
const chartPanelBarMark = chartPanelBars.querySelector(".chart-panel__bar-group");
assert.equal(chartPanelBarMark.tabIndex, 0);
assert.match(chartPanelBarMark.dataset.tooltip, /Value 1/);
chartPanelBarMark.dispatchEvent({ type: "mouseenter" });
assert.equal(chartPanelBars.querySelector(".chart-panel__tooltip").dataset.visible, "true");
assert.match(chartPanelBars.querySelector(".chart-panel__tooltip").textContent, /Value 1/);
const chartPanelDonut = createChartPanel({ label: "Spend mix", variant: "donut", values: [3, 6, 9] });
assert.equal(chartPanelDonut.querySelector(".chart-panel__donut-center").textContent, "18");
const chartPanelBullet = createChartPanel({ label: "Targets", variant: "bullet", labels: ["Fuel", "EV"], values: [84, 62] });
assert.equal(chartPanelBullet.querySelectorAll(".chart-panel__bullet").length, 2);
const chartPanelComparison = createChartPanel({
  label: "Spend comparison",
  variant: "comparison",
  labels: ["Mon", "Tue"],
  comparisons: [
    { label: "Previous", values: [42, 58] },
    { label: "Current", values: [54, 72] },
  ],
});
const chartPanelComparisonPlot = chartPanelComparison.querySelector(".chart-panel__plot");
assert.equal(Array.from(chartPanelComparisonPlot.children).filter((child) => String(child.className).split(/\s+/).includes("chart-panel__comparison-group")).length, 2);
assert.equal(chartPanelComparisonPlot.querySelectorAll(".chart-panel__comparison-bar").length, 4);
const chartPanelPareto = createChartPanel({ label: "Cost drivers", variant: "pareto", labels: ["Fuel", "Toll", "Service"], values: [42, 18, 8] });
assert.equal(chartPanelPareto.querySelectorAll(".chart-panel__pareto-bar").length, 3);
assert.equal(chartPanelPareto.querySelectorAll(".chart-panel__pareto-line").length, 1);
const chartPanelMultiLine = createChartPanel({
  label: "Multi trend",
  variant: "line",
  series: [
    { label: "Fuel", values: [32, 54, 48] },
    { label: "EV", values: [18, 24, 36] },
  ],
});
assert.equal(chartPanelMultiLine.querySelectorAll(".chart-panel__line").length, 2);

const stationPin = createStationPin({ label: "Station Norte", value: "$23.4", meta: "Open", variant: "fuel", state: "selected", density: "lg" });
assert.equal(stationPin.tagName, "BUTTON");
assert.equal(stationPin.className, "station-pin");
assert.equal(stationPin.dataset.variant, "fuel");
assert.equal(stationPin.dataset.state, "selected");
assert.equal(stationPin.dataset.density, "lg");
assert.equal(stationPin.attributes["aria-label"], "Station Norte $23.4 Open");
assert.equal(stationPin.attributes["aria-pressed"], "true");
assert.equal(stationPin.querySelector(".station-pin__value").textContent, "$23.4");
assert.equal(stationPin.querySelector(".station-pin__marker").dataset.kind, "icon");
const clusterStationPin = createStationPin({ label: "Station cluster", count: 4, variant: "cluster" });
assert.equal(clusterStationPin.querySelector(".station-pin__marker").textContent, "4");
assert.equal(clusterStationPin.querySelector(".station-pin__marker").dataset.kind, "count");
assert.equal(clusterStationPin.querySelector(".station-pin__value"), null);
const unavailableStationPin = createStationPin({ label: "Closed station", state: "unavailable" });
assert.equal(unavailableStationPin.disabled, true);
assert.equal(unavailableStationPin.dataset.state, "unavailable");

const routeSummary = createRouteSummary({
  label: "Route A",
  description: "Fastest",
  metrics: [{ label: "Stops", value: "8" }],
  actions: [{ label: "Choose" }],
  variant: "compare",
  state: "selected",
  density: "sm",
  icon: "navigation",
  fullWidth: true,
});
assert.equal(routeSummary.tagName, "ARTICLE");
assert.equal(routeSummary.className, "route-summary");
assert.equal(routeSummary.dataset.variant, "compare");
assert.equal(routeSummary.dataset.state, "selected");
assert.equal(routeSummary.dataset.density, "sm");
assert.equal(routeSummary.dataset.fullWidth, "true");
assert.equal(routeSummary.attributes["aria-selected"], "true");
assert.equal(routeSummary.querySelector(".route-summary__icon").textContent, "navigation");
assert.equal(routeSummary.querySelector(".route-summary__metrics").textContent, "Stops8");
assert.equal(routeSummary.querySelector("button").textContent, "Choose");
const disabledRouteSummary = createRouteSummary({ label: "Route B", state: "disabled", actions: [{ label: "Choose" }] });
assert.equal(disabledRouteSummary.attributes["aria-disabled"], "true");
assert.equal(disabledRouteSummary.querySelector("button").disabled, true);
const compactRouteSummary = createRouteSummary({ label: "Hacia G500 Roma Norte", description: "0.9 km · llegas en 4 min", variant: "compact", actions: [{ label: "Cancelar ruta", icon: "close" }] });
assert.equal(compactRouteSummary.dataset.variant, "compact");
assert.equal(compactRouteSummary.querySelector(".route-summary__metrics").children.length, 0);
assert.equal(compactRouteSummary.querySelector(".icon-button__icon").textContent, "close");
assert.equal(compactRouteSummary.querySelector(".icon-button").attributes["aria-label"], "Cancelar ruta");

const codeInput = createCodeInput({ label: "Code", value: "123", length: 4, helper: "Expires soon" });
assert.equal(codeInput.tagName, "LABEL");
assert.equal(codeInput.className, "field code-input");
assert.equal(codeInput.dataset.state, "default");
assert.equal(codeInput.querySelector(".field__label").textContent, "Code");
assert.equal(codeInput.querySelector(".field__helper").textContent, "Expires soon");
assert.equal(codeInput.querySelector(".code-input__slots").attributes["aria-hidden"], "true");
assert.equal(codeInput.querySelector(".code-input__slots").children.length, 4);
assert.equal(codeInput.querySelectorAll("input").length, 1);
const otpLogicalInput = codeInput.querySelectorAll("input")[0];
assert.equal(otpLogicalInput.value, "123");
assert.equal(otpLogicalInput.attributes["data-code-input"], "");
assert.equal(otpLogicalInput.autocomplete, "one-time-code");
assert.equal(otpLogicalInput.attributes.inputmode, "numeric");
assert.equal(otpLogicalInput.attributes.autocomplete, "one-time-code");
assert.equal(otpLogicalInput.attributes.pattern, "[0-9]*");
assert.equal(otpLogicalInput.attributes.maxlength, "4");
assert.equal(codeInput.querySelector(".code-input__slots").children[0].tagName, "SPAN");
assert.equal(codeInput.querySelector(".code-input__slots").children[0].attributes["data-code-slot"], "");
assert.equal(otpLogicalInput.attributes["aria-describedby"], codeInput.querySelector(".field__helper").id);
const maskedOtp = createCodeInput({ label: "Code", value: "123456", variant: "masked" });
assert.equal(maskedOtp.dataset.variant, "masked");
assert.equal(maskedOtp.dataset.masked, "true");
assert.equal(maskedOtp.querySelector(".code-input__slots").children[0].querySelector(".code-input__digit").textContent, "1");
const otpError = createCodeInput({ label: "Code", value: "12", error: "Code expired" });
assert.equal(otpError.dataset.state, "error");
assert.equal(otpError.querySelectorAll("input")[0].attributes["aria-invalid"], "true");
assert.equal(otpError.querySelector(".field__helper").textContent, "Code expired");
let otpValue = "";
let otpComplete = "";
const interactiveOtp = createCodeInput({
  label: "Code",
  length: 4,
  onValueChange(value) {
    otpValue = value;
  },
  onComplete(value) {
    otpComplete = value;
  },
});
const interactiveCodeInput = interactiveOtp.querySelectorAll("input")[0];
interactiveCodeInput.value = "a7890";
interactiveCodeInput.dispatchEvent({ type: "input" });
assert.equal(interactiveCodeInput.value, "7890");
const interactiveOtpSlots = interactiveOtp.querySelector(".code-input__slots").children;
assert.equal(interactiveOtpSlots[0].dataset.filled, "true");
assert.equal(interactiveOtpSlots[3].textContent, "0");
assert.equal(otpValue, "7890");
assert.equal(otpComplete, "7890");
assert.equal(interactiveCodeInput.autocomplete, "one-time-code"); // Native paste and Backspace stay on the single logical input.
interactiveCodeInput.dispatchEvent({ type: "focus" });
assert.equal(interactiveOtp.dataset.focused, "true");
interactiveCodeInput.value = "12";
interactiveCodeInput.dispatchEvent({ type: "input" });
assert.equal(interactiveOtpSlots[2].dataset.active, "true");
interactiveCodeInput.dispatchEvent({ type: "blur" });
assert.equal(interactiveOtp.dataset.focused, "false");

const phoneInput = createPhoneInput({ label: "Phone", value: "5551234", country: "MX", helper: "SMS only" });
assert.equal(phoneInput.tagName, "LABEL");
const phoneInputClasses = phoneInput.className.split(" ");
assert.ok(phoneInputClasses.includes("phone-input"));
assert.ok(phoneInputClasses.includes("field"));
assert.ok(phoneInputClasses.includes("phone-input"));
assert.equal(phoneInput.dataset.state, "default");
assert.equal(phoneInput.querySelector(".field__label").textContent, "Phone");
assert.equal(phoneInput.querySelector(".phone-input__prefix").textContent, "+52");
assert.equal(phoneInput.querySelector(".country-flag").dataset.country, "MX");
assert.equal(phoneInput.querySelector(".phone-input__country").dataset.country, "MX");
assert.equal(phoneInput.querySelector(".phone-input__country-trigger").attributes.role, "combobox");
assert.equal(phoneInput.querySelector(".phone-input__country-trigger").attributes["aria-expanded"], "false");
assert.deepEqual(listCountryFlags().sort(), ["AR", "BR", "CA", "CL", "CO", "CU", "ES", "MX", "PE", "US"]);
assert.equal(phoneInput.querySelectorAll(".phone-input__country-option").length, 10);
assert.equal(phoneInput.querySelector(".phone-input__country-option").attributes.role, "option");
assert.equal(phoneInput.querySelector(".field__helper").textContent, "SMS only");
const phoneField = phoneInput.querySelector(".phone-input__input");
assert.equal(phoneField.type, "tel");
assert.equal(phoneField.className, "input phone-input__input");
assert.equal(phoneField.attributes["data-phone-input"], "");
assert.equal(phoneField.attributes["aria-describedby"], phoneInput.querySelector(".field__helper").id);
assert.equal(phoneField.value, "55 5123 4");
const phoneError = createPhoneInput({ label: "Phone", value: "55", error: "Enter a reachable number." });
assert.equal(phoneError.dataset.state, "error");
assert.equal(phoneError.querySelector(".phone-input__input").attributes["aria-invalid"], "true");
assert.equal(phoneError.querySelector(".field__helper").textContent, "Enter a reachable number.");
let phoneValue = "";
let phoneMeta = {};
const interactivePhone = createPhoneInput({
  label: "Phone",
  country: "MX",
  onValueChange(value, meta) {
    phoneValue = value;
    phoneMeta = meta;
  },
});
const interactivePhoneField = interactivePhone.querySelector(".phone-input__input");
interactivePhoneField.value = "(55) 5123-4567";
interactivePhoneField.dispatchEvent({ type: "input" });
assert.equal(interactivePhoneField.value, "55 5123 4567");
assert.equal(phoneValue, "5551234567");
assert.equal(phoneMeta.country, "MX");
assert.equal(phoneMeta.callingCode, "+52");
assert.equal(phoneMeta.e164, "+525551234567");
interactivePhoneField.value = "+53 7 123 4567";
interactivePhoneField.dispatchEvent({ type: "input" });
assert.equal(interactivePhone.querySelector(".phone-input__prefix").textContent, "+53");
assert.equal(interactivePhone.querySelector(".phone-input__country").dataset.country, "CU");
assert.equal(phoneMeta.country, "CU");
assert.equal(phoneMeta.e164, "+5371234567");

const datePicker = createDatePicker({ label: "Service date", value: "2026-07-13", helper: "One operational date.", min: "2026-01-01", max: "2026-12-31", density: "lg", state: "focus" });
assert.equal(datePicker.tagName, "DIV");
assert.equal(datePicker.className, "field date-picker");
assert.equal(datePicker.dataset.density, "lg");
assert.equal(datePicker.dataset.state, "focus");
assert.equal(datePicker.querySelector(".field__label").textContent, "Service date");
assert.equal(datePicker.querySelector(".date-picker__control").attributes["data-date-picker-trigger"], "");
assert.equal(datePicker.querySelector(".date-picker__control").attributes["aria-controls"], datePicker.querySelector(".date-picker__panel").id);
assert.equal(datePicker.querySelector(".date-picker__control").attributes["aria-labelledby"], datePicker.querySelector(".date-picker__label").id);
assert.equal(datePicker.querySelector(".date-picker__control").attributes["aria-describedby"], datePicker.querySelector(".date-picker__helper").id);
assert.equal(datePicker.querySelector(".date-picker__value").textContent, "13 jul 2026");
assert.equal(datePicker.querySelector(".field__helper").textContent, "One operational date.");
assert.equal(datePicker.querySelector("input").type, "date");
assert.equal(datePicker.querySelector("input").attributes["data-date-picker-input"], "");
assert.equal(datePicker.querySelector("input").min, "2026-01-01");
assert.equal(datePicker.querySelector("input").max, "2026-12-31");
assert.equal(datePicker.querySelector(".date-picker__panel").attributes.role, "dialog");
assert.equal(datePicker.querySelector(".date-picker__panel").attributes["aria-modal"], "false");
assert.equal(datePicker.querySelector(".date-picker__panel").hidden, true);
assert.equal(datePicker.querySelectorAll("strong")[0].textContent, "Julio 2026");
assert.equal(datePicker.querySelector(".date-picker__grid").attributes.role, "grid");
assert.equal(datePicker.querySelector(".date-picker__grid").attributes["aria-labelledby"], datePicker.querySelectorAll("strong")[0].id);
assert.equal(datePicker.querySelectorAll(".date-picker__weekday").map((day) => day.textContent).join(""), "LMXJVSD");
assert.equal(datePicker.querySelectorAll(".date-picker__weekday")[0].attributes.role, "columnheader");
assert.equal(datePicker.querySelectorAll(".date-picker__nav").length, 2);
assert.equal(datePicker.querySelectorAll(".date-picker__day")[0].attributes.role, "gridcell");
assert.equal(Boolean(datePicker.querySelectorAll(".date-picker__day")[0].attributes["aria-label"]), true);
let dateValue = "";
let dateOpen = null;
const interactiveDate = createDatePicker({
  label: "Service date",
  value: "2026-07-13",
  onValueChange(value) {
    dateValue = value;
  },
  onOpenChange(open) {
    dateOpen = open;
  },
});
interactiveDate.querySelector(".date-picker__control").click();
assert.equal(interactiveDate.querySelector(".date-picker__panel").hidden, false);
assert.equal(interactiveDate.querySelector(".date-picker__control").attributes["aria-expanded"], "true");
assert.equal(dateOpen, true);
interactiveDate.querySelectorAll(".date-picker__nav")[1].click();
assert.equal(interactiveDate.querySelectorAll("strong")[0].textContent, "Agosto 2026");
interactiveDate.querySelectorAll(".date-picker__nav")[0].click();
assert.equal(interactiveDate.querySelectorAll("strong")[0].textContent, "Julio 2026");
const nextDateButton = interactiveDate.querySelectorAll(".date-picker__day")
  .find((button) => button.attributes["data-date-picker-day"] === "2026-07-14");
nextDateButton.click();
assert.equal(dateValue, "2026-07-14");
assert.equal(interactiveDate.querySelector("input").value, "2026-07-14");
assert.equal(interactiveDate.querySelector(".date-picker__panel").hidden, true);
assert.equal(globalThis.document.activeElement, interactiveDate.querySelector(".date-picker__control"));

const dateRangePicker = createDateRangePicker({
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
  helper: "One bounded date range.",
  density: "md",
  state: "selected",
});
assert.equal(dateRangePicker.tagName, "DIV");
assert.equal(dateRangePicker.className, "field date-picker date-range-picker");
assert.equal(dateRangePicker.dataset.state, "selected");
assert.equal(dateRangePicker.dataset.from, "2026-07-01");
assert.equal(dateRangePicker.dataset.to, "2026-07-15");
assert.equal(dateRangePicker.querySelector(".date-range-picker__control").attributes["data-date-range-picker-trigger"], "");
assert.equal(dateRangePicker.querySelector(".date-range-picker__control").attributes["aria-controls"], dateRangePicker.querySelector(".date-range-picker__panel").id);
assert.equal(dateRangePicker.querySelector(".date-range-picker__value").textContent, "01 jul 2026 - 15 jul 2026");
assert.equal(dateRangePicker.querySelectorAll(".date-range-picker__preset").length, 3);
assert.equal(dateRangePicker.querySelector(".date-range-picker__panel").attributes.role, "dialog");
assert.equal(dateRangePicker.querySelector(".date-range-picker__grid").attributes.role, "grid");
assert.equal(dateRangePicker.querySelectorAll(".date-range-picker__day").some((day) => day.dataset.rangeEdge === "start"), true);
assert.equal(dateRangePicker.querySelectorAll(".date-range-picker__day").some((day) => day.dataset.rangeEdge === "end"), true);
const dateRangePickerNoPresets = createDateRangePicker({
  label: "Export range",
  value: { from: "2026-07-01", to: "2026-07-09" },
  presets: false,
});
assert.equal(dateRangePickerNoPresets.querySelectorAll(".date-range-picker__preset").length, 0);
let rangeValue = null;
let rangeOpen = null;
const interactiveRange = createDateRangePicker({
  label: "Reporting range",
  value: {},
  onValueChange(value) {
    rangeValue = value;
  },
  onOpenChange(open) {
    rangeOpen = open;
  },
});
interactiveRange.querySelector(".date-range-picker__control").click();
assert.equal(interactiveRange.querySelector(".date-range-picker__panel").hidden, false);
assert.equal(rangeOpen, true);
const firstInteractiveRangeDay = interactiveRange.querySelector(".date-range-picker__day");
const firstInteractiveRangeDate = firstInteractiveRangeDay.attributes["data-date-range-picker-day"];
firstInteractiveRangeDay.click();
assert.equal(rangeValue.from, firstInteractiveRangeDate);
assert.equal(rangeValue.to, "");
assert.equal(interactiveRange.dataset.from, firstInteractiveRangeDate);
interactiveRange.querySelectorAll(".date-range-picker__preset")[0].click();
assert.equal(Boolean(rangeValue.from), true);
assert.equal(Boolean(rangeValue.to), true);
assert.equal(interactiveRange.querySelector(".date-range-picker__panel").hidden, true);

const segmentedControl = createSegmentedControl({
  label: "Range",
  density: "lg",
  selectedKey: "week",
  items: [{ key: "day", label: "Day" }, { key: "week", label: "Week", icon: "calendar_view_week" }],
});
assert.equal(segmentedControl.tagName, "DIV");
assert.equal(segmentedControl.attributes.role, "tablist");
assert.equal(segmentedControl.dataset.density, "lg");
assert.equal(segmentedControl.dataset.variant, "outlined");
assert.equal(segmentedControl.querySelector(".segmented-control__indicator").attributes["aria-hidden"], "true");
assert.equal(segmentedControl.querySelectorAll("button")[0].attributes["data-segmented-control-item"], "");
assert.equal(segmentedControl.querySelectorAll("button")[1].attributes["aria-selected"], "true");
assert.equal(segmentedControl.querySelector(".segmented-control__icon").textContent, "calendar_view_week");
assert.equal(segmentedControl.querySelectorAll("button")[0].tabIndex, -1);
const iconOnlySegments = createSegmentedControl({
  label: "View mode",
  variant: "icon-only",
  selectedKey: "map",
  items: [{ key: "map", label: "Map", icon: "map" }, { key: "list", label: "List", icon: "view_list" }],
});
assert.equal(iconOnlySegments.dataset.variant, "icon-only");
assert.equal(iconOnlySegments.querySelector("button").dataset.iconOnly, "true");
assert.equal(iconOnlySegments.querySelector("button").attributes["aria-label"], "Map");
assert.equal(iconOnlySegments.querySelector(".segmented-control__label").attributes["aria-hidden"], "true");
let segmentChange = "";
const interactiveSegments = createSegmentedControl({
  items: [{ key: "day", label: "Day" }, { key: "week", label: "Week" }, { key: "month", label: "Month", disabled: true }],
  onValueChange(value) {
    segmentChange = value;
  },
});
interactiveSegments.querySelectorAll("button")[1].click();
assert.equal(interactiveSegments.querySelectorAll("button")[1].attributes["aria-selected"], "true");
assert.equal(segmentChange, "week");
interactiveSegments.querySelectorAll("button")[1].dispatchEvent({ type: "keydown", key: "ArrowRight", preventDefault() { this.defaultPrevented = true; } });
assert.equal(interactiveSegments.querySelectorAll("button")[0].attributes["aria-selected"], "true");
assert.equal(globalThis.document.activeElement, interactiveSegments.querySelectorAll("button")[0]);

const popover = createPopover({ triggerLabel: "Details", title: "Card status", description: "Active", id: "card-popover", density: "sm", variant: "metric", placement: "top" });
assert.equal(popover.tagName, "SPAN");
assert.equal(popover.className, "popover");
assert.equal(popover.dataset.density, "sm");
assert.equal(popover.dataset.variant, "metric");
assert.equal(popover.dataset.placement, "top");
assert.equal(popover.querySelector("button").dataset.density, "sm");
assert.equal(popover.querySelector("button").attributes["aria-haspopup"], "dialog");
assert.equal(popover.querySelector("button").attributes["data-popover-trigger"], "");
assert.equal(popover.querySelector(".popover__panel").id, "card-popover");
assert.equal(popover.querySelector(".popover__panel").hidden, true);
let popoverOpen = null;
let popoverAction = "";
const interactivePopover = createPopover({
  triggerLabel: "Details",
  title: "Card status",
  variant: "action",
  actions: [{ label: "Apply", key: "apply" }],
  onOpenChange(open) {
    popoverOpen = open;
  },
  onAction(key) {
    popoverAction = key;
  },
});
interactivePopover.querySelector("button").click();
assert.equal(interactivePopover.querySelector(".popover__panel").hidden, false);
assert.equal(interactivePopover.querySelector("button").attributes["aria-expanded"], "true");
assert.equal(popoverOpen, true);
interactivePopover.querySelectorAll("button")[1].click();
assert.equal(interactivePopover.querySelector(".popover__panel").hidden, true);
assert.equal(popoverAction, "apply");
interactivePopover.querySelector("button").click();
interactivePopover.querySelector(".popover__panel").dispatchEvent({ type: "keydown", key: "Escape", preventDefault() { this.defaultPrevented = true; } });
assert.equal(interactivePopover.querySelector(".popover__panel").hidden, true);
assert.equal(globalThis.document.activeElement, interactivePopover.querySelector("button"));
interactivePopover.querySelector("button").click();
globalThis.document.dispatchEvent({ type: "pointerdown", target: document.createElement("span") });
assert.equal(interactivePopover.querySelector(".popover__panel").hidden, true);
const formPopover = createPopover({ triggerLabel: "Edit", title: "Local edit", variant: "form", field: { label: "Limit", value: "$500" }, open: true });
assert.equal(formPopover.querySelector(".field").dataset.density, "md");

const cardSummary = createCardSummary({ label: "Fuel card", meta: "Ana Sosa", number: "•••• 0420", expires: "12/28", status: "Active", metrics: [{ label: "Limit", value: "$900" }] });
assert.equal(cardSummary.tagName, "ARTICLE");
assert.equal(cardSummary.className, "card-summary");
assert.equal(cardSummary.querySelector(".card-summary__number").textContent, "•••• 0420");
assert.equal(cardSummary.querySelector(".card-summary__expires").textContent, "12/28");
assert.equal(cardSummary.querySelector(".card-summary__metrics"), null);
const limitCardSummary = createCardSummary({ variant: "limit", label: "Fleet", meta: "Ana Sosa", number: "•••• 0420", metrics: [{ label: "Limit", value: "$900" }] });
assert.equal(limitCardSummary.querySelector(".card-summary__metrics").textContent, "Limit$900");
const frozenCardSummary = createCardSummary({ state: "frozen", label: "Fleet", meta: "Ana Sosa", number: "•••• 0420" });
assert.equal(frozenCardSummary.querySelector(".card-summary__frost").textContent, "ac_unitFrozen");

const movementRow = createMovementRow({ label: "Fuel purchase", meta: "Today", amount: "−$842.00", status: "Pending", category: "fuel", state: "pending", density: "sm" });
assert.equal(movementRow.tagName, "BUTTON");
assert.equal(movementRow.className, "movement-row");
assert.equal(movementRow.dataset.category, "fuel");
assert.equal(movementRow.dataset.state, "pending");
assert.equal(movementRow.dataset.density, "sm");
assert.equal(movementRow.querySelector(".movement-row__icon").textContent, "local_gas_station");
assert.equal(movementRow.querySelector(".movement-row__content").textContent, "Fuel purchaseToday");
assert.equal(movementRow.querySelector(".movement-row__value").textContent, "−$842.00Pending");

const quickAction = createQuickAction({ label: "Freeze", icon: "lock", badge: "2", variant: "destructive", state: "warning", density: "sm" });
assert.equal(quickAction.tagName, "DIV");
assert.equal(quickAction.className, "quick-action");
assert.equal(quickAction.dataset.variant, "destructive");
assert.equal(quickAction.dataset.state, "warning");
assert.equal(quickAction.dataset.density, "sm");
assert.equal(quickAction.querySelector(".quick-action__control").tagName, "BUTTON");
assert.equal(quickAction.querySelector(".quick-action__control").attributes["aria-label"], "Freeze");
assert.equal(quickAction.querySelector(".quick-action__icon").attributes["aria-hidden"], "true");
assert.equal(quickAction.querySelector(".badge").textContent, "2");
const loadingQuickAction = createQuickAction({ label: "Sync", state: "loading" });
assert.equal(loadingQuickAction.querySelector(".quick-action__control").attributes["aria-busy"], "true");
assert.equal(loadingQuickAction.querySelector(".spinner").dataset.density, "sm");

console.log("components smoke tests passed");
