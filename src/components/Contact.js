import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { BASE_URL } from '../constants'
import FormSubmitError from './FormSubmitError'

const Contact = () => {
    const { register, handleSubmit, errors } = useForm()

    const [data, setData] = useState({
        senderEmail: '',
        subject: '',
        message: '',
        successMessage: '',
        isSubmitting: false,
        errorMessage: '',
    })


    const handleSubmitForm = () => {

        setData({
            ...data,
            isSubmitting: true
        })

        let emailMessage = {
            senderEmail: data.senderEmail,
            title: data.subject,
            content: data.message
        }

        axios({
            method: 'post',
            url: BASE_URL + "/sendEmail",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(emailMessage)
        }).then(res => {
            if (res.data.code === 200) {
                setData({
                    senderEmail: '',
                    subject: '',
                    message: '',
                    successMessage: res.data.message,
                    isSubmitting: false
                })


            }

        }).catch(err => {
            console.log(err)
            if ((err.message).indexOf('500') >= 0 || (ErrorEvent.statusText).indexOf('500')) {
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
                        <h3 className="profile-heading">Email Me</h3>
                        <hr />

                        <form id="form" onSubmit={handleSubmit(handleSubmitForm)} >
                            {data.errorMessage && <FormSubmitError message={data.errorMessage} />}
                            <div className="form-group">
                                <label >Subject <sup style={{ color: "#f44336" }}>*</sup></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="subject"
                                    name="subject"
                                    style={errors.subject && { borderColor: "red", boxShadow: "none !important" }}
                                    value={data.subject}
                                    ref={register({ required: true, minLength: 4 })}
                                    onChange={handleInputChange}
                                />
                                {errors.subject
                                    &&
                                    errors.subject.type === "required"
                                    &&
                                    <span style={{ color: "#f44336" }}>This field is required</span>}
                                {errors.subject && errors.subject.type === "minLength" && <span style={{ color: "#f44336" }}>User name should have atleast 4 letters</span>}


                            </div>
                            <div className="form-group">
                                <label >Your Email Address<sup style={{ color: "#f44336" }}>*</sup></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="senderEmail"
                                    name="senderEmail"
                                    style={errors.senderEmail && { borderColor: "red", boxShadow: "none !important" }}
                                    value={data.senderEmail}
                                    ref={register({ required: true, pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
                                    onChange={handleInputChange}
                                />
                                {errors.senderEmail
                                    &&
                                    errors.senderEmail.type === "required"
                                    &&
                                    <span style={{ color: "#f44336" }}>This field is required</span>}
                                {errors.senderEmail && errors.senderEmail.type === "pattern" && <span style={{ color: "#f44336" }}>Invalid email address</span>}
                            </div>

                            <div className="form-group">
                                <label >Message<sup style={{ color: "#f44336" }}>*</sup></label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="message"
                                    rows="4"
                                    name="message"
                                    style={errors.message && { borderColor: "red", boxShadow: "none !important" }}
                                    value={data.message}
                                    ref={register({ required: true })}
                                    onChange={handleInputChange}
                                />
                                {errors.message
                                    &&
                                    errors.message.type === "required"
                                    &&
                                    <span style={{ color: "#f44336" }}>This field is required</span>}

                            </div>

                            <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />
                            <br />
                            <span className="subCancelBtn" style={{ marginTop: "3%" }}>
                                <button type="submit" id="submitBtn" className="btn btn-primary" style={{ marginRight: "5%" }}>{data.isSubmitting ? "Sending..." : "Send"}</button>

                            </span> </form>

                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>

        </>
    )
}

export default Contact;