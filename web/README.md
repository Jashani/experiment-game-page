# Protocol 3 — web (JS) build

A native-JavaScript port of the Protocol 3 Godot survey game, running directly
in the browser as a jsPsych experiment. This replaces the old Godot
HTML5 export embedded via `<iframe>` — no Godot, no `.wasm`/`.pck`, and **no
re-export when you change content**: `config.json` and `scenarios.json` are
fetched at runtime.

## Running

Serve this folder over HTTP (ES modules + `fetch` don't work from `file://`):

```bash
cd export/web
python3 -m http.server 8000
# open http://localhost:8000/
```

Deploy by serving the folder over HTTPS (any static host). The page reads
Prolific URL variables and saves to OSF exactly as the original did.

## Editing content (no rebuild needed)

- **`config.json`** — slider prompts shown in the discussion room. Same schema
  as the Godot project (`stage` = `before`/`after`, `column_name`, `labels`,
  `min_value`/`max_value`, `value`, `use_previous`).
- **`scenarios.json`** — `headlines` / `responses` / `arrangements`. Same schema
  as the Godot project.

Both files are copied verbatim from the project root. Edit them here (or re-copy
from the root) and just reload — no build step.

## Structure

```
index.html              jsPsych page: welcome → game → OSF save → Prolific redirect
css/game.css            dark theme matching the Godot UI
config.json             slider prompts (runtime-loaded)
scenarios.json          headlines / responses / arrangements (runtime-loaded)
assets/icons/           red (Republican) / blue (Democrat) avatar PNGs
src/
  main.js               jsPsych timeline + the custom game plugin (replaces the iframe)
  game.js               game controller: loads data, runs stages in order
  singletons/           autoload equivalents — globals, config, scenarios, data
  resources/            data types — round, prompt, affiliation, demographics
  components/           reusable UI — message bubble, slider popup, opinion popup
  stages/               one module per screen, in execution order
  util.js               shuffle / random / wait / DOM helpers
```

### Stage order

Mirrors the Godot `next_scene` chain (which does **not** follow the folder
numbering — leaning sits between the instructions and the priors):

instructions1 → instructions2 → leaning → priorsAccuracy → priorsBias →
waitingRoom → postWaitingRoom → discussionRoom (loops the 8 scenarios) →
demographics → end.

## Data output

The game produces the same results dictionary as the Godot build, and `main.js`
flattens it into the same wide CSV columns the OSF pipeline expects
(`round_<n>_<field>` per round, plus flat globals). Mapping of in-game state to
output keys is unchanged from `data.gd`.

## Relationship to the Godot project

This is a faithful behavioural port of the GDScript. The original Godot project
(project root) remains the source of the headline/prompt content; keep
`config.json` / `scenarios.json` in sync between the two if you intend to run
both. The old Godot web exports under `export/bar/` and `export/no_bar/` are
superseded by this folder and can be removed once you've switched over.
