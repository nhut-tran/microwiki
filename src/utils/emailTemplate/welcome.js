function wellCome(name, url) {
    return `
    
    <div>
        <img src='cid:logo@cid' style="width:45%" />
        <h1 style="color:#ff2882;">Hello ${name}<h2>
        <h3>Wellcome to Microwiki</h3>
        <p>Cảm ơn ${name} đã tham gia Microwiki</p>
        <a href=${url}>Vui lòng click vào link để kích hoạt tài khoản</a>
    </div>
    `
}

module.exports = wellCome