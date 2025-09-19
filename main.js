/**
 * Pokedex UI logic
 * - Fetches index of Pokémon for autocomplete
 * - Lets user click a suggestion or submit the form to view details
 * - Populates dialog with sprites, types, stats, abilities, etc.
 * - Adds small UX helpers (loading indicator, error handling)
 */

/* ===== DOM references ===== */
// Search form elements
const searchForm = document.querySelector("#search"); // the form handling searches
const searchInput = document.querySelector("#input"); // the text input for queries
const suggestionsList = document.querySelector("#suggestions"); // UL where autocomplete suggestions render
const findBtn = document.querySelector("#find"); // submit button

// Dialog and its controls/content
const dialog = document.querySelector("#myDialog"); // <dialog> element
const closeButton = document.querySelector("#close"); // close button inside method=dialog form

// Image + identity
const imgPokemon = document.querySelector("#img-pokemon"); // main sprite image
const nameEl = document.querySelector(".name"); // Pokémon name <h2>
const idEl = document.querySelector(".id"); // Pokémon id <h3>

// Stats/info fields
const heightEl = document.querySelector(".height"); // height text holder
const weightEl = document.querySelector(".weight"); // weight text holder
const genderEl = document.querySelector(".gender"); // gender text holder (requires species data)
const categoryEl = document.querySelector(".category"); // category text holder (species "genera")

// Action buttons
const rotateBtn = document.querySelector("#rotate"); // rotates the image
const shinyBtn = document.querySelector("#shiny"); // toggles shiny vs default sprite
const genderBtn = document.querySelector("#gender"); // toggles gender sprites (if available)

// Moves
const movesList = document.querySelector(".moveList");
const sortButton = document.querySelector("#sort-moves");
let currentMoves = []; // lagres så vi kan sortere uten nytt fetch

// Stats controls
const statHP = document.querySelector(".stats_grid .hp");
const statAttack = document.querySelector(".stats_grid .attack");
const statDefense = document.querySelector(".stats_grid .defense");
const statSpatk = document.querySelector(".stats_grid .spatk");
const statSpdef = document.querySelector(".stats_grid .spdef");
const statSpeed = document.querySelector(".stats_grid .speed");

// Type buttons (we’ll set their labels from API)
const type1Btn = document.querySelector("#type-1"); // first type
const type2Btn = document.querySelector("#type-2"); // second type

// Other info containers
const infoEl = document.querySelector(".info"); // flavor text
const weaknessesEl = document.querySelector(".weaknesses"); // derived weaknesses list
const abilitiesEl = document.querySelector(".abilities"); // abilities list
const generationsEl = document.querySelector(".generations"); // generation info
const spritesWrap = document.querySelector(".sprites"); // sprites gallery container

// Loading indicator
const loadingImg = document.querySelector("#loadingEl"); // small spinner image

/* ===== API endpoints and in-memory cache ===== */
const API_BASE = "https://pokeapi.co/api/v2"; // base URL for PokeAPI
let pokedexIndex = []; // cached list of { name, url } for autocomplete
let currentPokemon = null; // last loaded Pokémon details (for toggles)

/* ===== Helpers: fetch JSON safely with errors surfaced ===== */
async function getJSON(url) {
  // Toggle a small loading indicator while we fetch
  loadingImg.hidden = false;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
    return await res.json();
  } finally {
    loadingImg.hidden = true;
  }
}

/* ===== Initial load: fetch index of Pokémon for suggestions ===== */
(async function bootstrap() {
  // Get many Pokémon names for autocomplete (limit ~1000 covers Gen 1–8)
  const data = await getJSON(`${API_BASE}/pokemon?limit=100000&offset=0`);
  pokedexIndex = data.results; // [{ name, url }]
})();

/* ===== Autocomplete: update list as user types ===== */
searchInput.addEventListener("input", () => {
  // Normalize user text
  const q = searchInput.value.trim().toLowerCase();

  // Clear previous suggestions
  suggestionsList.innerHTML = "";

  // If empty, stop here
  if (!q) return;

  // Filter top matches by name (starts-with first, then includes) and cap results
  const startsWith = pokedexIndex.filter((p) => p.name.startsWith(q));
  const includes = pokedexIndex.filter(
    (p) => !p.name.startsWith(q) && p.name.includes(q)
  );
  const matches = [...startsWith, ...includes].slice(0, 20);

  // Render each suggestion as a focusable <li>
  matches.forEach((p) => {
    const li = document.createElement("li"); // create list item
    li.tabIndex = 0; // allow keyboard focus
    li.role = "option"; // a11y role inside listbox
    li.textContent = capitalize(p.name); // show nicely capitalized name
    li.addEventListener("click", () => pickSuggestion(p.name)); // click selects
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter") pickSuggestion(p.name);
    }); // Enter selects
    suggestionsList.appendChild(li); // attach to DOM
  });
});

