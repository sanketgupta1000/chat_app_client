import { useForm } from "react-hook-form";
import Input from "../components/input/Input";
import Button from "../components/input/Button";
import InputError from "../components/input/InputError";


function LoginPage() {
    // react hook form
    const { register, handleSubmit, formState } = useForm();
    // errors
    const {errors} = formState;


    // submit handler, dummy for now
    // TODO: implement actual
    const handleLogin = (data) => {
        console.log(data);
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
                            type="submit"
                        >
                            Login
                        </Button>

                    </form>
                </div>
            </div>
        </div>

    )

}

export default LoginPage;