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

export default function Education() {

    const [showModal, setShowModal] = useState(false)
    const [education, setEducation] = useState([])
    const [loading, setLoading] = useState(true)
    let isAdminAuthenticated = authenticateAdmin()
    const { register, handleSubmit, errors } = useForm();
    const [state, setState] = useState({
        institution: "",
        awards: [],
        period: '',
        formTitle: '',
        chosenInstituion: '',
        submitEdit: false,
        isSubmitting: false,
        errorMessage: null,
        successMessage: null
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
        refreshEduactionDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleCloseModal = () => {
        setShowModal(false)
        setState({
            ...state,
            formTitle: '',
            awards: '',
            institution: '',
            period: '',
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

    const handleFormSubmit = () => {

        setState({
            ...state,
            isSubmitting: true,
            errorMessage: null
        })

        let awards = null
        if (state.awards.indexOf(',') < 0) {

            awards = new Array(state.awards)

        } else {
            awards = state.awards.split(',')
        }

        const eduData = {
            institution: state.institution,
            awards: awards,
            period: state.period
        }

        axios({
            method: 'put',
            url: BASE_URL + '/education/' + userName,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(eduData)
        }).then(res => {
            if (res.data.code === 200) {
                refreshEduactionDetails()
                setState({
                    institution: "",
                    awards: "",
                    period: '',
                    formTitle: "Add Education Details",
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

    const refreshEduactionDetails = async () => {
        if (uid === null) return
        const userData = await axios.get(BASE_URL + '/users/' + uid).then(res => {
            setLoading(false)
            return res.data
        }).catch(err => console.log(err))
        if (userData) {
            if (userData.education) {
                setEducation(userData.education)
            }
            else {
                setEducation([])
            }
        }


    }


    const saveEducation = () => {
        setShowModal(true)

        let selectedInstution = state.chosenInstituion


        setState({
            ...state,
            isSubmitting: true,
            submitEdit: true,
            formTitle: "Edit " + selectedInstution + "Details",
            errorMessage: null
        })
        let awards = null
        //create an array od awards
        if (state.awards.indexOf(',') < 0) {

            awards = new Array(state.awards)

        } else {
            awards = state.awards.split(',')
        }

        //education details object
        const eduData = {
            institution: state.institution,
            awards: awards,
            period: state.period
        }

        //add education details
        axios({
            method: 'put',
            url: BASE_URL + '/education/update/' + selectedInstution,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(eduData)
        }).then(res => {
            if (res.data.code === 200) {
                refreshEduactionDetails()
                setState({
                    institution: "",
                    awards: "",
                    period: '',
                    submitEdit: false,
                    formTitle: "Add Education Details",
                    successMessage: res.data.message,
                })
                //dismiss the modal after 7 seconds
                setTimeout(() => { setShowModal(false) }, 70000)


            }

        }).catch(err => {
            setState({
                ...state,
                errorMessage: err.message
            })
        })


    }

    //open modal for adding education details
    const addEducaction = () => {
        setShowModal(true)
        setState({
            ...state,
            formTitle: "Add Education Details"
        })
    }
    const deleteEducation = (event) => {
        let educationInstitution = event.currentTarget.value
        const response = window.confirm("Are you sure you want to delete the  " + educationInstitution + " details ?")
        if (response === true) {
            axios.delete(BASE_URL + '/education/' + userName + "/" + educationInstitution, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.code === 200) {
                    refreshEduactionDetails()
                }
            })
        } else {
            return false
        }

    }

    const editEducation = (event) => {
        setShowModal(true)
        const selectedEducation = event.currentTarget.value
        const educationDetails = education.find(edu => {
            return edu.institution === selectedEducation
        })

        setState({
            ...state,
            institution: educationDetails.institution,
            awards: educationDetails.awards,
            period: educationDetails.period,
            formTitle: "Edit " + educationDetails.institution + " Details",
            submitEdit: true,
            chosenInstituion: selectedEducation
        })
    }

    return (

        <div className="container-fluid">
            {isAdminAuthenticated ? (
                <div>
                    <div>
                        <span style={{ marginLeft: "2rem" }} data-toggle="tooltip" title="Add education details" className="add-project-button" onClick={addEducaction}><MdCreate size={30} /></span>
                    </div>
                    {
                        loading ? <div>Loading</div> : (
                            <div className="row">
                                {
                                    education.map(edu => {
                                        return (
                                            <div className="col-md-4" key={edu.institution}>
                                                <Card style={{ display: "group" }}>
                                                    <Card.Subtitle style={{ marginTop: "2%", textAlign: "center" }}>
                                                        <strong>{edu.institution}</strong>
                                                    </Card.Subtitle>
                                                    <Card.Body >
                                                        <span>Period : <strong>{edu.period}</strong></span><br />
                                                        <h6>Awards</h6>
                                                        <ul style={{ listStyle: "square", marginLeft: "0px", marginRight: "10%" }}>
                                                            {edu.awards.map(award => {
                                                                return (
                                                                    <li key={`${edu.institution} + ${award}`}>
                                                                        {award}
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Edit ${edu.institution} details`} style={{ float: "left", padding: "0px", backgroundColor: "inherit", border: "none" }} value={edu.institution} onClick={(event) => editEducation(event)}>
                                                            <FaEdit size={25} color={"#455A64"} />
                                                        </Button>

                                                        <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Delete ${edu.institution} details`} style={{ float: "right", padding: "0px", backgroundColor: "inherit", border: "none" }} value={edu.institution} onClick={(event) => deleteEducation(event)}>
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
                                    <label >Institution<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="institution"
                                        style={errors.institution && { borderColor: "red", boxShadow: "none !important" }}

                                        name="institution"
                                        value={state.institution}
                                        ref={register({ required: true, minLength: 2 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.institution

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}
                                    {errors.institution && errors.institution.type === "minLength" && <span style={{ color: "#f44336" }}>Institution name should have atleast 2 letters</span>}

                                </div>
                                <div className="form-group">
                                    <label >Awards<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        rows="2"
                                        placeholder="Bsc in comp, Msc in info, PHD in abc...."
                                        id="awards"
                                        style={errors.awards && { borderColor: "red", boxShadow: "none !important" }}

                                        name="awards"
                                        value={state.awards}
                                        ref={register({ required: true, maxLength: 150 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.awards &&
                                        errors.awards.type === "required"

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}

                                    {errors.awards &&
                                        errors.awards.type === "maxLength"

                                        &&
                                        <span style={{ color: "#f44336" }}>Awards string too long</span>}


                                </div>
                                <div className="form-group">
                                    <label >Duration <sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="period"
                                        name="period"
                                        style={errors.period && { borderColor: "red", boxShadow: "none !important" }}

                                        placeholder="e.g. 2018 - present"
                                        value={state.period}
                                        ref={register({ required: true })}
                                        onChange={handleInputChange}
                                    />
                                    {errors.period
                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}

                                </div>

                                <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />

                                <br />
                                {state.successMessage && <span>{state.successMessage}</span>}
                                {state.errorMessage && <span>{state.errorMessage}</span>}

                                <span className="subCancelBtn" style={{ marginTop: "1%" }}>

                                    <button type="button" id="submitBtn" className="btn btn-primary" style={{ marginRight: "5%" }} onClick={state.submitEdit ? handleSubmit(saveEducation) : handleSubmit(handleFormSubmit)} >{state.isSubmitting ? "Submitting..." : "Submit"}</button>

                                </span>


                            </form>
                        </Modal.Body>

                    </Modal>


                </div>
            ) : <Redirect to="/login" />}

        </div>
    )
}
