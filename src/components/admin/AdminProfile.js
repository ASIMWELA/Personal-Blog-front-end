import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'
import { FaEdit, FaTrash } from "react-icons/fa"
import { useForm } from 'react-hook-form'
import { useHistory, Redirect } from "react-router-dom"
import { BASE_URL } from '../../constants'
import FormSubmitError from '../FormSubmitError'
import axios from 'axios'
import { authenticateAdmin } from '../../utils/AuthUtils'
import './profile.css'
import { MdCreate } from 'react-icons/md'
import Modal from 'react-bootstrap/Modal'

export default function Profile() {
    const { register, handleSubmit, errors } = useForm()
    const history = useHistory()
    const [showModal, setShowModal] = useState(false)
    const [showSecondModal, setShowSecondModa] = useState(false)
    const [admins, setAdmin] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeAdmin, setActiveAdmin]=useState()

    let isAdminAuthenticated = authenticateAdmin()


    const [data, setData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        sex: '',
        dob: '',
        submitEdit: false,
        successMessage: '',
        isSubmitting: false,
        errorMessage: '',
        validatePassword: ''
    })

    useEffect(() => {
        refreshAdminData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  
    const refreshAdminData = async () => {
        if (!user.uid) return
        const users = await axios.get(BASE_URL + "/users").then(users => {
            setLoading(false)
            return users.data
        })
        const admins = users._embedded.userList.filter(user => {
            return 'projects' in user._links
        })

        setAdmin(admins)

        const admin = admins.find(adm => {
            return adm.userName === userName
        })
        setActiveAdmin(admin)
    }

    let token = null
    let user = null;
    let userName = null

    if (isAdminAuthenticated) {
        let userObj = JSON.parse(localStorage.getItem('admin'))
        token = userObj.access_TOKEN
        user = userObj.user
        userName = user.userName

    }
    else {
        history.push('/')
    }

    const editDetails = (event) => {
        setShowSecondModa(true)
        const userName = event.currentTarget.value
        const admin = admins.find(adm => {
            return adm.userName === userName
        })

        setData({
            ...data,
            formTitle: "Edit your details",
            submitEdit: true,
            userName: admin.userName,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email
        })

    }
    const handleSubmitForm = () => {
        setData({
            ...data,
            isSubmitting: true
        })

        const adminData = {
            userName: data.userName,
            firstName: data.userName,
            lastName: data.lastName,
            password: data.password,
            sex: data.sex,
            email: data.email,
            dateOfBirth: data.dob
        }
        axios({
            method: 'post',
            url: BASE_URL + '/auth/signup-admin',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(adminData)
        }).then(res => {
            if (res.data.code === 201) {
                setData({
                    firstName: "",
                    lastName: "",
                    userName: "",
                    password: "",
                    validatePassword: "",
                    email: "",
                    dob: '',
                    successMessage: res.data.message,
                    isSubmitting: false,
                    formTitle: res.data.message
                })

                refreshAdminData()

            }


        })
    }

    const addAdmin = () => {
        setShowModal(true)
        setData({
            ...data,
            formTitle: "Add Admin Details"
        })
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setData({
            ...data,
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            email: "",
            dob: '',
            formTitle: '',
            successMessage: '',
            errorMessage: '',
            submitEdit: false
        })
    }

    const handleCloseSecondModal = () => {
        setShowSecondModa(false)
        setData({
            ...data,
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            email: "",
            formTitle: '',
            successMessage: '',
            errorMessage: '',
            submitEdit: false
        })
    }


    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const deleteAdmin = (event) => {
        const adminUserName = event.currentTarget.value

        const response = window.confirm("Are you sure you want to delete the project " + adminUserName + " Details")
        if (response === true) {
            axios.delete(BASE_URL + '/users/' + adminUserName, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.code === 200) {

                    refreshAdminData()
                }
            })
        } else {
            return false
        }


    }
