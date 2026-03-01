let allBooks = [];

// helper to convert formatted currency strings to numbers (removes symbols/commas)
// still available in case other fields need it, but sums use numeric cost
function parseCurrency(str) {
  if (!str) return 0;
  const num = str.replace(/[^0-9.-]+/g, "");
  return parseFloat(num) || 0;
}

// format number using Indian currency conventions (₹, lakh/crore grouping)
function formatIndianCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

async function loadAndDisplayBooks() {
  const url =
    "https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/refs/heads/master/Librarian%202.0/src/main/resources/book-list.json";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const books = await response.json();

    // Use dateOfReading unless it's "0001-01-01", then use dateOfPurchase
    books.forEach((book) => {
      book._sortDate =
        book.dateOfReading && book.dateOfReading !== "0001-01-01"
          ? book.dateOfReading
          : book.dateOfPurchase;
    });

    // Sort books in reverse chronological order of the chosen date
    books.sort((a, b) => new Date(b._sortDate) - new Date(a._sortDate));

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
    tbody.innerHTML = `<tr><td colspan="7">Failed to load books: ${error.message}</td></tr>`;
  }
}

function renderBooks(books) {
  const tbody = document.getElementById("book-table-body");
  tbody.innerHTML = "";

  // Group books by year (from _sortDate)
  const booksByYear = {};
  books.forEach((book) => {
    const year = new Date(book._sortDate).getFullYear();
    if (!booksByYear[year]) booksByYear[year] = [];
    booksByYear[year].push(book);
  });

  // Sort years in descending order
  const years = Object.keys(booksByYear)
    .map(Number)
    .sort((a, b) => b - a);

  let serialNumber = books.length;
  years.forEach((year) => {
    const yearBooks = booksByYear[year];
    // compute total cost for the year using numeric cost field
    const totalCost = yearBooks.reduce(
      (sum, b) => sum + (parseFloat(b.costInLocalCurrency) || 0),
      0,
    );

    // Year header row
    const yearRow = document.createElement("tr");
    yearRow.style.background = "#e8e8e8";
    yearRow.style.fontWeight = "bold";
    yearRow.innerHTML = `<td colspan="7">${year} &mdash; ${yearBooks.length} book(s) &mdash; total cost: ${formatIndianCurrency(
      totalCost,
    )}</td>`;
    tbody.appendChild(yearRow);

    yearBooks.forEach((book) => {
      const tr = document.createElement("tr");
      // Add shoppingUrl as link to title, open in new window if available
      const titleCell = book.shoppingUrl
        ? `<a href="${book.shoppingUrl}" target="_blank" rel="noopener noreferrer">${book.bookTitle}</a>`
        : book.bookTitle;
      tr.innerHTML = `
        <td>${serialNumber--}</td>
        <td>${titleCell}</td>
        <td>${book.authorFirstName} ${book.authorLastName}</td>
        <td>${book.bookGenre}</td>
        <td>${book.typeOfBinding || ""}</td>
        <td>${book.costInLocalCurrencyFmtd || ""}</td>
        <td>${book._sortDate}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}
