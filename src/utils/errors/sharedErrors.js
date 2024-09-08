// network error
class NetworkError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

// invalid data sent to server
class InvalidDataError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

// all others
class UnknownError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

export {
    NetworkError,
    InvalidDataError,
    UnknownError
};