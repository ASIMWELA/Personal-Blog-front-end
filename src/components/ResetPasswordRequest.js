import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { BASE_URL } from '../constants'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import './resetPass.css'


const ResetPasswordRequest = () => {
    const [state, setState] = useState({
        email: '',
        sucessMessage: '',
        errorMessage: '',
        sendingRequest: false

    });
    const { register, handleSubmit, errors } = useForm();


    const sendRequest = () => {

        setState({
            ...state,
            sendingRequest: true
        })
        //console.log(window.location.hostname)


        axios.post(BASE_URL + "/auth/forgot-password?email=" + state.email + "&url=" + window.location.origin).then(res => {
            if (res.data.code === 200) {
                setState({
                    ...state,
                    sendingRequest: false,
                    successMessage: res.data.message,
                    email: ''
                })
            }

        }
        ).catch(err => {
            setState({
                ...state,
                sendingRequest: false,
                errorMessage: err.message
            })
            console.log(err)
        })
    }
    const handleInputChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <Card style={{ width: "20rem", display: "flex", flexDirection: "column !important" }}>
                        <Card.Subtitle className="mt-3 mb-3" style={{ fontSize: "1.5rem", fontFamily: "sans-serif", textAlign: "center" }}>Reset Your Password</Card.Subtitle>
                        <Card.Body>
                            <form><label>Enter Your Email</label>
                                <div className="input-group" >

                                    <div className="input-group-prepend">
                                        <div className="input-group-text">@</div>
                                    </div>
                                    <input type="email"
                                        name="email"
                                        id="userPasswordResetEmail"
                                        style={errors.email && { borderColor: "red" }}
                                        placeholder="Enter your email"
                                        onChange={handleInputChange}
                                        value={state.email}
                                        className="form-control"
                                        ref={register({ required: true, pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
                                    />


                                </div>

                                {
                                    errors.email &&
                                    errors.email.type === "required" && <span style={{ color: "#f44336" }}>This filed is required</span>
                                }
                                {errors.email && errors.email.type === "pattern" && <span style={{ color: "#f44336" }}>Invalid email address</span>}


                                <Button color="sucess" className="mt-3 mb-3" onClick={handleSubmit(sendRequest)} style={{ width: "100%" }}>
                                    {
                                        state.sendingRequest ? "Sending Request" : "Reset"
                                    }
                                </Button>
                            </form>

                            <span><Link to="/" style={{ float: "left" }}>Home</Link> <Link to="/login" style={{ float: "right" }}>Login</Link></span>

                        </Card.Body>
                        <Card.Footer>

                            {state.successMessage && <div>{state.successMessage}</div>}
                        </Card.Footer>
                    </Card>
                </div>
                <div className="col-md-4"></div>
            </div>

        </div>
    )
}

export default ResetPasswordRequest