console.log(admins)
    const submitEdit = () => {
        setShowSecondModa(true)
        setData({
            ...data,
            isSubmitting: true
        })

        let adminData = {
            userName: data.userName,
            lastName: data.lastName,
            firstName: data.firstName,
            email: data.email,
            password: data.password
        }

        axios({
            method: 'put',
            url: BASE_URL + `/users/${userName}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(adminData)
        }).then(res => {
            if (res.data.code === 200) {
                setData({
                    firstName: "",
                    lastName: "",
                    userName: "",
                    email: "",
                    password: "",
                    formTitle: res.data.message,
                    successMessage: res.data.message,
                    isSubmitting: false
                })
                //dismiss the modal after 7 seconds50000)
                refreshAdminData()
            }

        }).catch(err => {
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: 'We are unable to update the admin details'

            });

        })
    }
    return (
        <>{isAdminAuthenticated ? (
            <div>
                <div>
                    <span style={{ marginLeft: "2rem" }} data-toggle="tooltip" title="Add your details" className="add-project-button" onClick={addAdmin}><MdCreate size={30} /></span>
                </div>

                <div className="container-fluid">
                    {
                        loading ? <div>Loading</div> : (
                            <div className="row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-8">
                                    <div>
                                        <img src={"/images/user.png"}
                                            className="img-responsive img-circle margin"
                                            id="displayI"
                                            alt="display"
                                            style={{ marginLeft: "4%" }}
                                            width="200"
                                            height="200" />

                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>User name</th>
                                                    <th>Email</th>
                                                    <th>Authorities</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    admins.map(admin => {
                                                        return (
                                                            <tr key={admin.userName}>
                                                                <td>{admin.userName}</td>
                                                                <td>{admin.email}</td>
                                                                <td>Write, Read, Delete</td>
                                                                <td>{admin.userName === userName &&
                                                                    <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={" Edit your details"} style={{ marginTop: "1.8rem", padding: "0px", backgroundColor: "inherit", border: "none" }} value={admin.userName} onClick={(event) => editDetails(event)}>
                                                                        <FaEdit size={25} color={"#455A64"} />
                                                                    </Button>

                                                                }

                                                                    {
                                                                        admin.userName !== userName &&
                                                                        <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Delete ${admin.userName} details`} style={{ marginTop: "1.5rem", padding: "0px", backgroundColor: "inherit", border: "none" }} value={admin.userName} onClick={(event) => deleteAdmin(event)}>
                                                                            <FaTrash size={25} color={"red"} />
                                                                        </Button>
                                                                    }


                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }


                    <div className="col-sm-2"></div>
                    <div>
                        <Modal
                            show={showModal}
                            onHide={handleCloseModal}
                            backdrop='static'
                            keyboard={false}
                            centered
                        >

                            <Modal.Header closeButton>
                                <Modal.Title>{data.formTitle}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>


                                <form id="form" >
                                    <div className="form-group">
                                        <label >First name<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            style={errors.firstName && { borderColor: "red", boxShadow: "none !important" }}
                                            name="firstName"
                                            value={data.firstName}
                                            ref={register({ required: true, minLength: 3 })}
                                            onChange={handleInputChange}

                                        />
                                        {errors.firstName
                                            &&
                                            errors.firstName.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.firstName && errors.firstName.type === "minLength" && <span style={{ color: "#f44336" }}>First name should have atleast 3 letters</span>}

                                    </div>
                                    <div className="form-group">
                                        <label >Last name<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            style={errors.lastName && { borderColor: "red", boxShadow: "none !important" }}
                                            value={data.lastName}
                                            name="lastName"
                                            ref={register({ required: true, minLength: 3 })}
                                            onChange={handleInputChange}
                                        />
                                        {errors.lastName
                                            &&
                                            errors.lastName.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.lastName && errors.lastName.type === "minLength" && <span style={{ color: "#f44336" }}>Last name should have atleast 3 letters</span>}


                                    </div>
                                    <div className="form-group">
                                        <label >User name <sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="adminUserName"
                                            style={errors.userName && { borderColor: "red", boxShadow: "none !important" }}
                                            name="userName"
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
                                        <label >Date of birth<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dob"
                                            name="dob"
                                            style={errors.dob && { borderColor: "red", boxShadow: "none !important" }}
                                            value={data.dob}
                                            ref={register({ required: true })}
                                            onChange={handleInputChange}
                                        />
                                        {errors.dob
                                            &&
                                            errors.dob.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}</div>

                                    <label>Sex</label>
                                    <select className="form-control"
                                        value={data.sex}
                                        id="sex"
                                        name="sex"
                                        style={errors.sex && { borderColor: "red", boxShadow: "none !important" }}
                                        onChange={handleInputChange}
                                    ><option></option>
                                        <option name="Male" id="Male">Male</option>
                                        <option name="Female" id="Female">Female</option>
                                        <option name="Other" id="Other">Other</option>

                                    </select>
                                    <div className="form-group">
                                        <label >Password<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            style={errors.password && { borderColor: "red", boxShadow: "none !important" }}
                                            name="password"
                                            value={data.password}
                                            ref={register({ required: true, minLength: 5 })}
                                            onChange={handleInputChange}
                                        />
                                        {errors.password
                                            &&
                                            errors.password.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.password && errors.password.type === "minLength" && <span style={{ color: "#f44336" }}>Password should have atleast 5 characters long</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Re-type password<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="validatePassword1"
                                            style={errors.validatePassword && { borderColor: "red", boxShadow: "none !important" }}
                                            name="validatePassword"
                                            value={data.validatePassword}
                                            ref={register({ required: true, validate: value => value === data.password })}
                                            onChange={handleInputChange}
                                        />

                                        {errors.validatePassword && errors.validatePassword.type === "validate" && <span style={{ color: "#f44336" }}>Passwords do not match</span>}


                                        {errors.validatePassword && errors.validatePassword.type === "required" && <span style={{ color: "#f44336" }}>This filed is required</span>}

                                    </div>

                                    <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />
                                    {data.errorMessage && <span>{data.errorMessage}</span>}
                                    {data.successMessage && <span>{data.successMessage}</span>}
                                    <br />
                                    <span className="subCancelBtn" style={{ marginTop: "3%" }}>
                                        <button type="button" id="submitBtn" onClick={data.submitEdit ? handleSubmit(submitEdit) : handleSubmit(handleSubmitForm)} className="btn btn-primary" style={{ marginRight: "5%" }}>{data.isSubmitting ? "Submitting..." : "Submit"}</button>

                                    </span> </form>

                            </Modal.Body>
                        </Modal>


                        <Modal
                            show={showSecondModal}
                            onHide={handleCloseSecondModal}
                            backdrop='static'
                            keyboard={false}
                            centered
                        >

                            <Modal.Header closeButton>
                                <Modal.Title>{data.formTitle}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>


                                <form id="form" >
                                    <div className="form-group">
                                        <label >First name<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            style={errors.firstName && { borderColor: "red", boxShadow: "none !important" }}
                                            name="firstName"
                                            value={data.firstName}
                                            ref={register({ required: true, minLength: 3 })}
                                            onChange={handleInputChange}

                                        />
                                        {errors.firstName
                                            &&
                                            errors.firstName.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.firstName && errors.firstName.type === "minLength" && <span style={{ color: "#f44336" }}>First name should have atleast 3 letters</span>}

                                    </div>
                                    <div className="form-group">
                                        <label >Last name<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={data.lastName}
                                            style={errors.lastName && { borderColor: "red", boxShadow: "none !important" }}
                                            name="lastName"
                                            ref={register({ required: true, minLength: 3 })}
                                            onChange={handleInputChange}
                                        />
                                        {errors.lastName
                                            &&
                                            errors.lastName.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.lastName && errors.lastName.type === "minLength" && <span style={{ color: "#f44336" }}>Last name should have atleast 3 letters</span>}


                                    </div>
                                    <div className="form-group">
                                        <label >User name <sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="adminUserName"
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
                                        <label >New Password<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            style={errors.password && { borderColor: "red", boxShadow: "none !important" }}
                                            name="password"
                                            value={data.password}
                                            ref={register({ required: true, minLength: 5 })}
                                            onChange={handleInputChange}
                                        />
                                        {errors.password
                                            &&
                                            errors.password.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.password && errors.password.type === "minLength" && <span style={{ color: "#f44336" }}>Password should have atleast 5 characters long</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Re-type password<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="validatePassword"
                                            style={errors.validatePassword && { borderColor: "red", boxShadow: "none !important" }}
                                            name="validatePassword"
                                            value={data.validatePassword}
                                            ref={register({ validate: value => value === data.password })}
                                            onChange={handleInputChange}
                                        />

                                        {errors.validatePassword && errors.validatePassword.type === "validate" && <span style={{ color: "#f44336" }}>Passwords do not match</span>}


                                    </div>

                                    <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />
                                    {data.errorMessage && <span>{data.errorMessage}</span>}
                                    {data.successMessage && <span>{data.successMessage}</span>}
                                    <br />
                                    <span className="subCancelBtn" style={{ marginTop: "3%" }}>
                                        <button type="button" id="submitBtn" onClick={data.submitEdit ? handleSubmit(submitEdit) : handleSubmit(handleSubmitForm)} className="btn btn-primary" style={{ marginRight: "5%" }}>{data.isSubmitting ? "Sbmitting..." : "Submit"}</button>

                                    </span> </form>

                            </Modal.Body>
                        </Modal>


                    </div>
                </div>

            </div>

        ) : <Redirect to="/" />}

        </>
    );
}
