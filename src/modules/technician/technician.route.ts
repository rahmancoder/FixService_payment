import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get('/', technicianController.getAllTechnicians);
router.get('/:id', technicianController.getTechnicianById);



router.put("/profile",
    auth(Role.TECHNICIAN),
    technicianController.updateTechnicianProfile);
// router.post("/availability", technicianController.loginUser);

router.put("/availability", technicianController.updateTechnicianAvailability);




router.get("/bookings", technicianController.getTechnicianBookings);

router.patch("/bookings/:id", technicianController.updateTechnicianBookingsStatus);



export const technicianRoutes = router;