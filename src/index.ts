import type { Book, ApiResponse, DisplayBook } from "../types/book.d.ts";

const API_URL = "http://localhost:4730";

async function fetchDisplayBooks(): Promise<DisplayBook[]> {
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
  const unliked = `
        <button class="button button-clear fav-btn">
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
        </button>
  `;
  const liked = `
        <button class="button button-clear fav-btn">
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
        </button>
  `;
  const trColumn = `
        <td>
            ${unliked}
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
    const bookListItem = createBookListItem(book);
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

let displayBooks: DisplayBook[] = await fetchDisplayBooks();
addSelectors(displayBooks);

let searchQuery = "";
let selectedPublisher = "-";

function applyFilters() {
  const filtered = displayBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedPublisher === "-" ||
        book.publisher.toLowerCase() === selectedPublisher),
  );
  fillBookList(filtered);
}

const searchInput = document.getElementById("search") as HTMLInputElement;
searchInput.addEventListener("input", (event: InputEvent) => {
  searchQuery = (event.currentTarget as HTMLInputElement).value;
  applyFilters();
});

selectPublisher.addEventListener("change", (event: Event) => {
  selectedPublisher = (event.currentTarget as HTMLSelectElement).value;
  applyFilters();
});

applyFilters();
