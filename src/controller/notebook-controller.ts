import { Request, Response, NextFunction } from "express";
import {
  CreatedNoteBookData,
  createNoteBookService,
  deleteNoteBookService,
  filterNoteBookByTagName,
  findNoteBookByIdService,
  getNoteBooksQueryService,
  shareNoteBookWithUser,
  updateNoteBookService,
} from "../service/notebook-service";
import { successResponse } from "../helpers/success-response";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import { Privacy } from "@prisma/client";
import { ForbiddenError } from "../errors/forbidden-error";
import logger from "../Logger";
import { findUserByIdService } from "../service/auth-user-service";
import { FilterData, NoteBookInputData, NoteBookRequestBody } from "../interface";



export const createNoteBookController = async (req: Request, res: Response) => {
  const { title, content, tags } = req.body as NoteBookRequestBody;
  const ownerId = req.currentUser?.id!;
  const data: NoteBookInputData = { title, content, ownerId };
    const notebook = await createNoteBookService(data,tags);
  return successResponse(res, StatusCodes.CREATED, notebook);
};

export const getNoteBookByIdServiceController = async (
  req: Request,
  res: Response
) => {
  const userId = req.currentUser?.id!;

  const { id } = req.params;
  const notebook = await findNoteBookByIdService(id, userId);
  if (!notebook) {
    throw new BadRequestError("Invalid Notebook ID");
  }
  return successResponse(res, StatusCodes.OK, notebook);
};

export const getAllNoteBooksQuerySearch = async (
  req: Request,
  res: Response
) => {
  const userId = req.currentUser?.id!;
  const notebooks = await getNoteBooksQueryService(req.query, userId);
  if (!notebooks.notebooks || notebooks.notebooks.length < 1)
    throw new NotFoundError("No notebook found");
  return successResponse(res, StatusCodes.OK, notebooks);
};

export const updateNoteBookController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, privacy, tags } = req.body as NoteBookRequestBody;
  const ownerId = req.currentUser?.id!;

  const data: NoteBookInputData = { title, content, privacy, ownerId };
  const notebook = await findNoteBookByIdService(id, ownerId);

  if (!notebook) throw new BadRequestError("Invalid Notebook ID");

  const updatedNotebook = await updateNoteBookService(id, data, tags);

  return successResponse(res, StatusCodes.OK, updatedNotebook);
};



export const shareNoteBookController = async (req: Request, res: Response) => {
  const {userIds } = req.body as {
    userIds: string[];
  };
  const{notebookId}= req.params
  const ownerId= req.currentUser?.id!;
  const notebook = await findNoteBookByIdService(notebookId, ownerId);
  if (!notebook) throw new BadRequestError("Invalid Notebook ID");
  if (notebook.privacy === Privacy.PRIVATE)
    throw new ForbiddenError('"Cannot share a private notebook" ');

  const validUserIds = userIds.filter(userId => !!userId);
  if (validUserIds.length === 0) {
    throw new BadRequestError("No valid user IDs provided");
  }

  const data = await Promise.all(
    validUserIds.map(async (userId) => {
        const id = await findUserByIdService(userId);
        if (!id) {
          logger.info(`User with ID ${userId} not found, skipping...`);
          return null;
        }

        if(ownerId===userId){
          logger.info(`Cannot share to yourself, skipping...`);
          return null;
        }

        const alreadyShared = notebook.sharedUsers.some(
          (sharedUser) => sharedUser.id === userId
        );
        if (alreadyShared) {
          logger.info(
            `Notebook already shared with user ${userId}, skipping...`
          );
          return null;
        }

        const notebookUpdate = await shareNoteBookWithUser(notebookId, userId);
        return notebookUpdate;
      })
  );
  const filteredData = data.filter(item => item !== null);
  const numberOfUsersSharedWith = filteredData.length;
  if (numberOfUsersSharedWith === 0)
    throw new BadRequestError("Failed to share notebook");

  return successResponse(
    res,
    StatusCodes.OK,
    `Notebook shared to ${numberOfUsersSharedWith} successfully`
  );
};


export const filterNoteBookByTagNameController = async (
  req: Request,
  res: Response
) => {
  const ownerId = req.currentUser?.id!;
  const { tagName } = req.body;
  const data:FilterData= {
    ownerId,
    tagName
  }
  const notebooks = await filterNoteBookByTagName(req.query,data);
  if (!notebooks.notebooks || notebooks.notebooks.length < 1)
    throw new NotFoundError("No notebook found");
  return successResponse(res, StatusCodes.OK, notebooks);
};


export const deleteNoteBookController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.currentUser?.id!;
  const notebook = await findNoteBookByIdService(id, userId);
  if (!notebook) throw new BadRequestError("Invalid Notebook ID");
  const deletedNotebook = await deleteNoteBookService(id);
  return successResponse(res, StatusCodes.OK, deletedNotebook);
};