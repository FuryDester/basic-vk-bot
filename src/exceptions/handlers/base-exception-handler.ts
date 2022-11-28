import BaseException from '@/exceptions/custom-exceptions/base-exception';

abstract class BaseExceptionHandler {
  private err: BaseException;

  protected constructor(err: BaseException, handle: boolean = true) {
    this.err = err;

    if (handle) {
      this.handle(err);
    }
  }

  getError(): BaseException {
    return this.err;
  }

  setError(err: BaseException): BaseExceptionHandler {
    this.err = err;

    return this;
  }

  abstract handle(err: BaseException): void;
}

export default BaseExceptionHandler;
