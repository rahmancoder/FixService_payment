class ApiError extends Error {
    statusCode: number;
    errorDetails?: unknown;

    constructor(statusCode: number, message: string, errorDetails?: unknown, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
