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

router.put("/availability", auth(Role.TECHNICIAN), technicianController.updateTechnicianAvailability);




router.get("/bookings", auth(Role.TECHNICIAN), technicianController.getTechnicianBookings);

router.patch("/bookings/:id", auth(Role.TECHNICIAN), technicianController.updateTechnicianBookingsStatus);



export const technicianRoutes = router;