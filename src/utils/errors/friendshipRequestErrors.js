class RequestExistsError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

class RequestNotFoundError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

export {
    RequestExistsError,
    RequestNotFoundError
};