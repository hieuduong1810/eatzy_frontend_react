import React from 'react';
import './Skeleton.css';

const Skeleton = ({
    width,
    height,
    variant = 'text', // text, circle, rect
    className = '',
    style = {}
}) => {
    const styles = {
        width,
        height,
        ...style
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={styles}
        ></div>
    );
};

export default Skeleton;
