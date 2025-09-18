const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CRUD usuarios
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Login
router.post("/login", userController.loginUser);

module.exports = router;
