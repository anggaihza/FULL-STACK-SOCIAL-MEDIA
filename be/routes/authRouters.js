const router = require("express").Router()
const { authController } = require("../controllers")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.get("/verify-email/:token", authController.verifyEmail)


module.exports = router