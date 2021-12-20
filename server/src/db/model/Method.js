const mongoose = require('mongoose')
const Media = require('../model/Media')
const methodSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    type: {
        type: String,
        trim: true,
        required: true,

    },

    media: [{
        stepName: {
            type: String
        },
        action: {
            type: String
        },

        mediaName: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Media'
        },
        mediaQuantity: {
            type: Number,
            required: true,
        },
        mediaUnit: {
            type: String,
            required: true
        },
        temp: {
            type: Number,
            required: true,
        },
        tempRange: {
            type: Number,
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
        note: {
            type: String
        }

    }],

    longDuration: {
        type: Number,
        required: true,
        default: 0
    },
    shortDuration: {
        type: Number,
        default: 0,
        required: true
    },

    positiveControlStrain: {
        type: String,
        required: true
    },
    negativeControlStrain: {
        type: String,
        required: true
    },

    topReadingInterval: {
        type: Number,
    },
    bottomReadingInterval: {
        type: Number
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

methodSchema.index({ name: 1 })
//  methodSchema.virtual('mediaList').get(function() {
//     const mediaID = this.media.map(el => {
//         return el.mediaName
//     })
//     return mediaID.flat()

//  })
// methodSchema.post('save', function(next) {
//     if(!this.isModified('steps.media.mediaName')) return next()
//     if(this.isModified('steps.media.mediaName')) {
//        const mediaID = this.steps.map(el => el.media.map(el => el.mediaName))
//         mediaID.flat().map(async (el) => {
//             const media = await Media.findById(el)
//             console.log(this._id)
//             media.UseIn.push(this._id)
//             await media.save()
//         })

//     }
//     next()


// })
methodSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'media.mediaName',
        select: 'name'
    })
    next()
})


// methodSchema.pre('aggregate', function(next) {
//     this.populate({
//         path: 'steps.media.mediaName',
//         select: 'name -_id'
//     })
//     next()
// })


const Method = mongoose.model('Method', methodSchema)
module.exports = Method
