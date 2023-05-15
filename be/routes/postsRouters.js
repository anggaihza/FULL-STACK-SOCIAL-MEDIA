const router = require("express").Router()
const { postsController } = require("../controllers")

router.get("/", postsController.getPosts)
router.post("/", postsController.createPost)
router.delete("/:id", postsController.deletePost)
router.patch("/:id", postsController.updatePost)
router.get("/:postId", postsController.postDetail)

module.exports = router