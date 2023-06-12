var jwt = require('jsonwebtoken');
const privateKey = "mynameisjasminrasikbhaikorat"

const authentication = async (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send({ status: "Failed", message: "Please authentication using valid tokan!!!" })
    }
    try {
        const data = await jwt.verify(token, privateKey)
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({ status: "Failed", message: "Please authentication using valid tokan!!!" })
    }
}

module.exports = authentication;