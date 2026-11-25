/**
 * `code` (+ `params`) lets the client show the error in the user's language;
 * `message` is the English fallback.
 */
export class HttpError extends Error {
    constructor(status, message, code = null, params = null) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.code = code;
        this.params = params;
    }
}
