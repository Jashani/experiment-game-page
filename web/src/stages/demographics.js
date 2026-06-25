import { el } from "../util.js";
import { Data } from "../singletons/data.js";
import { Globals } from "../singletons/globals.js";

// Mirror of stages/5_demographics. Reuses Globals.player_demographics (its
// affiliation was set in the leaning stage) and adds age/gender/education plus
// the required sharing-feeling response and optional feedback.

const EDUCATION_OPTIONS = [
  "12th grade or less",
  "High school or equivalent",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
  "Other",
  "Prefer not to say",
];

const GENDER_OPTIONS = ["Female", "Male", "Other", "Prefer not to say"];

function dropdown(options) {
  return el(
    "select.demographics-select",
    {},
    [el("option", { value: "", text: "Select...", disabled: true, selected: true })].concat(
      options.map((o) => el("option", { value: o, text: o }))
    )
  );
}

export function runDemographics(mount) {
  return new Promise((resolve) => {
    const demographics = Globals.playerDemographics;
    let sharingFeeling = "";
    let feedback = "";

    const ageInput = el("input.demographics-input", {
      type: "number",
      placeholder: "Age",
    });
    const ageError = el("div.age-error");
    const educationSelect = dropdown(EDUCATION_OPTIONS);
    const genderSelect = dropdown(GENDER_OPTIONS);
    const sharingBox = el("textarea.demographics-text", { placeholder: "(Required)" });
    const feedbackBox = el("textarea.demographics-text", { placeholder: "(Optional)" });

    const proceed = el("button.proceed-button", { type: "button", text: "Proceed", disabled: true });
    const hint = el("div.proceed-hint", { text: "Please fill all values to continue..." });

    let ageValid = false;

    function checkCompletion() {
      const fields = [demographics.education, demographics.gender, sharingFeeling];
      proceed.disabled = !ageValid || fields.includes("");
    }

    ageInput.addEventListener("input", () => {
      const raw = ageInput.value;
      if (raw === "") {
        ageValid = false;
        ageError.textContent = "";
      } else {
        const n = parseInt(raw, 10);
        if (n < 18) {
          ageError.textContent = "Age must be at least 18.";
          ageValid = false;
        } else if (n > 150) {
          ageError.textContent = "Age must be 150 or less.";
          ageValid = false;
        } else {
          ageError.textContent = "";
          demographics.age = n;
          ageValid = true;
        }
      }
      checkCompletion();
    });
    educationSelect.addEventListener("change", () => {
      demographics.education = educationSelect.value;
      checkCompletion();
    });
    genderSelect.addEventListener("change", () => {
      demographics.gender = genderSelect.value;
      checkCompletion();
    });
    sharingBox.addEventListener("input", () => {
      sharingFeeling = sharingBox.value;
      checkCompletion();
    });
    feedbackBox.addEventListener("input", () => {
      feedback = feedbackBox.value;
    });

    proceed.addEventListener("click", () => {
      Data.saveGlobally("age", demographics.age);
      Data.saveGlobally("gender", demographics.gender);
      Data.saveGlobally("education", demographics.education);
      Data.saveGlobally("sharing_feeling", sharingFeeling);
      Data.saveGlobally("feedback", feedback);
      Data.saveGlobally("participant_affiliation", demographics.affiliation);
      resolve();
    });

    mount.append(
      el("div.stage.scroll-stage", {}, [
        el("div.stage-content", {}, [
          el("p.demographics-intro", {
            text: "Please let us know a little bit about yourself! All data is anonymized.",
          }),
          el("label.demographics-label", { text: "What is your age?" }),
          ageInput,
          ageError,
          el("label.demographics-label", {
            text: "What is the highest level of education you have completed?",
          }),
          educationSelect,
          el("label.demographics-label", { text: "What is your gender?" }),
          genderSelect,
          el("label.demographics-label", {
            text: "How did you feel about having to share your views with other participants?",
          }),
          sharingBox,
          el("label.demographics-label", {
            text: "Do you have any comments? Anything you found particularly confusing or interesting?",
          }),
          feedbackBox,
          el("div.proceed-row", {}, [hint, proceed]),
        ]),
      ])
    );
  });
}
