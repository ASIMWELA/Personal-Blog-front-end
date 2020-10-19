import React, { useContext } from 'react';
import { UserContext } from '../contex'
import { useGetUser } from '../custom-hooks/useCustomHook'
import SkillRating from './SkillRating'
import { FiCircle } from 'react-icons/fi'
import './Abilities.css'

export default function Abilities() {

    const { adminId } = useContext(UserContext)
    const adminData = useGetUser(adminId)
    if (!adminData.data) {
        return <div>Loading</div>
    }
    const admin = adminData.data
    let adminSkills = []
    if (admin.skills) {
        adminSkills = admin.skills
    }
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <h3 className="profile-heading">Skills Resume</h3>
                        <small className="profile-info">View each technology with associated skills and rating !.The rating is out of five</small>
                        <hr />


                        {adminSkills.map(skill => {
                            return (<div key={skill.technology}>
                                <h6 className="skill-heading">{skill.technology}</h6>
                                <div className="skill-container">
                                    <h6 className="skill">Skills</h6><h6 className="rating">Rating</h6>
                                </div>

                                <ol >
                                    {skill.skills.map(skill => {
                                        return (

                                            <li key={skill} className="skill-container">

                                                <h6 className="skill"><FiCircle size={9} style={{ marginRight: "1.5rem" }} />{(skill.replace(/[0-9]/g, '')).replace(/[.]/g, '') || skill} </h6><SkillRating ratingValue={parseFloat((skill.replace(/[^\d.-]/g, ''))) || 1} />

                                            </li>



                                        )
                                    })}
                                    <hr /> </ol>


                            </div>

                            )
                        })}
                    </div>
                    <div className="col-md-2"></div>
                </div>
            </div>

        </>
    );
}
