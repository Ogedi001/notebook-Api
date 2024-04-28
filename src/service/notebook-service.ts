import { NoteBook, Privacy, Tag, User } from "@prisma/client";
import { prisma } from "../client";
import logger from "../Logger";

export interface NoteBookInputData {
  content: string;
  title: string;
  privacy?: Privacy;
  ownerId: string;
}

// export type NoteBookInputData =Partial<Pick<NoteBook,'privacy'>> & Pick<NoteBook,'title'|'content'|'ownerId'>

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
export type CreatedNoteBookData = {
  tags: Tag[];
} & NoteBook;

export const createNoteBookService = async (
  data: NoteBookInputData,
  tags?: string[]
): Promise<CreatedNoteBookData> => {
  console.log(tags);
  const notebook = await prisma.noteBook.create({
    data: {
      ...data,
      tags: {
        connectOrCreate: tags && tags
        ?.filter((tagName) => tagName.trim())
        .map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
    },
    include: {
      tags: true,
    },
  });
  return notebook;
};



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
  data: NoteBookInputData,
  tags?: string[]
) => {
  if (tags && tags.length > 0) {
    const existingTags = await prisma.tag.findMany({
      where: { notes: { some: { id: id } } },
      select: {
        name: true,
      },
    });
    // get tag in existing tag arry not in incoming tag arry
    const tagToDelete = existingTags.filter(
      (tagName) => !tags.includes(tagName.name)
    );

    if (tagToDelete.length > 0) {
      await prisma.tag.deleteMany({
        where: { name: { in: tagToDelete.map((tag) => tag.name) } },
      });
    }
  }

  
  const updatedNotebook = await prisma.noteBook.update({
    where: { id: id },
    data: {
      ...data,
      tags: {
        connectOrCreate: tags
          ?.filter((tagName) => tagName.trim())
          .map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
      },
    },
    include: { tags: true },
  });

  return updatedNotebook;
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

// connectOrCreate: tags
//           ?.filter((tagName) => tagName.trim())
//           .map((tagName) => ({
//             where: { name: tagName },
//             create: { name: tagName },
//           })),
