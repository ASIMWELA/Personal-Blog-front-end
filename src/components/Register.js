import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../constants'
import FormSubmitError from './FormSubmitError'
import './register.css'

export default function Register() {
    const { register, handleSubmit, errors } = useForm()

    const [data, setData] = useState({
        userName: '',
        email: '',
        password: '',
        successMessage: '',
        isSubmitting: false,
        errorMessage: '',
    })


    const handleSubmitForm = () => {

        setData({
            ...data,
            isSubmitting: true
        })

        let userData = {
            userName: data.userName,
            password: data.password,
            email: data.email
        }
        axios({
            method: 'post',
            url: BASE_URL + "/auth/signup-subscriber",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(userData)
        }).then(res => {
            if (res.data.code === 201) {
                setData({
                    userName: "",
                    email: "",
                    password: "",
                    successMessage: res.data.message,
                    isSubmitting: false
                })


            }

        }).catch(err => {

            if ((err.message).indexOf('409') >= 0 || (ErrorEvent.statusText).indexOf('409') >= 0) {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: 'User name or email already taken, try different ones'

                });


            }
            else if ((err.message).indexOf('500') >= 0 || (ErrorEvent.statusText).indexOf('500')) {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: 'We are unable to process your request'

                });
            }
            else {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: err.message || ErrorEvent.statusText
                }

                )
            }
        })

    }


    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };
    return (
        <>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6" id="subscribe-form">
                        <h3 className="profile-heading">Subscription Form</h3>
                        <hr />

                        <form id="form" onSubmit={handleSubmit(handleSubmitForm)} >

                            <div className="form-group">
                                <label >User name <sup style={{ color: "#f44336" }}>*</sup></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputUserName"
                                    name="userName"
                                    style={errors.userName && { borderColor: "red", boxShadow: "none !important" }}
                                    value={data.userName}
                                    ref={register({ required: true, minLength: 4 })}
                                    onChange={handleInputChange}
                                />
                                {errors.userName
                                    &&
                                    errors.userName.type === "required"
                                    &&
                                    <span style={{ color: "#f44336" }}>This field is required</span>}
                                {errors.userName && errors.userName.type === "minLength" && <span style={{ color: "#f44336" }}>User name should have atleast 4 letters</span>}


                            </div>
                            <div className="form-group">
                                <label >Email<sup style={{ color: "#f44336" }}>*</sup></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    style={errors.email && { borderColor: "red", boxShadow: "none !important" }}
                                    value={data.email}
                                    ref={register({ required: true, pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
                                    onChange={handleInputChange}
                                />
                                {errors.email
                                    &&
                                    errors.email.type === "required"
                                    &&
                                    <span style={{ color: "#f44336" }}>This field is required</span>}
                                {errors.email && errors.email.type === "pattern" && <span style={{ color: "#f44336" }}>Invalid email address</span>}
                            </div>

                            <div className="form-group">
                                <label >Password<sup style={{ color: "#f44336" }}>*</sup></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    style={errors.password && { borderColor: "red", boxShadow: "none !important" }}
                                    value={data.password}
                                    ref={register({ required: true, minLength: 5 })}
                                    onChange={handleInputChange}
                                />
                                {errors.password
                                    &&
                                    errors.password.type === "required"
                                    &&
                                    <span style={{ color: "#f44336" }}>This field is required</span>}
                                {errors.password
                                    &&
                                    errors.password.type === "minLength"
                                    &&
                                    <span style={{ color: "#f44336" }}>Password should have a minimum of 5 characters</span>}

                            </div>

                            <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />
                            {data.errorMessage && <FormSubmitError message={data.errorMessage} />}
                            {data.successMessage && <span>{data.successMessage}{' '} Go<Link to="/login">login</Link></span>}
                            <br />
                            <span className="subCancelBtn" style={{ marginTop: "3%" }}>
                                <button type="submit" id="submitBtn" className="btn btn-primary" style={{ marginRight: "5%" }}>{data.isSubmitting ? "Submitting..." : "Submit"}</button>

                            </span> </form>

                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>

        </>
    );
}
