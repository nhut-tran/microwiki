const User = require('../db/model/User')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const appErr = require('../utils/appErr')
console.log({
    ['a-b']: 'nhut'
})
exports.auth = catchAsync(async (req, res, next) => {

    // if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) return next(new appErr(401, 'Please Login'))
    if (!req.cookies.jwt) return next(new appErr(401, 'Please Login!'))

    const token = req.cookies.jwt
    const decode = jwt.verify(token, process.env.JWT_KEY)
    //check user still exist
    const user = await User.findById(decode.id).select('+role')
    if (!user) return next(new appErr(401, 'Please Login!'))
    if (!user.signupStatus) return next(new appErr(401, 'Your account not activated'))
    //user change password (user.changepassword > iat)
    if (user.checkChangePassword(decode.iat)) return next(new appErr(401, 'Please Login after your password had chaged!'))
    req.user = user

    next()

})
exports.isLogined = async (req, res, next) => {

    try {
        if (req.cookies.jwt) {
            const token = req.cookies.jwt
            const decode = jwt.verify(token, process.env.JWT_KEY)
            //check user still exist
            const user = await User.findById(decode.id).select('+role')
            if (!user) return next()
            //user change password (user.changepassword > iat)
            if (user.checkChangePassword(decode.iat)) return next()
            if (req.originalUrl === '/user/rememberUser') {
                req.userName = user.name
                req.role = user.role
                req.photo = user.photo
                req.signupStatus = user.signupStatus
                return next()
            }
            return next()
        }
        next()
    } catch {
        next()
    }

}
exports.restrictRole = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) next(new appErr(401, 'Route non exist'))
        next()
    }


}
