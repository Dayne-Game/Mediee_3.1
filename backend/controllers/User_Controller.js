import asyncHandler from "express-async-handler";
import Generate_Token from "../utils/Generate_Token.js";
import User from "../models/UserModel.js";

// @DESC    GET ALL USERS
// @ROUTE   GET /api/users
// @ACCESS  PRIVATE/ADMIN
const GetUsers = asyncHandler(async (req, res) => {
  // Keyword Search Input
  var re = new RegExp(req.query.keyword, "i");

  if (req.user.isOwner === true) {
    const owner_staff = await User.find({ owner: req.user._id })
      .or([{ name: { $regex: re } }])
      .select("-password");
    res.json(owner_staff);
  } else if (req.user.access === "admin" && req.user.isOwner === false) {
    const admin_staff = await User.find({ owner: req.user.owner })
      .or([{ name: { $regex: re } }])
      .select("-password");
    res.json(admin_staff);
  } else {
    res.status(401);
    throw new Error("You don't have permission to do this!");
  }
});

// @DESC    GET USER BY ID
// @ROUTE   GET /api/users/:id
// @ACCESS  PRIVATE / ADMIN
const GetUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESC    AUTH USER & GET TOKEN
// @ROUTE   POST /api/users/login
// @ACCESS  PUBLIC
const AuthUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      user_image: user.user_image,
      role: user.role,
      resthome: user.resthome,
      email: user.email,
      isOwner: user.isOwner,
      access: user.access,
      token: Generate_Token(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or Password");
  }
});

// @DESC    REGISTER OWNER (COMPANY)
// @ROUTE   POST /api/users/owner
// @ACCESS  PUBLIC
const RegisterOwner = asyncHandler(async (req, res) => {
  const { name, user_image, resthome, email, password } = req.body;

  if (
    name === "" ||
    name === null ||
    resthome === "" ||
    resthome === null ||
    email === "" ||
    email === null ||
    password === "" ||
    password === null
  ) {
    res.status(400);
    throw new Error("Invalid Data. Make sure the fields are NOT empty.");
  }

  // CHECK IF USER EMAIL ALL READY EXISTS
  const userEmailExists = await User.findOne({ email });

  if (userEmailExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // CREATE OWNER
  const owner = await User.create({
    name,
    user_image,
    role: "Care Facility Owner",
    resthome,
    email,
    password,
    isOwner: true,
    access: "admin",
  });

  if (owner) {
    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      user_image: owner.user_image,
      role: owner.role,
      resthome: owner.resthome,
      email: owner.email,
      isOwner: owner.isOwner,
      access: owner.access,
      token: Generate_Token(owner._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Owner Data");
  }
});

// @DESC    REGISTER STAFF MEMBER
// @ROUTE   POST /api/users/staff
// @ACCESS  PRIVATE / ADMIN
const RegisterStaff = asyncHandler(async (req, res) => {
  const { name, user_image, role, resthome, email, password, access } =
    req.body;

  if (
    name === "" ||
    name === null ||
    role === "" ||
    role === null ||
    resthome === "" ||
    resthome === null ||
    email === "" ||
    email === null ||
    password === null ||
    password === "" ||
    access === "" ||
    access === null
  ) {
    res.status(400);
    throw new Error("Invalid Owner Data");
  }

  // CHECK IF USER EMAIL ALL READY EXISTS
  const userEmailExists = await User.findOne({ email });

  if (userEmailExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (req.user.isOwner === true) {
    const new_staff = await User.create({
      name,
      user_image,
      role,
      resthome,
      email,
      password,
      owner: req.user._id,
      access,
    });

    const staff = await new_staff.save();
    res.json(staff);
  } else if (req.user.isAdmin === true && req.user.isOwner === false) {
    const new_staff = await User.create({
      name,
      user_image,
      role,
      resthome,
      email,
      password,
      owner: req.user.owner,
      access,
    });

    const staff = await new_staff.save();
    res.json(staff);
  } else {
    res.status(400);
    throw new Error("Invalid Staff data");
  }
});

// @DESC    UPDATE USER
// @ROUTE   /api/users/:id
// @ACCESS  PRIVATE / ADMIN
const UpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.user_image = req.body.user_image || user.user_image;
    user.role = req.body.role || user.role;
    user.resthome = req.body.resthome || user.resthome;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.access = req.body.access || user.access;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      user_image: updatedUser.user_image,
      role: updatedUser.role,
      resthome: updatedUser.resthome,
      email: updatedUser.email,
      role: updatedUser.role,
      access: updatedUser.access,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESC    DELETE USER
// @ROUTE   /api/users/:id
// @ACCESS  PRIVATE / ADMIN
const DeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  GetUsers,
  GetUserById,
  AuthUser,
  RegisterOwner,
  RegisterStaff,
  UpdateUser,
  DeleteUser,
};
