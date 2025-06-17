export class Result<T = any> {

  constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string
  ) {}

  static ok<T>(data: T): Result<T> {
    return new Result<T>(true, data);
  }

  static fail<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }
  
}
