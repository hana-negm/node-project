const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  updateUserSchema,
  userIdSchema,
} = require("../validations/user.validation");

// GET all users - Admin only
router.get(
  "/",
  authMiddleware,
  authorize("admin"),
  getAllUsers
);

// GET single user - Auth required
router.get(
  "/:id",
  authMiddleware,
  validate(userIdSchema, "params"),
  getUserById
);

// UPDATE user - Owner/Admin
router.put(
  "/:id",
  authMiddleware,
  upload.single("avatar"),
  validate(updateUserSchema),
  updateUser
);

// DELETE user - Admin only
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  deleteUser
);

module.exports = router;