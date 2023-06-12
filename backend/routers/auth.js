const express = require("express")
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = express.Router()
const privateKey = "mynameisjasminrasikbhaikorat"
const authentication = require("../middleware/authentication")




// create user
router.post("/create", [
    body('email', "Enter Valide Email").isEmail(),
    body('password', "Password length is minimum 2 character").isLength({ min: 2 }),
    body('name', "Name length is minimum 2 character").isLength({ min: 2 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            res.status(400).send({ success: false, message: "EMAIL IS ALREADY EXIST IN DATABASE !" })
        } else {
            const password = req.body.password
            const securePassword = await bcrypt.hash(password, 10)
            const createUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePassword,
            })
            const data = {
                user: {
                    id: createUser.id,
                    name: createUser.name,
                    email: createUser.email,
                    password: createUser.password
                }
            }
            var token = jwt.sign(data, privateKey);
            console.log(token)
            res.json({ success: true, data: createUser, token })
        }
    } catch (error) {
        res.json({ success: false, data: error.message })
    }

})


//Login User
router.post("/login", [
    body('email', "Enter Valide Email").isEmail(),
    body('password', "Password blank was not required").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(400).json({ success: false, message: "Email Is Invalid!!!" })
        } else {
            const passwordComapre = await bcrypt.compare(password, user.password)
            if (passwordComapre) {
                const data = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password
                    }
                }
                var token = jwt.sign(data, privateKey);
                console.log(token)
                res.json({ success: true, message: "Login Successfully!!", token })
            }
            else {
                res.status(400).json({ success: false, message: "Password Is Invalid!!!" })
            }
        }
    } catch (error) {
        res.status(400).json({ success: false, data: error.message })
    }

})

//get user detail
router.post("/getuser", authentication, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.status(200).json({ status: "success", message: "Login Successfully!!", user })
    } catch (error) {
        res.status(400).json({ status: "Failed", data: error.message })
    }

})


module.exports = router