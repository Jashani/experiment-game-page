import { el } from "../util.js";
import { Globals } from "../singletons/globals.js";
import { Demographics } from "../resources/demographics.js";

// Mirror of stages/2_1_leaning — participant selects political affiliation.
// Sets Globals.player_affiliation / player_icon and seeds the Demographics
// object (its affiliation field is reused later by the demographics stage).

export function runLeaning(mount) {
  return new Promise((resolve) => {
    const demographics = new Demographics();

    function pick(affiliationKey) {
      Globals.playerAffiliation = Globals.affiliations[affiliationKey];
      demographics.affiliation = Globals.playerAffiliation.text;
      Globals.playerDemographics = demographics;
      Globals.playerIcon = Globals.playerAffiliation.randomIcon(); // TODO: REMOVE (mirrors original)
      resolve();
    }

    function makeOption(affiliationKey) {
      const affil = Globals.affiliations[affiliationKey];
      const icon = el("img.leaning-option-icon", { src: affil.icons[7], alt: affil.text });
      const label = el("span.leaning-option-label", { text: affil.text });
      label.style.color = affil.color;
      const btn = el("button.leaning-option", { type: "button" }, [icon, label]);
      btn.addEventListener("click", () => pick(affiliationKey));
      return btn;
    }

    mount.append(
      el("div.stage.center-stage", {}, [
        el("div.panel.leaning-panel", {}, [
          el("h2", { text: "What best describes your political leaning?" }),
          el("div.leaning-options", {}, [
            makeOption("republican"),
            makeOption("democrat"),
          ]),
        ]),
      ])
    );
  });
}
