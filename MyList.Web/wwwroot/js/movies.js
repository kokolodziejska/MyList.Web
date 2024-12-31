document.addEventListener("DOMContentLoaded", () => {
    const moviesTableBody = document.getElementById("movies-tbody");
    const apiEndpoint = "/api/movies";
    const movieForm = document.getElementById("movie-form");
    const formTitle = document.getElementById("form-title");
    const formButton = document.getElementById("form-button");
    const formWidget = document.getElementById("movie-form-widget");

    let isEditing = false; // Flaga trybu edycji
    let editingMovieId = null; // ID edytowanego filmu

    // Pobieranie danych z API
    async function fetchMovies() {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                console.error("Błąd API:", response.statusText);
                return;
            }
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        }
    }

    // Wyświetlanie danych w tabeli
    function displayMovies(movies) {
        moviesTableBody.innerHTML = "";
        movies.forEach(movie => {
            const row = `
                <tr>
                    <td>${new Date(movie.date).toLocaleDateString()}</td>
                    <td>${movie.title}</td>
                    <td>${movie.category}</td>
                    <td>${movie.rating}</td>
                    <td>
                        <button class="edit-button" data-id="${movie.id}">Edit</button>
                        <button class="delete-button" data-id="${movie.id}">Delete</button>
                    </td>
                </tr>
            `;
            moviesTableBody.insertAdjacentHTML("beforeend", row);
        });

        // Obsługa przycisków "Delete"
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.getAttribute("data-id");
                deleteMovie(id);
            });
        });

        // Obsługa przycisków "Edit"
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.getAttribute("data-id");
                editMovie(id);
            });
        });
    }

    // Funkcja do usuwania filmu
    async function deleteMovie(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
            if (!response.ok) {
                console.error("Błąd podczas usuwania filmu:", response.statusText);
                return;
            }
            console.log("Film usunięty!");
            fetchMovies();
        } catch (error) {
            console.error("Błąd podczas usuwania filmu:", error);
        }
    }

    // Funkcja do wypełnienia formularza w trybie edycji
    async function editMovie(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`);
            if (!response.ok) {
                console.error("Błąd podczas pobierania filmu:", response.statusText);
                return;
            }
            const movie = await response.json();

            // Wypełnienie formularza
            document.getElementById("date").value = movie.date.split("T")[0];
            document.getElementById("title").value = movie.title;
            document.getElementById("category").value = movie.category;
            document.getElementById("rating").value = movie.rating;

            // Zmiana trybu na edycję
            formTitle.textContent = "Edit Movie";
            formTitle.style.color = "#bd8e0a"
            formButton.textContent = "Edit";

            formWidget.classList.add("edit-mode");
            formButton.classList.add("edit-mode");

            isEditing = true;
            editingMovieId = id; // Przechowaj ID edytowanego filmu
        } catch (error) {
            console.error("Błąd podczas edycji filmu:", error);
        }
    }

    // Obsługa przesyłania formularza
    movieForm.addEventListener("submit", async event => {
        event.preventDefault();

        const formData = new FormData(movieForm);
        const movie = {
            date: formData.get("date"),
            title: formData.get("title"),
            category: formData.get("category"),
            rating: parseInt(formData.get("rating")),
        };

        try {
            if (isEditing) {
                // Usuwanie starego filmu
                await deleteMovie(editingMovieId);

                // Dodawanie nowego filmu
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movie),
                });

                if (!response.ok) {
                    console.error("Błąd podczas zapisu filmu:", response.statusText);
                    return;
                }

                console.log("Film zaktualizowany!");
                isEditing = false;
                editingMovieId = null;
                formTitle.textContent = "Add New Movie";
                formTitle.style.color = "white"
                formButton.textContent = "Add";

                formWidget.classList.remove("edit-mode");
                formButton.classList.remove("edit-mode");

            } else {
                // Dodawanie nowego filmu
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movie),
                });

                if (!response.ok) {
                    console.error("Błąd podczas dodawania filmu:", response.statusText);
                    return;
                }

                console.log("Film dodany!");
            }

            fetchMovies(); // Odśwież tabelę
            movieForm.reset(); // Wyczyść formularz
        } catch (error) {
            console.error("Błąd podczas przesyłania formularza:", error);
        }
    });

    // Wywołanie funkcji pobierania danych
    fetchMovies();
});
