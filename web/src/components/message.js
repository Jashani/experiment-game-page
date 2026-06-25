import { el } from "../util.js";

// Mirror of components/message.gd + message.tscn — a single chat bubble.
// Layout: an icon box (avatar + affiliation name) beside a bubble panel.
// Default (NPC) order is [panel, iconBox]; set_icon_left() swaps the icon to
// the front, exactly like move_child(panel, 1) in the original.
// Valence sets the bubble border colour (true=green, false=red, neutral=grey).

const TYPING_TEXT = "Thinking...";

export class Message {
  constructor() {
    this.icon = el("img.message-icon", { alt: "" });
    this.affiliationLabel = el("div.message-affiliation");
    this.iconBox = el("div.message-iconbox", {}, [this.icon, this.affiliationLabel]);

    this.responseLabel = el("div.message-text");
    this.panel = el("div.message-panel", {}, [this.responseLabel]);

    // HBox default child order: [iconBox, panel] → icon left (outer), panel right. NPC layout.
    this.root = el("div.message", {}, [this.iconBox, this.panel]);
    this.setTyping();
  }

  setAffiliation(affiliation) {
    this.icon.src = affiliation.randomIcon();
    this.affiliationLabel.textContent = affiliation.text;
    this.affiliationLabel.style.color = affiliation.color;
  }

  setTyping() {
    this.responseLabel.textContent = TYPING_TEXT;
    this.responseLabel.classList.add("typing");
  }

  setIconRight() {
    // Player messages: icon on the outer right, panel on the left.
    this.root.appendChild(this.iconBox); // moves iconBox to end → [panel, iconBox]
    this.root.classList.add("player");
  }

  setIcon(newIcon) {
    this.icon.src = newIcon;
  }

  setText(text) {
    this.responseLabel.classList.remove("typing");
    this.responseLabel.textContent = text;
  }

  setTruthy() {
    this._setValenceClass("truthy");
  }

  setFalsey() {
    this._setValenceClass("falsey");
  }

  setNeutral() {
    this._setValenceClass("neutral");
  }

  _setValenceClass(name) {
    this.panel.classList.remove("truthy", "falsey", "neutral");
    this.panel.classList.add(name);
  }
}
