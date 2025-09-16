const displayImg = document.querySelector("#img-pokemon");
const searchInput = document.querySelector("#input");
const displayInput = document.querySelector("#result");

const dialog = document.querySelector("#myDialog");
const showButton = document.querySelector("#myDialog + #close");
const closeButton = document.querySelector("#myDialog + #close");

const apiEndpoint = "https://pokeapi.co/api/v2/pokemon";

// Handles API data
async function getData() {
  try {
    for (let poke in pokemons) {
      await fetch(poke);
      console.log(poke);
    }
    const data = await response.json();
    console.log(data);

    searchData();

    if (response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.log("There has been a problem: ", error.message);
  }
}

getData(apiEndpoint);

// Renders element to page
function searchData(data) {
  data.forEach((element) => {});
}
searchData(apiEndpoint);

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});
