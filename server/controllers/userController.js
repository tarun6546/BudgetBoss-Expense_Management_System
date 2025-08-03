const userModel = require("../models/userModel");
//LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

//register controller
const registerController = async (req, res) => {
  try {
    console.log(req.body);
    const newUser = new userModel(req.body);
    console.log(newUser)
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      sucess: false,
      error,
    });
  }
};

//update user profile controller
const updateUserController = async (req, res) => {
  try {
    const { userId, name, email, photo } = req.body;

    // Find and update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, email, photo },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { loginController, registerController, updateUserController };
