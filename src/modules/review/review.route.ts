import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";
import validationRequest from "../../middlewares/validationRequest";
import { reviewValidation } from "./review.validation";


const router = Router();

router.post(
    '/',
    auth(Role.CUSTOMER),
    validationRequest(reviewValidation.reviewcreateZodSchema),
    reviewController.createReview
);

// Router.get('/');
router.get('/technician/:technicianId', reviewController.getReviewsForTechnician);


export const reviewRoutes = router;