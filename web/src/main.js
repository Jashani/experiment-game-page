import { runGame } from "./game.js";

// Flattening logic carried over verbatim from the old Godot index.html so the
// OSF CSV columns stay identical (round_N_<prop> + flat globals).
function flattenGodotData(rawData) {
  const flatData = {};
  for (const key in rawData) {
    if (!Array.isArray(rawData[key]) && typeof rawData[key] !== "object") {
      flatData[key] = rawData[key];
    }
  }
  if (rawData.rounds && Array.isArray(rawData.rounds)) {
    rawData.rounds.forEach((item, index) => {
      const i = index + 1;
      for (const prop in item) {
        flatData[`round_${i}_${prop}`] = item[prop];
      }
    });
  }
  return flatData;
}

// Custom jsPsych plugin replacing the Godot iframe. Runs the native-JS game in
// a full-screen overlay and finishes the trial with the same flattened data the
// old receiveGodotData() handler produced.
class Protocol3GamePlugin {
  static info = { name: "protocol3-game", parameters: {} };

  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element) {
    const overlay = document.createElement("div");
    overlay.id = "p3-game-overlay";
    const mount = document.createElement("div");
    mount.id = "p3-game-root";
    overlay.appendChild(mount);
    document.body.appendChild(overlay);

    runGame(mount)
      .then((results) => {
        const data = flattenGodotData(results);
        overlay.remove();
        this.jsPsych.finishTrial(data);
      })
      .catch((error) => {
        console.error("Protocol 3 game error:", error);
        overlay.remove();
        this.jsPsych.finishTrial({ error: String(error) });
      });
  }
}

/* -----------------------------------------------------------
   EXPERIMENT TIMELINE  (preserved from the original index.html)
   ----------------------------------------------------------- */

const jsPsych = initJsPsych();
const timeline = [];

jsPsych.data.addProperties({
  prolific_id: jsPsych.data.getURLVariable("PROLIFIC_PID"),
  study_id: jsPsych.data.getURLVariable("STUDY_ID"),
  session_id: jsPsych.data.getURLVariable("SESSION_ID"),
});

// --- SCREEN 1: Welcome ---
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <h1>Welcome</h1>
    <p>Once you proceed, the task will load and you will receive instructions.</p>
    <p>Please do not refresh the page through the experiment.</p>
    <p>Press any key to begin.</p>
  `,
});

// --- SCREEN 2: The Game (native JS, formerly the Godot iframe) ---
timeline.push({ type: Protocol3GamePlugin });

// --- SCREEN 3: Save Data to OSF ---
timeline.push({
  type: jsPsychPipe,
  action: "save",
  experiment_id: "RHWILWMcmO8T",
  filename: `data_${jsPsych.randomization.randomID(10)}.csv`,
  data_string: () => jsPsych.data.get().csv(),
});

// --- SCREEN 4: End / redirect to Prolific ---
const prolificLink = "https://app.prolific.com/submissions/complete?cc=C1QMLO4J";
function Redirect() {
  window.location.href = prolificLink;
}

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <h1>Thank you!</h1>
    <p>Your results have been uploaded successfully.</p>
    <p>Press any key to be redirected to Prolific.</p>
  `,
  on_finish: Redirect,
});

jsPsych.run(timeline);
