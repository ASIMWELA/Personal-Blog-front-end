import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { BASE_URL } from '../constants'
import { FaKey } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AuthenticationError from './AuthenticationError'
import { useForm } from 'react-hook-form'

const ResetPassword = (props) => {
    const [state, setState] = useState({
        password: '',
        verifyPassword: '',
        sucessMessage: '',
        errorMessage: '',
        sendingRequest: false

    });
    const { register, handleSubmit, errors } = useForm();

    const sendRequest = () => {
        const token = new URLSearchParams(props.location.search).get("token")
        if (!token) {
            state.errorMessage = "Invalid Link. No Token available"
            return false
        }
        setState({
            ...state,
            sendingRequest: true
        })
        axios({
            method: "post",
            url: BASE_URL + "/auth/reset-password?token=" + token + "&password=" + state.password
        }).then(res => {
            if (res.data.code === 200) {
                setState({
                    ...state,
                    sendingRequest: false,
                    sucessMessage: res.data.message,
                    password: '',
                    verifyPassword: ''
                })
            }

        }).catch(err => {
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
                        <Card.Subtitle className="mt-3 mb-0" style={{ fontSize: "1.5rem", fontFamily: "sans-serif", textAlign: "center" }}>Reset Your Password</Card.Subtitle>
                        <Card.Body>
                            <small style={{ textAlign: "center", marginBottom: "4px" }}> {state.errorMessage && (
                                <AuthenticationError message={state.errorMessage} />
                            )}</small>
                            <form><label>Enter new password</label>
                                <div className="input-group" >

                                    <div className="input-group-prepend">
                                        <div className="input-group-text"><FaKey /></div>
                                    </div>
                                    <input type="password"
                                        name="password"
                                        id="newPassword"
                                        style={errors.password && { borderColor: "red", boxShadow: "none" }}
                                        placeholder="input your password"
                                        onChange={handleInputChange}
                                        value={state.password}
                                        className="form-control"
                                        ref={register({ required: true, minLength: 5 })}
                                    />
                                </div>
                                {
                                    errors.password &&
                                    errors.password.type === "required" && <span style={{ color: "#f44336" }}>This filed is required</span>
                                }
                                {errors.password && errors.password.type === "minLength" && <span style={{ color: "#f44336" }}>Password should have a minimum of 5 characters</span>}
                                <div>                               <label className="mb-1 mt-4">Re-type password</label>
                                    <div className="input-group" >

                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><FaKey /></div>
                                        </div>
                                        <input type="password"
                                            name="verifyPassword"
                                            id="verifyPassword"
                                            style={errors.verifyPassword && { borderColor: "red", boxShadow: "none" }}
                                            placeholder="Re-enter password"
                                            onChange={handleInputChange}
                                            value={state.verifyPassword}
                                            className="form-control"
                                            ref={register({ validate: value => value === state.password })}
                                        />
                                    </div>
                                    {errors.verifyPassword && errors.verifyPassword.type === "validate" && <span style={{ color: "#f44336" }}>Passwords do not match</span>}
                                </div>

                                <Button color="sucess" className="mt-3 mb-3" onClick={handleSubmit(sendRequest)} style={{ width: "100%" }}>
                                    {
                                        state.sendingRequest ? "Sending Request" : "Reset"
                                    }
                                </Button>
                            </form>

                            <span><Link to="/" style={{ float: "left" }}>Home</Link> <Link to="/login" style={{ float: "right" }}>Login</Link></span>

                        </Card.Body>
                        <Card.Footer>{state.successMessage && <div>{state.sucessMessage}</div>}</Card.Footer>
                    </Card>
                </div>
                <div className="col-md-4"></div>
            </div>

        </div>
    )
}
export default ResetPassword