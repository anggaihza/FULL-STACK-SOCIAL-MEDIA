const router = require("express").Router()
const { postsController } = require("../controllers")

router.get("/", postsController.getPosts)
router.post("/", postsController.createPost)
router.delete("/:id", postsController.deletePost)
router.patch("/:id", postsController.updatePost)

module.exports = router