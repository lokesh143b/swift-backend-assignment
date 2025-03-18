const express = require("express");
const {
  loadUsers,
  deleteAllUsers,
  deleteUserById,
  getUserById,
  addUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/load", loadUsers);  
router.delete("/users", deleteAllUsers);
router.delete("/users/:userId", deleteUserById);
router.get("/users/:userId", getUserById);
router.put("/users", addUser);

module.exports = router;
