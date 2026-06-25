import { runPriors } from "./priorsCommon.js";

// Mirror of stages/1_3_priors_accuracy.
export function runPriorsAccuracy(mount) {
  return runPriors(mount, {
    keyPrefix: "prior_accuracy",
    lowLabel: "Not at all (0)",
    highLabel: "(100) Completely",
    repPrompt:
      "Imagine a typical Republican user on this platform who is presented with a politically neutral headline on the following topics. How likely are they to be right about the veracity of the headline?",
    demPrompt:
      "Imagine a typical Democrat user on this platform who is presented with a politically neutral headline on the following topics. How likely are they to be right about the veracity of the headline?",
  });
}
