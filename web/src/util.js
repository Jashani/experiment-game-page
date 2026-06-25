// Small helpers that mirror the Godot/GDScript primitives the game relied on.

// In-place Fisher-Yates shuffle, matching Array.shuffle() in GDScript.
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Random element, matching Array.pick_random().
export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Float in [min, max), matching RandomNumberGenerator.randf_range().
export function randfRange(min, max) {
  return min + Math.random() * (max - min);
}

// Integer in [min, max] inclusive, matching randi_range().
export function randiRange(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Awaitable delay, replacing `await get_tree().create_timer(t).timeout`.
export function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Tiny DOM builder. tag may include classes, e.g. "div.foo.bar".
export function el(tag, props = {}, children = []) {
  const parts = tag.split(".");
  const node = document.createElement(parts[0]);
  if (parts.length > 1) node.className = parts.slice(1).join(" ");
  for (const [key, value] of Object.entries(props)) {
    if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key in node) node[key] = value;
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child != null) node.append(child);
  }
  return node;
}
