export type Book = {
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

export type ApiResponse<T> = T;
