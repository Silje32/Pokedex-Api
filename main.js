const displayImg = document.querySelector("#img-evolutions");
const url = "https://pokeapi.co/api/v2/evolution-chain";

// Handles API data
async function getData() {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
}
getData();

// Renders element to page
function renderImg(data) {
  data.forEach((element) => {
    const img = document.createElement("img-evolutions");
    img.src = element.img;
    img.alt = element.name;
    displayImg.appendChild(img);
  });
}
