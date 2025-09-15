const displayImg1 = document.querySelector("#img-evolutions_1");
const displayImg2 = document.querySelector("#img-evolutions_2");
const displayImg3 = document.querySelector("#img-evolutions_3");

const url = "https://pokeapi.co/api/v2/evolution-chain";

// Handles API data
async function getData(url) {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
}
getData();

// Renders element to page
function renderImg(data) {
  data.forEach((element) => {
    const img1 = document.createElement("img-evolutions_1");
    img1.src = element.img;
    img1.alt = element.name;
    displayImg1.appendChild(img1);
  });
}
renderImg(url);
