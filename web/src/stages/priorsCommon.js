import { el } from "../util.js";
import { Data } from "../singletons/data.js";

// Shared builder for stages/1_3_priors_accuracy and 1_4_priors_bias.
// Both show a Republican and a Democrat section (order randomised), each with
// four 0–100 topic sliders that must all be touched before proceeding.

const TOPICS = [
  { name: "Crime", key: "crime" },
  { name: "Education", key: "education" },
  { name: "Immigration", key: "immigration" },
  { name: "Environment", key: "environment" },
];

// opts: { repPrompt, demPrompt, lowLabel, highLabel, keyPrefix }
export function runPriors(mount, opts) {
  return new Promise((resolve) => {
    const touched = {}; // "<party>_<topic>" → true
    const required = [];
    const sliders = {}; // same key → input element

    const proceed = el("button.proceed-button", { type: "button", text: "Proceed", disabled: true });
    const hint = el("div.proceed-hint", { text: "Please interact with all sliders to continue..." });

    function markTouched(key) {
      touched[key] = true;
      proceed.disabled = !required.every((k) => touched[k]);
    }

    function buildSection(party, promptText) {
      const rows = TOPICS.map((topic) => {
        const fullKey = `${party}_${topic.key}`;
        required.push(fullKey);

        const valueLabel = el("div.prior-value", { text: "50" });
        const slider = el("input.slider", {
          type: "range",
          min: "0",
          max: "100",
          step: "1",
          value: "50",
        });
        sliders[fullKey] = slider;
        slider.addEventListener("input", () => {
          valueLabel.textContent = String(Math.trunc(parseFloat(slider.value)));
          markTouched(fullKey);
        });

        return el("div.prior-row", {}, [
          el("div.prior-topic", { text: topic.name }),
          slider,
          valueLabel,
        ]);
      });

      return el("div.prior-section", {}, [
        el("p.prior-prompt", { text: promptText }),
        el("div.prior-scale", {}, [
          el("span", { text: opts.lowLabel }),
          el("span", { text: opts.highLabel }),
        ]),
        ...rows,
      ]);
    }

    const repSection = buildSection("republican", opts.repPrompt);
    const demSection = buildSection("democrat", opts.demPrompt);

    const sections = el("div.prior-sections", {}, [repSection, demSection]);
    // _ready: 50% chance to move the Democrat section to the front.
    if (Math.floor(Math.random() * 2) === 0) {
      sections.insertBefore(demSection, repSection);
    }

    proceed.addEventListener("click", () => {
      for (const topic of TOPICS) {
        Data.saveGlobally(
          `${opts.keyPrefix}_republican_${topic.key}`,
          parseFloat(sliders[`republican_${topic.key}`].value)
        );
        Data.saveGlobally(
          `${opts.keyPrefix}_democrat_${topic.key}`,
          parseFloat(sliders[`democrat_${topic.key}`].value)
        );
      }
      resolve();
    });

    mount.append(
      el("div.stage.scroll-stage", {}, [
        el("div.stage-content", {}, [
          el("h1", { text: "About other users" }),
          sections,
          el("div.proceed-row", {}, [hint, proceed]),
        ]),
      ])
    );
  });
}
