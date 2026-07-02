import { runPriors } from "./priorsCommon.js";
import { Config } from "../singletons/config.js";

// Mirror of stages/1_3_priors_accuracy.
export function runPriorsAccuracy(mount) {
  const cfg = Config.config["priors_accuracy"];
  return runPriors(mount, {
    keyPrefix: "prior_accuracy",
    lowLabel: cfg["low_label"],
    highLabel: cfg["high_label"],
    repPrompt: cfg["rep_prompt"],
    demPrompt: cfg["dem_prompt"],
  });
}
