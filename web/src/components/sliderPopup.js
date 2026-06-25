import { el, clamp } from "../util.js";
import { Data } from "../singletons/data.js";

// Mirror of components/slider_popup.gd + slider_popup.tscn.
// Appears inside the chat panel; resolves `complete` when the participant
// submits. Submit stays disabled until the slider is touched.

export class SliderPopup {
  constructor() {
    this.minValue = 0.0;
    this.maxValue = 100.0;
    this.dataKey = "";

    this.title = el("div.popup-title");
    this.valueLabel = el("div.slider-value");
    this.slider = el("input.slider", {
      type: "range",
      min: "0",
      max: "100",
      step: "1",
      value: "50",
    });
    this.labelsContainer = el("div.slider-labels");
    this.submitButton = el("button.submit-button", { type: "button", text: "Submit", disabled: true });

    this.root = el("div.popup.slider-popup", {}, [
      this.title,
      this.valueLabel,
      this.slider,
      this.labelsContainer,
      this.submitButton,
    ]);

    this._completeResolvers = [];

    this.slider.addEventListener("input", () => {
      this.setValueLabel(this.value);
      this.submitButton.disabled = false; // drag_started → enable submit
    });
    this.submitButton.addEventListener("click", () => this._onSubmit());
  }

  get value() {
    return parseFloat(this.slider.value);
  }

  // Resolves when the participant submits.
  complete() {
    return new Promise((resolve) => this._completeResolvers.push(resolve));
  }

  fromResource(prompt) {
    this.setTitle(prompt.text);
    this.setLabels(prompt.labels);
    this.dataKey = prompt.columnName;
    this.setLimits(prompt.minValue, prompt.maxValue);
    this.slider.value = String(prompt.value);
    this.setValueLabel(this.value);
  }

  setLimits(minLimit, maxLimit) {
    this.minValue = minLimit;
    this.maxValue = maxLimit;
    this.slider.min = String(minLimit);
    this.slider.max = String(maxLimit);
  }

  setTitle(text) {
    this.title.textContent = text;
  }

  setValueLabel(value) {
    value = clamp(value, this.minValue, this.maxValue);
    const rounded = Math.round(value);
    if (this.minValue < 0.0) {
      const absVal = Math.abs(rounded);
      if (rounded < 0) this.valueLabel.textContent = `${absVal}% left bias`;
      else if (rounded > 0) this.valueLabel.textContent = `${absVal}% right bias`;
      else this.valueLabel.textContent = "0%";
    } else {
      this.valueLabel.textContent = `${rounded}%`;
    }
  }

  setLabels(values) {
    this.labelsContainer.replaceChildren();
    values.forEach((value, i) => {
      const label = el("div.slider-end-label", { text: value });
      if (i === 0) label.style.textAlign = "left";
      else if (i === values.length - 1) label.style.textAlign = "right";
      else label.style.textAlign = "center";
      this.labelsContainer.append(label);
    });
  }

  _onSubmit() {
    Data.saveValue(this.dataKey, this.value);
    const resolvers = this._completeResolvers;
    this._completeResolvers = [];
    this.root.remove();
    for (const resolve of resolvers) resolve();
  }
}
