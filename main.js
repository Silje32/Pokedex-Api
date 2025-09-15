const displayImg = document.querySelector("#img-evolutions");

const url = "https://pokeapi.co/api/v2/evolution-chain";
async function getData() {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
}
getData();
