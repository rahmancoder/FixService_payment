
// POST	/api/bookings	Create new booking (customer)
// GET	/api/bookings	Get user's bookings
// GET	/api/bookings/:id	Get booking details

import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
    '/',
    auth(Role.CUSTOMER, Role.ADMIN),
    bookingController.createBooking
);



export const bookingRoutes = router;