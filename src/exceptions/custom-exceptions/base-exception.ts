abstract class BaseException extends Error {
  private options: Record<string, unknown>;

  constructor(msg?: string, options?: Record<string, unknown>) {
    super(msg);

    this.options = options;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.getName();
  }

  abstract getName(): string;

  getOptions(): Record<string, unknown> {
    return this.options;
  }

  setOptions(options: Record<string, unknown>): BaseException {
    this.options = options;

    return this;
  }
}

export default BaseException;
