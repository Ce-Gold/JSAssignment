// Hämta HTML-element
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");



// Funktion som gör API-anrop
async function searchBooks() {

  // Tar texten från sökfältet
  const query = searchInput.value;

  if (!query) {
    results.innerHTML = "<p>Skriv något i sökfältet!</p>";
    return;
  }

  // API-url (Open Library kräver ingen nyckel)
  const url = `https://openlibrary.org/search.json?q=${query}`;

  try {
    // Hämta data
    const response = await fetch(url);
    const data = await response.json();

    // Visa böckerna
    displayResults(data.docs);

  } catch (error) {
    results.innerHTML = "<p>Kunde inte hämta böcker. Försök igen.</p>";
    console.error(error);
  }
}

// Funktion som visar resultaten i DOM
function displayResults(books) {

  // Om inga böcker hittas
  if (books.length === 0) {
    results.innerHTML = "<p>Inga böcker hittades.</p>";
    return;
  }

  // Töm sektionen
  results.innerHTML = "";

  // Skapa ett kort för varje bok
  books.slice(0, 20).forEach(book => {

    // Författare (om ingen finns)
    const author = book.author_name
      ? book.author_name.join(", ")
      : "Okänd författare";

    // Bokbild eller placeholder
    const coverId = book.cover_i;
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/200x300?text=Ingen+bild";

    // Skapa HTML för varje bok
    const card = `
            <div class="book-card">
                <img src="${coverUrl}" alt="Bokomslag">
                <h3>${book.title}</h3>
                <p>${author}</p>
            </div>
        `;

    results.innerHTML += card;
  });
}

// Lyssna på knappen
searchBtn.addEventListener("click", searchBooks);

// Gör det möjligt att trycka Enter
searchInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") searchBooks();
});
