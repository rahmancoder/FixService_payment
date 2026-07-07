import { Router } from "express";
import { serviceController } from "./service.controller";


const router = Router();


router.get("/", serviceController.getAllServices);


// router.get("/technician", serviceController.getAllTechnician);



// router.get("/technician/:id", serviceController.getTechnicianById);


// router.get("/categories");

export const serviceRoutes = router;