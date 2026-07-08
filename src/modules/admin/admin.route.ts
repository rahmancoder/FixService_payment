
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();



// get all users
router.get("");


// update user status ban/unban
router.patch("/");



// get all bookings
router.get("/");


// get all categories
router.get("");


// create new service category
router.post(
    '/categories',
    auth(Role.ADMIN),

    adminController.createCategory
);


export const adminRoutes = router;