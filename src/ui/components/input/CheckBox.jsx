import { forwardRef } from "react";

const CheckBox = forwardRef(function({
    label,
    ...props
}, ref)
{
    return (
        
        <div className="form-control">

            <label className="label cursor-pointer">
                {label &&
                <span className="label-text">{label}</span>
                }

                <input
                    type="checkbox"
                    className="checkbox"
                    ref={ref}
                    {...props}
                ></input>

            </label>

        </div>

    );
});

export default CheckBox;