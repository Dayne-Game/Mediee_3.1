import express from "express";
const router = express.Router();

import {
  GetResidents,
  RegisterResident,
  DeleteResident,
} from "../controllers/Resident_Controller.js";

import { protect, admin } from "../middleware/auth_middleware.js";

router
  .route("/")
  .get(protect, GetResidents)
  .post(protect, admin, RegisterResident);
router.route("/:id").delete(protect, admin, DeleteResident);

export default router;
