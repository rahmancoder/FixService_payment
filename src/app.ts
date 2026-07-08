import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.route";
import { technicianRoutes } from "./modules/technician/technician.route";
import { serviceRoutes } from "./modules/service/service.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { categoryRoutes } from "./modules/category/category.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { userRoutes } from "./modules/user/user.route";






const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))


// const endpointSecret = config.stripe_webhook_secret;

// Stripe webhook needs the raw request body for signature verification,
// so it must be registered BEFORE the json() body parser below.
app.post(
    '/api/payments/webhook',
    express.raw({ type: 'application/json' })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get("/", (req: Request, res: Response) => {
    // res.send("Author Mustafizur Rahman FixService Backend");

    res.status(200).json({
        message: "Mustafizur Rahman FixService Backend",
        author: "Md. Mustafizur Rahman",
    });
});

app.use("/api/auth", authRoutes);

//added new route
app.use("/api/users", userRoutes);

app.use("/api/technician", technicianRoutes);


app.use("/api/services", serviceRoutes);


app.use("/api/bookings", bookingRoutes);


app.use("/api/payments", paymentRoutes);

app.use("/api/reviews", reviewRoutes);


app.use("/api/categories", categoryRoutes);

app.use("/api/admin", adminRoutes);





// app.use("/api/");



// not found route here
app.use(notFound);

// global error handler here
app.use(globalErrorHandler);


export default app;