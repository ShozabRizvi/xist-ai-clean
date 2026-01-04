class ApiKeyPool {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!this.apiKey) {
      throw new Error("No OpenRouter API key found in environment!");
    }
    // No more this.apiKeys or .length anywhere!
    console.log("Loaded OpenRouter API key.");
  }

  getKey() {
    return this.apiKey;
  }
}

export default new ApiKeyPool();
