const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// GET /api/users
// Admin only
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// GET /api/users/:id
// Authenticated users
const getUserById = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// PUT /api/users/:id
// Owner/Admin
const updateUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Only the owner or admin can update the user
  if (
    req.user.role !== "admin" &&
    req.user.id !== req.params.id
  ) {
    throw new AppError(
      "You are not authorized to update this user",
      403
    );
  }

  const { name, email } = req.body;

  if (email !== undefined) {
  const existingUser = await User.findOne({
    email,
    _id: { $ne: req.params.id },
  });

  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  user.email = email;
}

  if (email !== undefined) {
    user.email = email;
  }

  if (req.file) {
    user.avatar = req.file.path;
  }

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user: userResponse,
    },
  });
});

// DELETE /api/users/:id
// Admin only
const deleteUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};