import { useState, useEffect } from 'react'


import axios from 'axios'
import { BASE_URL } from '../constants'

export const useGetUser = (userId) => {
    const [user, setUser] = useState({})

    useEffect(() => {
        axios.get(BASE_URL + `/users/${userId}`, {
            header: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(userData => {
                setUser(userData)
            })
            .catch(error => { console.log(error) });
    }, [userId])

    return user

}

export const useGetProject = (projectName) => {

    const [project, setProject] = useState({ project: null })
    useEffect(() => {
        axios.get(BASE_URL + `/projects/${projectName}`)
            .then(projectData => { setProject(projectData) })
            .catch(error => { console.log(error) });
    }, [projectName])

    return project;
}