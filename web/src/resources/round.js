// Mirror of resources/round.gd — one discussion-room scenario.
export class Round {
  constructor() {
    this.id = 0;
    this.title = "";
    this.response = {}; // { type, text, affiliation }
    this.type = "";
  }
}
