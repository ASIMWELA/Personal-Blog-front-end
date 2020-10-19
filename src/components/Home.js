import React, { useContext } from 'react'
import { useGetUser } from '../custom-hooks/useCustomHook'
import { FaSearchLocation, FaLaptopCode, FaGraduationCap } from 'react-icons/fa'

//styling
import './Home.css'

//context
import { UserContext } from '../contex'
//components

import { Card } from 'react-bootstrap'
export default function Home() {
    const { adminId } = useContext(UserContext)
    const adminData = useGetUser(adminId)

    let selectedExp = []
    let selectedSkills = []

    if (!adminData.data && ErrorEvent) {
        return <div>Loading</div>
    }
    if (adminData.data.experience) {
        selectedExp = adminData.data.experience.slice(0, 4)

    }
    if (adminData.data.skills) {
        selectedSkills = adminData.data.skills.slice(0, 3)
    }

    return (
        <React.Fragment>
            <div className="container-fluid bg-1 text-center">
                <h3 className="margin">Who Am I?</h3>
                <img src="images/user.png" id="displayImg" className="img-responsive img-circle margin" style={{ display: "inline", displayRadius: "5rem" }} alt="display" width="300" height="300" />
                <h3>Tech enthusiast</h3>
            </div>

            <div className="container-fluid bg-2 text-center">
                <h3 className="margin">What I Do</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>

            </div>

            <div className="container-fluid bg-3 text-center">
                <h3 className="margin">Resume</h3><br />
                <div className="row">

                    <div className="col-sm-5">
                        <Card className="contacts-card">
                            <Card.Title className="contact-header"><FaLaptopCode size={40} />Selected skills</Card.Title>
                            <Card.Body>
                                <div className='row'>
                                    <div className="col-sm-6">
                                        <div className="table-responsive">
                                            <table className="table">

                                                <thead>
                                                    <tr >
                                                        <th colSpan={2}>Experience</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Tech</th>
                                                        <th>Years</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        selectedExp.map(admi => {
                                                            return (<tr key={admi.name}>
                                                                <td>{admi.name}</td>
                                                                <td>{admi.years}</td>
                                                            </tr>
                                                            );
                                                        })
                                                    }


                                                </tbody>
                                            </table>
                                        </div>

                                    </div><div className="col-sm-6">
                                        <h3> Skills </h3>
                                        <ul className="list-group">
                                            {
                                                selectedSkills.map(skill => {
                                                    return (
                                                        <li className="list-group-item" key={skill.technology}>
                                                            <strong>{skill.technology}</strong><br />
                                                            {skill.skills.map(name => {
                                                                return (
                                                                    <span key={name}>{(name.replace(/[0-9]/g, '')).replace(/[.]/g, '') || name}{', '}</span>
                                                                );
                                                            })}
                                                        </li>
                                                    );
                                                })
                                            }

                                        </ul>

                                    </div>

                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-sm-4">
                        <h4><FaGraduationCap size={40} />Education</h4>
                        <img src="images/responsive_web.jpg" className="img-responsive margin" style={{ width: "100%" }} alt="name" />
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <h4><FaSearchLocation />Geographical Location</h4>
                        <img src="images/responsive_web.jpg" className="img-responsive margin" style={{ width: "100%" }} alt="name2" />
                    </div>

                    <div className="col-sm-4">
                        <h4><FaLaptopCode />Selected skills</h4>
                        <img src="images/responsive_web.jpg" className="img-responsive margin" style={{ width: "100%" }} alt="mane3" />
                    </div>

                    <div className="col-sm-4">
                        <h4><FaGraduationCap />Education</h4>
                        <img src="images/responsive_web.jpg" className="img-responsive margin" style={{ width: "100%" }} alt="name" />
                    </div>

                </div>
            </div>
        </React.Fragment>
    );

}      
