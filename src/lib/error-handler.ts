export interface ErrorResponse {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export class ApiErrorHandler extends Error implements ErrorResponse {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
  }
}

export const handleError = (error: any): ErrorResponse => {
  if (error.response?.data) {
    return {
      message: error.response.data.message || 'An error occurred',
      code: error.response.data.code || 'ERROR',
      status: error.response.status || 500,
      details: error.response.data.details,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
};
