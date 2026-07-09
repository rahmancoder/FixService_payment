
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";
import { categoryController } from "../category/category.controller";

const router = Router();



// get all users
router.get('/users', auth(Role.ADMIN), adminController.getAllUsers);


// update user status ban/unban
router.patch(
    '/users/:id',
    auth(Role.ADMIN),
    adminController.updateUserStatus
);



// get all bookings
// router.get("/");

// public
// // get all categories
// router.get("");
router.get('/', categoryController.getAllCategories);

// create new service category
router.post(
    '/categories',
    auth(Role.ADMIN),

    adminController.createCategory
);


export const adminRoutes = router;