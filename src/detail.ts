import type {
  Book,
  ApiResponse,
  BookDetail,
  DisplayBookDetail,
} from "../types/book.d.ts";
import { API_URL } from "./index.js";

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

console.log(fetchDisplayBookDetail("9781787125421"));
