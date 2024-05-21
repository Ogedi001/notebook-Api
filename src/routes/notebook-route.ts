import { Router } from "express";
import {
  createNoteBookController,
  deleteNoteBookController,
  filterNoteBookByTagNameController,
  getAllNoteBooksQuerySearch,
  getNoteBookByIdServiceController,
  shareNoteBookController,
  updateNoteBookController,
} from "../controller";
import {
  createNotebookSchema,
  filterNotebookSchema,
  notebookByIdSchema,
  shareNotebookSchema,
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

  router
  .route("/:notebookId/share")
  .patch(
    shareNotebookSchema(),
    validateRequestMiddleware,
    shareNoteBookController
  )
  router
  .route("/filter")
  .get(
    filterNotebookSchema(),
    validateRequestMiddleware,
    filterNoteBookByTagNameController
  )

export { router as NotebookRoute };
