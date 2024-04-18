import { Request, Response } from "express";

import * as notebookService from "./../service/notebook-service";
import {
  createNoteBookController,
  deleteNoteBookController,
  getAllNoteBooksQuerySearch,
  getNoteBookByIdServiceController,
  updateNoteBookController,
} from "../controller/notebook-controller";
import { NoteBook } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

jest.mock("./../service/notebook-service.ts");
jest.mock("../utils/redis.ts", () => ({
  redisClient: jest.fn(),
}));
//arrange, act,assert

const mockNotebook: NoteBook = {
  id: "1",
  title: "Test Notebook",
  content: "Test Content",
  ownerId: "userss",
  privacy: "PRIVATE",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Notebook Controller", () => {
  describe("createNotebookController", () => {
    it("It should create a new Notebook sucessfully", async () => {
      const req = {
        body: { title: "Test Notebook", content: "Test Content" },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (
        notebookService.createNoteBookService as jest.Mock
      ).mockResolvedValueOnce(mockNotebook);

      await createNoteBookController(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: mockNotebook,
        message: "success",
      });
    });
  });

  describe("getNoteBookByIdServiceController", () => {
    it("it should get existing notebook by Id", async () => {
      (
        notebookService.findNoteBookByIdService as jest.Mock
      ).mockResolvedValueOnce(mockNotebook);
      const req = {
        currentUser: {
          id: "ddd",
        },
        params: { id: "1" },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await getNoteBookByIdServiceController(req, res);
      expect(notebookService.findNoteBookByIdService).toHaveBeenCalledWith("1","ddd");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockNotebook,
        message: "success",
      });
    });
  });

  describe("getAllNoteBooksQuerySearch", () => {
    it(" it should get all notebook and perform search query with notebook title", async () => {
      const mockNotebookArray: notebookService.NotebooksData = {
        pagination: {
          page: 1,
          limit: 10,
          totalPages: 1,
          totalNotebooks: 1,
        },
        notebooks: [
          {
            id: "1",
            title: "Test Notebook",
            content: "Test Content",
            ownerId: "userss",
            privacy: "PRIVATE",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      (
        notebookService.getNoteBooksQueryService as jest.Mock
      ).mockResolvedValueOnce(mockNotebookArray);
      const req = {
        currentUser: {
          id: "ddd",
        },
        query: {},
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      await getAllNoteBooksQuerySearch(req, res);
      expect(notebookService.getNoteBooksQueryService).toHaveBeenCalledWith(
        req.query,
        req.currentUser?.id!
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockNotebookArray,
        message: "success",
      });
    });
  });

  describe("updateNoteBookController", () => {
    it("it should update a notebook by id ", async () => {
      (
        notebookService.findNoteBookByIdService as jest.Mock
      ).mockResolvedValueOnce(mockNotebook);
      (
        notebookService.updateNoteBookService as jest.Mock
      ).mockResolvedValueOnce(mockNotebook);
      const req = {
        currentUser: {
          id: "ddd",
        },
        params: { id: "1" },
        body: { title: "new title", content: "new content" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await updateNoteBookController(req, res);
      
      expect(notebookService.findNoteBookByIdService).toHaveBeenCalledWith("1","ddd");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockNotebook,
        message: "success",
      });
    });
  });

  describe("deleteNoteBookController", () => {
    it("it should delete a notebook by id", async () => {
      (
        notebookService.findNoteBookByIdService as jest.Mock
      ).mockResolvedValueOnce(mockNotebook);
      (
        notebookService.deleteNoteBookService as jest.Mock
      ).mockResolvedValueOnce(mockNotebook);
      const req = {
        currentUser: {
          id: "ddd",
        },
        params: { id: "1" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await deleteNoteBookController(req, res);

      expect(notebookService.findNoteBookByIdService).toHaveBeenCalledWith("1","ddd");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockNotebook,
        message: "success",
      });
    });
  });
});
