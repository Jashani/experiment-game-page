// Mirror of config.gd — loads config.json (slider prompts).
// Fetched at runtime so editing config.json never requires a rebuild.

class ConfigSingleton {
  constructor() {
    this.config = {};
  }

  async load(path = "config.json") {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("Failed to load config! " + response.status);
    }
    this.config = await response.json();
  }
}

export const Config = new ConfigSingleton();
