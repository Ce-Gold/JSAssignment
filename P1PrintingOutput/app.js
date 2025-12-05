// Hämtar sökrutan där användaren skriver
const searchInput = document.getElementById("searchInput");

// Hämtar knappen som användaren klickar på
const searchBtn = document.getElementById("searchBtn");

// Hämtar platsen där bokresultaten ska visas
const results = document.getElementById("results");

// Hämtar platsen där felmeddelanden ska visas
const searchMessage = document.getElementById("searchMessage");

// Hämtar dropdown-menyn för sortering
const sortSelect = document.getElementById("sortSelect");

// Variabel som sparar de senaste sökresultaten så vi kan sortera dem
let lastBooks = [];

// ===========================
// SÖKFUNKTION
// ===========================
// Funktion som söker efter böcker när användaren klickar på knappen
async function searchBooks() {
  // Hämtar texten som användaren har skrivit och tar bort mellanslag
  const query = searchInput.value.trim();

  // Tömmer gamla felmeddelanden
  searchMessage.textContent = "";

  // Tömmer gamla sökresultat
  results.innerHTML = "";

  // Döljer sorteringsmenyn när en ny sökning startar
  sortSelect.style.display = "none";

  // Kollar om användaren skrev något
  if (!query) {
    // Visar ett meddelande om sökrutan är tom
    searchMessage.textContent = "Skriv något i sökfältet!";
    return; // Stoppar funktionen här
  }

  // Skapar webbadressen till bokbiblioteket med sökordet
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

  try {
    // Skickar en förfrågan till bokbiblioteket
    const response = await fetch(url);

    // Omvandlar svaret till ett format vi kan läsa
    const data = await response.json();

    // Sparar de första 20 böckerna i lastBooks-variabeln
    lastBooks = data.docs.slice(0, 20);

    // Om vi hittat böcker, visa sorteringsmenyn
    if (lastBooks.length > 0) {
      sortSelect.style.display = "block";
    }

    // Skickar böckerna vidare för att visas på sidan
    displayResults(lastBooks);

  } catch (err) {
    // Visar ett felmeddelande om något går fel
    searchMessage.textContent = "Kunde inte hämta böcker.";
    console.error(err);
  }
}

// ===========================
// VISA RESULTAT
// ===========================
// Funktion som visar böckerna på sidan
function displayResults(books) {
  // Tömmer området så gamla resultat försvinner
  results.innerHTML = "";

  // Kollar om inga böcker hittades
  if (books.length === 0) {
    results.innerHTML = "<p>Inga böcker hittades.</p>";
    return; // Stoppar funktionen här
  }

  // Loopar igenom varje bok i listan
  books.forEach(book => {
    // Hämtar titeln eller skriver "Okänd titel" om den saknas
    const title = book.title || "Okänd titel";

    // Hämtar författarens namn eller skriver "Okänd författare"
    const author = book.author_name
      ? book.author_name.join(", ")
      : "Okänd författare";

    // Hämtar ID:t för bokomslaget
    const coverId = book.cover_i;

    // Skapar webbadressen till bokomslaget eller en standardbild
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/200x300?text=Ingen+bild";

    // Skapar HTML-kod för ett bokkort och lägger till det på sidan
    results.innerHTML += `
      <div class="book-card">
        <img src="${coverUrl}" alt="Bokomslag för ${title}">
        <h3>${title}</h3>
        <p>${author}</p>
      </div>
    `;
  });
}

// ===========================
// SORTERING
// ===========================
// Lyssnar på när användaren ändrar sorteringsval i dropdown-menyn
sortSelect.addEventListener("change", () => {
  // Om inga böcker finns, gör ingenting
  if (lastBooks.length === 0) return;

  // Skapar en kopia av bokarna som vi kan sortera
  let sorted = [...lastBooks];

  // Kollar vilket sorteringsval användaren valde
  switch (sortSelect.value) {
    case "title-asc":
      // Sortera efter titel A-Ö (stigande)
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "title-desc":
      // Sortera efter titel Ö-A (fallande)
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;

    case "year-asc":
      // Sortera efter utgivningsår (äldst först)
      sorted.sort((a, b) =>
        (a.first_publish_year || 9999) - (b.first_publish_year || 9999)
      );
      break;

    case "year-desc":
      // Sortera efter utgivningsår (nyast först)
      sorted.sort((a, b) =>
        (b.first_publish_year || 0) - (a.first_publish_year || 0)
      );
      break;
  }

  // Visar de sorterade böckerna på sidan
  displayResults(sorted);
});

// ===========================
// EVENT LISTENERS
// ===========================
// Lyssnar på klick på sök-knappen
searchBtn.addEventListener("click", searchBooks);

// Lyssnar på när användaren trycker på tangenter i sökrutan
searchInput.addEventListener("keydown", (e) => {
  // Om användaren tryckte Enter, kör sökningen
  if (e.key === "Enter") searchBooks();
});
