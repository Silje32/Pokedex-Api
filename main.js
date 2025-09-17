const searchForm = document.querySelector("#search");
const searchInput = document.querySelector("#input");
const displayInput = document.querySelector("#suggestions");
const findBtn = document.querySelector("#find");

const dialog = document.querySelector("#myDialog");
const showButton = document.querySelector("#myDialog + #close");
const closeButton = document.querySelector("#myDialog + #close");

const imgPokemon = document.querySelector(".img-pokemon");
const name = document.querySelector(".name");
const id = document.querySelector(".id");

const height = document.querySelector(".height");
const weight = document.querySelector(".weight");
const gender = document.querySelector(".gender");
const category = document.querySelector(".category");

const rotateBtn = document.querySelector("#rotate");
const shinyBtn = document.querySelector("#shiny");
const genderBtn = document.querySelector("#gender");

const filterBtn1 = document.querySelector("#filterBtn_1");
const filterBtn2 = document.querySelector("#filterBtn_2");
const selectType = document.querySelector("#typeSelectFilter");
const sortType = document.querySelector("#typeSelectSort");

const type1Btn = document.querySelector("#type-1");
const type2Btn = document.querySelector("#type-2");

const info = document.querySelector(".info");
const weaknesses = document.querySelector(".weaknesses");
const abilities = document.querySelector(".abilities");
const generations = document.querySelector(".generations");

const imgSprites = document.querySelector(".sprites");

const apiEndpoint = "https://pokeapi.co/api/v2/pokemon";
const data = apiEndpoint;

const loading = document.querySelector("#loading");

// Handles API data
async function getData(url) {
  try {
    const result = await fetch(url);
    console.log(url);
    const data = await result.json();
    console.log(data);

    // Hide loading when data arrives
    loadingEl.style.display = "none";

    // Show data
    dataEl.innerHTML = `
          <h2>${data.title}</h2>
          <p>${data.body}</p>
        `;

    searchData(data.results);

    if (result.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.log("There has been a problem: ", error.message);
    loadingEl.style.display = "none";
    dataEl.textContent = "Error loading data :cry:";
  }
}
// Call on page load
fetchData();

getData(apiEndpoint);

// Renders element to page
function searchData(data) {
  data.forEach((element) => {
    const suggestions = document.createElement("li");
    suggestions.textContent = element.name;
    displayInput.append(suggestions);
    // Eventlistener for modal
    suggestions.addEventListener("click", () => {
      displayEffect(element);
    });
  });
}
searchData(data);

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});

// Autocomplete Dropdown
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  suggestions.innerHTML = "";
  if (value === "") return;
  const filtered = apiEndpoint.filter((suggestions) =>
    suggestions.toLowerCase().includes(value)
  );
  filtered.forEach((suggestions) => {
    const li = document.createElement("li");
    li.textContent = suggestions;
    li.addEventListener("click", () => {
      input.value = suggestions;
      suggestions.innerHTML = "";
    });
    suggestions.appendChild(li);
  });
});
