import { Router } from "express";
import {
  createNoteBookController,
  deleteNoteBookController,
  getAllNoteBooksQuerySearch,
  getNoteBookByIdServiceController,
  updateNoteBookController,
} from "../controller/notebook-controller";
import {
  createNotebookSchema,
  notebookByIdSchema,
  updateNotebookSchma,
} from "../schema/notebook-schema";
import { validateRequestMiddleware } from "../middleware/validate-request";
import { currentUserMiddleware, emailVerificationCheck } from "../middleware";

const router = Router();
router.use(currentUserMiddleware,emailVerificationCheck);
router
  .route("/")
  .post(
    createNotebookSchema(),
    validateRequestMiddleware,
    createNoteBookController
  )
  .get(getAllNoteBooksQuerySearch);

router
  .route("/id/:id")
  .get(
    notebookByIdSchema(),
    validateRequestMiddleware,
    getNoteBookByIdServiceController
  )
  .patch(
    updateNotebookSchma(),
    validateRequestMiddleware,
    updateNoteBookController
  )
  .delete(
    notebookByIdSchema(),
    validateRequestMiddleware,
    deleteNoteBookController
  );

export { router as NotebookRoute };
