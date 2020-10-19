import React, { useState } from 'react';
import {
    FaUser,
    FaUserCircle,
    FaLaptopCode,
    FaBriefcase,
    FaAddressBook,
    FaBook,
    FaGraduationCap,
    FaEnvelope
} from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { Route, useHistory, useLocation } from 'react-router-dom'
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Button } from 'antd'
import { chatActiveContact } from '../../contex'
import { useRecoilState } from "recoil";
import { authenticateAdmin } from '../../utils/AuthUtils'

import './adminSideNav.css'

function AdminSideNav(props) {
    const [expand, setExpand] = useState(false)
    const location = useLocation()
    const history = useHistory()
    // eslint-disable-next-line no-unused-vars
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact)
    let userName = ''
    let isAdminAuthenticated = authenticateAdmin()
    if (!isAdminAuthenticated) {
        userName = ''
    }
    else {
        userName = JSON.parse(localStorage.getItem('admin')).user.userName
    }
    const logout = () => {
        if (localStorage.admin) {
            localStorage.removeItem('admin')
            setActiveContact()
            history.push("/login")
        } else {
            history.push("/login")
        }
    }
    return (
        <div>
            <nav className="navbar fixed-top navbar-light bg-light" id='navBar'>
                <SideNav
                    onSelect={(selected) => {
                        const to = '/' + selected;
                        if (location.pathname !== to) {
                            history.push(to);
                        }
                    }}

                    expanded={expand}
                    onToggle={() => {

                        if (!expand) {

                            document.querySelector('.main-content').style.marginLeft = '19%'
                            document.querySelector('#side').style.transitionDelay = '0.001s'

                            document.querySelector('.main-content').style.transitionDelay = '0.01s'

                        } else {

                            document.querySelector('.main-content').style.marginLeft = '10%'
                            document.querySelector('#side').style.transitionDelay = '0.01s'
                            document.querySelector('.main-content').style.transitionDelay = '0.01s'

                        }

                        setExpand(!expand)
                    }}

                    id='side'>

                    <SideNav.Toggle className="sideNavToggle" />

                    <SideNav.Nav defaultSelected="admin/projects">
                        <NavItem eventKey="admin/projects"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Project Details"
                        >
                            <NavIcon>
                                <FaBook size={32} />
                            </NavIcon>
                            <NavText>
                                <div className="side-nav-items">Projects</div>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="admin/address"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Address Details"
                        >
                            <NavIcon>
                                <FaAddressBook size={32} />
                            </NavIcon>
                            <NavText>
                                <div className="side-nav-items" >Address</div>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="admin/profile"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Profile Details"
                        >
                            <NavIcon>
                                <FaUser size={32} />
                            </NavIcon>
                            <NavText>

                                <div className="side-nav-items" >Full profile</div>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="admin/inbox"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="subscriber messaging platform"
                        >
                            <NavIcon>
                                <FaEnvelope size={32} />
                            </NavIcon>
                            <NavText>

                                <div className="side-nav-items">Inbox</div>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="admin/experience"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Experience Details"

                        >
                            <NavIcon>
                                <FaBriefcase size={32} />
                            </NavIcon>
                            <NavText>

                                <div className="side-nav-items" >Experience</div>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="admin/skills"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Skills Details"
                        >
                            <NavIcon>
                                <FaLaptopCode size={32} />
                            </NavIcon>
                            <NavText>

                                <div className="side-nav-items" >Skills</div>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="admin/education"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Education Details"
                        >
                            <NavIcon>
                                <FaGraduationCap size={32} />
                            </NavIcon>
                            <NavText>
                                <div className="side-nav-items" >Education</div>
                            </NavText>
                        </NavItem>

                        <NavItem eventKey="admin/emp"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Add, Edit, Delete Your Employment Details"
                        >
                            <NavIcon>
                                <FaLaptopCode size={32} />
                            </NavIcon>
                            <NavText>
                                <div className="side-nav-items" >Employment</div>
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>

                <div></div>
                <ul className="nav justify-content-center" id="admin-section-title">
                    <li> <h5>{props.title}</h5></li>
                </ul>
                <ul className="nav justify-content-end">
                    <li className="nav-item" id="userNameDisplay" data-toggle="tooltip" data-placement="bottom" title={`Logged in as ${userName}`}>
                        <span><FaUserCircle size={24} /> | {userName || ''}   </span>
                    </li>

                    <li className="nav-item" id="logoutButton">
                        <Button icon={<FiLogOut size={25} />} onClick={logout}> Logout</Button>
                    </li>

                </ul>
            </nav>
            <Route render={() => (
                <div>

                    <div className="main-content">
                        {props.children}
                    </div>

                </div>
            )}
            />



        </div>
    )
}
export default AdminSideNav