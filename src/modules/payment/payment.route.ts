import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";
import validationRequest from "../../middlewares/validationRequest";
import { paymentValidation } from "./payment.validation";


const router = Router();


router.post(
    '/create',
    auth(Role.CUSTOMER),
    validationRequest(paymentValidation.createPaymentZodSchema),
    paymentController.createPayment
);

router.post('/confirm', auth(Role.CUSTOMER), paymentController.confirmPayment);


router.post(
    '/webhook',
    paymentController.stripeWebhook
);

// router.get("/", paymentController.getUserpaymentHistory);

router.get('/', auth(Role.CUSTOMER, Role.ADMIN), paymentController.getMyPayments);

router.get('/single/:id', auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), paymentController.getPaymentById);


export const paymentRoutes = router;