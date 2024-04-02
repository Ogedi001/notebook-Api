import { Router } from "express";
import { NotebookRoute } from "./notebook-route";

const router = Router()

router.use('/notebook', NotebookRoute)

export {router as applicationRoutes}