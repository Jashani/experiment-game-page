import { pickRandom } from "../util.js";

// Mirror of resources/affiliation.gd plus the .tres data (colours + icon sets).
export class Affiliation {
  constructor(text, color, icons) {
    this.text = text; // "Republican" / "Democrat"
    this.color = color; // CSS colour string
    this.icons = icons; // array of icon URLs
  }

  randomIcon() {
    return pickRandom(this.icons);
  }
}

const ICONS_BASE = "assets/icons/";

function iconSet(prefix) {
  // The .tres resources reference icons 0..8 (nine each).
  return Array.from({ length: 9 }, (_, i) => `${ICONS_BASE}${prefix}_icon_${i}.png`);
}

// Colours from rep_affiliation.tres / dem_affiliation.tres (Godot Color → rgb).
export const Affiliations = {
  // Color(0.845857, 0.344829, 0.339471)
  republican: new Affiliation("Republican", "rgb(216, 88, 87)", iconSet("red")),
  // Color(0.292278, 0.588872, 0.85269)
  democrat: new Affiliation("Democrat", "rgb(75, 150, 217)", iconSet("blue")),
};
