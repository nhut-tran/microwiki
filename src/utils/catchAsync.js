module.exports = fn => {
    return (req, res, next) => {
        // console.log(fn.catch)
        fn(req, res, next).catch((err) =>{
        console.log(err)
         return next(err)}
         )
    }
}