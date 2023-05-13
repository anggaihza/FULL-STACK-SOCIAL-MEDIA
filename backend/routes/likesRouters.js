const router = require("express").Router()
const { likeController } = require("../controllers")

router.get("", likeController.getLikes)
router.post("", likeController.addLike)
router.delete("", likeController.deleteLike)

module.exports = router