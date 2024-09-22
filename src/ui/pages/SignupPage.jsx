import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../components/input/Input";
import CheckBox from "../components/input/CheckBox";
import Button from "../components/input/Button";
import InputError from "../components/input/InputError";
import SimpleLink from "../components/ui/SimpleLink";
import useInterests from "../../hooks/useInterests";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { InvalidDataError, NetworkError } from "../../utils/errors/sharedErrors";
import { UserExistsError } from "../../utils/errors/userErrors";
import toast from "react-hot-toast";


function SignupPage() {
    // react hook form
    const { register, handleSubmit, control, formState } = useForm();
    // errors
    const {errors} = formState;

    // fetch the interests using the hook
    const [isLoading, interests, error] = useInterests();

    const [submitLoading, setSubmitLoading] = useState(false);

    const navigate = useNavigate();

    // field array for interests
    // fields will be useful to populate the interests dynamically
    const { fields, append, remove } = useFieldArray(
        {
            control,
            name: "interests",
        }
    );

    // submit handler, dummy for now
    const handleSignup = (data) =>
    {

        // show button as loading button
        setSubmitLoading(true);

        const interestIds = [];
        data.interests.forEach((i)=>
        {
            if(i.value==true)
            {
                interestIds.push(i.interestId);
            }
        });

        const authService = new AuthService();

        authService
        .signup({
            email: data.email,
            name: data.name,
            description: data.description,
            password: data.password,
            interestIds
        })
        .then((user)=>
        {
            // navigate to login
            navigate("/auth/login");
        })
        .catch((err)=>
        {
            if(err instanceof NetworkError)
            {
                toast.error("Failed to connect to server, please check your network connection and try again.");
            }
            else if(err instanceof InvalidDataError)
            {
                toast.error("Incorrect inputs given, please try again.");
            }
            else if(err instanceof UserExistsError)
            {
                toast.error("Email is already registered, please login.");
            }
            else
            {
                toast.error("An unknown error occured, please try again.");
            }
        })
        .finally(()=>
        {
            setSubmitLoading(false);
        });

    }

    useEffect(() => {

        if(!isLoading)
        {
            if(error)
            {
                // error while fetching
                // log for now
                console.log(error);
                // will show in a toast afterwards
            }
            else
            {
                // data fetched

                remove();

                interests.forEach((i)=>
                {
                    append({interestId:i.id, interestName:i.name, value:false});
                });
            }
        }

    }, [isLoading]);

    // return the form
    return (

        (
            !isLoading?
            <div className="hero bg-base-200 min-h-screen">
    
                <div className="hero-content flex-col lg:flex-row-center">
    
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Create Account!</h1>
                    </div>
    
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
    
                        <form className="card-body" onSubmit={handleSubmit(handleSignup)}>
    
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
    
                            {/* name field */}
                            <Input
                                label="Name"
                                type="text"
                                placeholder="Name"
                                {...register("name", {
                                    required: true,
                                    minLength: 5
                                })}
                            ></Input>
                            {errors.name && <InputError>Please enter a name of at least 5 characters</InputError>}
    
                            {/* description field */}
                            <Input
                                label="Description"
                                type="textarea"
                                placeholder="Description"
                                {...register("description", {
                                    required: true,
                                    minLength: 20
                                })}
                            ></Input>
                            {errors.description && <InputError>Please enter a description of at least 20 characters</InputError>}
    
                            {/* checkboxes for interests */}
                            {/* {
                            
                            fields.map((field, index)=>(
                                <CheckBox
                                    label={field.interestName}
                                    key={field.id}
                                    {...register(`interests.${index}.value`, {
                                        validate: (interests)=>
                                        {
                                            console.log(interests);
                                            // return interests.some((i)=>i.value);
                                        }
                                    })}
                                ></CheckBox>
                            ))
    
                            } */}
    
                            <Controller
                                control={control}
                                name="interests"
                                rules={{
                                    validate: {
                                        required: (value) =>
                                            value.some((interest) => interest.value) || "Please select at least one interest.",
                                    },
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.id}>
                                                <CheckBox
                                                    label={field.interestName}
                                                    checked={value[index]?.value || false}
                                                    onChange={(e) => {
                                                        const newInterests = [...value];
                                                        newInterests[index].value = e.target.checked;
                                                        onChange(newInterests);
                                                    }}
                                                ></CheckBox>
                                            </div>
                                        ))}
                                    </>
                                )}
                            />
                            {
                            errors.interests && <InputError>Please select at least one interest</InputError>
                            }
    
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
    
                            {/* signup button */}
                            <Button
                                loading={submitLoading}
                                type="submit"
                            >
                                {submitLoading?
                                "Signing up..."
                                :
                                "Sign Up"
                                }
                            </Button>
    
                            {/* link to login page */}
                            <SimpleLink
                                to={"/auth/login"}
                            >
                                Already have an account?
                            </SimpleLink>
    
                        </form>
                    </div>
                </div>
            </div>
            :
            <LoadingSpinner/>
        )


    )

}

export default SignupPage;