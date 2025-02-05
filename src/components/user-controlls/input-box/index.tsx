import React, { useEffect, useState } from "react";
import "./styles.scss";

type InputBoxProps = {
    type: "text" | "password" | "email" | "password_confirmation";
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, hasError ?: boolean) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>, hasError ?: boolean) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>, hasError ?: boolean) => void;
    placeholder: string;
    id?: string;
    name?: string;
    label?: string;
    isRequired?: boolean;
    isError?: boolean;
    disabled?: boolean;
};

const doNothing = (...props: any) => null;

export const InputBoxComponent: React.FC<InputBoxProps> = ({
                                                               type = "text",
                                                               className,
                                                               value = "",
                                                               onChange = doNothing,
                                                               onBlur = doNothing,
                                                               onFocus = doNothing,
                                                               placeholder,
                                                               id,
                                                               name,
                                                               isRequired = true,
                                                               label = "This field is required",
                                                               isError = false,
                                                               disabled = false,
                                                           }: InputBoxProps) => {
    const [hasError, setHasError] = useState<boolean>(isError);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => setHasError(isError), [isError]);

    const validateInput = (value: string) => {
        if (isRequired && value.trim() === "") {
            return "This field is required";
        }

        if (type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Please enter a valid email address";
            }
        }

        if (type === "password") {
            if (value.length < 6) {
                return "Password must be at least 6 characters long";
            }
        }

        if (type === "password_confirmation") {
            // Implement your password confirmation logic here
            // e.g., check if it matches a provided password
        }

        return ""; // No error
    };

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const error = validateInput(e.target.value);
        setErrorMessage(error);
        setHasError(!!error);

        if (onBlur) {
            onBlur(e, hasError);
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (hasError) {
            // Validate while typing to clear the error
            const error = validateInput(e.target.value);
            setErrorMessage(error);
            setHasError(!!error);
        }

        if (onChange) {
            onChange(e, hasError);
        }
    };

    return (
        <div className="input-container">
            {hasError && <span className="label d-block">{errorMessage || label}</span>}
            <input
                className={`form-control ${className}`}
                type={type}
                value={value}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onFocus={handleOnChange}
                placeholder={placeholder}
                id={id}
                name={name}
                disabled={disabled}
            />
        </div>
    );
};
