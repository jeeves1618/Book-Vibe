let allBooks = [];

async function loadAndDisplayBooks() {
  const url =
    "https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/refs/heads/master/Librarian%202.0/src/main/resources/book-list.json";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const books = await response.json();

    // Sort books in reverse chronological order of dateOfPurchase
    books.sort(
      (a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase)
    );

    allBooks = books; // Store for filtering
    renderBooks(books);

    // Add search event listener
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        const filtered = allBooks.filter((book) => {
          const title = (book.bookTitle || "").toLowerCase();
          const authorFirst = (book.authorFirstName || "").toLowerCase();
          const authorLast = (book.authorLastName || "").toLowerCase();
          const genre = (book.bookGenre || "").toLowerCase();
          return (
            title.includes(query) ||
            authorFirst.includes(query) ||
            authorLast.includes(query) ||
            genre.includes(query)
          );
        });
        renderBooks(filtered);
      });
    }
  } catch (error) {
    const tbody = document.getElementById("book-table-body");
    tbody.innerHTML = `<tr><td colspan="5">Failed to load books: ${error.message}</td></tr>`;
  }
}

function renderBooks(books) {
  const tbody = document.getElementById("book-table-body");
  tbody.innerHTML = "";

  // Group books by year
  const booksByYear = {};
  books.forEach((book) => {
    const year = new Date(book.dateOfPurchase).getFullYear();
    if (!booksByYear[year]) booksByYear[year] = [];
    booksByYear[year].push(book);
  });

  // Sort years in descending order
  const years = Object.keys(booksByYear)
    .map(Number)
    .sort((a, b) => b - a);

  let serialNumber = books.length;
  years.forEach((year) => {
    // Year header row
    const yearRow = document.createElement("tr");
    yearRow.style.background = "#e8e8e8";
    yearRow.style.fontWeight = "bold";
    yearRow.innerHTML = `<td colspan="5">${year} &mdash; ${booksByYear[year].length} book(s)</td>`;
    tbody.appendChild(yearRow);

    booksByYear[year].forEach((book) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${serialNumber--}</td>
        <td>${book.bookTitle}</td>
        <td>${book.authorFirstName} ${book.authorLastName}</td>
        <td>${book.bookGenre}</td>
        <td>${book.dateOfPurchase}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}
