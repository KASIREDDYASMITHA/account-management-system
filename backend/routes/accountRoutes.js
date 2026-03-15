import express from "express"
import { getBalance } from "../controllers/accountController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import { transferMoney } from "../controllers/accountController.js"
import { getStatement } from "../controllers/accountController.js"
import { getUsers } from "../controllers/accountController.js"

const router = express.Router()

router.get("/balance", authMiddleware, getBalance)
router.post("/transfer", authMiddleware, transferMoney)
router.get("/statement", authMiddleware, getStatement)
router.get("/users", authMiddleware, getUsers)
export default router