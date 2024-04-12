import { Router } from "express";
import { NotebookRoute } from "./notebook-route";
import { authUserRoute } from "./auth-user-route";

const router = Router()

router.use('/notebook', NotebookRoute)
router.use('/auth',authUserRoute)
export {router as applicationRoutes}