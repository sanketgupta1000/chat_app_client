const Button = function({
    type="button",
    shape="default",
    colour="primary",
    onClick,
    // to be displayed inside button
    children,
    className="",
    // should the button be shown as a loading button
    loading = false,
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

    // shapes
    const shapeClasses = {
        default: "",
        circle: "btn-circle",
        square: "btn-square"
    };

    return (
        <button
        
            type={type}
            className={`btn ${shapeClasses[shape]} ${colourClasses[colour]} ${className}`}
            onClick={ onClick?onClick:()=>{} }
            // disable on loading
            disabled={loading}
            {...props}

        >

            {/* show spinner only if loading */}
            {
            loading &&
            <span className="loading loading-spinner">
            </span>
            }

            {children}
        </button>
    )

}

export default Button;