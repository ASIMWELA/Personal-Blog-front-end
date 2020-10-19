import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { Card } from 'react-bootstrap'
import { Button } from 'antd'
import { FaTrash } from 'react-icons/fa'
import { MdCreate } from 'react-icons/md'
import Modal from 'react-bootstrap/Modal'
import { BASE_URL } from '../../constants'
import { useHistory } from 'react-router-dom'
import { authenticateAdmin } from '../../utils/AuthUtils'
import axios from 'axios'

export default function Experience() {
    const { register, handleSubmit, errors } = useForm();
    const [showModal, setShowModal] = useState(false)
    const [experiences, setExperiences] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory()

    const [data, setData] = useState({
        name: '',
        beganOn: "",
        successMessage: '',
        isSubmitting: false,
        errorMessage: '',
        formTitle: "Add experience"
    })

    let isAdminAuthenticated = authenticateAdmin()

    let token = null
    let userName = null
    let userObj
    //let user = null;
    if (isAdminAuthenticated) {
        userObj = JSON.parse(localStorage.getItem('admin'))
        token = userObj.access_TOKEN
        userName = userObj.user.userName
    }
    else {
        history.push('/')
    }
    useEffect(() => {
        refreshExperienceDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };
    const refreshExperienceDetails = async () => {
        if (userObj === undefined) return
        const userData = await axios.get(BASE_URL + '/users/' + userObj.user.uid).then(res => {
            setLoading(false)
            return res.data
        }
        )
        if (userData.experience) {
            setExperiences(userData.experience)
        } else {
            setExperiences([])
        }

    }
    const handleFormSubmit = () => {
        setData({
            ...data,
            isSubmitting: true
        })

        let experienceData = {
            name: data.name,
            beganOn: data.beganOn
        }
        axios({
            method: 'put',
            url: BASE_URL + `/experience/${userName}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(experienceData)
        }).then(res => {
            if (res.data.code === 200) {
                refreshExperienceDetails()
                setData({
                    name: "",
                    beganOn: "",
                    successMessage: res.data.message,
                    isSubmitting: false
                })

            }

        }).catch(err => {

            if ((err.message).indexOf('409') >= 0) {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: 'Experience already added. Specify a new experience entity'

                });

            }
            else {
                setLoading(false)
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: err.message || ErrorEvent.statusText
                }

                )
            }
        })
    }
    const handleCloseModal = () => {
        setShowModal(false)
    }

    const deleteExperience = (event) => {
        const expName = event.currentTarget.value
        const response = window.confirm("Are you sure you want to delete the project " + expName + " ?")
        if (response === true) {
            axios.delete(BASE_URL + `/experience/${expName}/${userName}`, { headers: { 'Authorization': "Bearer " + token } }).then(res => {
                if (res.data.code === 200) {
                    refreshExperienceDetails()
                }
            }).catch(err => console.log(err.message))

        } else {
            return false
        }

    }
    return (
        <>
            <Button icon={<MdCreate size={25} />} onClick={() => setShowModal(true)} style={{ marginTop: "3%" }} data-toggle="tooltip"
                title={"Add Exp. Details"} />

            <div className="container-fluid">

                {
                    loading ? <div>Loading</div> : (
                        <div className="row">
                            {
                                experiences.map(exp => {
                                    return (
                                        <div className="col-md-4" key={exp.name}>


                                            <Card style={{ display: "group", textAlign: "center", margin: "3%" }} id="project-card">
                                                <Card.Subtitle style={{ marginTop: "1%", marginBottom: "2px" }}>{exp.name}</Card.Subtitle>

                                                <Card.Body>
                                                    Year started <strong> {exp.beganOn}</strong><br />
                                    Experience : <strong>{exp.years < 1 ? <span>{exp.month === 1 ? <span>{exp.months} Month</span> : <span>{exp.months} Months</span>} </span> : <span>{exp.years === 1 ? <span>{exp.years} Year</span> : <span>{exp.years} Years</span>}</span>} </strong>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <Button icon={<FaTrash size={20} color={"red"} />} value={exp.name} style={{ margin: "0px", padding: "3px", border: "none", backgroundColor: "inherit" }} onClick={(event) => deleteExperience(event)} data-toggle="tooltip"
                                                        title={`Delete ${exp.name}`} />
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
                        <Modal.Title>{data.formTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="beganOn-form-container">
                            <form id='form'>
                                <div className="form-group">
                                    <label >name<sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name='name'
                                        ref={register({ required: true, minLength: 2 })}
                                        value={data.name}
                                        style={errors.name && { borderColor: "red", boxShadow: "none !important" }}

                                        placeholder="e.g. Java"
                                        onChange={handleInputChange}
                                    />{errors.name
                                        &&
                                        errors.name.type === "required"
                                        &&
                                        <span style={{ color: "#f44336" }}>Tech is required</span>}
                                    {errors.name && errors.name.type === "minLength" && <span style={{ color: "#f44336" }}>Name should have atleast 2 letters</span>}
                                </div>
                                <div className="form-group">
                                    <label>Year Started<sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup></label><br />
                                    < input
                                        type="date"
                                        id="beganOn"
                                        name='beganOn'
                                        style={errors.beganOn && { borderColor: "red", boxShadow: "none !important" }}

                                        value={data.beganOn}
                                        onChange={handleInputChange}
                                        ref={register({ required: true })} /><br />
                                    {errors.beganOn && <span style={{ color: "#f44336" }}>Field is required</span>}
                                </div>
                                <span>{data.successMessage}</span>
                                <span>{data.errorMessage}</span> <br />
                                <span className="form-buttons">
                                    <Button type="button" onClick={handleSubmit(handleFormSubmit)} className="btn btn-primary active" id="submitBtn">
                                        {data.isSubmitting ? "Submitting..." : "Submit"}
                                    </Button>
                                </span>

                            </form>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>



        </>
    );
}
