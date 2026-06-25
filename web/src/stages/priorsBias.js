import { runPriors } from "./priorsCommon.js";

// Mirror of stages/1_4_priors_bias.
export function runPriorsBias(mount) {
  return runPriors(mount, {
    keyPrefix: "prior_bias",
    lowLabel: "No bias",
    highLabel: "Extremely biased",
    repPrompt:
      "What is the level of bias you would expect from a typical Republican on this platform, about each of the following topics?\n\nA stronger bias means they are more likely to endorse claims that align with their party's view or reject claims that misalign with it, regardless of whether those claims are true.",
    demPrompt:
      "What is the level of bias you would expect from a typical Democrat on this platform, about each of the following topics?\n\nA stronger bias means they are more likely to endorse claims that align with their party's view or reject claims that misalign with it, regardless of whether those claims are true.",
  });
}
