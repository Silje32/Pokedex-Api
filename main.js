const displayImg1 = document.querySelector("#img-evolutions_1");
const displayImg2 = document.querySelector("#img-evolutions_2");
const displayImg3 = document.querySelector("#img-evolutions_3");

const apiEndpoint = "https://pokeapi.co/api/v2/evolution-chain";

// Handles API data
async function getData() {
  try {
    for (let evo in evolutions) {
      const response = await fetch(evo);
      console.log(evo);
      const data = await response.json();
      console.log(data);
    }

    renderImg();

    if (response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.log("There has been a problem: ", error.message);
  }
}
getData(apiEndpoint);

// Renders element to page
function renderImg(data) {
  data.forEach((element) => {
    const img1 = document.createElement("img-evolutions_1");
    img1.url = element.img;
    displayImg1.appendChild(img1);
  });
}
renderImg(apiEndpoint);
