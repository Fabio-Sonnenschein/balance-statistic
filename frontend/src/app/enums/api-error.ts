export enum APIError {
    BAD_REQUEST = 'Bad request',
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden',
    NOT_FOUND = 'Not found',
    CONFLICT = 'Conflict',
    INTERNAL_SERVER_ERROR = 'Internal server error',
    NOT_IMPLEMENTED = 'Not implemented',
    PROBLEM = 'There has been a problem on our end.',
    PROBLEM_RETRY = 'There has been a problem on our end, please try again.',
    INVALID_CREDENTIALS = 'Your credentials could not be verified.',
    EMAIL_ALREADY_IN_USE = 'This email has already been used to register an account.',
    ACCOUNT_NUMBER_ALREADY_IN_USE = 'This account number has already been used. The existing account was added to your overview.'
}
