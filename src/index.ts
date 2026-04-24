import type { Book, ApiResponse, DisplayBook } from "../types/book.d.ts";

const API_URL = "http://localhost:4730";

async function displayBooks(): Promise<DisplayBook[]> {
  var data: ApiResponse<Book[]> = [];
  try {
    const response = await fetch(API_URL + "/books", { method: "GET" });
    data = (await response.json()) as ApiResponse<Book[]>;
  } catch (error) {
    console.error("Error fetching books: ", error);
  }
  const displayBooks: DisplayBook[] = data.map((book) => ({
    title: book.title,
    isbn: book.isbn,
    author: book.author,
    publisher: book.publisher,
  }));

  return displayBooks;
}

function createBookListItem(book: DisplayBook): HTMLTableRowElement {
  const trColumn = `
        <td>
            <button class="button button-clear fav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fav">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
            </svg>
            </button>
        </td>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td>
            <button class="button" onclick="location.href = 'detail.html'">
            Detail
            </button>
        </td>
        `;
  const tableItem = document.createElement("tr");
  tableItem.innerHTML = trColumn;
  return tableItem;
}

async function fillBookList() {
  const bookList = document.querySelector("tbody") as HTMLTableSectionElement;
  const books = await displayBooks();

  books
    .map((book) => createBookListItem(book))
    .forEach((listItem) => bookList.append(listItem));
}

fillBookList();
// console.log("Fetching books...");
// console.log(await displayBooks());

// async function createBook(payload: BookCreatePayload): Promise<ApiResponse<Book>> {
//   const response = await fetch("/api/books", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
//   return (await response.json()) as ApiResponse<Book>;
// }
