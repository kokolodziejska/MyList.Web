document.addEventListener("DOMContentLoaded", () => {
    const tvSeriesTableBody = document.getElementById("tvseries-tbody");
    const apiEndpoint = "/api/tvseries";
    const tvSeriesForm = document.getElementById("tvseries-form");
    const formTitle = document.getElementById("tvseries-form-title");
    const formButton = document.getElementById("tvseries-form-button");
    const formWidget = document.getElementById("tvseries-form-widget");

    let isEditing = false; // Flaga trybu edycji
    let editingTvSeriesId = null; // ID edytowanego serialu

    // Pobieranie danych z API
    async function fetchTvSeries() {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                console.error("Błąd API:", response.statusText);
                return;
            }
            const tvSeries = await response.json();
            displayTvSeries(tvSeries);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        }
    }

    // Wyświetlanie danych w tabeli
    function displayTvSeries(tvSeries) {
        tvSeriesTableBody.innerHTML = "";
        tvSeries.forEach(series => {
            const row = `
                <tr>
                    <td>${new Date(series.date).toLocaleDateString()}</td>
                    <td>${series.title}</td>
                    <td>${series.category}</td>
                    <td>${series.rating}</td>
                    <td>
                        <button class="edit-button" data-id="${series.id}">Edit</button>
                        <button class="delete-button" data-id="${series.id}">Delete</button>
                    </td>
                </tr>
            `;
            tvSeriesTableBody.insertAdjacentHTML("beforeend", row);
        });

        // Obsługa przycisków "Delete"
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.getAttribute("data-id");
                deleteTvSeries(id);
            });
        });

        // Obsługa przycisków "Edit"
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.getAttribute("data-id");
                editTvSeries(id);
            });
        });
    }

    // Funkcja do usuwania serialu
    async function deleteTvSeries(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
            if (!response.ok) {
                console.error("Błąd podczas usuwania serialu:", response.statusText);
                return;
            }
            console.log("Serial usunięty!");
            fetchTvSeries();
        } catch (error) {
            console.error("Błąd podczas usuwania serialu:", error);
        }
    }

    // Funkcja do wypełnienia formularza w trybie edycji
    async function editTvSeries(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`);
            if (!response.ok) {
                console.error("Błąd podczas pobierania serialu:", response.statusText);
                return;
            }
            const series = await response.json();

            // Wypełnienie formularza
            document.getElementById("tvseries-date").value = series.date.split("T")[0];
            document.getElementById("tvseries-title").value = series.title;
            document.getElementById("tvseries-category").value = series.category;
            document.getElementById("tvseries-rating").value = series.rating;

            // Zmiana trybu na edycję
            formTitle.textContent = "Edit TVSeries";
            formTitle.style.color = "#bd8e0a"
            formButton.textContent = "Edit";

            formWidget.classList.add("edit-mode");
            formButton.classList.add("edit-mode");

            isEditing = true;
            editingTvSeriesId = id;
        } catch (error) {
            console.error("Błąd podczas edycji serialu:", error);
        }
    }

    // Obsługa przesyłania formularza
    tvSeriesForm.addEventListener("submit", async event => {
        event.preventDefault();

        const formData = new FormData(tvSeriesForm);
        const series = {
            date: formData.get("date"),
            title: formData.get("title"),
            category: formData.get("category"),
            rating: parseInt(formData.get("rating")),
        };

        try {
            if (isEditing) {
                // Edycja serialu
                await deleteTvSeries(editingTvSeriesId);
            }

            // Dodanie nowego serialu
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(series),
            });

            if (!response.ok) {
                console.error("Błąd podczas dodawania/edycji serialu:", response.statusText);
                return;
            }

            console.log("Serial zapisany!");
            isEditing = false;
            editingTvSeriesId = null;
            formTitle.textContent = "Add New TV Series";
            formButton.textContent = "Add";
            formTitle.style.color = "white"
            formWidget.classList.remove("edit-mode");
            formButton.classList.remove("edit-mode");
            

            fetchTvSeries(); // Odśwież tabelę
            tvSeriesForm.reset(); // Wyczyść formularz
        } catch (error) {
            console.error("Błąd podczas przesyłania formularza:", error);
        }
    });

    fetchTvSeries(); // Wywołanie funkcji na starcie
});
