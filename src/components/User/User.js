import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticateUser } from '../../utils/AuthUtils'
import UserNavBar from './UserNavBar'
import UserChatBox from './Messaging/UserChatBox'
export default function User() {

    let isUserAuthenticated = authenticateUser()

    return (
        <>
            {isUserAuthenticated ? (
                <>
                    <UserNavBar />
                    <UserChatBox />
                </>
            ) : <Redirect to="/" />}
        </>
    );
}
