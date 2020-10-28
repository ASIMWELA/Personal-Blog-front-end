import React from 'react';
import './formSubmitError.css'

export default function FormSubmitError(props) {
    return (
        <div className="submit-error-message">
            <div className="alert alert-danger" role="alert">
                <strong style={{ fontSize: "1.5rem" }}>Error! </strong><span style={{ fontSize: "1rem", fontWeight: "bold" }}>{props.message}</span>
            </div>
        </div>
    );
}
