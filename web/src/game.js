import { Config } from "./singletons/config.js";
import { Scenarios } from "./singletons/scenarios.js";
import { Data } from "./singletons/data.js";

import { runInstructions1 } from "./stages/instructions1.js";
import { runInstructions2 } from "./stages/instructions2.js";
import { runLeaning } from "./stages/leaning.js";
import { runPriorsAccuracy } from "./stages/priorsAccuracy.js";
import { runPriorsBias } from "./stages/priorsBias.js";
import { runWaitingRoom } from "./stages/waitingRoom.js";
import { runPostWaitingRoom } from "./stages/postWaitingRoom.js";
import { runDiscussionRoom } from "./stages/discussionRoom.js";
import { runDemographics } from "./stages/demographics.js";
import { runEnd } from "./stages/end.js";

// Stage execution order, taken from the Godot next_scene chain (which does NOT
// follow the folder numbering — leaning runs between the instructions and the
// priors stages).
const STAGES = [
  runInstructions1,
  runInstructions2,
  runLeaning,
  runPriorsAccuracy,
  runPriorsBias,
  runWaitingRoom,
  runPostWaitingRoom,
  runDiscussionRoom,
  runDemographics,
  runEnd,
];

// Boots the game inside `mount` and resolves with the results dictionary once
// the end stage saves data. Equivalent to the autoload startup + scene flow.
export async function runGame(mount, { configPath, scenariosPath } = {}) {
  // Autoloads: load config + scenarios, then initialise Data.
  await Config.load(configPath || "config.json");
  await Scenarios.load(scenariosPath || "scenarios.json");
  Data.rounds = [];
  Data.results = {};
  Data.init();

  const resultsPromise = new Promise((resolve) => {
    Data.onComplete = resolve;
  });

  for (const stage of STAGES) {
    mount.replaceChildren(); // change_scene_to_packed — clear the previous stage
    await stage(mount);
  }

  return resultsPromise;
}
