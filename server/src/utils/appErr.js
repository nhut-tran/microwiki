class appErr extends Error {
    constructor(statusCode, message, data) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.operational = true
        this.data = data
        Error.captureStackTrace(this, this.constructor)

    }

}

module.exports = appErr