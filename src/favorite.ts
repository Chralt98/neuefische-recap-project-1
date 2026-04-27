import type { DisplayBook } from "../types/book.d.ts";
import {
  fetchDisplayBooks,
  addSelectors,
  createBookListItem,
} from "./index.js";
import { FAVORITE_BOOKS_KEY } from "./config.js";

const REMOVE_FAVORITE_SYMBOL = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="fav"
  >
    <path
      fill-rule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clip-rule="evenodd"
    />
  </svg>
`;

let allBooks: DisplayBook[] = [];
let searchQuery = "";
let selectedPublisher = "-";

function updateFavoriteCount(count: number) {
  const favoriteHeading = document.querySelector(
    "main.container > h2",
  ) as HTMLHeadingElement;
  if (favoriteHeading) {
    favoriteHeading.textContent = `${count} Favorites on your list`;
  }
  const navNumber = document.querySelector(
    ".mainnav-number",
  ) as HTMLSpanElement;
  if (navNumber) {
    navNumber.textContent = `${count}`;
  }
}

function handleRemoveButton(
  bookListItem: HTMLTableRowElement,
  book: DisplayBook,
) {
  const favBtn = bookListItem.querySelector(".fav-btn") as HTMLButtonElement;
  favBtn.addEventListener("click", (event: MouseEvent) => {
    const storedBooks = localStorage.getItem(FAVORITE_BOOKS_KEY);
    let favoriteBooks: string[] = storedBooks ? JSON.parse(storedBooks) : [];
    favoriteBooks = favoriteBooks.filter((isbn) => isbn !== book.isbn);
    console.log(favoriteBooks);
    updateFavoriteCount(favoriteBooks.length);
    localStorage.setItem(FAVORITE_BOOKS_KEY, JSON.stringify(favoriteBooks));
    bookListItem.remove();
  });
}

const bookList = document.querySelector("tbody") as HTMLTableSectionElement;

function fillBookList(displayBooks: DisplayBook[]) {
  bookList.innerHTML = "";

  displayBooks.forEach((book) => {
    const bookListItem = createBookListItem(book, REMOVE_FAVORITE_SYMBOL);
    handleRemoveButton(bookListItem, book);
    bookList.append(bookListItem);
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

export async function initFavorite() {
  allBooks = await fetchDisplayBooks();
  const storedBooks = localStorage.getItem(FAVORITE_BOOKS_KEY);
  const favoriteBooks: string[] = storedBooks ? JSON.parse(storedBooks) : [];
  allBooks = allBooks.filter((book) => favoriteBooks.includes(book.isbn));
  updateFavoriteCount(favoriteBooks.length);
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
