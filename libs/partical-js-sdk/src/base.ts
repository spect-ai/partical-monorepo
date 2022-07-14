type Config = {
  apiKey: string;
  baseUrl?: string;
};

export abstract class Base {
  protected apiKey: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
  }
}
