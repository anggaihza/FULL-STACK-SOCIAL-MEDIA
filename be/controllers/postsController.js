const moment = require("moment/moment")
const { db } = require("../db")
const jwt = require("jsonwebtoken")

module.exports = {
    getPosts: (req, res) => {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json({ msg: "Not logged in!" })

        jwt.verify(token, "JWT", (err, userInfo) => {
            if (err) return res.status(400).json({ msg: "Token is not valid!" })


            const q = `SELECT p.*, u.id AS userId, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) ORDER BY p.createdAt DESC`

            db.query(q, [userInfo.id], (err, data) => {
                if (err) return res.status(500).json(err)
                return res.status(200).json(data)
            })
        })
    },
    createPost: (req, res) => {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json({ msg: "Not logged in!" })

        jwt.verify(token, "JWT", (err, userInfo) => {
            if (err) return res.status(400).json({ msg: "Token is not valid!" })


            const q = "INSERT INTO posts (`caption`, `image`, `userId`, `createdAt`) VALUES (?)";

            const values = [
                req.body.caption,
                req.body.image,
                userInfo.id,
                moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            ]

            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err)
                return res.status(200).json({ msg: "Post has been created" })
            })

        })
    },
    deletePost: (req, res) => {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json({ msg: "Not logged in!" })

        jwt.verify(token, "JWT", (err, userInfo) => {
            if (err) return res.status(400).json({ msg: "Token is not valid!" })


            const q = "DELETE FROM posts WHERE `id`=? AND `userId`=?";

            db.query(q, [req.params.id, userInfo.id], (err, data) => {
                if (err) return res.status(500).json(err)
                if (data.affectedRows > 0) return res.status(200).json({ msg: "Post has been deleted" })
                return res.status(400).json({ msg: "You can delete only your post" })
            })

        })
    },
    updatePost: (req, res) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ msg: "Not logged in!" });

        jwt.verify(token, "JWT", (err, userInfo) => {
            if (err) return res.status(400).json({ msg: "Token is not valid!" });

            const postId = req.params.id;
            const newCaption = req.body.caption;

            const q = "SELECT * FROM posts WHERE id=? AND userId=?";
            db.query(q, [postId, userInfo.id], (err, data) => {
                if (err) return res.status(500).json(err);

                if (data.length === 0) {
                    return res.status(404).json({ msg: "Post not found" });
                }

                const post = data[0];

                const q = "UPDATE posts SET caption=? WHERE id=?";
                db.query(q, [newCaption, post.id], (err, data) => {
                    if (err) return res.status(500).json(err);

                    return res.status(200).json({ msg: "Post caption updated" });
                });
            });
        });
    },
}