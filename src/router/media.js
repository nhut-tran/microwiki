const express = require('express')
const mediaController = require('../controller/mediaController')
const authController = require('../controller/authController')
const router = new express.Router()

router.use(authController.isLogined)
router.route('/import')
.get(mediaController.importData)


router.route('/')
.post(authController.auth, authController.restrictRole('user','admin'), mediaController.addNewMedia)
.get(authController.auth, authController.restrictRole('user', 'admin'), mediaController.getAllMedia)

router.route('/getStat')
.get(authController.auth, authController.restrictRole('admin'), mediaController.getStat)
router.route('/:id')
.get(authController.auth, authController.restrictRole('user', 'admin'), mediaController.getOneMedia)
.patch(authController.auth, authController.restrictRole('user', 'admin'), mediaController.updateOneMedia)
.delete(authController.auth, authController.restrictRole('user', 'admin'), mediaController.deleteOneMedia)
module.exports = router
