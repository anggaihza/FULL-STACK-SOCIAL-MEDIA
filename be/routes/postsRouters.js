const router = require("express").Router()
const { postsController } = require("../controllers")

router.get("/", postsController.getPosts)
router.post("/", postsController.createPost)
router.delete("/:id", postsController.deletePost)

module.exports = router