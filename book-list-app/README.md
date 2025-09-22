# Book List App

## Overview
The Book List App is a simple web application that displays a list of books in a nicely formatted table. The application fetches book data from a JSON file and sorts the books in reverse chronological order based on the date of purchase.

## Project Structure
```
book-list-app
├── src
│   ├── index.html        # Main HTML document
│   ├── styles
│   │   └── main.css      # Styles for the application
│   ├── scripts
│   │   └── app.js        # JavaScript code for fetching and displaying books
│   └── assets
│       └── books.json    # Local copy of the JSON data
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, etc.)
- A local server (optional, for testing purposes)

### Running the Application
1. Clone the repository or download the project files.
2. Open the `index.html` file in your web browser. If you are using a local server, serve the `src` directory.
3. The application will fetch the book data from `books.json` and display it in a table sorted by the date of purchase.

### Functionality
- The application fetches book data from a local JSON file.
- Books are displayed in a table format.
- The table is sorted in reverse chronological order by the date of purchase.

## License
This project is open-source and available under the MIT License.