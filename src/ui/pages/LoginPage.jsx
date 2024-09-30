import { useForm } from "react-hook-form";
import Input from "../components/input/Input";
import Button from "../components/input/Button";
import InputError from "../components/input/InputError";
import SimpleLink from "../components/ui/SimpleLink";
import { useState } from "react";
import AuthService from "../../services/authService";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices";
import { InvalidDataError, NetworkError } from "../../utils/errors/sharedErrors";
import { InvalidCredentialsError, UserNotFoundError } from "../../utils/errors/userErrors";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../store/slices/userSlice";


function LoginPage() {
    // react hook form
    const { register, handleSubmit, formState } = useForm();
    // errors
    const {errors} = formState;

    const [submitLoading, setSubmitLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // submit handler
    const handleLogin = (data) => {
        
        setSubmitLoading(true);

        const authService = new AuthService();

        authService
        .login(data)
        .then((token)=>
        {
            // got the user

            // set token
            dispatch(setToken({
                token: token
            }));
        })
        .catch((err)=>
        {
            if(err instanceof NetworkError)
            {
                // show toast
                toast.error("Cannot connect to server, please check your internet connection");
            }
            else if(err instanceof InvalidDataError)
            {
                toast.error("Invalid inputs, please check your data and try again");
            }
            else if(err instanceof UserNotFoundError)
            {
                toast.error("User not found, please check your email");
            }
            else if(err instanceof InvalidCredentialsError)
            {
                toast.error("Invalid credentials");
            }
            else
            {
                toast.error("An unknown error occured");
            }
        })
        .finally(()=>
        {
            setSubmitLoading(false);
        });

    }

    // return the form
    return (

        <div className="hero bg-base-200 min-h-screen">

            <div className="hero-content flex-col lg:flex-row-center">

                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login!</h1>
                </div>

                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">

                    <form className="card-body" onSubmit={handleSubmit(handleLogin)}>

                        {/* email field */}
                        <Input
                            label="Email"
                            type="text"
                            placeholder="Email"

                            // react hook form
                            {...register("email", {
                                required: true,
                                pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                            })}

                        ></Input>
                        {errors.email && <InputError>Please enter a valid email</InputError>}

                        {/* password */}
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Password"
                            {...register("password", {
                                required: true,
                                minLength: 8
                            })}
                        ></Input>
                        {errors.password && <InputError>Please enter at least 8 characters</InputError>}

                        {/* login button */}
                        <Button
                            loading={submitLoading}
                            type="submit"
                        >
                            {
                            submitLoading?
                            "Logging in..."
                            :
                            "Login"
                            }
                        </Button>

                        <SimpleLink
                            to={"/auth/signup"}
                        >
                            Don't have an account?
                        </SimpleLink>

                    </form>
                </div>
            </div>
        </div>

    )

}

export default LoginPage;