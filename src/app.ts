import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.route";
import { technicianRoutes } from "./modules/technician/technician.route";



const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

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

app.use("/api/technician", technicianRoutes);


app.use("/api/services", serviceRoutes);



// app.use("/api/");



// not found route here
// global error handler here

export default app;