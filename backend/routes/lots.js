import express from "express";
import { 
    getUsers, 
    getUser, 
    postUser,
    deleteUser 
    //updateLot 
} from "../controllers/editUser.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", postUser);
router.delete("/:id", deleteUser);
// router.update("/:id", updateLot);

export default router;