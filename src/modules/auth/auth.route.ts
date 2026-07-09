import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);


router.get("/me",
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    authController.getLoggedInUser);

router.post("/refresh", authController.refreshToken)


export const authRoutes = router;