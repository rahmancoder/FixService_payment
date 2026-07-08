
import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();

//Public
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);


// router.post(
//     '/',
//     auth(Role.ADMIN),

//     categoryController.createCategory
// );


export const categoryRoutes = router;