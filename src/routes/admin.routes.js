import express from 'express';
import { authenticate, authorizeRoles, authorizePermissions } from '../middlewares/auth.middleware.js';
import {createUserByAdmin} from '../controllers/admin.controller.js';

import { createRole, getRoles } from "../controllers/role.controller.js"
import { createPermission, getPermissions } from "../controllers/permission.controller.js"


import authorize from '../middlewares/authorize.js'; // 👈 Import the authorize middleware
const router = express.Router();


router.get('/get-test',authenticate, authorizeRoles('admin'),authorizePermissions('okay'), // 👈 Add authenticate and authorize middleware here
// authorize("okay"),
 (req, res) => {
  // Logic to get users
  res.send('Working Fine');
  res.status(200).json({ message: 'successfully Result' })
})


// Role and Permission routes
router.post("/role",authorizeRoles('admin'), createRole);
router.get("/roles",authorizeRoles('admin'), getRoles);

router.post("/permission",authorizeRoles('admin'), createPermission);
router.get("/permissions",authorizeRoles('admin'), getPermissions);



// Simulated authentication middleware (assume user is authenticated via JWT)
router.use((req, res, next) => {
  req.user = { id: "USER_MONGODB_ID_HERE" }; // replace with real ID
  next();
});

router.post("/create-user", authorize("create_user"), (req, res) => {
  res.send("✅ User Created");
});

router.delete("/delete-user", authorize("delete_user"), (req, res) => {
  res.send("✅ User Deleted");
});


export default router;
