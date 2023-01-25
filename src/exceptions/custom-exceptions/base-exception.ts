abstract class BaseException extends Error {
  private options: Record<string, unknown>;

  constructor(msg?: string, options?: Record<string, unknown>) {
    super(msg);

    const keys = this.getOptionsKeys();
    Object.keys(keys).forEach((key: string) => {
      if (options[key] === undefined) {
        delete options[key];
      }

      if (keys[key] && options[key] === undefined) {
        throw new Error(`Option ${key} is required for ${this.getName()}`);
      }
    });

    this.options = options;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.getName();
  }

  protected getName(): string {
    return this.constructor.name;
  }

  /**
   * Return all options that can be in exception
   * If false - option is unnecessary, otherwise it is necessary
   * Example:
   * 'databaseName': true - necessary key
   * 'login': false - unnecessary key
   */
  abstract getOptionsKeys(): Record<string, boolean>;

  getOptions(): Record<string, unknown> {
    return this.options;
  }

  setOptions(options: Record<string, unknown>): BaseException {
    this.options = options;

    return this;
  }
}

export default BaseException;
