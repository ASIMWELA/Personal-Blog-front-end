import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { atom } from 'recoil'

import { BASE_URL } from './constants'


const UserContext = React.createContext()

const UserProvider = (props) => {
    const [users, setUsers] = useState({ users: null })
    const [adminId, setAdminId] = useState({ adminId: null })
    const [loading, setLoading] = useState({ loading: true })
    const [projectData, setProjects] = useState({ projectData: null })

    // function updateLoggedInUser(user) {
    //     setLoggedInUser((loggedInUser) => ({ ...loggedInUser, user }))
    // }

    // function setAuthentication(authenticated) {
    //     setAuthetication((isAuthenticated) => ({ ...isAuthenticated, authenticated }))
    // }
    useEffect(() => {
        axios.get(BASE_URL + '/users')
            .then(data => {
                if (data.data) {
                    const adminData = data.data._embedded.userList.find(user => {
                        return 'projects' in user._links
                    })
                    if (!adminData.uid) return
                    setAdminId(adminData.uid)
                }
                setUsers(data)
            }).catch(err => console.log(err))

        axios.get(BASE_URL + '/projects')
            .then(projectData => {
                setProjects(projectData)
                setLoading(false)
            }).catch(err => console.log(err));


    }, [adminId])
    //
    return (
        <UserContext.Provider value={{ users, adminId, loading, projectData }}>
            {props.children}
        </UserContext.Provider>
    )

}

const UserConsumer = UserContext.Consumer;

export const chatActiveContact = atom({
    key: "chatActiveContact",
    persistence_UNSTABLE: {
        type: "chatActiveContact",
    },
});

export const pageAdmin = atom({
    key: "pageAdmin",
    persistence_UNSTABLE: {
        type: "pageAdmin",
    },
});
export { UserProvider, UserConsumer, UserContext }
