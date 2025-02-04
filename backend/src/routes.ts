const express = require("express")
import { UserController } from "./controllers/user.controller"

export const router = express.Router()

router.get("/users/",UserController.getAllUsers)
router.get("/users/:id",UserController.getUserById)
router.post("/users/",UserController.createUser)
router.delete("/users/:id",UserController.deleteUser)
router.put("/users/:id",UserController.updateUser)


module.exports = router