class HttpError extends Error {
  code: string;
  statusCode: number;
  errors?: string[];
  constructor(
    message: string,
    errorCode: string,
    statusCode: number,
    errors?: string[]
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.code = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static referenceError(message: string) {
    return new HttpError(message, "reference-error", 400);
  }
  static insufficientBalanceError() {
    return new HttpError(
      "Insufficient balance to complete the transaction",
      "Insufficient balance",
      400
    );
  }

  static notFound(param: string) {
    return new HttpError(`${param} not found`, "not-found", 404);
  }

  static invalidParameters(params: string[]) {
    return HttpError.validation(params.map((param) => `Invalid ${param}`));
  }

  static missingParameters(params: string[]) {
    return HttpError.validation(params.map((param) => `${param} is required`));
  }

  static duplicateFields(params: string[]) {
    return HttpError.validation(
      params.map((param) => `This ${param} already exists`)
    );
  }

  static validation(errors: string[]) {
    return HttpError.badRequest(
      "One or more fields are invalid",
      "invalid-parameters",
      errors
    );
  }

  static badRequest(message: string, code?: string, errors?: string[]) {
    return new HttpError(message, code ?? "bad-request", 400, errors);
  }

  static rateLimited(message: string) {
    return new HttpError(message, "rate-limited", 429);
  }

  static invalidCredentials() {
    return HttpError.unauthorized("Invalid username or password");
  }

  static forbidden(message?: string) {
    return new HttpError(
      message ?? "User is not authorized for this action",
      "forbidden",
      403
    );
  }

  static invalidTokens() {
    return HttpError.unauthorized("Tokens are missing or invalid");
  }

  static unauthorized(message: string) {
    return new HttpError(message, "unauthorized", 401);
  }

  static serverError(message: string) {
    return new HttpError(message, "server-error", 500);
  }
}

export { HttpError };
