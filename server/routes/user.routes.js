const express = require("express");
const {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateMyProfile,
  updateUserByAdmin,
  deleteMyAccount,
  deleteUserByAdmin,
  getUserByEmail,
} = require("../controllers/user.controller.js");
const { authMiddleware } = require("../middleware/auth.middleware.js");
const { authorizeRoles } = require("../middleware/role.middleware.js");

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMyProfile);

router.patch("/me", updateMyProfile);

router.delete("/me", deleteMyAccount);

router.get("/", getAllUsers);

router.get("/email/:email", getUserByEmail);

router.get("/:id", getUserById);

router.patch("/:id", updateUserByAdmin);

router.delete("/:id", deleteUserByAdmin);

module.exports = router;