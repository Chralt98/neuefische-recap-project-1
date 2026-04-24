import type { Book, ApiResponse, DisplayBook } from "../types/book.d.ts";

const API_URL = "http://localhost:4730";

async function displayBooks(): Promise<DisplayBook[]> {
  const response = await fetch(API_URL + "/books", { method: "GET" });
  const data = (await response.json()) as ApiResponse<Book[]>;
  const displayBooks: DisplayBook[] = data.map((book) => ({
    title: book.title,
    isbn: book.isbn,
    author: book.author,
    publisher: book.publisher,
  }));

  return displayBooks;
}

console.log("Fetching books...");

console.log(await displayBooks());

// async function createBook(payload: BookCreatePayload): Promise<ApiResponse<Book>> {
//   const response = await fetch("/api/books", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
//   return (await response.json()) as ApiResponse<Book>;
// }
