import { Router } from "express";
import { userController } from "./user.controller";
import { technicianController } from "../technician/technician.controller";
import { categoryController } from "../category/category.controller";


const router = Router();


// All Public Routes 


router.get('/services', userController.getAllServices);
router.get('/services/:id', userController.getServiceById);

// router.get('/', userController.getAllTechnicians);
router.get('/', technicianController.getAllTechnicians);

// router.get('/:id', userController.getTechnicianById);

// router.get('/categories', userController.getAllCategories);
// router.get('/', categoryController.getAllCategories);



export const userRoutes = router;