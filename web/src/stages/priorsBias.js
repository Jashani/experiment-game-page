import { runPriors } from "./priorsCommon.js";
import { Config } from "../singletons/config.js";

// Mirror of stages/1_4_priors_bias.
export function runPriorsBias(mount) {
  const cfg = Config.config["priors_bias"];
  return runPriors(mount, {
    keyPrefix: "prior_bias",
    lowLabel: cfg["low_label"],
    highLabel: cfg["high_label"],
    repPrompt: cfg["rep_prompt"],
    demPrompt: cfg["dem_prompt"],
  });
}
