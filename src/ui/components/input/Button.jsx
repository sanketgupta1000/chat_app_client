const Button = function({
    type="button",
    colour="primary",
    onClick,
    // to be displayed inside button
    children,
    className="",
    ...props
})
{

    // colour variants
    const colourClasses = {
        default: "",
        neutral: "btn-neutral",
        primary: "btn-primary",
        secondary: "btn-secondary",
        accent: "btn-accent",
        ghost: "btn-ghost",
        link: "btn-link"
    };

    return (
        <button
        
            type={type}
            className={`btn ${colourClasses[colour]} ${className}`}
            onClick={ onClick?onClick:()=>{} }
            {...props}

        >
            {children}
        </button>
    )

}

export default Button;