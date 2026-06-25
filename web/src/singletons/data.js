// Mirror of data.gd — collects per-round and global data, then hands the
// finished results dictionary back to the embedding jsPsych page.

class DataSingleton {
  constructor() {
    this.rounds = []; // Array<dict>, one per round
    this.participantId = 0; // TODO: set properly (matches data.gd)
    this.results = {};
    // Resolved by the host (main.js) when save_data() runs.
    this.onComplete = null;
  }

  // Called once at game startup (mirrors data.gd _ready).
  init() {
    this.saveGlobally("participant_id", this.participantId);
  }

  newRound(round) {
    this.rounds.push({
      scenario_id: round.id,
      headline_type: round.type,
      npc_affiliation: round.response["affiliation"],
      comment: round.response["text"],
      comment_leaning: round.response["type"],
    });
  }

  saveValue(key, value) {
    console.assert(this.rounds.length > 0, "Trying to save value, but no rounds!");
    this.rounds[this.rounds.length - 1][key] = value;
  }

  saveGlobally(key, value) {
    this.results[key] = value;
  }

  saveData() {
    this.results["rounds"] = this.rounds;
    console.log(this.results);
    if (this.onComplete) this.onComplete(this.results);
  }
}

export const Data = new DataSingleton();
