import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();


// All Public Routes 


router.get('/services', userController.getAllServices);
router.get('/services/:id', userController.getServiceById);

// router.get('/', userController.getAllTechnicians);
// router.get('/:id', userController.getTechnicianById);

// router.get('/categories', userController.getAllCategories);


export const userRoutes = router;