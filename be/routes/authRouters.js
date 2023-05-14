const router = require("express").Router()
const { authController } = require("../controllers")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/forgot-password", authController.forgotPassword)
router.get("/reset-password/:id/:token", authController.resetPassword)
router.post("/reset-password/:id/:token", authController.resetPasswordTwo)


module.exports = router