document.addEventListener("DOMContentLoaded", () => {
    const booksTableBody = document.getElementById("books-tbody");
    const apiEndpoint = "/api/books";
    const bookForm = document.getElementById("book-form");
    const formTitle = document.getElementById("book-form-title");
    const formButton = document.getElementById("book-form-button");
    const formWidget = document.getElementById("book-form-widget");

    let isEditing = false; // Flaga trybu edycji
    let editingBookId = null; // ID edytowanej książki

    // Pobieranie danych z API
    async function fetchBooks() {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                console.error("Błąd API:", response.statusText);
                return;
            }
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        }
    }

    // Wyświetlanie danych w tabeli
    function displayBooks(books) {
        booksTableBody.innerHTML = "";
        books.forEach(book => {
            const row = `
                <tr>
                    <td>${new Date(book.date).toLocaleDateString()}</td>
                    <td>${book.title}</td>
                    <td>${book.category}</td>
                    <td>${book.rating}</td>
                    <td>
                        <button class="edit-button" data-id="${book.id}">Edit</button>
                        <button class="delete-button" data-id="${book.id}">Delete</button>
                    </td>
                </tr>
            `;
            booksTableBody.insertAdjacentHTML("beforeend", row);
        });

        // Obsługa przycisków "Delete"
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.getAttribute("data-id");
                deleteBook(id);
            });
        });

        // Obsługa przycisków "Edit"
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.getAttribute("data-id");
                editBook(id);
            });
        });
    }

    // Funkcja do usuwania książki
    async function deleteBook(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
            if (!response.ok) {
                console.error("Błąd podczas usuwania książki:", response.statusText);
                return;
            }
            console.log("Książka usunięta!");
            fetchBooks();
        } catch (error) {
            console.error("Błąd podczas usuwania książki:", error);
        }
    }

    // Funkcja do wypełnienia formularza w trybie edycji
    async function editBook(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`);
            if (!response.ok) {
                console.error("Błąd podczas pobierania książki:", response.statusText);
                return;
            }
            const book = await response.json();

            // Wypełnienie formularza
            document.getElementById("book-date").value = book.date.split("T")[0];
            document.getElementById("book-title").value = book.title;
            document.getElementById("book-category").value = book.category;
            document.getElementById("book-rating").value = book.rating;

            // Zmiana trybu na edycję
            formTitle.textContent = "Edit Book";
            formButton.textContent = "Edit";

            formWidget.classList.add("edit-mode");
            formTitle.style.color = "#bd8e0a"
            formButton.classList.add("edit-mode");

            isEditing = true;
            editingBookId = id;
        } catch (error) {
            console.error("Błąd podczas edycji książki:", error);
        }
    }

    // Obsługa przesyłania formularza
    bookForm.addEventListener("submit", async event => {
        event.preventDefault();

        const formData = new FormData(bookForm);
        const book = {
            date: formData.get("date"),
            title: formData.get("title"),
            category: formData.get("category"),
            rating: parseInt(formData.get("rating")),
        };

        try {
            if (isEditing) {
                // Usuwanie starej książki
                await deleteBook(editingBookId);

                // Dodawanie nowej książki
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(book),
                });

                if (!response.ok) {
                    console.error("Błąd podczas zapisu książki:", response.statusText);
                    return;
                }

                console.log("Książka zaktualizowana!");
                isEditing = false;
                editingBookId = null;
                formTitle.textContent = "Add New Book";
                formButton.textContent = "Add";
                formTitle.style.color = "white"

                formWidget.classList.remove("edit-mode");
                formButton.classList.remove("edit-mode");
            } else {
                // Dodawanie nowej książki
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(book),
                });

                if (!response.ok) {
                    console.error("Błąd podczas dodawania książki:", response.statusText);
                    return;
                }

                console.log("Książka dodana!");
            }

            fetchBooks(); // Odśwież tabelę
            bookForm.reset(); // Wyczyść formularz
        } catch (error) {
            console.error("Błąd podczas przesyłania formularza:", error);
        }
    });

    fetchBooks(); // Wywołanie funkcji na starcie
});