/* ===== When a suggestion is chosen, load its details and open dialog ===== */
async function pickSuggestion(name) {
  searchInput.value = capitalize(name); // fill input with selection
  suggestionsList.innerHTML = ""; // clear suggestion UI
  await loadPokemon(name); // fetch and render details
  openDialog(); // show modal details
}

/* ===== Form submit: use current input value ===== */
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page reload
  const q = searchInput.value.trim().toLowerCase(); // get user query
  if (!q) return; // ignore empty
  await loadPokemon(q); // fetch the Pokémon
  openDialog(); // display the dialog
});

/* ===== Core: load Pokémon + species + type matchup ===== */
async function loadPokemon(nameOrId) {
  try {
    // Basic Pokémon data (stats, types, sprites)
    const pokemon = await getJSON(`${API_BASE}/pokemon/${nameOrId}`);
    currentPokemon = pokemon; // keep reference for toggles

    // Species data (flavor text + genera + gender rate + generation)
    const species = await getJSON(pokemon.species.url);

    // Populate simple fields
    nameEl.textContent = capitalize(pokemon.name); // name heading
    idEl.textContent = `#${pokemon.id}`; // id heading

    // Height/weight (API gives decimeters/hectograms → convert to m / kg)
    heightEl.textContent = `${(pokemon.height / 10).toFixed(1)} m`;
    weightEl.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;

    // Gender (species.gender_rate: -1 = genderless; else 0–8 where 8 is 100% female)
    const gr = species.gender_rate;
    genderEl.textContent = gr === -1 ? "Genderless" : "Male / Female";

    // Category (species.genera contains entries by language; pick English)
    const genusEn = species.genera.find((g) => g.language.name === "en");
    categoryEl.textContent = genusEn ? genusEn.genus : "—";

    // Flavor text (strip weird line breaks)
    const flavorEn = species.flavor_text_entries.find(
      (f) => f.language.name === "en"
    );
    infoEl.textContent = flavorEn
      ? flavorEn.flavor_text.replace(/\f|\n/g, " ")
      : "—";

    // Types (1–2 types)
    const typeNames = pokemon.types.map((t) => t.type.name);
    type1Btn.textContent = typeNames[0] ? capitalize(typeNames[0]) : "—";
    type2Btn.textContent = typeNames[1] ? capitalize(typeNames[1]) : "—";

    // Abilities (show names, hidden flagged)
    abilitiesEl.textContent = pokemon.abilities
      .map(
        (a) => `${capitalize(a.ability.name)}${a.is_hidden ? " (Hidden)" : ""}`
      )
      .join(", ");

    // Generation (e.g., "generation-i")
    generationsEl.textContent = species.generation
      ? prettyGen(species.generation.name)
      : "—";

    // Weaknesses (derive from type damage relations; union weaknesses)
    const weaknesses = await computeWeaknesses(typeNames);
    weaknessesEl.textContent = weaknesses.length
      ? weaknesses.map(capitalize).join(", ")
      : "—";

    // Moves
    currentMoves = pokemon.moves.map((m) => m.move.name); // bare navneliste
    renderMoves(currentMoves);

    // Stats
    const getStat = (name) =>
      pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? "-";

    statHP.textContent = `HP: ${getStat("hp")}`;
    statAttack.textContent = `Attack: ${getStat("attack")}`;
    statDefense.textContent = `Defense: ${getStat("defense")}`;
    statSpatk.textContent = `Sp.Atk: ${getStat("special-attack")}`;
    statSpdef.textContent = `Sp.Def: ${getStat("special-defense")}`;
    statSpeed.textContent = `Speed: ${getStat("speed")}`;

    // Main sprite + gallery
    renderSprites(pokemon);
  } catch (err) {
    alert(`Could not load Pokémon: ${err.message}`);
  }
}
/* Make function render moves */
function renderMoves(moves) {
  movesList.innerHTML = "";
  moves.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = capitalize(name);
    movesList.appendChild(li);
  });
}

