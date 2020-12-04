import React, { useContext } from 'react'
import { useGetUser } from '../custom-hooks/useCustomHook'
import {  FaLaptopCode, FaGraduationCap } from 'react-icons/fa'
import LocationMap from './LocationMap'

//styling
import './Home.css'

//context
import { UserContext } from '../contex'
//components
import{BASE_PIC_URL} from '../constants'

import { Card } from 'react-bootstrap'
import Footer from './Footer'
export default function Home() {
    const { adminId } = useContext(UserContext)
    const adminData = useGetUser(adminId)

    let selectedExp = []
    let selectedSkills = []
    let eduAwards = []
    let awardsList = []
    let adminProfile=null

    if (!adminData.data && ErrorEvent) {
        return <div>Loading</div>
    }
    if (adminData.data.experience) {
        selectedExp = adminData.data.experience.slice(0, 2)

    }
    if (adminData.data.skills) {
        selectedSkills = adminData.data.skills.slice(0, 2)
    }
    if(adminData.data.profilePicPath){
        adminProfile =  adminData.data.profilePicPath
    }
    if (adminData.data.education) {
        eduAwards = adminData.data.education.slice(0, 3)
        eduAwards.map(award=>{
         award.awards.map(y=>{
           awardsList.push(y)
         })
        })
    }

    

    return (
        <React.Fragment>
            <div className="container-fluid bg-1 text-center">
                <h3 className="margin">Who Am I?</h3>
            <img src={adminProfile?BASE_PIC_URL+"/"+adminProfile:"/images/user.png"} id="displayImg" className="img-responsive img-circle margin" style={{ display: "inline", displayRadius: "5rem" }} alt="display" width="300" height="300" />
                <h3>Tech enthusiast</h3>
            </div>

            <div className="container-fluid bg-2 text-center">
                <h3 className="margin">What I Do</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>

            </div>

            <div className="container-fluid bg-3 text-center">
                <h3 className="margin">Resume Summary</h3><br />
                <div className="row" id="resumeSummary">
                    <div className="col-md-2"></div>
                    <div className="col-sm-4">
                        {selectedExp.length===0 || selectedExp.length===0 ? null:(
                            <Card className="contacts-card" style={{marginRight:"5rem"}}>
                            <Card.Title className="contact-header"><FaLaptopCode size={40} />Selected skills</Card.Title>
                            <Card.Body >
                                <div className='row'>
                                    <div className="col-sm-6">
                                        <div className="table-responsive">
                                            <table className="table">

                                                <thead>
                                                    <tr >
                                                    {selectedExp.length!==0 &&  <th colSpan={2}>Experience</th>}  
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
                                    {selectedSkills.length!==0 && <h3> Skills </h3>} 
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
                        )}
                        
                    </div>

                    <div className="col-sm-4">
                        {
                            awardsList.length!==0?(
                                <Card className="contacts-card" style={{marginLeft:"5rem"}} id="eduDetailsCard">

                               <Card.Subtitle><h4><FaGraduationCap size={40} />Education Awards</h4></Card.Subtitle> 
                               <Card.Body className="awardListComponent">
                                   <ul >
                                   {
                                    awardsList.map(award=>{
                                        return(
                                        <li key={award} className="awardList">{award}</li>
                                                   
                                        )
                                    })
                                }
                                </ul>
                                </Card.Body>
                                </Card>
                                
                            ):null
                        }
                        
                  </div>

                </div>
                <div className="col-md-2"></div>
                
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <LocationMap/>
                    </div>
                    <div className="col-md-2"></div>
                </div>
            </div>
            <Footer/>

        </React.Fragment>
    );

}      
