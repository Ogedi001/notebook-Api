import { NoteBook, Privacy } from "@prisma/client";
import { prisma } from "../client";
import { NoteBookInputData, Pagination_Notebook, SharedUsers, Tag } from "../interface";


export type NotebooksData = {
  pagination: Pagination_Notebook;
  notebooks: ReturnedNoteBookData[];
};
export type ReturnedNoteBookData = {
  sharedUsers: SharedUsers[];
  tags: Tag[];
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
        connectOrCreate:
          tags &&
          tags
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
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      sharedUsers: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
  });
};

export const getNoteBooksQueryService = async (
  query: any,
  ownerId: string
):Promise<NotebooksData>=> {
  let limit = parseInt(query.limit || "10");
  let page = parseInt(query.page || "1");
  let startIndex = (page - 1) * limit;

  let filterQuery: any;
  filterQuery = {
    title: query.title,
  };
  const notebooks = await prisma.noteBook.findMany({
    where: {
      ownerId,
      ...filterQuery,
    },
    include:{
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      sharedUsers: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },

    skip: startIndex,
    take: limit,
  });
  //@desc  getting total users and pages for pagination
  const totalNotebooks = await prisma.noteBook.count({
    where: { ...filterQuery, ownerId },
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
):Promise<ReturnedNoteBookData>=> {
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
    include: {
      tags: {
      select: {
        id: true,
        name: true,
      },
    },
    sharedUsers: {
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    },},
  });

  return updatedNotebook;
};

export const shareNoteBookWithUser = async (
  id: string,
  userId: string
): Promise<ReturnedNoteBookData> => {
  return await prisma.noteBook.update({
    where: { id },
    data: {
      sharedUsers: {
        connect: { id: userId },
      },
    },
    include:{
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      sharedUsers: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    }
  });
};

export const deleteNoteBookService = async (id: string): Promise<NoteBook> => {
  return await prisma.noteBook.delete({
    where: { id: id },
  });
};