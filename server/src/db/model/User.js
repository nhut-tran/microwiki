const mongoose = require('mongoose')
const crypto = require('crypto')
const validators = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name must be provided']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function(value) {
                return validators.isEmail(value)
            },
            message: 'Invalid email'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: [8,' at least 8 character'],
        select: false
    },

    passwordConfirm: String,
    photo: {
        type: String,
        default: 'avatar.jpeg'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        select: false
    },
    signupStatus: {
        type: Boolean,
        default: false
    },
    activateAccountToken: String,
    activateAccountTokenExp: Date, 
    changePasswordTime: Date,
    ResetPassWordToken: String,
    ResetPassWordTokenExp: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.path('password').validate(function() {
    if(!this.password || !this.passwordConfirm) {
    
        this.invalidate('passwordConfirm',  'password, passwordConfirm must be provided')
    }
    if(this instanceof mongoose.Model  && this.password && this.passwordConfirm ) {
        if(this.password !== this.passwordConfirm){
            this.invalidate('passwordConfirm',  'Password and Password Confirm must be the same')
        }
    }
    return true
},)

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.passwordConfirm = undefined
        if(!this.isNew) {
            this.changePasswordTime = Date.now()
        }
    }  
    
    next()
})
userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}})
    next()
})

userSchema.methods.checkLogin = async function (candidatePassword) {
    const pass = await bcrypt.compare(candidatePassword, this.password)
    return pass
}

userSchema.methods.checkChangePassword = function(JwtIat) {
    if(this.changePasswordTime) {
        const passwordChangeTime = this.changePasswordTime.getTime()/1000
        return passwordChangeTime > JwtIat
    }
    
   return false
}
userSchema.methods.createChangePasswordToken = async function() {
    const resetPasstoken =  crypto.randomBytes(32).toString('hex')
    this.ResetPassWordToken = crypto.createHash('sha256').update(resetPasstoken).digest('hex')
    this.ResetPassWordTokenExp = Date.now() +  5 * 60 * 1000
    await  this.save({validateBeforeSave: false })
    return resetPasstoken
}
userSchema.methods.createActivateAccountToken = async function() {
    const activateToken =  crypto.randomBytes(32).toString('hex')
    this.activateAccountToken = crypto.createHash('sha256').update(activateToken).digest('hex')
    this.activateAccountTokenExp = Date.now() +  5 * 60 * 1000
  
   await this.save({validateBeforeSave: false })
    return activateToken
}
const User = mongoose.model('User', userSchema)

module.exports = User