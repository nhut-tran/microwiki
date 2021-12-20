const checkRole = (allowedRole = [], role) => {
    if(allowedRole.includes(role)) {
        return true
    } 
    return false
}

export default checkRole 