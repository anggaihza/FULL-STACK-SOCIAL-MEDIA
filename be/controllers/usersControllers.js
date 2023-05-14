const { db } = require("../db")
const jwt = require("jsonwebtoken")

module.exports = {
    getUsers: async (req, res) => {
        const userId = req.params.userId
        const q = `SELECT * FROM users WHERE id = ?`

        db.query(q, [userId], (err, data) => {
            if (err) return res.status(500).json(err)
            const { password, ...info } = data[0]
            return res.json(info)
        })
    },
    updateUsers: async (req, res) => {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json({ msg: "Not Authenticated!" })

        jwt.verify(token, "JWT", (err, userInfo) => {
            if (err) return res.status(400).json({ msg: "Token is not valid!" })

            // Check if the new username is already taken by another user
            const q = "SELECT * FROM users WHERE username = ? AND id != ?";
            db.query(q, [req.body.username, userInfo.id], (err, data) => {
                if (err) return res.status(400).json(err);

                if (data.length > 0) {
                    return res.status(400).json({ msg: "Username already taken" });
                }

                const q = "UPDATE users SET `username`=?, `fullname`=?, `bio`=?, `profilePic`=?,`coverPic`=? WHERE id=?"
                db.query(q, [req.body.username, req.body.fullname, req.body.bio, req.body.coverPic, req.body.profilePic, userInfo.id], (err, data) => {
                    if (err) return res.status(400).json(err)
                    if (data.affectedRows > 0) return res.json({ msg: "Updated!" })
                    return res.status(403).json({ msg: "You can update only your post" })
                })
            })
        });
    }
}
