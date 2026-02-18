const User = require("../models/user.model");
const UserActivityLog = require("../models/userActivityLog.model");
const bcrypt = require("bcrypt");

const ROLES = {
  USER: 1,
  ADMIN: 2,
  MANAGER: 3,
};

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    delete user.passwordHash;

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    const updatedUser = await User.updatedById(userId, updates);

    delete updatedUser.passwordHash;

    await UserActivityLog.create({
      actorId: userId,
      targetUserId: userId,
      action: "UPDATE_PROFILE",
      details: {
        fields: Object.keys(updates),
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already in use" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllUsersForAdmin = async (req, res) => {
  try {
    const search = req.query.search || "";
    const users = await User.findAllForAdmin(search); // ✅ فقط رشته
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const targetUserId = parseInt(req.params.id);

    if (adminId === targetUserId) {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.roleId === ROLES.MANAGER) {
      return res.status(403).json({
        message: "You cannot modify a manager account",
      });
    }

    const newStatus = !user.isActive;

    const updatedUser = await User.updateActiveStatus(targetUserId, newStatus);

    res.status(200).json({
      message: `User ${newStatus ? "activated" : "deactivated"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllUsersForManager = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error fetching users for manager:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }

    if (req.user.id === targetUserId) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.updateRole(targetUserId, roleId);

    res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });

    await UserActivityLog.create({
      actorId: req.user.id,
      targetUserId: targetUserId,
      action: "CHANGE_ROLE",
      details: {
        from: user.roleId,
        to: roleId,
      },
    });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleUserActive = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);

    if (req.user.id === targetUserId) {
      return res.status(400).json({
        message: "You cannot change your own active status",
      });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.toggleActive(targetUserId);

    res.status(200).json({
      message: "User active status updated",
      user: updatedUser,
    });

    await UserActivityLog.create({
      actorId: req.user.id,
      targetUserId,
      action: "TOGGLE_ACTIVE",
      details: {
        from: user.isActive,
        to: !user.isActive,
      },
    });
  } catch (error) {
    console.error("Error toggling user active:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    if (req.user.id === targetUserId) {
      return res.status(400).json({
        message: "You cannot change your own password here",
      });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await User.updatePassword(targetUserId, passwordHash);

    res.status(200).json({
      message: "User password updated successfully",
    });
    await UserActivityLog.create({
      actorId: req.user.id,
      targetUserId,
      action: "RESET_PASSWORD",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserActivityLogs = async (req, res) => {
  try {
    const logs = await UserActivityLog.findAll();
    res.status(200).json({
      logs,
    });
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const changeMyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updatePassword(userId, hashedPassword);

    await User.increamentTokenVersion(userId);

    await UserActivityLog.create({
      actorId: userId,
      targetUserId: userId,
      action: "CHANGE_MY_PASSWORD",
    });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllUsersForAdmin,
  toggleUserStatus,
  getMyProfile,
  updateMyProfile,
  resetUserPassword,
  changeMyPassword,
  changeUserRole,
  toggleUserActive,
  getAllUsersForManager,
  getUserActivityLogs,
};
