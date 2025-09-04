export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleError(error: unknown) {
  if (error instanceof ApiError) {
    return { error: error.message, status: error.statusCode };
  }

  console.error(error);
  return { error: 'Internal Server Error', status: 500 };
}
