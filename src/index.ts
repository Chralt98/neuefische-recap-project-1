import type {
  Book,
  ApiResponse,
  DisplayBook,
  DisplayBookWithLike,
} from "../types/book.d.ts";
import { API_URL } from "./config.js";

let allBooks: DisplayBook[] = [];
let searchQuery = "";
let selectedPublisher = "-";

async function fetchDisplayBooks(): Promise<DisplayBook[]> {
  let data: ApiResponse<Book[]> = null;
  try {
    const response = await fetch(API_URL + "/books", { method: "GET" });
    data = (await response.json()) as ApiResponse<Book[]>;
  } catch (error) {
    console.error("Error fetching books: ", error);
  }
  if (!data) {
    return [];
  }
  const displayBooks: DisplayBook[] = data.map((book) => ({
    title: book.title,
    isbn: book.isbn,
    author: book.author,
    publisher: book.publisher,
  }));

  return displayBooks;
}

function toggleLikeButton(book: DisplayBookWithLike) {
  book.isLiked = !book.isLiked;
}

function createBookListItem(book: DisplayBookWithLike): HTMLTableRowElement {
  const unliked = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="fav"
        >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
        </svg>
  `;
  const liked = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="fav"
        >
            <path
            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            />
        </svg>
  `;
  const trColumn = `
        <td>
            <button class="button button-clear fav-btn" onclick="${toggleLikeButton(book)}">
                ${book.isLiked ? liked : unliked}
            </button>
        </td>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td>
            <button class="button" onclick="location.href = 'detail.html?isbn=${book.isbn}'">
            Detail
            </button>
        </td>
        `;
  const tableItem = document.createElement("tr");
  tableItem.innerHTML = trColumn;
  return tableItem;
}

const selectPublisher = document.getElementById(
  "by-publisher",
) as HTMLSelectElement;

function createSelectorItem(publisher: string): HTMLOptionElement {
  const selectorItem = document.createElement("option");
  selectorItem.value = publisher.toLowerCase();
  selectorItem.text = publisher;
  return selectorItem;
}

const bookList = document.querySelector("tbody") as HTMLTableSectionElement;

function fillBookList(displayBooks: DisplayBook[]) {
  bookList.innerHTML = "";

  displayBooks.forEach((book) => {
    const bookListItem = createBookListItem({ ...book, isLiked: false });
    bookList.append(bookListItem);
  });
}

function addSelectors(allDisplayBooks: DisplayBook[]) {
  selectPublisher.innerHTML = `<option value="-">-</option>`;
  let selectors = new Set<string>();
  allDisplayBooks.forEach((book) => {
    if (!selectors.has(book.publisher)) {
      const selectorItem = createSelectorItem(book.publisher);
      selectPublisher.append(selectorItem);
      selectors.add(book.publisher);
    }
  });
}

function applyFilters() {
  const filtered = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedPublisher === "-" ||
        book.publisher.toLowerCase() === selectedPublisher),
  );
  fillBookList(filtered);
}

export async function init() {
  allBooks = await fetchDisplayBooks();
  addSelectors(allBooks);
  const searchInput = document.getElementById("search") as HTMLInputElement;
  searchInput.addEventListener("input", (e) => {
    searchQuery = (e.currentTarget as HTMLInputElement).value;
    applyFilters();
  });
  const selectPublisher = document.getElementById(
    "by-publisher",
  ) as HTMLSelectElement;
  selectPublisher.addEventListener("change", (e) => {
    selectedPublisher = (e.currentTarget as HTMLSelectElement).value;
    applyFilters();
  });

  applyFilters();
}
