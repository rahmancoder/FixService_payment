// POST / api / reviews	Create review(after job completion)


import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";


const router = Router();

router.post(
    '/',
    auth(Role.CUSTOMER),
    reviewController.createReview
);

// Router.get('/');
export const reviewRoutes = router;