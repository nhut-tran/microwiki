const express = require('express')
const router = new express.Router()
const methodController = require('../controller/methodController')
const authController = require('../controller/authController')

router.route('/')
    .post(authController.auth, authController.restrictRole('admin'), methodController.addNewMethod)
    .get(authController.auth, authController.restrictRole('user', 'admin'), methodController.getAllMethod)
router.route('/getStat')
    .get(authController.auth, authController.restrictRole('admin'), methodController.getStat)
router.route('/exportexcel')
    .post(authController.auth, authController.restrictRole('user', 'admin'), methodController.exportExcel)
    .get(authController.auth, authController.restrictRole('user', 'admin'), methodController.sendExcelFile)

router.route('/:id')
    .get(authController.auth, authController.restrictRole('user', 'admin'), methodController.getOneMethod)
    .patch(authController.auth, authController.restrictRole('user', 'admin'), methodController.updateOneMethod)
    .delete(authController.auth, authController.restrictRole('admin'), methodController.deleteOneMethod)
module.exports = router