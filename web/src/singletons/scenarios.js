import { Round } from "../resources/round.js";
import { shuffle, pickRandom } from "../util.js";

// Mirror of scenarios.gd — loads scenarios.json, pre-builds and shuffles the
// rounds at startup. One round per arrangement.

class ScenariosSingleton {
  constructor() {
    this.scenarios = []; // Array<Round>
    this.scenariosConfig = {};
    this.totalScenarios = 0;
  }

  async load(path = "scenarios.json") {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("Failed to load scenarios! " + response.status);
    }
    this.scenariosConfig = await response.json();
    this._loadRandomScenarios();
    shuffle(this.scenarios);
    this.totalScenarios = this.scenarios.length;
  }

  getScenario() {
    return this.scenarios.shift();
  }

  remainingScenarios() {
    return this.scenarios.length;
  }

_loadRandomScenarios() {
    const arrangements = this.scenariosConfig["arrangements"];
    const responsePool = this._buildResponsePool();
    const scenarioPools = this._buildScenarioPools();
    for (const arrangement of arrangements) {
      const scenario = scenarioPools[arrangement["headline"]].shift();
      const responseText = responsePool.shift()[arrangement["stance"]];
      scenario.response = {
        type: arrangement["stance"],
        text: responseText,
        affiliation: arrangement["comment"],
      };
      this.scenarios.push(scenario);
    }
  }

  _buildResponsePool() {
    const responsePool = this.scenariosConfig["responses"].slice();
    shuffle(responsePool);
    return responsePool;
  }

  _buildScenarioPools() {
    const topics = this.scenariosConfig["headlines"];
    const leftScenarios = [];
    const rightScenarios = [];
    for (const topic of topics) {
      leftScenarios.push(this._buildRandomScenario(topic["left"], topic["type"], "left"));
      rightScenarios.push(this._buildRandomScenario(topic["right"], topic["type"], "right"));
    }
    shuffle(leftScenarios);
    shuffle(rightScenarios);
    return { left: leftScenarios, right: rightScenarios };
  }

  _buildRandomScenario(scenarioList, topic, leaning) {
    const randomScenario = pickRandom(scenarioList);
    const type = leaning + "_" + topic;
    return this._scenarioToObject(randomScenario, type);
  }

  _scenarioToObject(scenario, type) {
    const round = new Round();
    round.id = scenario["id"];
    round.title = scenario["title"];
    round.type = type;
    return round;
  }
}

export const Scenarios = new ScenariosSingleton();
