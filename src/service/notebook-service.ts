import { NoteBook } from "@prisma/client";
import { prisma } from "../client";

export interface NoteBookInputData {
  content: string;
  title: string;
  userId: string;
}
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
  id: string
): Promise<NoteBook | null> => {
  return await prisma.noteBook.findUnique({
    where: { id: id },
  });
};

export const getNoteBooksQueryService = async (
  query: any
): Promise<NoteBook[]> => {
  let filterQuery: any;
  filterQuery = {
    title: query.title,
  };
  return await prisma.noteBook.findMany({
    where: {
      ...filterQuery,
    },
  });
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
