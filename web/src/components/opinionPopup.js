import { el } from "../util.js";
import { Data } from "../singletons/data.js";

// Mirror of components/opinion_popup.gd + opinion_popup.tscn.
// Participant picks Believe / Unsure / Disbelieve (which enables the text box),
// writes a comment, then submits. Resolves `complete` with [opinion, text].

const VALENCE_KEY = "post_valence";
const CONTENT_KEY = "post_content";

const TITLE_TEXT =
  "Share your thoughts: It is your turn to share your thoughts about the headline. " +
  "What comment do you want to post in the chatroom?";

export class OpinionPopup {
  constructor() {
    this.selectedOpinion = "";

    this.title = el("div.popup-title", { text: TITLE_TEXT });

    this.believeBtn = el("button.opinion-button", { type: "button", text: "Believe" });
    this.unsureBtn = el("button.opinion-button", { type: "button", text: "Unsure" });
    this.disbelieveBtn = el("button.opinion-button", { type: "button", text: "Disbelieve" });
    this.opinionButtons = [this.believeBtn, this.unsureBtn, this.disbelieveBtn];
    const buttonRow = el("div.opinion-buttons", {}, this.opinionButtons);

    this.input = el("textarea.opinion-input", {
      placeholder: "Enter your thoughts here...",
      disabled: true,
    });
    this.submitButton = el("button.submit-button", { type: "button", text: "Submit", disabled: true });

    this.root = el("div.popup.opinion-popup", {}, [this.title, buttonRow, this.input, this.submitButton]);

    this._completeResolvers = [];

    this.believeBtn.addEventListener("click", () => this._select("support", this.believeBtn));
    this.unsureBtn.addEventListener("click", () => this._select("unsure", this.unsureBtn));
    this.disbelieveBtn.addEventListener("click", () => this._select("oppose", this.disbelieveBtn));
    this.input.addEventListener("input", () => this._onTextChanged());
    this.submitButton.addEventListener("click", () => this._onSubmit());
  }

  complete() {
    return new Promise((resolve) => this._completeResolvers.push(resolve));
  }

  _select(opinion, button) {
    this.selectedOpinion = opinion;
    this.input.disabled = false; // _enable_text
    // Keep the chosen button visually selected (recent Godot behaviour).
    for (const b of this.opinionButtons) b.classList.toggle("selected", b === button);
  }

  _onTextChanged() {
    this.submitButton.disabled = this.input.value.length === 0;
  }

  _onSubmit() {
    Data.saveValue(VALENCE_KEY, this.selectedOpinion);
    Data.saveValue(CONTENT_KEY, this.input.value);
    const text = this.input.value;
    const opinion = this.selectedOpinion;
    const resolvers = this._completeResolvers;
    this._completeResolvers = [];
    this.root.remove();
    for (const resolve of resolvers) resolve([opinion, text]);
  }
}
