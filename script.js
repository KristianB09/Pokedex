// type colors:

const typeColors = {
  grass: "#63BC5A",
  fire: "#FF9D55",
  water: "#5090D6",
  electric: "#F4D23C",
  rock: "#C5B78C",
  normal: "#929DA3",
  flying: "#8FA9DE",
  steel: "#5A8EA2",
  fighting: "#CE416B",
  poison: "#AA6BC8",
  ground: "#D97845",
  bug: "#91C12F",
  ghost: "#5269AD",
  psychic: "#FA7179",
  ice: "#73CEC0",
  dragon: "#0B6DC3",
  dark: "#5A5465",
  fairy: "#EC8FE6",
};

// getting html elements
const homeButton = document.getElementById("home-button");
const prevButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const errorMessageEl = document.getElementById("error-message");
const pokemonContainer = document.getElementById("pokemon-container");
const howManyPokemon = document.getElementById("pokemon-amount");
const searchBarEl = document.getElementById("search-bar");
const megaFilter = document.getElementById("filter-mega");
const gmaxFilter = document.getElementById("filter-gmax");
const sortByButton = document.getElementById("sort-by-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const sortOption = document.querySelectorAll(".sort-option");

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

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextButton.click();
  }
  if (event.key === "ArrowLeft") {
    prevButton.click();
  }
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

// type color array

//displays list of pokemon based on given url
async function displayPokemonList(url) {
  await updatePokemonList(url);
  setLastPage();

  pokemonContainer.innerHTML = "";

  for (const pokemon of pokemonList.results) {
    const pokemonExtraData = await getData(pokemon.url);

    const pokemonAndDetails = document.createElement("div");
    pokemonAndDetails.classList.add("pokemon-and-details-container");

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

    const typesContainer = document.createElement("div");
    typesContainer.classList.add("types");

    pokemonExtraData.types.forEach((type) => {
      const typeEl = document.createElement("p");
      typeEl.textContent = type.type.name;
      typeEl.style.backgroundColor = typeColors[type.type.name] || "gray";
      typesContainer.append(typeEl);
      typeEl.classList.add("type");
    });

    const imageEl = document.createElement("img");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.style = "max-width: 40%;";
    imageEl.src =
      pokemonExtraData.sprites.other["official-artwork"].front_default;

    containerEl.append(titleEl, imageEl, pokemonBallImageEl, typesContainer);

    containerEl.addEventListener("click", () => {
      if (!detailsContainer.classList.contains("details-hidden")) {
        detailsContainer.classList.add("details-hidden");
      } else if (detailsContainer.classList.contains("details-hidden")) {
        detailsContainer.classList.remove("details-hidden");
      }
    });

    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-hidden");
    detailsContainer.classList.add("details");
    detailsContainer.classList.add("animation");

    let pokemonData = pokemonExtraData;

    const { base_experience, height, weight, stats } = pokemonData;

    const xpEl = document.createElement("p");
    xpEl.textContent = `Base XP: ${base_experience}`;

    const heightEl = document.createElement("p");
    heightEl.textContent = `Height: ${height / 10} M`;

    const weightEl = document.createElement("p");
    weightEl.textContent = `Width: ${weight / 10} Kg`;

    const statsContainer = document.createElement("div");
    const statsHeaderEl = document.createElement("h3");
    statsHeaderEl.textContent = "Stats: ";
    statsContainer.append(statsHeaderEl);

    stats.forEach(({ stat, base_stat, effort }) => {
      const statEl = document.createElement("p");
      statEl.textContent = `${stat.name}: ${base_stat} (effort: ${effort})`;

      statsContainer.append(statEl);
    });

    detailsContainer.append(xpEl, heightEl, weightEl, statsContainer);
    containerEl.after(detailsContainer);
    pokemonAndDetails.append(containerEl, detailsContainer);
    pokemonContainer.append(pokemonAndDetails);
  }
}

pokemonContainer.classList.add("main-container");
displayPokemonList();

// Search functions below this line

async function displaySearchedPokemonList(pokemonArray) {
  pokemonContainer.innerHTML = "";

  for (const pokemon of pokemonArray) {
    const pokemonExtraData = await getData(pokemon.url);

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

async function searchPokemon() {
  const searchText = searchBarEl.value.toLowerCase();

  if (searchText.length < 3) {
    displayError("Please enter 3 or more characters");
    return;
  }

  displayError();

  const pokemonResult = await getData(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=-1"
  );

  const pokemonArray = pokemonResult.results;

  const filteredPokemon = pokemonArray.filter((pokemon) => {
    if (pokemon.name.includes(searchText)) {
      if (megaFilter.checked) {
        return pokemon.name.includes("-mega");
      }
      if (gmaxFilter.checked) {
        return pokemon.name.includes("-gmax");
      }
      return true;
    }
    return false;
  });

  if (!filteredPokemon.length > 0) {
    displayError("No pokemons found");
    return;
  }

  displaySearchedPokemonList(filteredPokemon);
}

// note: keypress is deprecated according to developer.mozilla. Hence i use keydown instead.

// pressing enter to search
searchBarEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchPokemon();
  }
});

// searches automatically when no key has been typed for 1 second.
let timeOut;

searchBarEl.addEventListener("keyup", () => {
  clearTimeout(timeOut);

  timeOut = setTimeout(searchPokemon, 1000);
});

// sort by dropdown menu

sortByButton.addEventListener("click", () => {
  if (dropdownMenu.classList.contains("hidden")) {
    dropdownMenu.classList.remove("hidden");
  } else if (!dropdownMenu.classList.contains("hidden")) {
    dropdownMenu.classList.add("hidden");
  }
});

// sort by buttons/alternatives

sortOption.forEach((option) => {
  option.addEventListener("click", (event) => {
    const sortValue = event.target.textContent.toLowerCase();
    console.log(sortValue);
    sortPokemon(sortValue);
  });
});

async function sortPokemon(sortCriteria) {
  const pokemonResult = await getData(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=-1"
  );

  const fetchPokemon = pokemonResult.results.map((pokemon) =>
    getData(pokemon.url)
  );

  const fullPokemonArray = await Promise.all(fetchPokemon);

  console.log(fullPokemonArray);
}
