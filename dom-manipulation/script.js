const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportQuotesBtn = document.getElementById("exportQuotes");
const importFileInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

let quotes = [];
let categories = [];

function loadQuotesFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("quoteData") || "{}");
  quotes = storedData.quotes || [];
  categories = storedData.categories || [];
}

function saveQuotesToLocalStorage() {
  const quoteData = {
    quotes: quotes,
    categories: categories,
  };
  localStorage.setItem("quoteData", JSON.stringify(quoteData));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>${randomQuote.text}</p>
    <p>- ${randomQuote.author}</p>
    <p>Category: ${randomQuote.category}</p>
  `;
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      author: "Anonymous",
      category: newQuoteCategory,
    };

    quotes.push(newQuote);
    saveQuotesToLocalStorage();

    // Update categories dropdown
    if (!categories.includes(newQuoteCategory)) {
      const newOption = document.createElement("option");
      newOption.value = newQuoteCategory;
      newOption.text = newQuoteCategory;
      categoryFilter.appendChild(newOption);
      categories.push(newQuoteCategory);
      saveQuotesToLocalStorage();
    }

    showRandomQuote();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

function filterQuotes() {
  showRandomQuote();
}

function populateCategories() {
  categories = [...new Set(quotes.map((quote) => quote.category))]; // Get unique categories
  categories.unshift("all"); // Add 'All Categories' option

  categoryFilter.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from local storage
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Load quotes and categories from Local Storage
loadQuotesFromLocalStorage();
populateCategories();

// Restore last selected filter
const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
if (lastSelectedCategory) {
  categoryFilter.value = lastSelectedCategory;
}

newQuoteBtn.addEventListener("click", showRandomQuote);
document
  .querySelector('button[onclick="addQuote()"]')
  .addEventListener("click", addQuote);
exportQuotesBtn.addEventListener("click", exportQuotes);
importFileInput.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", () => {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  filterQuotes();
});

showRandomQuote();
