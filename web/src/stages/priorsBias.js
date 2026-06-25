import { runPriors } from "./priorsCommon.js";

// Mirror of stages/1_4_priors_bias.
export function runPriorsBias(mount) {
  return runPriors(mount, {
    keyPrefix: "prior_bias",
    lowLabel: "No bias (0)",
    highLabel: "(100) Extremely biased",
    repPrompt:
      "What is the level of bias you would expect from a typical Republican on this platform, about each of the following topics?",
    demPrompt:
      "What is the level of bias you would expect from a typical Democrat on this platform, about each of the following topics?",
  });
}
