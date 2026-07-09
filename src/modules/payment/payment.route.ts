

// POST	/api/payments/create	Create a payment intent/session for an accepted booking
// POST	/api/payments/confirm	Confirm/verify payment (webhook or callback)
// GET	/api/payments	Get user's payment history
// GET	/api/payments/:id	Get payment details



import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";


const router = Router();


router.post(
    '/create',
    auth(Role.CUSTOMER),
    paymentController.createPayment
);

router.post('/confirm', auth(Role.CUSTOMER), paymentController.confirmPayment);


// router.post(
//     '/',
//     paymentController.stripeWebhook
// );

// router.get("/", paymentController.getUserpaymentHistory);

router.get('/', auth(Role.CUSTOMER, Role.ADMIN), paymentController.getMyPayments);

router.get('/single/:id', auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), paymentController.getPaymentById);


export const paymentRoutes = router;