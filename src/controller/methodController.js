const fs = require('fs')
const path = require('path')
const Method = require('../db/model/Method')
const appErr = require('../utils/appErr')
const catchAsync = require('../utils/catchAsync')
const sendData = require('../utils/sendData')
const xl = require('excel4node')
const readXlsxFile = require('read-excel-file/node')

exports.addNewMethod = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const { name, type, media, Longduration, shortDuration, negativeControlStrain, tempRange,
        positiveControlStrain, topReadingInterval = undefined, bottomReadingInterval = undefined } = { ...req.body }
    const newMethod = await Method.create({
        name, type, media, Longduration, shortDuration, negativeControlStrain, tempRange,
        positiveControlStrain, topReadingInterval, bottomReadingInterval
    })

    sendData(newMethod, res)

})

exports.getAllMethod = catchAsync(async (req, res, next) => {

    //build query: basic filter
    let queryObj = { ...req.query }
    const excludeQuery = ['sort', 'page', 'limit', 'fields']
    excludeQuery.forEach((el) => {
        delete queryObj[el]
    })

    let query = Method.find()
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
    const page = req.query.page * 1 || 1
    query = query.skip((page - 1) * 10).limit(10)
    //exec query
    const allMethod = await query
    let count, pageCount
    if (allMethod.length === 0) {
        pageCount = 0
    } else if (allMethod.length !== 0) {
        if (req.query.name) {
            pageCount = allMethod.length <= 10 ? 1 : Math.ceil(allMethod.length / 10)

        } else {
            count = await Method.countDocuments()
            pageCount = count <= 10 ? 1 : Math.ceil(count / 10)
        }
    }
    const data = {
        data: allMethod,
        pageCount
    }
    sendData(data, res)

})

exports.
    getOneMethod = catchAsync(async (req, res, next) => {
        if (!req.params.id) return next(new appErr(400, 'invalid data'))

        // const method = await Method.aggregate([
        //     {
        //         $match: {_id: mongoose.Types.ObjectId(req.params.id)}
        //     },
        //     {
        //         $unwind: '$steps'
        //     }
        // ])
        const method = await (await Method.findOne({ _id: req.params.id }))
        if (!method) return next(new appErr(404, 'Method not found'))
        sendData(method, res)
    })


exports.updateOneMethod = catchAsync(async (req, res, next) => {
    if (!req.params.id) return next(new appErr(400, 'invalid data'))
    const method = await Method.findById(req.params.id)
    if (!method) return next(new appErr(404, 'Method not found'))
    const updateKey = Object.keys(req.body)
    updateKey.forEach((key) => {
        method[key] = req.body[key]
    })
    await method.save()
    sendData(method, res)
})

exports.deleteOneMethod = catchAsync(async (req, res, next) => {
    if (!req.params.id) return next(new appErr(400, 'invalid data'))
    const method = await Method.findOneAndDelete({ _id: req.params.id })
    if (!method) return next(new appErr(400, 'Method not found'))
    sendData(method, res)
})

exports.getStat = catchAsync(async (req, res, next) => {
    const numMethod = await Method.countDocuments()
    sendData(numMethod, res)
})

