import React, { useContext } from 'react';
import { useGetUser } from '../custom-hooks/useCustomHook'
import { UserContext } from '../contex'
import { FiSettings, FiUser } from 'react-icons/fi'
import { FaLaptopCode, FaGraduationCap } from 'react-icons/fa'
import './Profile.css'

export default function Profile() {
    const { adminId } = useContext(UserContext)
    const adminData = useGetUser(adminId)
    if (!adminData.data) {
        return <div>Loading</div>
    }
    const admin = adminData.data

    let adminExp = []
    let adminEmp = []
    let adminEdu = []
    if (admin.experience) {
        adminExp = admin.experience
    }
    if (admin.employment) {
        adminEmp = admin.employment
    }
    if (admin.education) {
        adminEdu = admin.education
    }
    console.log(admin)

    return (
        < div className="header-container">
            <h3 className="profile-heading">My Profile</h3>
            <small className="profile-info">Full resume. Education, Experience, Employment</small>
            <hr />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-4 col-md-4">
                        <div className="personal-info">
                            <h6><FiUser size={30} />Personal Info:</h6>
                            <div className="details">
                                <div className="row">
                                    <div className="col-sm-3 col-md-4">
                                        <img src="/images/user.png" alt="profile" id="userImg" />

                                    </div>
                                    <div className="col-sm-7 col-md-8">
                                        <p>First name: <span className="info-space">{admin.firstName}</span></p>
                                        <p>Last name: <span className="info-space">{admin.lastName}</span></p>
                                        <p>Sex:<span className="info-space">{admin.sex}</span></p>
                                        <p>Age: <span className="info-space">{admin.age}</span></p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 col-md-4">
                        <div className="experience">
                            <h6><FiSettings size={30} />Experience</h6>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>

                                            <th>Name</th>
                                            <th>Years</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            adminExp.map(exp => {
                                                return (
                                                    <tr key={exp.name}>
                                                        <td>{exp.name}</td>
                                                        <td>{exp.years}</td>

                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                    <div className="col-sm-4 col-md-4">
                        <div className="education">
                            <h6><FaGraduationCap size={40} />Education</h6>
                            {
                                adminEdu.map(edu => {
                                    return (
                                        <div key={edu.institution}>
                                            <strong>Institution:  </strong><span>{edu.institution}</span><br />
                                            <strong>Period:  </strong> <span>{edu.period}</span><br />
                                            <strong>Awards:  </strong><br />

                                            <ul>
                                                {edu.awards.map(award => {
                                                    return (
                                                        <li key={award + new Date()}>{award}</li>
                                                    )
                                                })}
                                            </ul>

                                            <hr />

                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <h6 className="empDetails"><FaLaptopCode size={40} />Employment Details:</h6>
            <div className="emp-cards">
                <div className="row">
                    {
                        adminEmp.map(emp => {
                            return (
                                <div className=" col-sm-4 col-md-3" key={emp.company}>
                                    <div className="list-group">
                                        <div className="list-group-item" key={emp.company}>
                                            <div className="list-group-item-heading"><strong>Company Name:</strong> <span className="compn-space">{emp.company}</span> </div>
                                            <p className="list-group-item-text"><strong>Duration: </strong><span className="compn-space">{emp.duration}</span> </p>
                                            <p className="list-group-item-text"><strong>Availability:</strong> <span className="compn-space">{emp.availability}</span></p>
                                            <div className="list-group-item-text">
                                                <strong>Accomplishments:</strong><b />
                                                <ul>{emp.accomplishments.map(acmp => {
                                                    return (
                                                        <li key={acmp + Math.random()}>
                                                            {acmp}
                                                        </li>
                                                    )
                                                })
                                                }

                                                </ul>

                                            </div>
                                            <hr />
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    }

                </div>

            </div>
        </div >
    );
}
