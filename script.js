// getting html elements
const homeButton = document.getElementById("home-button");
const prevButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const errorMessageEl = document.getElementById("error-message");
const pokemonContainer = document.getElementById("pokemon-container");
const howManyPokemon = document.getElementById("pokemon-amount");
const searchBarEl = document.getElementById("search-bar");

let pokemonAmount = howManyPokemon.value;

let pokedexUrl = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${pokemonAmount}`;

let pokemonList = [];

howManyPokemon.addEventListener("change", () => {
  pokemonAmount = howManyPokemon.value;
  pokedexUrl = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${pokemonAmount}`;
  displayPokemonList(pokedexUrl);
});

homeButton.addEventListener("click", () => {
  displayPokemonList();
});

nextButton.addEventListener("click", () => {
  if (pokemonList.next) displayPokemonList(pokemonList.next);
  else displayPokemonList();
});

prevButton.addEventListener("click", () => {
  if (pokemonList.previous) displayPokemonList(pokemonList.previous);
  else
    displayPokemonList(
      `https://pokeapi.co/api/v2/pokemon?offset=${pokemonList.lastPage}&limit=${pokemonAmount}`
    );
});

const displayError = (errorMessage) => {
  if (errorMessage) console.warn(errorMessage);

  errorMessageEl.textContent = errorMessage;
};

async function getData(url = pokedexUrl) {
  const response = await fetch(url);
  if (response.ok !== true) {
    displayError(`noe gikk galt. Status: ${response.status}`);
    return;
  }
  // clear error message
  displayError();

  const data = await response.json();

  return data;
}

/**
 * Updates pokemonList
 * @param {String} url - the url we want to get data from
 */

const updatePokemonList = async (url) => (pokemonList = await getData(url));

/**
 * Updates the pokemonList.lastPage to given perPage-param
 * @param {Number} perPage - number of pokemons per page (default 20)
 * @returns
 */

const setLastPage = (perPage = pokemonAmount) =>
  (pokemonList.lastPage = Math.floor(pokemonList.count / perPage) * perPage);

//displays list of pokemon based on given url
async function displayPokemonList(url) {
  await updatePokemonList(url);
  setLastPage();

  pokemonContainer.innerHTML = "";

  for (const pokemon of pokemonList.results) {
    const pokemonExtraData = await getData(pokemon.url);
    console.log(pokemon.url);

    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container");

    const titleEl = document.createElement("h2");
    titleEl.textContent = `${pokemonExtraData.id}. ${pokemon.name}`;
    titleEl.classList.add("title");

    const pokemonBallImageEl = document.createElement("img");
    pokemonBallImageEl.src = "./images/Pokeball image.svg";
    pokemonBallImageEl.alt =
      "transparent pokeball in the background of pokemon";
    pokemonBallImageEl.classList.add("pokeball");

    const imageEl = document.createElement("img");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.style = "max-width: 40%;";
    imageEl.src =
      pokemonExtraData.sprites.other["official-artwork"].front_default;

    containerEl.append(titleEl, imageEl, pokemonBallImageEl);
    pokemonContainer.append(containerEl);

    containerEl.addEventListener("click", () =>
      displayPokemonDetails(pokemonExtraData)
    );
  }
}

// What is displayed after you click on a specific pokemon to see details
async function displayPokemonDetails(pokemonData) {
  pokemonContainer.innerHTML = "";

  const { id, name, sprites, base_experience, height, weight, types, stats } =
    pokemonData;
  const containerEl = document.createElement("div");
  const titleEl = document.createElement("h2");

  titleEl.textContent = `${id}. ${name}`;
  titleEl.classList.add("title");

  const imageEl = document.createElement("img");
  imageEl.alt = `image of ${name}`;
  imageEl.style = "max-width: 40%;";
  imageEl.src = sprites.other["official-artwork"].front_default;

  const xpEl = document.createElement("p");
  xpEl.textContent = `XP: ${base_experience}`;

  const heightEl = document.createElement("p");
  heightEl.textContent = `Height: ${height / 10} M`;

  const weightEl = document.createElement("p");
  weightEl.textContent = `Width: ${weight / 10} Kg`;

  const typesContainer = document.createElement("div");
  const typesHeaderEl = document.createElement("h3");
  typesHeaderEl.textContent = "Types: ";
  typesContainer.append(typesHeaderEl);

  types.forEach((type) => {
    const typeEl = document.createElement("p");
    typeEl.textContent = type.type.name;
    typesContainer.append(typeEl);
  });

  const statsContainer = document.createElement("div");
  const statsHeaderEl = document.createElement("h3");
  statsHeaderEl.textContent = "Stats: ";
  statsContainer.append(statsHeaderEl);

  stats.forEach(({ stat, base_stat, effort }) => {
    const statEl = document.createElement("p");
    statEl.textContent = `${stat.name}: ${base_stat} (effort: ${effort})`;

    statsContainer.append(statEl);

    console.log(stat);
  });
  containerEl.append(
    titleEl,
    imageEl,
    xpEl,
    heightEl,
    weightEl,
    typesContainer,
    statsContainer
  );
  pokemonContainer.append(containerEl);
}

pokemonContainer.classList.add("main-container");
displayPokemonList();

async function displaySearchedPokemonList(pokemonArray) {
  pokemonContainer.innerHTML = "";

  for (const pokemon of pokemonArray) {
    const pokemonExtraData = await getData(pokemon.url);

    const containerEl = document.createElement("div");
    containerEl.classList.add("");
  }
}
