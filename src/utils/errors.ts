export class NewsError extends Error {
  constructor(message: string, public source?: string) {
    super(message);
    this.name = 'NewsError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      source: this.source
    };
  }
}