const displayImg = document.querySelector("#img-pokemon");
const searchInput = document.querySelector("#input");
const displayInput = document.querySelector("#result");

const dialog = document.querySelector("#myDialog");
const showButton = document.querySelector("#myDialog + #close");
const closeButton = document.querySelector("#myDialog + #close");

const rotateBtn = document.querySelector("#rotate");
const shinyBtn = document.querySelector("#shiny");
const genderBtn = document.querySelector("#gender");

const filterBtn1 = document.querySelector("#filterBtn_1");
const filterBtn2 = document.querySelector("#filterBtn_2");

const type1Btn = document.querySelector("#type-1");
const type2Btn = document.querySelector("#type-2");

const info = document.querySelector(".info");
const weaknesses = document.querySelector(".weaknesses");
const abilities = document.querySelector(".abilities");
const generations = document.querySelector(".generations");

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