sortButton.addEventListener("click", () => {
  const sorted = [...currentMoves].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" })
  );
  renderMoves(sorted);
});

/* ===== Compute weaknesses from type endpoints ===== */
async function computeWeaknesses(typeNames) {
  // Fetch type data for each type the Pokémon has
  const typeData = await Promise.all(
    typeNames.map((t) => getJSON(`${API_BASE}/type/${t}`))
  );
  // Collect damage relations: double_damage_from indicates weaknesses
  const weakSets = typeData.map((td) =>
    td.damage_relations.double_damage_from.map((x) => x.name)
  );
  // Merge/unique
  const union = new Set(weakSets.flat());
  // Remove types the Pokémon itself has (optional tweak)
  typeNames.forEach((t) => union.delete(t));
  return Array.from(union);
}

/* ===== Render sprite gallery and set the primary image ===== */
function renderSprites(pokemon) {
  // Clear previous gallery
  spritesWrap.innerHTML = "";

  // Choose default image (front_default fallback to official artwork)
  const official = pokemon.sprites.other?.["official-artwork"]?.front_default;
  const front = pokemon.sprites.front_default || official;
  imgPokemon.src = front || ""; // set main src
  imgPokemon.dataset.default = front || ""; // remember default
  imgPokemon.dataset.shiny = pokemon.sprites.front_shiny || ""; // remember shiny

  // Collect a few interesting sprite paths
  const keys = ["front_default", "back_default", "front_shiny", "back_shiny"];

  // Create image elements for gallery
  keys.forEach((k) => {
    const src = pokemon.sprites[k];
    if (!src) return; // skip missing
    const img = document.createElement("img"); // thumb image
    img.src = src; // show sprite
    img.alt = k.replace("_", " "); // readable alt
    img.title = img.alt; // tooltip
    img.addEventListener("click", () => {
      imgPokemon.src = src;
    }); // click sets main image
    spritesWrap.appendChild(img); // add to gallery
  });
}

/* ===== Dialog open helper ===== */
function openDialog() {
  if (!dialog.open) dialog.showModal(); // open only if not already open
}

/* ===== Rotate: add/remove a CSS class that rotates the main image ===== */
rotateBtn.addEventListener("click", () => {
  // Toggle a 'rotating' class; define animation via CSS or inline style
  imgPokemon.classList.toggle("rotating");
  // If you prefer inline rotation instead of CSS, you can do:
  // imgPokemon.style.transform = imgPokemon.style.transform ? "" : "rotate(360deg)";
});

/* ===== Shiny toggle: swap between default and shiny sprite if available ===== */
shinyBtn.addEventListener("click", () => {
  const isShiny = imgPokemon.dataset.active === "shiny";
  const nextSrc = isShiny
    ? imgPokemon.dataset.default
    : imgPokemon.dataset.shiny;
  if (nextSrc) {
    imgPokemon.src = nextSrc;
    imgPokemon.dataset.active = isShiny ? "default" : "shiny";
  } else {
    alert("No shiny sprite available for this Pokémon.");
  }
});

/* ===== Gender toggle: try female sprites if available ===== */
genderBtn.addEventListener("click", () => {
  if (!currentPokemon) return;
  const male = currentPokemon.sprites.front_default;
  const female = currentPokemon.sprites.front_female;
  // If female sprite exists, toggle between them
  if (female) {
    const nowFemale = imgPokemon.dataset.gender === "female";
    imgPokemon.src = nowFemale ? male : female;
    imgPokemon.dataset.gender = nowFemale ? "male" : "female";
  } else {
    alert("No female sprite available for this Pokémon.");
  }
});

/* ===== Small helpers ===== */
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function prettyGen(g) {
  return g.replace("generation-", "Generation ").toUpperCase();
}

/* ===== Optional: ESC closes dialog (method=dialog already handles close button) ===== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialog.open) dialog.close();
});

/* ===== Optional:  dialog closes with a click  ===== */
dialog.addEventListener("click", (e) => {
  if (!dialog.contains(e.target) && e.target !== dialog) dialog.close();
});

/* ===== Styling for rotation effect (kept in JS for clarity; move to CSS if preferred) ===== */
const style = document.createElement("style");
style.textContent = `
  /* rotates the main sprite smoothly */
  #img-pokemon.rotating {
    animation: spin 1s linear;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
