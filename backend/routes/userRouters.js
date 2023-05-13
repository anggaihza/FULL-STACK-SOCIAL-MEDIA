const router = require("express").Router()
const { userController } = require("../controllers")

router.get("/find/:userId", userController.getUsers)
router.put("/", userController.updateUsers)


module.exports = router