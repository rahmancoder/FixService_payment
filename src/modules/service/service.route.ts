import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validationRequest";
import { serviceValidation } from "./service.validation";


const router = Router();


// router.post(
//     '/',
//     auth(Role.TECHNICIAN),

//     serviceController.createService);



router.post(
    '/',
    auth(Role.TECHNICIAN),
    validationRequest(serviceValidation.servicecreateZodSchema),
    serviceController.createService);

router.get("/", serviceController.getAllServices);


// router.get("/technician", serviceController.getAllTechnician);



// router.get("/technician/:id", serviceController.getTechnicianById);


// router.get("/categories");

export const serviceRoutes = router;