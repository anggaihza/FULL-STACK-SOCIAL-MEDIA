const { db } = require("../db")
const jwt = require("jsonwebtoken")
const moment = require("moment")

module.exports = {
    getComments: (req, res) => {

        const q = `SELECT c.*, u.id AS userId, username, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
        WHERE c.postId = ?
        ORDER BY c.createdAt DESC`

        db.query(q, [req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json(data)
        })

    },

    createComment: (req, res) => {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json({ msg: "Not logged in!" })

        jwt.verify(token, "JWT", (err, userInfo) => {
            if (err) return res.status(400).json({ msg: "Token is not valid!" })


            const q = "INSERT INTO comments (`desc`,`createdAt`, `userId`, `postId`) VALUES (?)";

            const values = [
                req.body.desc,
                moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                userInfo.id,
                req.body.postId
            ]
            console.log(userInfo);

            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err)
                return res.status(200).json({ msg: "Comments has been created" })
            })

        })
    }
}
