import React from 'react'
import './styles.scss';

interface TProps {
    className: string;
    value: string;
    onClick?: () => void;
}

const Button = ({
                    className,
                    value,
                    onClick,
                }: TProps) => {

    return (
        <button className={className} onClick={onClick}>
            {value}
        </button>
    )
}

export default Button