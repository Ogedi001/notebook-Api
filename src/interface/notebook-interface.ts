import { Privacy } from "@prisma/client";

export interface NoteBookInputData {
  content: string;
  title: string;
  privacy?: Privacy;
  ownerId: string;
}

export interface Pagination_Notebook {
  page: number;
  limit: number;
  totalPages: number;
  totalNotebooks: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface NoteBookRequestBody {
  title: string;
  content: string;
  privacy: Privacy;
  tags: string[];
}

export interface OwnedNotebook {
  id: string;
  title: string;
  content: String;
  privacy: Privacy;
  ownerId?: String;
  tags:Tag[]
}

export interface SharedNotebook {
    id: string;
    title: string;
    content: String;
    privacy: Privacy;
    ownerId: String;
    tags:Tag[]
  }
