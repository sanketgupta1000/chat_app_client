import config from "../configs/config";
import { UnknownError, NetworkError } from "../utils/errors/sharedErrors";

class InterestService
{
    // to get all interests
    async getAllInterests()
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl+"/api/interests"
            );
        }
        catch(e)
        {
            // network error
            throw new NetworkError();
        }

        if(response.status!=200)
        {
            throw new UnknownError();
        }

        return (await response.json()).interests;

    }
}

export default InterestService;