const displayImg = document.querySelector("#img-pokemon");
const searchInput = document.querySelector("#input");
const displayInput = document.querySelector("#result");
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

// Close modal
modal.addEventListener("click", () => closeModal(modal));

const closeModal = (modal) => {
  modal.close();
  document.body.removeEventListener("click", closeModal);
};
