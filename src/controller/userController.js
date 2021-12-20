const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const createID = require('mongoose').Types.ObjectId
const appErr = require('../utils/appErr')
const catchAsync = require('../utils/catchAsync')
const sendData = require('../utils/sendData')
const User = require('../db/model/User')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const mail = require('../utils/email')
const wellCome = require('../utils/emailTemplate/welcome')


const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new appErr(400, 'Images only'), false)
    }
}
const sendRes = (user, token, status = 200, res) => {
    res.cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000,
        // Date.now() + process.env.JWT_COOKIE_EXPIRE  * 3600,
        httpOnly: true
    })
    res.status(status).json({
        status: 'success',
        token,
        userName: user.name,
        userRole: user.role,
        userPhoto: user.photo,
        signupStatus: user.signupStatus,
        activateToken: user.activateAccountToken
    })
}

exports.uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter
}).single('avatar')

exports.rezisePhoto = (req, res, next) => {
    if (!req.file) return next()
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    sharp(req.file.buffer).resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../../public/img/${req.file.filename}`), (err) => console.log(err))
    return next()
}

exports.signupUser = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = { ...req.body }
    const newUser = await User.create({ name, email, password, passwordConfirm })
    const token = await newUser.createActivateAccountToken()
    const newMail = new mail(newUser)
    try {
        await newMail.send(wellCome(newUser.name, `${req.protocol}://${req.get('host')}/user/accountactivate/${token}`), 'Wellcome')
    } catch (e) {
        console.log(e)
        await User.deleteOne({ _id: newUser.id })
        return res.status(400).json({
            status: 'fail',
            message: 'Something went wrong. Try again later'
        })
    }

    const newjwt = jwt.sign({ id: newUser._id }, process.env.JWT_KEY)
    sendRes(newUser, newjwt, 201, res)
})
exports.activateAccount = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        activateAccountToken: hashToken,
        activateAccountTokenExp: { $gt: Date.now() }
    })
    if (!user) {
        return next(new appErr(400, 'Something went wrong, try again'))
    }

    user.signupStatus = true
    user.activateAccountToken = undefined,
        user.activateAccountTokenExp = undefined
    await user.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
    sendRes(user, token, 200, res)
})

exports.login = catchAsync(async (req, res, next) => {
    //check user exist
    const { email, password } = req.body

    if (!password || !email) return next(new appErr(401, 'Email and password must be provided'))
    const user = await User.findOne({ email }).select('+password +role')
    if (!user) return next(new appErr(401, 'Incorrect User or Password', { email, password }))
    //compare password

    if (!await user.checkLogin(password)) return next(new appErr(401, 'Incorrect User or Password', { email, password }))
    //creste jwt

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
    //send data
    sendRes(user, token, 200, res)
})

exports.getMe = catchAsync(async (req, res, next) => {
    sendData(req.user, res)
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    if (!req.body.email) return next(new appErr(400, 'Email is required'))
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new appErr(400, 'Non exist user'))
    const token = user.createChangePasswordToken()
    res.json({
        status: 'success',
        resetLink: `${req.protocol}://${req.get('host')}/user/resetPassword?token=${token}`
    })
})


exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.query.token).digest('hex')
    const user = await User.findOne({
        ResetPassWordToken: hashToken,
        ResetPassWordTokenExp: { $gt: Date.now() }
    })

    if (!user) {
        return next(new appErr(400, 'Something went wrong, try again'))
    }
    if (!req.body.password || !req.body.passwordConfirm) {
        return next(new appErr(400, 'Something went wrong, try again'))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.ResetPassWordToken = undefined,
        user.ResetPassWordTokenExp = undefined
    await user.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
    sendRes(user, token, 200, res)
})


exports.updatePassword = catchAsync(async (req, res, next) => {
    //check user exist
    const { passwordOld, password, passwordConfirm } = req.body
    if (!password || !passwordOld || !passwordConfirm) return next(new appErr(401, 'All fields must be provided'))
    const user = await User.findById(req.user._id).select('+password +role')
    if (!user) return next(new appErr(401, 'Incorrect User or Password'))
    //compare password
    if (!await user.checkLogin(passwordOld)) return next(new appErr(401, 'Incorrect User or Password'))

    user.password = password
    user.passwordConfirm = passwordConfirm
    await user.save()
    next()
    // const token =  jwt.sign({id: newUser._id}, process.env.JWT_KEY)
    // sendRes(user, token, 200, res)
})

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password) return next(new appErr(400, 'Route not exist'))
    const updateObj = {}
    if (req.body.name) updateObj.name = req.body.name
    if (req.file.filename) updateObj.photo = req.file.filename
    if (req.body.name || req.file.filename) {
        const user = await User.findByIdAndUpdate(req.user.id, updateObj, { runValidators: true, new: true })
        res.json({
            status: 'success',
            name: user.name,
            email: user.email,
            photo: user.photo
        })
    }

})

exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true })
    res.json({
        status: 'success'
    })
})

exports.logout = catchAsync(async (req, res, next) => {
    const token = jwt.sign({ id: createID() }, process.env.JWT_KEY)
    const user = { userName: null, userRole: null }
    sendRes(user, token, 200, res)
})
