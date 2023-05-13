const { db } = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = {
    register: (req, res) => {
        const q = `SELECT * FROM users where username = ?`
        db.query(q, [req.body.username], (err, data) => {
            if (err) return res.status(500).json(err)
            if (data.length) return res.status(400).json({ msg: "User already exists!" })

            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({ msg: "Passwords do not match!" })
            }

            // Password validation
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
            if (!passwordRegex.test(req.body.password)) {
                return res.status(400).json({ msg: "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, and one number." })
            }

            // Email validation
            const emailRegex = /^\S+@\S+\.\S+$/
            if (!emailRegex.test(req.body.email)) {
                return res.status(400).json({ msg: "Invalid email format." })
            }

            // Hash pass
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)

            // create user
            const q = "INSERT INTO users (`username`, `email`, `password`, `status`) VALUES (?, ?, ?, ?)"

            const values = [req.body.username, req.body.email, hashedPassword, "unverified"]
            db.query(q, values, (err, data) => {
                if (err) return res.status(500).json(err)
                return res.status(200).json({ msg: "User has been created" })
            })
        })

    },
    login: (req, res) => {
        const q = "SELECT * FROM users WHERE username = ?"

        db.query(q, [req.body.username], (err, data) => {
            if (err) return res.status(500).json(err)
            if (data.length === 0) return res.status(404).json({ msg: "User not found" })

            const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
            if (!checkPassword) return res.status(400).json({ msg: "Wrong password or username" })

            const token = jwt.sign({ id: data[0].id }, "JWT")

            const { password, ...others } = data[0]

            res.cookie("accessToken", token, {
                httpOnly: true
            }).status(200).json({ others, token })
        })
    },
    logout: (req, res) => {
        res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none"
        }).status(200).json({ msg: "User has been logged Out" })
    }
}