const mongoose = require('mongoose')
const method = require('./Method')
const mediaSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      min: 3
   },
   typeByUse: {
      type: String,
      required: [true, 'Type by using purpose is required']

   },
   typeByPhysical: {
      type: String,
      required: [true, 'Type by physical is required']

   },
   description: {
      type: String,
      required: [true, 'Description is required']
   },
   // GamPerLitter: {
   //    type: Number,
   //    required: [true, 'Gam per litter is required']
   // },
   // UseIn: [
   //    {
   //       type: mongoose.Schema.ObjectId
   //    }
   // ]

},
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
)
mediaSchema.index({ name: 1 })
mediaSchema.virtual('useIn', {
   ref: 'Method',
   foreignField: 'media.mediaName',
   localField: '_id'
})

// mediaSchema.pre(/^find/, function (next) {
//    this.populate('useIn')
//    next()
// })
const Media = mongoose.model('Media', mediaSchema)

module.exports = Media