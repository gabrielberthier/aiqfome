export class AppError extends Error {
  public override readonly name: string;
  public readonly code: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    code: number,
    description: string,
    isOperational: boolean,
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
