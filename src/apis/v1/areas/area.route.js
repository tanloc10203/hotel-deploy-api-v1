import { Router } from "express";
import { create } from "./area.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const response = await create();
    res.json({ message: "Success", response });
  } catch (error) {
    next(error);
  }
});

export default router;
