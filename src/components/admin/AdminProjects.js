import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa'
import { MdCreate } from 'react-icons/md'
import { Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'
import { BASE_URL } from '../../constants'
import { authenticateAdmin } from '../../utils/AuthUtils'
import Modal from 'react-bootstrap/Modal'
import './project.css'


export default function Projects() {
    const [showModal, setShowModal] = useState(false)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    let isAdminAuthenticated = authenticateAdmin()
    const { register, handleSubmit, errors } = useForm();

    const [data, setData] = useState({
        name: "",
        description: "",
        collaborators: '',
        selectedProject: '',
        locationLink: '',
        role: '',
        filterProject: '',
        formTitle: '',
        submitEdit: false,
        isSubmitting: false,
        errorMessage: null,
        successMessage: null
    });
    useEffect(() => {
        setLoading(true)
        axios.get(BASE_URL + '/projects')
            .then(projectData => {
                setProjects(projectData.data._embedded.projectList)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)

            })
        updateprojects()
    }, [])

    let token = null
    if (isAdminAuthenticated) {
        token = JSON.parse(localStorage.getItem('admin')).access_TOKEN
    }

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    function editProject(event) {
        setShowModal(true)
        let project = event.currentTarget.value
        const fullProject = projects.find(selectedProject => {
            return project === selectedProject.name
        })

        if (fullProject.collaborators) {
            setData({
                ...data,
                name: fullProject.name,
                selectedProject: project,
                role: fullProject.role,
                submitEdit: true,
                formTitle: "Edit  " + fullProject.name + " project",
                collaborators: fullProject.collaborators,
                locationLink: fullProject.locationLink,
                description: fullProject.description,
                successMessage: ''
            })

        }
        else {
            setData({
                ...data,
                name: fullProject.name,
                selectedProject: project,
                role: fullProject.role,
                submitEdit: true,
                formTitle: "Edit  " + fullProject.name + " project",
                collaborators: '',
                locationLink: fullProject.locationLink,
                description: fullProject.description,
                successMessage: ''
            })
        }

    }

    const handleFormSubmit = () => {
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        })

        let collabs = null
        if (data.collaborators.indexOf(',') < 0) {
            if (data.collaborators === '') {
                collabs = null
            } else {
                collabs = new Array(data.collaborators)
            }

        } else {
            collabs = data.collaborators.split(',')
        }
        let projectData = {
            name: data.name,
            description: data.description,
            locationLink: data.locationLink,
            role: data.role,
            collaborators: collabs
        }
        axios({
            method: 'post',
            url: BASE_URL + '/projects',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(projectData)
        }).then(res => {
            if (res.data.code === 201) {
                updateprojects()
                setData({
                    name: "",
                    description: "",
                    collaborators: '',
                    locationLink: '',
                    formTitle: res.data.message,
                    role: '',
                    successMessage: res.data.message,
                })


            }

        }).catch(err => {
            console.log(err)
            if ((err.message).indexOf('409') >= 0 || (ErrorEvent.statusText).indexOf('409') >= 0) {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: 'Project already added. Specify a new project'

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






    function deleteProject(event) {

        let project = event.currentTarget.value
        const response = window.confirm("Are you sure you want to delete the project " + project + " ?")
        if (response === true) {
            axios.delete(BASE_URL + '/projects/' + project, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.code === 200) {
                    updateprojects()
                }
            })
        } else {
            return false
        }


    }

    const saveProject = () => {
        setShowModal(true)
        let selectedProject = data.selectedProject


        setData({
            ...data,
            isSubmitting: true,
            submitEdit: true,
            formTitle: "Edit Project",
            errorMessage: null
        })

        let projectData = {}

        if (!data.collaborators) {
            projectData = {
                name: data.name,
                description: data.description,
                locationLink: data.locationLink,
                role: data.role

            }

        } else {
            let collabs = null
            if (data.collaborators.indexOf(',') < 0) {
                if (data.collaborators === '') {
                    collabs = null
                } else {
                    collabs = new Array(data.collaborators)
                }

            } else {
                collabs = data.collaborators.split(',')
            }
            projectData = {
                name: data.name,
                description: data.description,
                locationLink: data.locationLink,
                role: data.role,
                collaborators: collabs
            }

        }

        axios({
            method: 'put',
            url: BASE_URL + `/projects/${selectedProject}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(projectData)
        }).then(res => {
            if (res.data.code === 200) {
                updateprojects()
                setData({
                    name: "",
                    description: "",
                    collaborators: '',
                    locationLink: '',
                    formTitle: selectedProject + " Edited successfully",
                    role: '',
                    successMessage: res.data.message,

                })


            }
        })

    }

    const addProject = () => {
        setShowModal(true)
        setData({
            ...data,
            formTitle: "Add New Project"
        })
    }
    const updateprojects = async () => {
        setLoading(true)
        const projects = await axios.get(BASE_URL + '/projects').then(res => res.data).catch(err => {
            console.log(err)
            setLoading(false)
        })
        if (projects) {
            setProjects(projects._embedded.projectList)
            setLoading(false)
        }

    }


    const handleCloseModal = () => {

        setShowModal(false)
        setData({
            name: "",
            description: "",
            submitEdit: false,
            collaborators: '',
            successMessage: '',
            errorMessage: '',
            formTitle: "",
            locationLink: '',
            role: '',

        })

    }

    return (
        <div>
            {isAdminAuthenticated ? (
                <React.Fragment>

                    <div className="container-fluid">

                        <span style={{ marginLeft: "2rem", marginBottom: "2rem" }} data-toggle="tooltip" title="Add new project" className="add-project-button" onClick={addProject}><MdCreate size={30} />
                        </span><br />


                        {loading ? <div>Loading</div> : (<div className="row">
                            {projects.map((project) => {
                                return (
                                    <div className="col-md-4" key={project.name}>
                                        <Card style={{ display: "group", textAlign: "center", margin: "1%" }} id="project-card">
                                            <Card.Title style={{ marginTop: "1%", marginBottom: "1px" }}>{project.name}</Card.Title>

                                            <Card.Body>
                                                <strong>Description</strong>
                                                <p>{project.description}</p>
                                                <p><strong>Role:</strong> {project.role}</p>
                                                <p>
                                                    {project.collaborators &&

                                                        <span>
                                                            <strong>Collaborators:</strong>
                                                            {project.collaborators.map(collabs => {
                                                                return (

                                                                    <span key={project.name + collabs}> {collabs + ', '}</span>

                                                                )
                                                            })}
                                                        </span>
                                                    }


                                                </p>



                                            </Card.Body>
                                            <Card.Footer> <Link to={`//${project.locationLink}`} target="_blank" id="project-link"> View Project in production</Link>
                                                <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Edit ${project.name} project`} style={{ float: "left", marginTop: "1.8rem", padding: "0px", backgroundColor: "inherit", border: "none" }} value={project.name} onClick={(event) => editProject(event)}>
                                                    <FaEdit size={25} color={"#455A64"} />
                                                </Button>

                                                <Button className='btn btn-default' data-toggle="tooltip" data-placement="bottom" title={`Delete ${project.name} project`} style={{ float: "right", marginTop: "1.5rem", padding: "0px", backgroundColor: "inherit", border: "none" }} value={project.name} onClick={(event) => deleteProject(event)}>
                                                    <FaTrash size={25} color={"red"} />
                                                </Button> </Card.Footer>
                                        </Card></div>


                                )
                            }
                            )
                            }

                        </div>)}


                    </div>
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
                            <form id="form" onSubmit={handleSubmit(handleFormSubmit)} >
                                <div className="form-group">
                                    <label >Name<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        style={errors.name && { borderColor: "red", boxShadow: "none !important" }}

                                        name="name"
                                        value={data.name}
                                        ref={register({ required: true, minLength: 2 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.name

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}
                                    {errors.name && errors.name.type === "minLength" && <span style={{ color: "#f44336" }}>Project name should have atleast 2 letters</span>}

                                </div>
                                <div className="form-group">
                                    <label >Description<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        rows="2"
                                        id="description"
                                        name="description"
                                        style={errors.description && { borderColor: "red", boxShadow: "none !important" }}

                                        value={data.description}
                                        ref={register({ required: true, maxLength: 150 })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.description &&
                                        errors.description.type === "required"

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}

                                    {errors.description &&
                                        errors.description.type === "maxLength"

                                        &&
                                        <span style={{ color: "#f44336" }}>Description too long</span>}


                                </div>
                                <div className="form-group">
                                    <label >Role <sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="role"
                                        name="role"
                                        style={errors.role && { borderColor: "red", boxShadow: "none !important" }}

                                        value={data.role}
                                        ref={register({ required: true })}
                                        onChange={handleInputChange}
                                    />
                                    {errors.role
                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}

                                </div>
                                <div className="form-group">
                                    <label >Collaborators</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="collaborators"
                                        style={errors.collaborators && { borderColor: "red", boxShadow: "none !important" }}

                                        name="collaborators"
                                        value={data.collaborators}
                                        onChange={handleInputChange}
                                    />

                                </div>
                                <div className="form-group">
                                    <label >Location Link<sup style={{ color: "#f44336" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="locationLink"
                                        name="locationLink"
                                        style={errors.locationLink && { borderColor: "red", boxShadow: "none !important" }}

                                        value={data.locationLink}
                                        ref={register({ required: true })}
                                        onChange={handleInputChange}

                                    />
                                    {errors.locationLink

                                        &&
                                        <span style={{ color: "#f44336" }}>This field is required</span>}


                                </div>

                                <small style={{ marginBottom: "2rem" }}>Note: all fields marked with <sup style={{ color: "#f44336" }}>*</sup> are required</small><br />

                                <br />
                                {data.successMessage && <span>{data.successMessage}</span>}
                                {data.errorMessage && <span>{data.errorMessage}</span>}

                                <span className="subCancelBtn" style={{ marginTop: "1%" }}>

                                    <button type="button" id="submitBtn" className="btn btn-primary" style={{ marginRight: "5%" }} onClick={data.submitEdit ? handleSubmit(saveProject) : handleSubmit(handleFormSubmit)} >{data.isSubmitting ? "Submitting..." : "Submit"}</button>

                                </span>


                            </form>
                        </Modal.Body>

                    </Modal>




                </React.Fragment>
            ) : <Redirect to="/" />}
        </div>
    )
}
