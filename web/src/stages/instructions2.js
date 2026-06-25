import { el } from "../util.js";

// Mirror of stages/1_2_instructions — task instructions, single proceed button.

const INSTRUCTIONS_HTML = `
<p>Thank you for taking part in this study. In this task you will be placed in a shared discussion space where several participants are evaluating a set of news headlines at the same time.</p>
<p>You will rate each headline and then see comments that appear from other users with different political backgrounds.</p>
<p>Your own comments will also appear in the shared space and can be viewed by other participants. Please share your honest judgement as we are genuinely interested in your opinions.</p>
`;

export function runInstructions2(mount) {
  return new Promise((resolve) => {
    const proceed = el("button.proceed-button", { type: "button", text: "Agree & proceed" });
    proceed.addEventListener("click", () => resolve());

    mount.append(
      el("div.stage.scroll-stage", {}, [
        el("div.stage-content", {}, [
          el("h1", { text: "Instructions" }),
          el("div.rich-text", { html: INSTRUCTIONS_HTML }),
          proceed,
        ]),
      ])
    );
  });
}
