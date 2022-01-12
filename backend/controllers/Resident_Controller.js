import asyncHandler from "express-async-handler";
import Resident from "../models/ResidentModel.js";

// @DESC    FETCH ALL RESIDENTS ASSOCIATED TO LOGIN USER
// @ROUTE   GET /api/resident
// @ACCESS  PRIVATE
const GetResidents = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  var re = new RegExp(req.query.keyword, "i");

  if (req.user.isOwner === true) {
    const count = await (
      await Resident.countDocuments({ user: req.user._id })
    ).or([{ name: { $regex: re } }, { nhi: { $regex: re } }]);

    const residents = await Resident.find({ user: req.user._id })
      .or([{ name: { $regex: re } }, { nhi: { $regex: re } }])
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ residents, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.isOwner === false) {
    const count = await (
      await Resident.countDocuments({ user: req.user.owner })
    ).or([{ name: { $regex: re } }, { nhi: { $regex: re } }]);

    const residents = await Resident.find({ user: req.user.owner })
      .or([{ name: { $regex: re } }, { nhi: { $regex: re } }])
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ residents, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(400).send("Residents not Found");
  }
});

// @DESC    CREATE A RESIDENT
// @ROUTE   POST /api/residents
// @ACCESS  PRIVATE / ADMIN
const RegisterResident = asyncHandler(async (req, res) => {
  const { name, resident_image, nhi, dob, gender, height, weight, bloodtype } =
    req.body;

  if (
    name === "" ||
    name === null ||
    resident_image === "" ||
    resident_image === null ||
    nhi === "" ||
    nhi === null ||
    dob === "" ||
    dob === null ||
    gender === null ||
    gender === ""
  ) {
    res.status(400);
    throw new Error("Invalid Resident Data");
  }

  const residentExists = await Resident.findOne({ nhi });

  if (residentExists) {
    res.status(400);
    throw new Error("Resident Already Exists");
  }

  if (req.user.isOwner === true) {
    const newResident = await Resident.create({
      user: req.user.id,
      name,
      resident_image,
      nhi,
      dob,
      gender,
      height,
      weight,
      bloodtype,
    });

    const resident = await newResident.save();
    res.json(resident);
  } else if (req.user.access === "admin" && req.user.isOwner === false) {
    const newResident = await Resident.create({
      user: req.user.owner,
      name,
      resident_image,
      nhi,
      dob,
      gender,
      height,
      weight,
      bloodtype,
    });

    const resident = await newResident.save();
    res.json(resident);
  } else {
    res.status(400);
    throw new Error("Invalid Resident data");
  }
});

// @desc    Delete user
// @desc    DELETE /api/resident/:id
// @access  Private/Admin
const DeleteResident = asyncHandler(async (req, res) => {
  const resident = await Resident.findById(req.params.id);

  if (resident) {
    await resident.remove();
    res.json({ message: "Resident removed" });
  } else {
    res.status(404);
    throw new Error("Resident not found");
  }
});

export { GetResidents, RegisterResident, DeleteResident };
