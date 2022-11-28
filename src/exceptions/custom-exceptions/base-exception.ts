abstract class BaseException extends Error {
  constructor(msg?: string) {
    super(msg);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.getName();
  }

  abstract getName(): string;
}

export default BaseException;
