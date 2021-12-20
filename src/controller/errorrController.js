const appErr = require('../utils/appErr')


const sendCastIdErr = (error) => {
    return new appErr(400, `${error.value} is invalid ${error.path}`)
}

const validationError = (error) => {
    const failField = Object.keys(error.errors)
    let message = ''
    failField.forEach((el) => {
        message += `Fail to validate ${el}. Please check ${error.errors[el].message} \n`
    })
    return new appErr(400, message)
}
const duplicateValues = (error) => {
    return new appErr(400, `duplicate value of ${Object.keys(error.keyValue)}`)
}
const JWTVerifyFail = () => {
    return new appErr(' Please login again', 401)
}
const JWTExpire = () => {
    return new appErr(401, 'For long time not login. Please login again')
}
const writeToExcelErr = () => {
    return new appErr('Bad data input. Please check your data')
}
module.exports = (err, req, res, next) => {
    console.log(err)
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    let error = { ...err }
    if (error.operational) {
        error = {
            statusCode: error.statusCode,
            status: error.status,
            message: err.message,
            data: err.data
        }
    }
    else if (error.name === 'CastError') error = sendCastIdErr(error)
    else if (error.name === 'ValidationError') error = validationError(error)
    else if (error.code === 11000) error = duplicateValues(error)
    else if (error.name === 'JsonWebTokenError') error = JWTVerifyFail(error)
    else if (error.name === 'TokenExpiredError') error = JWTExpire(error)
    else if (err.name === 'TypeError') error = writeToExcelErr()
    else {
        error = {
            statusCode: 500,
            status: 'error',
            message: 'Something went Wrong'
        }
    }
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        data: error.data
    })

}
