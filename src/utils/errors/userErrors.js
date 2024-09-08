// user already exists
class UserExistsError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

// user not found
class UserNotFoundError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

// invalid credentials
class InvalidCredentialsError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

export {
    UserExistsError,
    UserNotFoundError,
    InvalidCredentialsError
};