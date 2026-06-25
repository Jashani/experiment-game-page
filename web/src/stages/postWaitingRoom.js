import { el } from "../util.js";

// Mirror of stages/3_2_post_waiting_room — "matched" screen before the discussion.

const BODY = `We are ready to begin!

You will be shown a list of headlines and asked to answer some questions about them alongside other participants.

You have been randomly assigned to be the second commenter in each round.

Once you press 'Begin', you will be taken to the first headline.`;

export function runPostWaitingRoom(mount) {
  return new Promise((resolve) => {
    const begin = el("button.proceed-button", { type: "button", text: "Begin" });
    begin.addEventListener("click", () => resolve());

    mount.append(
      el("div.stage.center-stage", {}, [
        el("div.post-waiting-box", {}, [
          el("p.post-waiting-text", { text: BODY }),
          begin,
        ]),
      ])
    );
  });
}
