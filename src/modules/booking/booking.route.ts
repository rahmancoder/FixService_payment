
// POST	/api/bookings	Create new booking (customer)
// GET	/api/bookings	Get user's bookings
// GET	/api/bookings/:id	Get booking details

import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";
import validationRequest from "../../middlewares/validationRequest";
import { bookingValidation } from "./booking.validation";

const router = Router();

// router.post(
//     '/',
//     auth(Role.CUSTOMER, Role.ADMIN),
//     bookingController.createBooking
// );

router.post(
    '/',
    auth(Role.CUSTOMER, Role.ADMIN),
    validationRequest(bookingValidation.bookingcreateZodSchema),
    bookingController.createBooking
);


router.get('/', auth(Role.CUSTOMER), bookingController.getMyBookings);

// router.get('/', auth(Role.TECHNICIAN), bookingController.getMyBookings);


router.get('/:id', auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), bookingController.getBookingById);



export const bookingRoutes = router;