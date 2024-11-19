import React, { useState } from 'react';

const Tooltip = ({
    children,
    title,
    isAbsolute = false,
    className = '',
    atBottom = false,
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className={`${isAbsolute?"absolute":"relative"} inline-block ${className}`}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onTouchStart={() => setVisible(true)}
            onTouchEnd={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className={`absolute ${atBottom?"top-full":"bottom-full"} left-1/2 z-10 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-sm rounded`}>
                    {title}
                </div>
            )}
        </div>
    );
};

export default Tooltip;