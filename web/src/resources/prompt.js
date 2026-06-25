// Mirror of resources/prompt.gd — a single slider prompt from config.json.

export const Stage = Object.freeze({ BEFORE: 0, AFTER: 1 });
export const PromptType = Object.freeze({ SLIDER: 0 });

function typeFromStr(string) {
  if (string.toLowerCase() === "slider") return PromptType.SLIDER;
  console.error("Failed to convert to type: " + string);
}

function stageFromStr(string) {
  string = string.toLowerCase();
  if (string === "before") return Stage.BEFORE;
  if (string === "after") return Stage.AFTER;
  console.error("Failed to convert to stage: " + string);
}

export class Prompt {
  static newFromDict(dict) {
    const prompt = new Prompt();
    prompt.type = typeFromStr(dict["type"]);
    prompt.stage = stageFromStr(dict["stage"]);
    prompt.columnName = dict["column_name"];
    prompt.text = dict["text"];
    prompt.labels = (dict["labels"] || []).slice();
    prompt.minValue = dict["min_value"];
    prompt.maxValue = dict["max_value"];
    prompt.value = dict["value"] ?? 0.0;
    prompt.usePrevious = dict["use_previous"] ?? false;
    return prompt;
  }
}
