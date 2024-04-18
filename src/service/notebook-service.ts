import { NoteBook, Tag, User } from "@prisma/client";
import { prisma } from "../client";
import { skip } from "node:test";

export interface NoteBookInputData {
  content: string;
  title: string;
  ownerId: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalNotebooks: number;
}
export type NotebooksData = {
  pagination: Pagination;
  notebooks: NoteBook[];
};
export type ReturnedNoteBookData = {
  sharedUsers: User[];
} & NoteBook;
export type CreatedNoteBookData ={
  tags:Tag[]
}& NoteBook


export const createNoteBookService = async (
  data: NoteBookInputData
):Promise<CreatedNoteBookData> => {
  const notebook = await prisma.noteBook.create({
    data: {
      ...data,
    },
    include:{
      tags:true
    }
  });
  return notebook;
};

export const createTagService = async (name:string,id:string):Promise<Tag>=>{
  return await prisma.tag.create({
    data:{
      name,
      notes:{
        connect:{id}
      }
    }
  })
}


export const findNoteBookByIdService = async (
  id: string,
  ownerId: string
): Promise<ReturnedNoteBookData | null> => {
  return await prisma.noteBook.findUnique({
    where: { id: id, ownerId },
    include: {
      sharedUsers: true,
    },
  });
};

export const getNoteBooksQueryService = async (
  query: any,
  userId: string
): Promise<NotebooksData> => {
  let limit = parseInt(query.limit || "10");
  let page = parseInt(query.page || "1");
  let startIndex = (page - 1) * limit;

  let filterQuery: any;
  filterQuery = {
    title: query.title,
  };
  const notebooks = await prisma.noteBook.findMany({
    where: {
      userId,
      ...filterQuery,
    },
    skip: startIndex,
    take: limit,
  });
  //@desc  getting total users and pages for pagination
  const totalNotebooks = await prisma.noteBook.count({
    where: { ...filterQuery, userId },
  });
  const totalPages = Math.ceil(totalNotebooks / limit);
  return {
    pagination: {
      page,
      limit,
      totalPages,
      totalNotebooks,
    },
    notebooks,
  };
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

export const shareNoteBookWithUser = async (
  id: string,
  userId: string
): Promise<NoteBook> => {
  return await prisma.noteBook.update({
    where: { id },
    data: {
      sharedUsers: {
        connect: { id: userId },
      },
    },
  });
};

export const deleteNoteBookService = async (id: string): Promise<NoteBook> => {
  return await prisma.noteBook.delete({
    where: { id: id },
  });
};
