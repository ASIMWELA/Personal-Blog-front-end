import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { authenticateAdmin } from '../../utils/AuthUtils'
import Modal from 'react-bootstrap/Modal'
import { Card } from 'react-bootstrap'
import { MdCreate } from 'react-icons/md'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Button } from 'antd'
import { Redirect } from 'react-router-dom'
import { BASE_URL } from '../../constants'
import axios from 'axios'

export default function Address() {

    const [showModal, setShowModal] = useState(false)
    const [address, setAddress] = useState()
    const [loading, setLoading] = useState(true)
    let isAdminAuthenticated = authenticateAdmin()
    const { register, handleSubmit, errors } = useForm();
    const [state, setState] = useState({
        city: "",
        physicalAddress: '',
        phoneNumber: '',
        country: '',
        formTitle: '',
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
        refreshAddressDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleInputChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    const handleCloseModal = () => {
        setShowModal(false)
        setState({
            ...state,
            errorMessage: '',
            successMessage: '',
            submitEdit: false,
            isSubmitting: false

        })
    }
    const saveAddressDetails = () => {
        setShowModal(true)

        let selectedPhone = state.chosenPhone


        setState({
            ...state,
            isSubmitting: true,
            submitEdit: true,
            formTitle: "Edit Contact Details",
            errorMessage: null
        })

        const contactDetails = {
            city: state.city,
            country: state.country,
            physicalAddress: state.physicalAddress,
            phoneNumber: state.phoneNumber

        }

        axios({
            method: 'put',
            url: BASE_URL + '/contact-info/update/' + selectedPhone,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(contactDetails)
        }).then(res => {
            if (res.data.code === 200) {
                refreshAddressDetails()
                setState({
                    city: "",
                    country: "",
                    phoneNumber: '',
                    physicalAddress: '',
                    submitEdit: false,
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

    const addAdressDetails = () => {
        setShowModal(true)
        setState({
            ...state,
            formTitle: "Add Address Details"
        })
    }

    const refreshAddressDetails = async () => {
        if (uid === null) return
        const userData = await axios.get(BASE_URL + '/users/' + uid).then(res => {
            setLoading(false)
            return res.data
        }).catch(err => console.log(err))
        if (userData) {
            if (userData.contactInfo) {
                setAddress(userData.contactInfo)
            }
            else (
                setAddress()
            )

        }

    }

    const deleteAddressDetails = () => {

        const response = window.confirm("Are you sure you want to delete the contact details ?")
        if (response === true) {
            axios.delete(BASE_URL + `/contact-info/${address.phoneNumber}/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.code === 200) {
                    refreshAddressDetails()
                }
            })
        } else {
            return false
        }

    }


    const editContactDetails = (event) => {
        setShowModal(true)
        const selectedphone = event.currentTarget.value
        setState({
            ...state,
            city: address.city,
            country: address.country,
            phoneNumber: address.phoneNumber,
            physicalAddress: address.physicalAddress,
            formTitle: "Edit Contact Details",
            submitEdit: true,
            chosenPhone: selectedphone
        })
    }
    const handleFormSubmit = () => {

        setState({
            ...state,
            isSubmitting: true,
            errorMessage: null
        })
        const address = {
            country: state.country,
            city: state.city,
            phoneNumber: state.phoneNumber,
            physicalAddress: state.physicalAddress
        }

        axios({
            method: 'put',
            url: BASE_URL + '/contact-info/' + userName,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(address)
        }).then(res => {
            if (res.data.code === 200) {
                refreshAddressDetails()
                setState({
                    city: "",
                    physicalAddress: '',
                    phoneNumber: '',
                    country: '',
                    submitEdit: false,
                    isSubmitting: false,
                    formTitle: "Add Education Details",
                    successMessage: res.data.message,
                })
                setTimeout(() => {
                    setShowModal(false)
                }, 5000)


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
            {
                isAdminAuthenticated ? (
                    <div>
                        <div style={address && { display: "none" }}>
                            <span style={{ marginLeft: "2rem" }} data-toggle="tooltip" title="Add Addres details" className="add-project-button" onClick={addAdressDetails}><MdCreate size={30} /></span>
                        </div>
                        {loading ? <div>Loading</div> : (
                            <div className='row'>

                                <div className="col-md-10">
                                    {address &&

                                        <Card style={{ marginLeft: "15%" }}><Card.Title style={{ display: "block", textAlign: "center", marginTop: "3%" }}><strong>Address Datails</strong></Card.Title>
                                            <Card.Body style={{ display: "block", textAlign: "center" }}>
                                                <h6>Contact phone number : <strong>{address.phoneNumber}</strong></h6><br />
                                                <h6>City : <strong>{address.city}</strong></h6><br />
                                                <h6>Country : <strong>{address.country}</strong></h6>
                                                <br />

                                                <h6>Physical Address :</h6>
                                                <h6><strong>{address.physicalAddress}</strong></h6>

                                            </Card.Body>
                                            <Card.Footer>
                                                <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={'Edit Contact details'} style={{ float: "left", padding: "0px", backgroundColor: "inherit", border: "none" }} value={address.phoneNumber} onClick={(event) => editContactDetails(event)}>
                                                    <FaEdit size={25} color={"#455A64"} />
                                                </Button>

                                                <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={'Delete contact details'} style={{ float: "right", padding: "0px", backgroundColor: "inherit", border: "none" }} value={address.phoneNumber} onClick={(event) => deleteAddressDetails(event)}>
                                                    <FaTrash size={25} color={"red"} />
                                                </Button>
                                            </Card.Footer>
                                        </Card>}

                                </div>


                            </div>
                        )}
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

                                        <label >Phone number<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phoneNumber"
                                            style={errors.phoneNumber && { borderColor: "red", boxShadow: "none !important" }}

                                            name="phoneNumber"
                                            value={state.phoneNumber}
                                            ref={register({ required: true })}
                                            onChange={handleInputChange}

                                        />
                                        {errors.phoneNumber

                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}

                                    </div>
                                    <div className="form-group">

                                        <label >City<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            style={errors.city && { borderColor: "red", boxShadow: "none !important" }}

                                            value={state.city}
                                            ref={register({ required: true, minLength: 2 })}
                                            onChange={handleInputChange}

                                        />
                                        {errors.city

                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}
                                        {errors.city && errors.city.type === "minLength" && <span style={{ color: "#f44336" }}>City name should have atleast 2 letters</span>}

                                    </div>
                                    <div className="form-group">
                                        <label >Country <sup style={{ color: "#f44336" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="country"
                                            name="country"
                                            style={errors.country && { borderColor: "red", boxShadow: "none !important" }}

                                            value={state.country}
                                            ref={register({ required: true })}
                                            onChange={handleInputChange}
                                        />
                                        {errors.country
                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}

                                    </div>

                                    <div className="form-group">
                                        <label >Physical Address<sup style={{ color: "#f44336" }}>*</sup></label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            rows="2"
                                            placeholder="e.g. Computer science department, Chanco, box..."
                                            id="physicalAddress"
                                            name="physicalAddress"
                                            style={errors.physicalAddress && { borderColor: "red", boxShadow: "none !important" }}

                                            value={state.physicalAddress}
                                            ref={register({ required: true, maxLength: 150 })}
                                            onChange={handleInputChange}

                                        />
                                        {errors.physicalAddress &&
                                            errors.physicalAddress.type === "required"

                                            &&
                                            <span style={{ color: "#f44336" }}>This field is required</span>}

                                        {errors.physicalAddress &&
                                            errors.physicalAddress.type === "maxLength"

                                            &&
                                            <span style={{ color: "#f44336" }}>Awards string too long</span>}


                                    </div>

                                    <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />

                                    <br />
                                    {state.successMessage && <span>{state.successMessage}</span>}
                                    {state.errorMessage && <span>{state.errorMessage}</span>}

                                    <span className="subCancelBtn" style={{ marginTop: "1%" }}>

                                        <button type="button" id="submitBtn" className="btn btn-primary" style={{ marginRight: "5%" }} onClick={state.submitEdit ? handleSubmit(saveAddressDetails) : handleSubmit(handleFormSubmit)} >{state.isSubmitting ? "Submitting..." : "Submit"}</button>

                                    </span>


                                </form>
                            </Modal.Body>

                        </Modal>


                    </div>) : <Redirect to="/login" />
            }

        </div>
    )
}
