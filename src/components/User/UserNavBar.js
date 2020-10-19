import React from 'react';
import { useHistory } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { FaUser } from 'react-icons/fa'
import { authenticateUser } from '../../utils/AuthUtils'
import { Button } from 'antd'
import { pageAdmin } from '../../contex'
import { useRecoilState } from 'recoil'

import './userNav.css'


export default function UserNavBar(props) {
    const history = useHistory()
    // eslint-disable-next-line no-unused-vars
    const [admin, setAdmin] = useRecoilState(pageAdmin)

    const isUserAuthenticated = authenticateUser()

    let userName = ''

    if (!isUserAuthenticated) {
        userName = ''
    }
    else {
        userName = JSON.parse(localStorage.getItem('user')).user.userName
    }

    const logout = () => {
        if (localStorage.user || localStorage.getItem("recoil-persist")) {
            localStorage.removeItem('user')
            setAdmin()
            history.push("/login")
        }
        else {
            history.push("/login")
        }

    }
    return (
        <div className="nav-container">
            <ul className="nav" id="userNav">
                <li className="nav-item" id="userName">
                    <FaUser size={20} />| Welcome {userName}
                </li>
                <li className="nav-item" >
                    <Button onClick={logout} id="userLogoutBtn" icon={<FiLogOut size={25} />} disabled={props.disable}>Logout </Button>
                </li>

            </ul>


        </div>
    );
}
