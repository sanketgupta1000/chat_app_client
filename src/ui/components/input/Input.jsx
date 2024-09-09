// will make a general input field

import { forwardRef } from "react";

const Input = forwardRef(function({
    label,
    type="text",
    placeholder,
    className="",
    ...props
}, ref)
{

    return (

        <label className="form-control w-full max-w-xs">

            {/* display label if exists */}
            {label && 
            
            <div className="label">

                <span className="label-text">
                    {label}
                </span>

            </div>

            }

            {
            (type=="textarea")?
            <textarea
                className="textarea textarea-bordered h-24"
                placeholder={placeholder?placeholder:""}
                ref={ref}
                {...props}
            >
            </textarea>
            :
            <input
                type={type}
                placeholder={placeholder?placeholder:""}
                className={`input input-bordered w-full max-w-xs ${className}`}
                // expose the dom element
                ref={ref}
                {...props}
            />
            }

        </label>

    )

});

export default Input;