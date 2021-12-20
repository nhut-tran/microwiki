const Media = require('../db/model/Media')
const appErr = require('../utils/appErr')
const catchAsync = require('../utils/catchAsync')
const sendData = require('../utils/sendData')


exports.addNewMedia = catchAsync(async (req, res, next) => {
    const { name, typeByUse, typeByPhysical, description, GamPerLitter, UseIn } = { ...req.body }
    const newMedia = await Media.create({
        name, typeByUse, typeByPhysical, description, GamPerLitter, UseIn
    })
    sendData(newMedia, res)

})

exports.getAllMedia = catchAsync(async (req, res, next) => {
    //return sendData({data: [], pageCount: 0}, res)
    //build query: basic filter
    let queryObj = { ...req.query }
    const excludeQuery = ['sort', 'page', 'limit', 'fields']
    excludeQuery.forEach((el) => {
        delete queryObj[el]
    })
    //advanced filter with operator >=<
    let stringQuery = JSON.stringify(queryObj)
    const operator = ['gt', 'lt', 'gte', 'lte']
    operator.forEach((el) => {
        if (stringQuery.includes(el)) {
            stringQuery = stringQuery.replace(el, match => `$${match}`)
        }
    })
    queryObj = JSON.parse(stringQuery)
    //let query =  Media.find(queryObj)
    //find by name
    let query = Media.find()
    if (req.query.name) {
        query = query.find({ "name": { "$regex": req.query.name, "$options": "i" } })
    }
    //sort 
    if (req.query.sort) {
        const sortByString = req.query.sort.split(',')
        const sortBy = {}
        sortByString.forEach(el => {
            el = el.split('_')
            sortBy[el[0]] = el[1] * 1 || 1
        })
        query = query.sort(sortBy)
    }
    //limit fields
    if (req.query.fields) {
        const selectFields = req.query.fields.split(',').join(' ')
        query = query.select(selectFields)
    } else {
        query.select('-__v')
    }
    //pagination
    let count, page
    if (req.query.page !== 'ad') {
        let beforePagination = await query
        count = beforePagination.length
        page = req.query.page * 1 || 1
        if (Math.ceil(count / 10) < page) {
            page = 1
        }
        query = query.skip((page - 1) * 10).limit(10)
    }


    //exec query
    allMedia = await query.populate('useIn', 'name').populate({ path: 'media.mediaName' })
    //covert to pure obj and get the name of populated method
    allMedia = allMedia.map(media => {

        const mediaObj = media.toObject()
        mediaObj.useIn = mediaObj.useIn.map(el => el.name)
        return mediaObj

    })

    let pageCount
    if (allMedia.length === 0) {
        pageCount = 0

    } else {
        pageCount = count <= 10 ? 1 : Math.ceil(count / 10)
    }
    const data = {
        data: allMedia,
        page,
        pageCount
    }
    sendData(data, res)
})

exports.getOneMedia = catchAsync(async (req, res, next) => {
    if (!req.params.id) return next(new appErr(400, 'invalid data'))

    let media = await Media.findOne({ _id: req.params.id }).populate('useIn').
        populate('media.mediaName', 'name')

    console.log(media.useIn)
    // media.useIn = media.useIn.map((el) => {
    //     el.media = undefined
    //     return el
    // })

    if (!media) return next(new appErr(404, 'Media not found'))
    sendData(media, res)
})

exports.updateOneMedia = catchAsync(async (req, res, next) => {
    if (!req.params.id) return next(new appErr(400, 'invalid data'))
    const media = await Media.findById(req.params.id)
    if (!media) return next(new appErr(404, 'Media not found'))
    const updateKey = Object.keys(req.body)
    updateKey.forEach((key) => {
        media[key] = req.body[key]
    })
    await media.save()
    sendData(media, res)
})

exports.deleteOneMedia = catchAsync(async (req, res, next) => {
    if (!req.params.id) return next(new appErr(400, 'invalid data'))
    const media = await Media.findByIdAndDelete(req.params.id)
    if (!media) return next(new appErr(400, 'Media not found'))
    sendData(media, res)
})

const fs = require('fs')
const path = require('path')
const { deleteOne } = require('../db/model/Media')
const { compareSync } = require('bcryptjs')
exports.importData = async (req, res, next) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/data.json')))
    const datapr = data.map(async (el) => {
        const { name, type, description } = { ...el }
        await Media.create(
            {
                name,
                typeByUse: type.byUsage,
                typeByPhysical: type.byPhysical,
                description,

            })
        const jsonBack = await Promise.all(datapr)

        res.send(jsonBack)
    })


};

exports.getStat = catchAsync(async (req, res, next) => {
    const numMedia = await Media.countDocuments()
    sendData(numMedia, res)
})