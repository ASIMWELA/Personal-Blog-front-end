import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Redirect } from 'react-router-dom'
import { MdCreate } from 'react-icons/md'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Button } from 'antd'
import { authenticateAdmin } from '../../utils/AuthUtils'
import { BASE_URL } from '../../constants'
import { Card } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

export default function Employment() {
    const [showModal, setShowModal] = useState(false)
    const [employment, setEmployment] = useState([])
    const [loading, setLoading] = useState(true)
    let isAdminAuthenticated = authenticateAdmin()
    const { register, handleSubmit, errors } = useForm();
    const [state, setState] = useState({
        company: "",
        accomplishments: [],
        duration: '',
        availability: '',
        formTitle: '',
        submitEdit: false,
        isSubmitting: false,
        errorMessage: null,
        successMessage: null,
        chosenCompany: ''
    });

    let token = null
    let userName = null
    let uid = null
    if (isAdminAuthenticated) {
        token = JSON.parse(localStorage.getItem('admin')).access_TOKEN
        userName = JSON.parse(localStorage.getItem('admin')).user.userName
        uid = JSON.parse(localStorage.getItem('admin')).user.uid
    }
    useEffect(() => {
        refreshEmpDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleCloseModal = () => {
        setShowModal(false)
        setState({
            ...state,
            formTitle: '',
            company: "",
            accomplishments: [],
            duration: '',
            availability: '',
            successMessage: '',
            errorMessage: '',
            submitEdit: false
        })
    }
    const handleInputChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };
    const addEmployment = () => {
        setShowModal(true)
        setState({
            ...state,
            formTitle: "Add Employment Details"
        })
    }
    const saveEmployment = () => {

        setShowModal(true)

        let selectedCompany = state.chosenCompany

        setState({
            ...state,
            isSubmitting: true,
            submitEdit: true,
            formTitle: "Edit " + selectedCompany + "Details",
            errorMessage: null
        })
        let accomplishments = null
        if (state.accomplishments.indexOf(',') < 0) {

            accomplishments = new Array(state.accomplishments)

        } else {
            accomplishments = state.accomplishments.split(',')
        }

        const empDetails = {
            company: state.company,
            duration: state.duration,
            availability: state.availability,
            accomplishments: accomplishments
        }

        axios({
            method: 'put',
            url: BASE_URL + '/employment/update/' + selectedCompany,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(empDetails)
        }).then(res => {
            if (res.data.code === 200) {
                refreshEmpDetails()
                setState({
                    company: "",
                    accomplishments: [],
                    duration: '',
                    availability: '',
                    submitEdit: false,
                    formTitle: res.data.message,
                    successMessage: res.data.message,
                })


            }

        }).catch(err => {
            setState({
                ...state,
                errorMessage: err.message
            })
        })

    }

    const deleteEmployment = (event) => {
        let company = event.currentTarget.value
        const response = window.confirm("Are you sure you want to delete the  " + company + " details ?")
        if (response === true) {
            axios.delete(BASE_URL + '/employment/' + userName + "/" + company, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.code === 200) {
                    refreshEmpDetails()
                }
            })
        } else {
            return false
        }

    }

    const editEmployment = (event) => {
        setShowModal(true)
        const company = event.currentTarget.value
        const companyDetails = employment.find(comp => {
            return comp.company === company
        })

        setState({
            ...state,
            company: companyDetails.company,
            accomplishments: companyDetails.accomplishments,
            availability: companyDetails.availability,
            duration: companyDetails.duration,
            formTitle: "Edit " + companyDetails.company + " Details",
            submitEdit: true,
            chosenCompany: company
        })
    }

    const refreshEmpDetails = async () => {
        if (uid === null) return
        const userData = await axios.get(BASE_URL + '/users/' + uid).then(res => {
            setLoading(false)
            return res.data
        }).catch(err => console.log(err))

        if (userData) {
            if (userData.employment) {
                setEmployment(userData.employment)
            }
            else {
                setEmployment([])
            }
        }

    }

    const handleFormSubmit = () => {
        setState({
            ...state,
            isSubmitting: true,
            errorMessage: null
        })

        let accomplishments = null
        if (state.accomplishments.indexOf(',') < 0) {

            accomplishments = new Array(state.accomplishments)

        } else {
            accomplishments = state.accomplishments.split(',')
        }

        const empDetails = {
            company: state.company,
            duration: state.duration,
            availability: state.availability,
            accomplishments: accomplishments
        }


        axios({
            method: 'put',
            url: BASE_URL + '/employment/' + userName,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(empDetails)
        }).then(res => {
            if (res.data.code === 200) {
                refreshEmpDetails()
                setState({
                    company: "",
                    accomplishments: [],
                    duration: '',
                    availability: '',
                    submitEdit: false,
                    isSubmitting: false,
                    formTitle: res.data.message,
                    successMessage: res.data.message,
                })


            }

        }).catch(err => {
            setState({
                ...state,
                errorMessage: err.message
            })
        })

    }
    return (
        <div className="container-fluid">
            {isAdminAuthenticated ? (
                <div>
                    <div>
                        <span style={{ marginLeft: "2rem" }} data-toggle="tooltip" title="Add education details" className="add-project-button" onClick={addEmployment}><MdCreate size={30} /></span>
                    </div>
                    {
                        loading ? <div>Loading</div> : (
                            <div className="row">
                                {
                                    employment.map(emp => {
                                        return (
                                            <div className="col-md-4" key={emp.company}>
                                                <Card style={{ marginTop: "4%" }}>
                                                    <Card.Subtitle style={{ textAlign: "center", marginTop: "1%", marginBottom: "0px !important" }}>
                                                        <h6>Company: <strong>{emp.company}</strong></h6>
                                                    </Card.Subtitle>
                                                    <Card.Body style={{ marginTop: "0px !important" }}>
                                                        <h6>Availabality : <strong>{emp.availability}</strong></h6>
                                                        <h6>Period : <strong>{emp.duration}</strong></h6>
                                                        <h6>Accomplishments</h6>
                                                        <ul style={{ listStyle: "square" }}>
                                                            {emp.accomplishments.map(accomp => {
                                                                return (
                                                                    <li key={accomp}>
                                                                        <h6><strong>{accomp}</strong></h6>
                                                                    </li>
                                                                )

                                                            })}
                                                        </ul>

                                                    </Card.Body>
                                                    <Card.Footer>

                                                        <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Edit ${emp.company} details`} style={{ float: "left", padding: "0px", backgroundColor: "inherit", border: "none" }} value={emp.company} onClick={(event) => editEmployment(event)}>
                                                            <FaEdit size={25} color={"#455A64"} />
                                                        </Button>

                                                        <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Delete ${emp.company} details`} style={{ float: "right", padding: "0px", backgroundColor: "inherit", border: "none" }} value={emp.company} onClick={(event) => deleteEmployment(event)}>
                                                            <FaTrash size={25} color={"red"} />
                                                        </Button>
                                                    </Card.Footer>
                                                </Card>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }

                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        backdrop='static'
                        keyboard={false}
                        centered
                    >

                        <Modal.Header closeButton>
                            <Modal.Title>{state.formTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form id="form">
                                <div className="form-group">
                                    <label >Company<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="company"
                                        name="company"
                                        style={errors.company && { borderColor: "red", boxShadow: "none !important" }}

                                        value={state.company}
                                        ref={register({ required: true, minLength: 2 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.company

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}
                                    {errors.company && errors.company.type === "minLength" && <span style={{ color: "#f44336" }}>Institution name should have atleast 2 letters</span>}

                                </div>

                                <div className="form-group">
                                    <label >Period<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="duration"
                                        name="duration"
                                        style={errors.duration && { borderColor: "red", boxShadow: "none !important" }}

                                        value={state.duration}
                                        ref={register({ required: true, minLength: 2 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.duration

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}
                                    {errors.duration && errors.duration.type === "minLength" && <span style={{ color: "#f44336" }}>Institution name should have atleast 2 letters</span>}

                                </div>


                                <div className="form-group">
                                    <label >Availability <sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="availability"
                                        name="availability"
                                        style={errors.availability && { borderColor: "red", boxShadow: "none !important" }}

                                        placeholder="e.g. part time, full time"
                                        value={state.availability}
                                        ref={register({ required: true })}
                                        onChange={handleInputChange}
                                    />
                                    {errors.availability
                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}

                                </div>
                                <div className="form-group">
                                    <label >Accomplishments<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        rows="2"
                                        placeholder="e.g. intergrated abc api with xyz api, developed stand alone abc app...."
                                        id="accomplishments"
                                        name="accomplishments"
                                        style={errors.accomplishments && { borderColor: "red", boxShadow: "none !important" }}

                                        value={state.accomplishments}
                                        ref={register({ required: true, maxLength: 150 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.accomplishments &&
                                        errors.accomplishments.type === "required"

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}

                                    {errors.accomplishments &&
                                        errors.accomplishments.type === "maxLength"

                                        &&
                                        <span style={{ color: "#f44336" }}>Awards string too long</span>}


                                </div>


                                <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />

                                <br />
                                {state.successMessage && <span>{state.successMessage}</span>}
                                {state.errorMessage && <span>{state.errorMessage}</span>}

                                <span className="subCancelBtn" style={{ marginTop: "1%" }}>

                                    <button type="button" id="submitBtn" className="btn btn-primary" style={{ marginRight: "5%" }} onClick={state.submitEdit ? handleSubmit(saveEmployment) : handleSubmit(handleFormSubmit)} >{state.isSubmitting ? "Submitting..." : "Submit"}</button>

                                </span>


                            </form>
                        </Modal.Body>

                    </Modal>



                </div>

            ) : <Redirect to="/login" />}
        </div>
    )
}
