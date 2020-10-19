import React, { useState } from 'react';
import axios from 'axios'
import { BASE_URL } from '../constants'
import { Link } from 'react-router-dom'
import AuthenticationError from './AuthenticationError'
import { Card } from 'react-bootstrap'
import { FaUser, FaKey } from 'react-icons/fa'
import './login.css'


export default function Login(props) {
    const initialState = {
        userName: "",
        password: "",
        isSubmitting: false,
        errorMessage: null
    };

    const [data, setData] = useState(initialState);
    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        });
        axios({
            method: 'post',
            url: BASE_URL + '/auth/login',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                userName: data.userName,
                password: data.password
            })
        }).then(user => {

            const roles = user.data.user.roles.map(role => role.name)

            if (roles.length > 1 && roles.includes("ROLE_ADMIN")) {
                localStorage.setItem('admin', JSON.stringify(user.data))
                props.history.push('/admin/projects')

            }
            else {
                localStorage.setItem('user', JSON.stringify(user.data))
                props.history.push('/user')
            }
        }).catch(error => {
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: "Username, password do not match"

            });
        });
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <Card id="loginForm" >
                        <div className="signInHeader">Sign In</div>
                        <small style={{ textAlign: "center" }}> {data.errorMessage && (
                            <AuthenticationError message={data.errorMessage} />
                        )}</small>
                        <Card.Body>
                            <form >
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text"><FaUser /></div>
                                    </div>
                                    <input type="text"
                                        name="userName"
                                        placeholder="Username"
                                        onChange={handleInputChange}
                                        value={data.userName}
                                        className="form-control"
                                    />
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text"><FaKey /></div>
                                    </div>
                                    <input
                                        type="password"
                                        id="passwordField"
                                        placeholder="password"
                                        onChange={handleInputChange}
                                        value={data.password}
                                        name="password"
                                        className="form-control"

                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                handleFormSubmit(event)
                                            }
                                        }}

                                    />
                                </div>
                                <div><Link to='/forgot-password'>Forgot password? </Link></div>

                                <button type="button" className="btn btn-primary" style={{ width: "100%", marginTop: "3px" }} onClick={handleFormSubmit}>
                                    {data.isSubmitting ? (
                                        "Signing In..."
                                    ) : (
                                            "Sign In"
                                        )}</button>


                            </form>
                        </Card.Body>
                        <Card.Footer> <span>Dont have an account? <Link to='/register'>subscribe</Link></span>
                            <span> <Link to='/'>Home</Link></span></Card.Footer>

                    </Card>
                </div>
                <div className="col-md-4"></div>
            </div>
        </div >



    );
}
