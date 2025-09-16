const displayImg = document.querySelector("#img-pokemon");
const searchInput = document.querySelector("#input");
const apiEndpoint = "https://pokeapi.co/api/v2/pokemon";

// Handles API data
async function getData() {
  try {
    const response = await fetch(apiEndpoint);
    console.log(apiEndpoint);
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
