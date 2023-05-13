const userRouters = require("./userRouters")
const authRouters = require("./authRouters")
const postsRouter = require("./postsRouters")
const commentRouter = require("./commentsRouter")
const likeRouter = require("./likesRouters")

module.exports = {
    authRouters,
    postsRouter,
    commentRouter,
    likeRouter,
    userRouters
}