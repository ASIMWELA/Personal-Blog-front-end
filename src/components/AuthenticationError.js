import React from 'react'
import { MdError } from 'react-icons/md'

const AuthenticationError = ({ message }) => {
    return (
        <div >
            <h6 style={{ color: "red" }}><strong>Error</strong><sup><MdError size={18} color={'red'} /></sup><br /> {message} </h6>
        </div>
    )
}
export default AuthenticationError
