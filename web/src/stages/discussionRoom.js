import { el, wait, randfRange } from "../util.js";
import { Scenarios } from "../singletons/scenarios.js";
import { Config } from "../singletons/config.js";
import { Data } from "../singletons/data.js";
import { Globals } from "../singletons/globals.js";
import { Prompt, Stage } from "../resources/prompt.js";
import { Message } from "../components/message.js";
import { SliderPopup } from "../components/sliderPopup.js";
import { OpinionPopup } from "../components/opinionPopup.js";

// Mirror of stages/4_discussion_room — the core loop. In Godot the scene
// reloads itself per scenario; here we loop until the scenario pool is empty,
// rebuilding the chat UI fresh each round.

const MAX_WAIT_FOR_NPC_RESPONSE = 3.0;
const MIN_WAIT_FOR_NPC_RESPONSE = 0.0;
const WAIT_BEFORE_PROMPT = 2.0;
const WAIT_AFTER_LAST_RESPONSE = 5.0;

export async function runDiscussionRoom(mount) {
  const total = Scenarios.totalScenarios;
  let roundNum = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    roundNum++;
    const round = Scenarios.getScenario();
    await runRound(mount, round, roundNum, total);
    if (Scenarios.remainingScenarios() === 0) break;
  }
}

async function runRound(mount, round, roundNum, total) {
  Data.newRound(round);

  // Each round is a fresh scene in Godot (the room reloads itself).
  mount.replaceChildren();

  const roundLabel = el("div.round-counter", { text: `Headline ${roundNum} of ${total}` });
  const titleLabel = el("h1.room-title", { text: round.title });
  const messagesContainer = el("div.messages");
  const scroll = el("div.messages-scroll", {}, [messagesContainer]);
  const chatContainer = el("div.chat-input-area"); // popups appear here, bottom

  // Keep the message log pinned to the bottom (scroll_container.gd behaviour).
  const observer = new MutationObserver(() => {
    scroll.scrollTop = scroll.scrollHeight;
  });
  observer.observe(messagesContainer, { childList: true, subtree: true, characterData: true });

  mount.append(
    el("div.stage.discussion-room", {}, [
      el("div.room-panel", {}, [
        el("div.room-header", {}, [roundLabel, titleLabel]),
        scroll,
        chatContainer,
      ]),
    ])
  );

  const { before, after } = getPrompts();

  // last_slider_value persists across the round (used by use_previous prompts).
  const state = { lastSliderValue: 0.0 };

  await runPrompts(before, chatContainer, state);
  await sendResponse(round, messagesContainer);
  await wait(WAIT_BEFORE_PROMPT);
  await runPrompts(after, chatContainer, state);
  await writeOpinion(chatContainer, messagesContainer);
  await wait(WAIT_AFTER_LAST_RESPONSE);

  observer.disconnect();
}

function getPrompts() {
  const before = [];
  const after = [];
  for (const promptDict of Config.config["prompts"]) {
    if (promptDict["column_name"] === "attention_check" && !Scenarios.isAttentionCheckScenario()) {
      continue;
    }
    const prompt = Prompt.newFromDict(promptDict);
    if (prompt.columnName === "attention_check") {
      const isDem = Globals.playerAffiliation === Globals.affiliations.democrat;
      prompt.text = isDem
        ? "This is an attention check. As a Democratic participant, please drag the slider all the way to Extreme Left Bias. Do not place the slider on any number other than -100 or 100."
        : "This is an attention check. As a Republican participant, please drag the slider all the way to Extreme Right Bias. Do not place the slider on any number other than -100 or 100.";
    }
    if (prompt.stage === Stage.BEFORE) before.push(prompt);
    else if (prompt.stage === Stage.AFTER) after.push(prompt);
  }
  return { before, after };
}

async function runPrompts(prompts, chatContainer, state) {
  for (const prompt of prompts) {
    await runPrompt(prompt, chatContainer, state);
  }
}

async function runPrompt(prompt, chatContainer, state) {
  // Only sliders exist in config.json; mirror the type check anyway.
  const sliderPopup = new SliderPopup();
  if (prompt.usePrevious) prompt.value = state.lastSliderValue;
  sliderPopup.fromResource(prompt);
  chatContainer.replaceChildren(sliderPopup.root);
  await sliderPopup.complete();
  state.lastSliderValue = sliderPopup.value;
}

async function sendResponse(round, messagesContainer) {
  const response = round.response;
  const affiliation = Globals.strToAffiliation(response["affiliation"]);
  const message = addEmptyMessage(affiliation, messagesContainer);
  await wait(randfRange(MIN_WAIT_FOR_NPC_RESPONSE, MAX_WAIT_FOR_NPC_RESPONSE));
  updateMessage(message, response["text"], response["type"]);
}

async function writeOpinion(chatContainer, messagesContainer) {
  const opinionPopup = new OpinionPopup();
  chatContainer.replaceChildren(opinionPopup.root);
  const [opinion, text] = await opinionPopup.complete();
  addMessage(text, opinion, Globals.playerAffiliation, messagesContainer, true);
}

function addMessage(text, valence, affiliation, messagesContainer, isPlayer = false) {
  const message = new Message();
  messagesContainer.append(message.root);
  message.setText(text);
  setValence(valence, message);
  message.setAffiliation(affiliation);
  if (isPlayer) {
    message.setIcon(Globals.playerIcon);
    message.setIconRight();
  }
}

function addEmptyMessage(affiliation, messagesContainer) {
  const message = new Message();
  message.setAffiliation(affiliation);
  messagesContainer.append(message.root);
  return message;
}

function updateMessage(message, text, valence) {
  message.setText(text);
  setValence(valence, message);
}

function setValence(valence, message) {
  switch (valence) {
    case "support":
      message.setTruthy();
      break;
    case "oppose":
      message.setFalsey();
      break;
    case "unsure":
      message.setNeutral();
      break;
    default:
      console.error("Failed to parse message valence: " + valence);
  }
}
