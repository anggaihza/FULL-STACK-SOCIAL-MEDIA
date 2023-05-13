const router = require("express").Router()
const { commentController } = require("../controllers")

router.get("/", commentController.getComments)
router.post("/", commentController.createComment)

module.exports = router