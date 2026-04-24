import type {
  ApiResponse,
  BookDetail,
  DisplayBookDetail,
} from "../types/book.d.ts";
import { API_URL } from "./config.js";

const params = new URLSearchParams(window.location.search);
const isbn = params.get("isbn");

// Create a detail page for each book. All required information in the template file src/detail.html should be displayed on this page.

async function fetchDisplayBookDetail(
  isbn: string,
): Promise<DisplayBookDetail | null> {
  let bookDetail: ApiResponse<BookDetail> = null;
  try {
    const response = await fetch(API_URL + "/books/" + isbn, { method: "GET" });
    bookDetail = (await response.json()) as ApiResponse<BookDetail>;
  } catch (error) {
    console.error("Error fetching book detail: ", error);
  }
  if (!bookDetail) {
    return null;
  }
  const displayBookDetail: DisplayBookDetail = {
    title: bookDetail.title,
    subtitle: bookDetail.subtitle,
    abstract: bookDetail.abstract,
    author: bookDetail.author,
    publisher: bookDetail.publisher,
    numPages: bookDetail.numPages,
  };

  return displayBookDetail;
}

export async function initDetail() {
  const mainElement = document.querySelector("main.container") as HTMLElement;
  mainElement.innerHTML = "";

  if (!isbn) {
    return;
  }

  const displayBookDetail = await fetchDisplayBookDetail(isbn);
  if (!displayBookDetail) {
    // TODO: show an empty template book detail
    return;
  }
  const detailContainerHTML = `
        <h1>
            ${displayBookDetail.title}<br>
            <small>${displayBookDetail.subtitle}</small>
        </h1>
        <section class="row">
            <div class="column column-67">
            <h3>Abstract</h3>
            <p>
                ${displayBookDetail.abstract}
            </p>

            <h4>Details</h4>
            <ul>
                <li><strong>Author:</strong> ${displayBookDetail.author}</li>
                <li><strong>Publisher:</strong> ${displayBookDetail.publisher}</li>
                <li><strong>Pages:</strong> ${displayBookDetail.numPages}</li>
            </ul>

            <button class="button button-outline" onclick="location.href = 'index.html'">
                Back
            </button>
            </div>
            <div class="column column-33">
            <img src="images/1001606140805.png" alt="">
            </div>
        </section>
    `;
  mainElement.innerHTML = detailContainerHTML;
}
