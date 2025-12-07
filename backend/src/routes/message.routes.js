import express from "express";//std code same in all 
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";

const router= express.Router();//std code same in all
// make endpoints by writing code for methods
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);//we will use post method cuz se are sending msg

export default router;//std code same in all