exports.exportExcel = catchAsync(async (req, res, next) => {
    const headerStyle = {
        alignment: {
            horizontal: 'center',
            shrinkToFit: true,
            vertical: 'center',
            wrapText: true
        },
        font: {
            bold: true,
            color: 'white',
            name: 'Arial Narrow',
            size: 36
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#1c7cb0',
            fgColor: '#1c7cb0'
        }
    }
    const tableTitleStyle = {
        alignment: {
            horizontal: 'center',
            shrinkToFit: true,
            vertical: 'center',
            wrapText: true
        },
        font: {
            bold: true,
            color: '#00008b',
            name: 'Arial Narrow',
            size: 13
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#47d147',
            fgColor: '#47d147'
        },

        border: {
            left: {
                style: 'dashed',
                color: '#90ee90'
            },
            right: {
                style: 'dashed',
                color: '#90ee90'
            },
            top: {
                style: 'dashed',
                color: '#90ee90'
            },
            bottom: {
                style: 'dashed',
                color: '#90ee90'
            }
        }
    }


    const createStripeStyle = (index) => {
        const style = {
            alignment: {
                horizontal: 'center',
                shrinkToFit: false,
                vertical: 'center',
                wrapText: true
            },
            font: {
                bold: false,
                color: '#001a33',
                name: 'Arial Narrow',
                size: 12
            },

            border: {
                left: {
                    style: 'dashed',
                    color: '#90ee90'
                },
                right: {
                    style: 'dashed',
                    color: '#90ee90'
                },
                top: {
                    style: 'dashed',
                    color: '#90ee90'
                },
                bottom: {
                    style: 'dashed',
                    color: '#90ee90'
                }
            }
        }


        if (index % 2 === 0) {
            return style
        } else {
            return {
                ...style,
                ...{
                    fill: {
                        type: 'pattern',
                        patternType: 'solid',
                        bgColor: '#e6f5ff',
                        fgColor: '#e6f5ff'
                    }
                }

            }
        }
    }

    const modData = req.body.map(method => {

        let valT = method.step.reduce((acc, curr) => {
            let currMediaLength = curr.media.length
            let val = curr.media.reduce((acc2, curr2) => {
                let val = curr2.tool.length
                curr2.numCellToMerge = val
                return acc2 + val
            }, 0)
            curr.numCellToMerge = (val >= currMediaLength ? val : currMediaLength)
            return acc + (val >= currMediaLength ? val : currMediaLength)

        }, 0)
        method.numCellToMerge = valT
        return method
    })


    const wb = new xl.Workbook()
    const ws = wb.addWorksheet('MicroWiki')
    ws.cell(1, 2, 4, 14, true).string('MicroWiki Detail Price Calculator').style(headerStyle)
    ws.cell(6, 2, 7, 2, true).string('name').style(tableTitleStyle)
    ws.cell(6, 3, 7, 3, true).string('step').style(tableTitleStyle)
    ws.cell(6, 4, 6, 9, true).string('media').style(tableTitleStyle)
    ws.cell(7, 4).string('name').style(tableTitleStyle)
    ws.cell(7, 5).string('quantity').style(tableTitleStyle)
    ws.cell(7, 6).string('package').style(tableTitleStyle)
    ws.cell(7, 7).string('weight').style(tableTitleStyle)
    ws.cell(7, 8).string('price').style(tableTitleStyle)
    ws.cell(7, 9).string('Fee').style(tableTitleStyle)
    ws.cell(6, 10, 6, 14, true).string('tool').style(tableTitleStyle)
    ws.cell(7, 10).string('name').style(tableTitleStyle)
    ws.cell(7, 11).string('quantity').style(tableTitleStyle)
    ws.cell(7, 12).string('price').style(tableTitleStyle)
    ws.cell(7, 13).string('Fee').style(tableTitleStyle)
    ws.cell(7, 14).string('Total Fee').style(tableTitleStyle)
    ws.column(2).freeze()
    ws.column(2).setWidth(20)
    ws.row(7).freeze()
    ws.column(4).setWidth(24)

    let numCelltoStep = 0


    modData.forEach((method, medthodIndex) => {
        let numcellToMerge = method.numCellToMerge
        if (medthodIndex > 0) {
            numCelltoStep = numCelltoStep + modData[medthodIndex - 1].numCellToMerge
        }
        const formulaForTottalFee = () => {

            if ((numcellToMerge + numCelltoStep + 8 - 1) === (8 + numCelltoStep)) {
                return `I${8 + numCelltoStep} + M${8 + numCelltoStep}`

            } else {

                let numCelltoStepMedia = []
                let str = `I${8 + numCelltoStep}`
                method.step.forEach(step => {
                    step.media.forEach(media => {
                        numCelltoStepMedia.push(media.tool.length)
                    })
                })
                let acc = 0
                if (numCelltoStepMedia.length > 0) numCelltoStepMedia.forEach((el, index) => {
                    if (index > 0) {

                        str = str + `+ I${8 + numCelltoStep + numCelltoStepMedia[index - 1]}`
                    }

                })

                for (i = 0; i < numcellToMerge; i++) {
                    str = str + ` + M${8 + numCelltoStep + numcellToMerge - 1 - i}`
                }
                return str
            }


        }
        ws.cell(8 + numCelltoStep, 2, numcellToMerge + numCelltoStep + 8 - 1, 2, true).string(method.name).style(createStripeStyle(medthodIndex))
        ws.cell(8 + numCelltoStep, 14, numcellToMerge + numCelltoStep + 8 - 1, 14, true).formula(

            formulaForTottalFee()


        ).style(createStripeStyle(medthodIndex))

        let numCelltoStepStep = 0
        method.step.forEach((step, stepIndex) => {
            let numcellToMergeStep = step.numCellToMerge
            if (stepIndex > 0) {
                numCelltoStepStep = numCelltoStepStep + method.step[stepIndex - 1].numCellToMerge
            }
            ws.cell(8 + numCelltoStepStep + numCelltoStep, 3, numcellToMergeStep + numCelltoStepStep + numCelltoStep + 8 - 1, 3, true).string(step.stepName).style(createStripeStyle(medthodIndex))
            let numCelltoStepMedia = 0
            step.media.forEach((media, mediaIndex) => {

                let numcellToMergeMedia = media.numCellToMerge
                if (mediaIndex > 0) {

                    numCelltoStepMedia = numCelltoStepMedia + step.media[mediaIndex - 1].numCellToMerge
                }
                let formulaOfCalculateFee = (row = 8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia) => {

                    if (media.mediaUnit === 'mL' && media.unit === 'g') {
                        return `(H${row} / F${row}) * (LEFT(E${row}, FIND(" ",E${row})-1) * G${row} / 1000)`
                    } else if (media.mediaUnit === 'piece') {
                        return `(H${row} / F${row}) * LEFT(E${row}, FIND(" ",E${row})-1)`
                    } else if (media.mediaUnit === 'mL' && media.unit === 'mL') {
                        return `(H${row} / F${row}) * LEFT(E${row}, FIND(" ",E${row})-1)`
                    } else {
                        return `(H${row} / F${row}) * LEFT(E${row}, FIND(" ",E${row})-1)`
                    }
                }
                // formulaOfCalculateFee()
                ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia, 4, 8 + numCelltoStep + numCelltoStepMedia + numCelltoStepStep + numcellToMergeMedia - 1, 4, true).string(media.displayName).style(createStripeStyle(medthodIndex))
                ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia, 5, 8 + numCelltoStep + numCelltoStepMedia + numCelltoStepStep + numcellToMergeMedia - 1, 5, true).string(`${media.mediaQuantity} (${media.mediaUnit})`).style(createStripeStyle(medthodIndex))
                ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia, 6, 8 + numCelltoStep + numCelltoStepMedia + numCelltoStepStep + numcellToMergeMedia - 1, 6, true).number(media.package).style(createStripeStyle(medthodIndex))
                ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia, 7, 8 + numCelltoStep + numCelltoStepMedia + numCelltoStepStep + numcellToMergeMedia - 1, 7, true).number(media.weight).style(createStripeStyle(medthodIndex))
                ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia, 8, 8 + numCelltoStep + numCelltoStepMedia + numCelltoStepStep + numcellToMergeMedia - 1, 8, true).number(media.price).style(createStripeStyle(medthodIndex))
                ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia, 9, 8 + numCelltoStep + numCelltoStepMedia + numCelltoStepStep + numcellToMergeMedia - 1, 9, true).formula(formulaOfCalculateFee()).style(createStripeStyle(medthodIndex))
                media.tool.forEach((tool, toolIndex) => {
                    ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia + toolIndex, 10).string(tool.toolName).style(createStripeStyle(medthodIndex))
                    ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia + toolIndex, 11).number(tool.toolQuantity).style(createStripeStyle(medthodIndex))
                    ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia + toolIndex, 12).number(tool.toolPrice).style(createStripeStyle(medthodIndex))
                    ws.cell(8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia + toolIndex, 13).formula(
                        `K${8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia + toolIndex} *
                        L${8 + numCelltoStep + numCelltoStepStep + numCelltoStepMedia + toolIndex}
                        `
                    ).style(createStripeStyle(medthodIndex))
                })
            })

        })
    })

    wb.writeToBuffer().then((data) => {
        fs.writeFile(`./public/excel-${req.user.id}.xlsx`, data, (err) => {
            if (err) next(err)
            sendData({}, res)
        })
    })

})

