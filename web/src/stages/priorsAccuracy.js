import { runPriors } from "./priorsCommon.js";

// Mirror of stages/1_3_priors_accuracy.
export function runPriorsAccuracy(mount) {
  return runPriors(mount, {
    keyPrefix: "prior_accuracy",
    lowLabel: "Not at all likely",
    highLabel: "Extremely likely",
    repPrompt:
      "Imagine a typical Republican user on this platform who is presented with a politically neutral headline on the following topics. How likely are they to have the knowledge to correctly identify whether the headline is true or false?",
    demPrompt:
      "Imagine a typical Democrat user on this platform who is presented with a politically neutral headline on the following topics. How likely are they to have the knowledge to correctly identify whether the headline is true or false?",
  });
}
