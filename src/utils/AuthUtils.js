const authenticateAdmin = () => {
    let adminRole = null;
    let arrayLength = 0
    let admin = []
    if (localStorage.admin) {
        admin = JSON.parse(localStorage.getItem('admin')).user.roles
    }

    adminRole = admin.find(role => {
        return (role.name.includes("ROLE_ADMIN"))
    })

    arrayLength = Boolean(admin.length >= 2)

    return (Boolean(adminRole) && arrayLength) ? true : false
}

const authenticateUser = () => {
    let userRole = null;
    let arrayLength = 0
    let user = []
    if (localStorage.user) {
        user = JSON.parse(localStorage.getItem('user')).user.roles
    }
    userRole = user.find(role => {
        return (!(role.name.includes("ROLE_ADMIN")))
    })


    arrayLength = Boolean(user.length === 1)


    //console.log(Boolean(userRole), arrayLength)
    return (Boolean(userRole) && arrayLength) ? true : false

}
//setTimeout(isUserAuthenticated, 2000)
// setTimeout(isAdminAuthenticated, 2000)

export { authenticateAdmin, authenticateUser }

