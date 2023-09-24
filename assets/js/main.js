const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonDetails = document.getElementsByClassName('pokemons')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail" style="cursor: pointer">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}"
                     id="pokemon-name">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

const getPokemonTypes = async (pokemon) => { 
    console.log('Valor de pokemon:', pokemon);
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(url);
    const jsonBody = await response.json();
    console.log(jsonBody)
    return jsonBody;
}


for (let i = 0; i < pokemonDetails.length; i++) {
    pokemonDetails[i].addEventListener('click', async (event) => {
      console.log('Clicou em um detalhe de Pokémon');
      
      const clickedElement = event.target;
      const imgElement = clickedElement.querySelector('img');
      const imgAlt = imgElement.getAttribute('alt');
      
      const clickedPokemon = await getPokemonTypes(imgAlt);
  
      const modalContent = document.getElementById('modalContent');
      
      // Verifique se a propriedade 'sprites' existe antes de acessar 'front_shiny'
      const frontShinyUrl = clickedPokemon.sprites?.front_shiny;

      const pokemonName = clickedPokemon?.name;
  
      modalContent.innerHTML = `
        <div class="pokemon">
          <span class="number">#${clickedPokemon.id}</span>
          <span class="name" style="color: black">${pokemonName}</span>
          <div class="detail">
            <img src="${frontShinyUrl}" alt="${clickedPokemon.name}">
            <div>Stats
            ${clickedPokemon.stats?.map((stats) => `<span>${stats.base_stat}</span>`).join(' ')}
            </div>
            </div>
            <div>Habilidades
        </div>
         <div>
         ${clickedPokemon.abilities?.map((ability) => `<span>${ability.ability.name}</span>`).join(' ')}
         </div>   
        </div>
      `;
  
      // Exibe o modal
      const modal = document.getElementById('myModal');
      modal.style.display = 'block';
    });
  }

  const closeModalBtn = document.getElementsByClassName('close')[0];

closeModalBtn.addEventListener('click', () => {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
});
  