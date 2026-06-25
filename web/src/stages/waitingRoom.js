import { el } from "../util.js";

// Mirror of stages/3_1_waiting_room — fake matchmaking wait.
// WAIT_SECONDS controls the fixed wait duration. To change it, edit that constant.

const WAIT_SECONDS = 5.0;
const BASE_TEXT = "Waiting for other players";

export function runWaitingRoom(mount) {
  return new Promise((resolve) => {
    const label = el("div.waiting-label", { text: BASE_TEXT + "." });

    mount.append(
      el("div.stage.center-stage", {}, [el("div.waiting-box", {}, [label])])
    );

    // Cycling dots animation.
    let dots = ".";
    const dotsInterval = setInterval(() => {
      dots = dots.length >= 3 ? "" : dots;
      dots += ".";
      label.textContent = BASE_TEXT + dots;
    }, 500);

    setTimeout(() => {
      clearInterval(dotsInterval);
      resolve();
    }, WAIT_SECONDS * 1000);
  });
}
