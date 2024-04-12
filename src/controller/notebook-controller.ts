import { Request, Response, NextFunction } from "express";
import {
  createNoteBookService,
  deleteNoteBookService,
  findNoteBookByIdService,
  getNoteBooksQueryService,
  NoteBookInputData,
  updateNoteBookService,
} from "../service/notebook-service";
import { successResponse } from "../helpers/success-response";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

export const createNoteBookController = async (req: Request, res: Response) => {
  const { title, content } = req.body as { title: string; content: string };
  const userId= req.currentUser?.id!
  const data:NoteBookInputData = { title,content,userId };
  const notebook = await createNoteBookService(data);
  return successResponse(res, StatusCodes.CREATED, notebook);
};

export const getNoteBookByIdServiceController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const notebook = await findNoteBookByIdService(id);
  if (!notebook){
    throw new BadRequestError("Invalid Notebook ID");
  } 
  return successResponse(res, StatusCodes.OK, notebook);
};


export const getAllNoteBooksQuerySearch = async (
  req: Request,
  res: Response
) => {
  const notebooks = await getNoteBooksQueryService(req.query);
  if (!notebooks || notebooks.length < 1)
    throw new NotFoundError("No notebook found");
  return successResponse(res, StatusCodes.OK, notebooks);
};

export const updateNoteBookController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body as { title: string; content: string };
  const userId= req.currentUser?.id!
  const data = { title, content,userId };
  const notebook = await findNoteBookByIdService(id);
  if (!notebook) throw new BadRequestError("Invalid Notebook ID");
  const updatedNotebook = await updateNoteBookService(id, data);
  return successResponse(res, StatusCodes.OK, updatedNotebook);
};

export const deleteNoteBookController= async (req: Request, res: Response) => {
  const { id } = req.params;
  const notebook = await findNoteBookByIdService(id);
  if (!notebook)throw new BadRequestError("Invalid Notebook ID");
  const deletedNotebook = await deleteNoteBookService(id);
  return successResponse(res, StatusCodes.OK, deletedNotebook);
};
