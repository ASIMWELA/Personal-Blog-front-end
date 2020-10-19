import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap'
import { Button } from 'antd'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'
//import { UserContext } from '../../contex'
import { useHistory, Redirect } from 'react-router-dom'
import { BASE_URL } from '../../constants'
import axios from 'axios'
import './skills.css'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdCreate } from 'react-icons/md'
import { authenticateAdmin } from '../../utils/AuthUtils'


export default function Skills() {
    const { register, handleSubmit, errors } = useForm();
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    //const { loggedInUser } = useContext(UserContext)
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState({
        technology: '',
        skills: '',
        successMessage: '',
        isSubmitting: false,
        submitEdit: false,
        errorMessage: '',
        formTitle: "Add Skill"
    })


    const history = useHistory()

    let isAdminAuthenticated = authenticateAdmin()
    let token = null
    let userName = null
    let user = null;
    if (isAdminAuthenticated) {
        user = JSON.parse(localStorage.getItem('admin'))
        token = user.access_TOKEN
        userName = user.user.userName


    }
    else {
        history.push('/')
    }

    useEffect(() => {
        refreshSkills()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };
    const refreshSkills = async () => {
        if (!user.user) return
        const userData = await axios.get(BASE_URL + '/users/' + user.user.uid).then(res => {
            setLoading(false)
            return res.data
        })
        if (userData.skills) {
            setSkills(userData.skills)
        } else {
            setSkills([])
        }

    }
    const editSkill = (event) => {
        setShowModal(true)
        let tech = event.currentTarget.value
        let skillsData = skills.find(skill => {
            return skill.technology === tech
        })
        setData({
            technology: skillsData.technology,
            skills: skillsData.skills,
            formTitle: "Edit " + skillsData.technology + " Skills",
            submitEdit: true
        })

    }

    const submitEditedSkill = () => {
        setData({
            ...data,
            isSubmitting: true,
            submitEdit: true
        })
        let userSkills = null
        if (data.skills.indexOf(',') < 0) {
            userSkills = new Array(data.skills)
        } else {
            userSkills = data.skills.split(',')
        }
        let skillsData = {
            technology: data.technology,
            skills: userSkills
        }
        axios({
            method: 'put',
            url: BASE_URL + `/skill/update/${userName}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(skillsData)
        }).then(res => {
            if (res.data.code === 200) {
                setData({
                    technology: "",
                    skills: "",
                    successMessage: res.data.message,
                    isSubmitting: false,
                    formTitle: "Add Skill",
                    submitEdit: false
                })

                refreshSkills()
            }

        }).catch(err => {
            setData({
                technology: "",
                skills: "",
                submitEdit: true,
                errorMessage: "we are unable to update the skill",
                isSubmitting: false,
                formTitle: "Edit " + data.technology + "Skills"
            })

        })

    }
    const deleteSkill = (event) => {
        let skill = event.currentTarget.value
        const response = window.confirm("Are you sure you want to delete the project " + skill + " ?")
        if (response === true) {
            axios.delete(BASE_URL + `/skill/${skill}/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.code === 200) {
                    refreshSkills()
                }
            })
        } else {
            return false
        }

    }
    const submitForm = () => {

        setData({
            ...data,
            isSubmitting: true,
        })

        let userSkills = null
        if (data.skills.indexOf(',') < 0) {
            userSkills = new Array(data.skills)
        } else {
            userSkills = data.skills.split(',')
        }
        let skillsData = {
            technology: data.technology,
            skills: userSkills
        }

        axios({
            method: 'put',
            url: BASE_URL + `/skill/${userName}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(skillsData)
        }).then(res => {
            if (res.data.code === 200) {
                refreshSkills()
                setData({
                    technology: "",
                    skills: "",
                    successMessage: res.data.message,
                    isSubmitting: false
                })
            }

        }).catch(err => {
            if ((err.message).indexOf('409') >= 0 || (ErrorEvent.statusText).indexOf('409') >= 0) {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: 'Skill already added. Specify a new skill'

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

    const handleCloseModal = () => {
        setShowModal(false)
        setData({
            ...data,
            submitEdit: false,
            technology: "",
            skills: "",
            isSubmitting: false,
            formTitle: "Add Skill"

        })
    }

    return (

        <div className="container-fluid">
            {isAdminAuthenticated ? (
                <div>
                    <Button onClick={() => setShowModal(true)} icon={<MdCreate size={30} />} data-toggle="tooltip"
                        title={"Add a skill "} />

                    {loading ? <div>Loading</div> : (
                        <div className="row">
                            {
                                skills.map(skill => {
                                    return (
                                        <div className='col-sm-4' id={skill.technology} key={skill.technology}>
                                            <Card style={{ display: "group", textAlign: "center", margin: "3%" }} id="project-card">
                                                <Card.Title style={{ marginTop: "1%", marginBottom: "2px" }}>{skill.technology}</Card.Title>

                                                <Card.Body>
                                                    {skill.skills.map(item => {
                                                        return (
                                                            <span className="skill-name" key={item}>{(item.replace(/[0-9]/g, '')).replace(/[.]/g, '') || skill}{', '}</span>
                                                        )
                                                    })}
                                                    <br />
                                                </Card.Body>
                                                <Card.Footer>
                                                    <Button

                                                        value={skill.technology}
                                                        onClick={(event) => editSkill(event)}
                                                        data-toggle="tooltip"
                                                        title={`Edit ${skill.technology}`}
                                                        icon={<FaEdit size={25} color={'#2196F3'} />}
                                                        style={{ float: "left", padding: "0px", border: "none", backgroundColor: "inherit" }}
                                                    />

                                                    <Button
                                                        value={skill.technology}
                                                        data-toggle="tooltip"
                                                        title={`Delete ${skill.technology}`}
                                                        icon={<FaTrash size={23} color={'red'} />}
                                                        onClick={(event) => deleteSkill(event)}
                                                        style={{ float: "right", padding: "0px", border: "none", backgroundColor: "inherit" }} />

                                                </Card.Footer>

                                            </Card>
                                        </div>
                                    )
                                })

                            }
                        </div>

                    )}



                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        backdrop='static'
                        keyboard={false}
                    >

                        <Modal.Header closeButton>
                            <Modal.Title>{data.formTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <form id='form'>
                                    <div className="form-group">
                                        <label >Technology<sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="technology"
                                            name='technology'
                                            style={errors.technology && { borderColor: "red", boxShadow: "none !important" }}

                                            ref={register({ required: true, minLength: 2 })}
                                            value={data.technology}
                                            placeholder="e.g. Java"
                                            onChange={handleInputChange}
                                        />{errors.technology
                                            &&
                                            errors.technology.type === "required"
                                            &&
                                            <span style={{ color: "#f44336" }}>Tech is required</span>}
                                        {errors.technology && errors.technology.type === "minLength" && <span style={{ color: "#f44336" }}>Tech should have atleast 2 letters</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Skills<sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup></label>
                                        < textarea
                                            type="text"
                                            rows="3"
                                            style={errors.skills && { borderColor: "red", boxShadow: "none !important" }}

                                            className="form-control"
                                            id="skills"
                                            name='skills'
                                            value={data.skills}
                                            placeholder="e.g.  android 3.5, springboot 4, swing 2"
                                            onChange={handleInputChange}
                                            ref={register({ required: true })} />
                                        {errors.skills && <span style={{ color: "#f44336" }}>Field is required</span>}
                                    </div>
                                    <span>{data.successMessage}</span>
                                    <span>{data.errorMessage}</span> <br />
                                    <span className="form-buttons">
                                        <Button type="button" className="btn btn-primary active" id="submitBtn" onClick={
                                            data.submitEdit ? handleSubmit(submitEditedSkill) : handleSubmit(submitForm)
                                        }>
                                            {data.isSubmitting ? "Submitting..." : "Submit"}
                                        </Button>

                                    </span>

                                </form>
                                <small>Note: enter each skill with accompanied rating out of five as shown by the place holder. All skills without a rating will hava a default rating of 1</small>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleCloseModal} className="btn btn primary">
                                close
                         </Button>
                        </Modal.Footer>

                    </Modal>


                </div>) : <Redirect to='/login' />
            }

        </div >
    )

}