exports.sendExcelFile = catchAsync(async (req, res, next) => {

    res.download(path.join(__dirname, `../../public/excel-${req.user.id}.xlsx`), 'data.xlsx', (err) => {

        fs.unlink(path.join(__dirname, `../../public/excel-${req.user.id}.xlsx`), (err) => {
            console.log('deleted')
        })
    })

})

const a = createCovidFile = catchAsync(async (req, res, next) => {
    readXlsxFile(path.resolve(__dirname, 'data.xlsx')).then(rows => console.log(rows[8]))
    var s = {
        border: { // §18.8.4 border (Border)
            left: {
                style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                // color: string // HTML style hex value
            },
            right: {
                style: 'thin',
                // color: string
            },
            top: {
                style: 'thin',
                //  color: string
            },
            bottom: {
                style: 'thin',
                // color: string
            }
        }
    }
    const wb = new xl.Workbook()
    const ws = wb.addWorksheet('test')
    ws.cell(3, 4).string('CÔNG TY TNHH INTERTEK VIỆT NAM-CHI NHÁNH CẦN THƠ').style({
        font: {
            size: 10
        }
    })
    ws.addImage({
        image: fs.readFileSync(path.resolve(__dirname, 'logo.png')),
        type: 'picture',
        position: {
            type: 'twoCellAnchor',
            from: {
                col: 1,
                colOff: 0,
                row: 3,
                rowOff: 0,
            },
            to: {
                col: 4,
                colOff: 0,
                row: 6,
                rowOff: 0,
            },
        }
    });

    ws.cell(4, 4).string('Địa chỉ: M10, 11, 12, 13 KĐT Nam Sông Cần Thơ, KV Thạnh Thuận, P. Phú Thứ, Q. Cái Răng, TPCT')
    ws.cell(7, 4).string('PHIẾU KẾT QUẢ XÉT NGHIỆM').style({ font: { bold: true } })
    ws.cell(9, 2).string('Họ & Tên:').style({ font: { size: 10 } })
    ws.cell(10, 2).string('Họ & Tên:').style({ font: { size: 10 } })
    ws.cell(11, 2).string('Mã số nhân viên:').style({ font: { size: 10 } })
    ws.cell(12, 2).string('Ngày sinh:').style({ font: { size: 10 } })
    ws.cell(9, 6).string('Điện thoại:').style({ font: { size: 10 } })
    ws.cell(12, 6).string('Giới tính:').style({ font: { size: 10 } })
    ws.cell(13, 2).string('CCCD/CMND:').style({ font: { size: 10 } })
    ws.cell(14, 2).string('Địa chỉ:').style({ font: { size: 10 } })
    ws.cell(15, 2).string('Ngày xét nghiệm:').style({ font: { size: 10 } })
    ws.cell(16, 2).string('Chẩn đoán:').style({ font: { size: 10 } })
    ws.cell(18, 1).string('STT').style(s)
    ws.cell(18, 2, 18, 5, true).string('TÊN XÉT NGHIỆM').style(s)
    ws.cell(18, 6, 18, 9, true).string('KẾT QUẢ').style(s)
    ws.cell(19, 1, 19, 9, true).string('Test nhanh').style(s)
    ws.cell(20, 1).string('1').style(s)
    ws.cell(20, 2, 20, 5, true).string('SGTi - Felx COVID - 19 Ag  (Cat.No.: CAGT900E )').style(s)
    ws.cell(20, 6, 20, 9, true).string('Âm tính').style(s)
    ws.cell(25, 2).string('Ngày:').style({ font: { size: 10 } })
    ws.cell(26, 2).string('Kỹ thuật viên xét nghiệm').style({ font: { size: 10 } })
    ws.cell(31, 2).string('Nguyễn Chí Tâm').style({ font: { size: 10 } })
    ws.cell(25, 7).string('Ngày:').style({ font: { size: 10 } })
    ws.cell(26, 7).string('Quản lý kỹ thuật').style({ font: { size: 10 } })
    ws.cell(31, 7).string('Cao Viết Thanh').style({ font: { size: 10 } })
    for (let i = 0; i < 2; i++) {
        wb.writeToBuffer().then((data) => {
            fs.writeFile(`./public/test${i + 1}.xlsx`, data, (err) => {

            })
        })
    }



})

