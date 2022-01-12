import express from "express";
const router = express.Router();

import {
  RegisterOwner,
  AuthUser,
  GetUsers,
  RegisterStaff,
  DeleteUser,
  UpdateUser,
  GetUserById,
} from "../controllers/User_Controller.js";
import { protect, admin } from "../middleware/auth_middleware.js";

router.route("/owner").post(RegisterOwner);
router.post("/login", AuthUser);
router.route("/").get(protect, admin, GetUsers);
router.route("/staff").post(protect, admin, RegisterStaff);
router
  .route("/id")
  .delete(protect, admin, DeleteUser)
  .put(protect, admin, UpdateUser)
  .get(protect, admin, GetUserById);

export default router;
