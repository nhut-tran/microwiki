const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authController')
const appErr = require('../utils/appErr')
const router = new express.Router()

router.post('/signup', userController.signupUser)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/me', authController.auth, userController.getMe)
router.get('/rememberUser', authController.isLogined, (req, res, next) => {
    if(!req.userName) return next(new appErr(401, 'Please Login!'))
    res.json({
        status:'success',
        userName: req.userName,
        userRole: req.role,
        userPhoto: req.photo,
        signupStatus: req.signupStatus
        
    })
      
})
router.get('/activate/:token', userController.activateAccount)
router.post('/forgotPassword', userController.forgotPassword)
router.get('/resetPassword', userController.resetPassword)
router.patch('/updatePassword', authController.auth, userController.updatePassword, userController.logout)
router.patch('/updateInfo', authController.auth, userController.uploadPhoto, userController.rezisePhoto, userController.updateMe)
router.delete('/deleteAccount', authController.auth, userController.deleteUser)
module.exports = router