type Book = {
  title: string;
  subtitle: string;
  isbn: string;
  abstract: string;
  numPages: number;
  author: string;
  publisher: string;
  price: string;
  cover: string;
};

export type DisplayBook = Pick<Book, "title" | "isbn" | "author" | "publisher">;

type Liked = {
  isLiked: boolean;
};

export type DisplayBookWithLike = DisplayBook & Liked;

type EntityId = { id: string };
type UserId = { userId: number };

export type BookDetail = EntityId & Book & UserId;

export type DisplayBookDetail = Pick<
  BookDetail,
  "title" | "subtitle" | "abstract" | "author" | "publisher" | "numPages"
>;

export type ApiResponse<T> = T | null;
