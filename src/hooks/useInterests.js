import { useEffect, useState } from "react";
import InterestService from "../services/interestService";

function useInterests(append)
{

    const [isLoading, setLoading] = useState(true);
    const [interests, setInterests] = useState([]);
    const [error, setError] = useState(null);

    // fetch interests with useeffect
    useEffect(()=>
    {
        setLoading(true);

        const interestService = new InterestService();

        interestService
        .getAllInterests()
        .then((interestArr)=>
        {
            setInterests(interestArr);
        })
        .catch((err)=>
        {
            setError(err);
        })
        .finally(()=>
        {
            setLoading(false);
        });

    }, []);

    return [isLoading, interests, error];

}

export default useInterests;