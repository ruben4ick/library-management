import { Router } from "express";
import {
  getAllLoans,
  createLoan,
  returnLoan,
} from "../controllers/loan.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", auth, getAllLoans);
router.post("/", auth, createLoan);
router.post("/:id/return", auth, returnLoan);

export default router;
