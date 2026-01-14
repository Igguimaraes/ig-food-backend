const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Público
router.post("/", userController.createUser);

// Protegido
router.get("/", authMiddleware, userController.listUsers);

module.exports = router;
