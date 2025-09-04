import { ApiError, handleError } from './errors';

describe('handleError', () => {
  it('should handle ApiError', () => {
    const error = new ApiError(404, 'Not Found');
    const result = handleError(error);
    expect(result).toEqual({ error: 'Not Found', status: 404 });
  });

  it('should handle other errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Something went wrong');
    const result = handleError(error);
    expect(result).toEqual({ error: 'Internal Server Error', status: 500 });
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});
