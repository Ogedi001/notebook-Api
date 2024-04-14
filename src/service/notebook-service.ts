import { NoteBook } from "@prisma/client";
import { prisma } from "../client";
import { skip } from "node:test";

export interface NoteBookInputData {
  content: string;
  title: string;
  userId: string;
}

interface Pagination{
  page: number;
  limit: number;
  totalPages: number;
  totalNotebooks: number;
};
export type NotebooksData = {
  pagination: Pagination;
  notebooks: NoteBook[];
};

export const createNoteBookService = async (
  data: NoteBookInputData
): Promise<NoteBook> => {
  const notebook = await prisma.noteBook.create({
    data: {
      ...data,
    },
  });
  return notebook;
};

export const findNoteBookByIdService = async (
  id: string,
  userId:string
): Promise<NoteBook | null> => {
  return await prisma.noteBook.findUnique({
    where: { id: id,userId },
  });
};

export const getNoteBooksQueryService = async (
  query: any,userId:string
):Promise<NotebooksData>=> {
  let limit = parseInt(query.limit||'10')
  let page = (parseInt(query.page||'1'))
  let startIndex= (page -1)*limit
 

  let filterQuery: any;
  filterQuery = {
    title: query.title,
  };
  const notebooks = await prisma.noteBook.findMany({
    where: {
  userId,
  ...filterQuery,
    },
    skip:startIndex,
    take:limit
  });
  //@desc  getting total users and pages for pagination
  const totalNotebooks = await prisma.noteBook.count({where:{...filterQuery,userId}})
  const totalPages = Math.ceil(totalNotebooks / limit)
  return {
  pagination:{
      page,
      limit,
      totalPages,
      totalNotebooks,
  },
  notebooks
}
};
export const updateNoteBookService = async (
  id: string,
  data: NoteBookInputData
): Promise<NoteBook> => {
  return await prisma.noteBook.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });
};

export const deleteNoteBookService = async (id: string): Promise<NoteBook> => {
  return  await prisma.noteBook.delete({
    where: { id: id },
  });
};
