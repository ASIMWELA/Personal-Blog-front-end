import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contex'
import { Card } from 'react-bootstrap'
import { Link } from "react-router-dom"
import './projects.css'
export default function Projects() {
    const { projectData, loading } = useContext(UserContext)
   
    console.log(projectData, loading)


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-1" id="left-pad"></div>
                <div className="col-md-10" >

                    <h3 className="profile-heading">Projects</h3>
                    <small className="profile-info">Browse the projects i have been involved.<br /> Check my role, technologies used, my collabolators and an associated link to<br /> the hosting site or an online repository</small>
                    <hr />
                    <div className="row">
                        {
                            loading?<div>Loading</div>:(
                                projectData.map(project => {
                                    return (
                                        <div className="col-md-4" key={project.name}>
                                            <Card style={{ display: "group", textAlign: "center", margin: "3%" }} id="project-card">
                                                <Card.Title style={{ marginTop: "1%", marginBottom: "2px" }}>{project.name}</Card.Title>
    
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
                                                <Card.Footer> <Link to={`//${project.locationLink}`} target="_blank" id="project-link"> View Project in production</Link> </Card.Footer>
                                            </Card>
                                        </div>
    
                                    )
                                })
                            )
                           
                        }
                    </div>
                </div>


            </div>
            <div className="col-md-1" id="right-pad"></div>


        </div >
    )
}
