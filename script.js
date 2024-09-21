const title = document.querySelector('#title');
const author = document.querySelector('#author');
const year = document.querySelector('#year');
const btn = document.querySelector('.btn');
const booklist = document.querySelector('#book-list');
const bookCount = document.querySelector('#book-count'); // Assuming you have a place to show total books

// Load books from localStorage on page load
window.addEventListener('DOMContentLoaded', loadBooksFromStorage);

// Event listener for adding a book
btn.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (title.value === '' || author.value === '' || year.value === '') {
    alert('Please input your information');
  } else {
    const book = {
      title: title.value,
      author: author.value,
      year: year.value,
      finished: false // Default is not finished
    };

    // Add book to the DOM
    addBookToTable(book);

    // Add book to localStorage
    addBookToStorage(book);

    // Show Toastify alert for new book added
    showToast('Book added successfully!', 'green');

    // Update the total number of books
    updateBookCount();

    // Clear input fields
    title.value = '';
    author.value = '';
    year.value = '';
  }
});

// Function to add a book to the table
function addBookToTable(book) {
  const newRow = document.createElement('tr');

  // Title column
  const newTitle = document.createElement('td');
  newTitle.innerHTML = book.title;
  newRow.appendChild(newTitle);

  // Author column
  const newAuthor = document.createElement('td');
  newAuthor.innerHTML = book.author;
  newRow.appendChild(newAuthor);

  // Year column
  const newYear = document.createElement('td');
  newYear.innerHTML = book.year;
  newRow.appendChild(newYear);

  // Finished reading checkbox
  const finishedCell = document.createElement('td');
  const finishedCheckbox = document.createElement('input');
  finishedCheckbox.type = 'checkbox';
  finishedCheckbox.checked = book.finished; // Set checkbox status based on book.finished
  finishedCheckbox.addEventListener('change', () => {
    // Update finished status in localStorage
    toggleFinishedStatus(book);
    
    // Show Toastify alert for book marked as finished
    if (finishedCheckbox.checked) {
      showToast('Book marked as finished!', 'blue');
    } else {
      showToast('Book marked as unfinished.', 'orange');
    }
  });
  finishedCell.appendChild(finishedCheckbox);
  newRow.appendChild(finishedCell);

  // Delete button
  const deleteCell = document.createElement('td');
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteCell.appendChild(deleteBtn);
  newRow.appendChild(deleteCell);

  // Append the new row to the book list
  booklist.appendChild(newRow);

  // Add event listener to delete the row and remove from localStorage
  deleteBtn.addEventListener('click', function () {
    // Remove from the DOM
    booklist.removeChild(newRow);

    // Remove from localStorage
    removeBookFromStorage(book);

    // Show Toastify alert for book deleted
    showToast('Book deleted successfully!', 'red');

    // Update the total number of books
    updateBookCount();
  });
}

// Function to update the total number of books
function updateBookCount() {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  bookCount.textContent = `Total Books: ${books.length}`;
}

// Function to add a book to localStorage
function addBookToStorage(book) {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
}

// Function to remove a book from localStorage
function removeBookFromStorage(bookToRemove) {
  let books = JSON.parse(localStorage.getItem('books')) || [];
  books = books.filter(book => 
    !(book.title === bookToRemove.title && book.author === bookToRemove.author && book.year === bookToRemove.year)
  );
  localStorage.setItem('books', JSON.stringify(books));
}

// Function to toggle the finished status of a book
function toggleFinishedStatus(bookToToggle) {
  let books = JSON.parse(localStorage.getItem('books')) || [];
  books = books.map(book => {
    if (book.title === bookToToggle.title && book.author === bookToToggle.author && book.year === bookToToggle.year) {
      book.finished = !book.finished; // Toggle the finished status
    }
    return book;
  });
  localStorage.setItem('books', JSON.stringify(books));
}

// Function to load books from localStorage on page load
function loadBooksFromStorage() {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  books.forEach(book => addBookToTable(book));
  updateBookCount(); // Update book count after loading books
}

// Toastify alert function
function showToast(message, color) {
  Toastify({
    text: message,
    duration: 3000, // 3 seconds
    close: true,
    gravity: "top", // Position the toast at the top
    position: "right", // Display on the right side of the screen
    backgroundColor: color, // Color based on the action
  }).showToast();
}
