import { Router } from "express";
import { technicianController } from "./technician.controller";


const router = Router();

router.put("/profile", technicianController.updateTechnicianProfile);
// router.post("/availability", technicianController.loginUser);

router.put("/availability", technicianController.updateTechnicianAvailability);



router.get("/bookings", technicianController.getTechnicianBookings);

router.patch("/bookings/:id", technicianController.updateTechnicianBookings);



export const technicianRoutes = router;