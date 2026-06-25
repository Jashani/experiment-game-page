import { el } from "../util.js";
import { Data } from "../singletons/data.js";

// Mirror of stages/6_end — shows the debrief and triggers the data save, which
// hands results back to the embedding jsPsych page (Data.onComplete).

const DEBRIEF = `Thank you for completing the study! All the headlines you viewed were intentionally fabricated for research purposes and did not describe true statements. The other players you interacted with were simulated profiles rather than real participants. This allowed us to keep the information you received consistent across the study and to examine how people evaluate news stories in controlled social settings. If you have any further questions please email greta.sanna.23@ucl.ac.uk`;

export function runEnd(mount) {
  mount.append(
    el("div.stage.center-stage", {}, [
      el("div.debrief-box", {}, [
        el("h1", { text: "Debrief" }),
        el("p", { text: DEBRIEF }),
      ]),
    ])
  );
  Data.saveData();
}
