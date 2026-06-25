import { Affiliations } from "../resources/affiliation.js";

// Mirror of globals.gd — player state shared across stages.

export const Opinion = Object.freeze({ SUPPORT: 0, UNSURE: 1, OPPOSE: 2 });

class GlobalsSingleton {
  constructor() {
    this.playerIcon = null; // icon URL
    this.playerDemographics = null; // Demographics
    this.playerAffiliation = null; // Affiliation
    this.affiliations = Affiliations;
  }

  strToAffiliation(string) {
    switch (string.toLowerCase()) {
      case "right":
        return this.affiliations.republican;
      case "left":
        return this.affiliations.democrat;
      default:
        console.error("Failed to parse str to affiliation: " + string);
    }
    return null;
  }

  strToOpinion(string) {
    switch (string.toLowerCase()) {
      case "support":
        return Opinion.SUPPORT;
      case "unsure":
        return Opinion.UNSURE;
      case "oppose":
        return Opinion.OPPOSE;
      default:
        console.error("Failed to parse str to opinion: " + string);
    }
    return -1;
  }
}

export const Globals = new GlobalsSingleton();
