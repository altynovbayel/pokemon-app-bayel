const $wrapper = document.querySelector('.wrapper')
const $container = document.querySelector('.container')
const $next = document.querySelector('.next')
const $prev = document.querySelector('.prev')
const $currentPage = document.querySelector('.currentPage')
const $allPages = document.querySelector('.allPages')
const $buttons = document.querySelector('.buttons')
const $pageInput= document.querySelector('.pageInput')
const $inputBtn = document.querySelector('.goPage')

const $inputSelect = document.querySelector('.inputSelect')

const baseUrl = 'https://pokeapi.co/api/v2/'
const limit = 20
const allPokemons = 1126
const allPages = Math.floor(allPokemons / limit)

let offsetCount = 0
let currentPage = 1
let selectPage = 0

window.addEventListener('load', () => {
  getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${offsetCount}`, cb => {
    cardTemplate(cb.results)
  })

})

function getData(url, query, cb){
  fetch(`${url}?${query}`)
  .then(res => res.json())
  .then(response => cb(response))
}

function cardTemplate(base){
  const markUp = base.map(({name, url}) => {
    return `
      <div class="card" onclick="getSingle('${url}')">
          ${name}
      </div>
    `
  }).join('')

  $wrapper.innerHTML = markUp
}

function getSingle(url){
  getData(`${url}`,'', cb => {
    console.log(cb);
    $container.innerHTML = `
      <div class="single">
        <div class="single_wrapper">
          <img src="${cb.sprites.other.dream_world.front_default}" alt='pokemon img'>

          <ul>
            <li>
              Name: <span>${cb.name}</span>
            </li>
            <li>
              Weight: <span>${cb.weight / 10} kg</span>
            </li>
            <li>
              Heigth: <span>${cb.height} cm</span>
            </li>
            <li>
              Abilities: <span>${cb.abilities[0].ability.name}</span>
            </li>
          </ul>
        </div>
        
        <div class="poke_stats">
          <div class="stats">
            <h3>${cb.stats[0].stat.name}</h3>
            <div class="stat_inner" >
              <div class="hp stat" style="width:${cb.stats[0].base_stat}%">${cb.stats[0].base_stat}</div>  
            </div>
          </div>
          <div class="stats">
            <h3>${cb.stats[1].stat.name}</h3>
            <div class="stat_inner" >
              <div class="attack stat" style="width:${cb.stats[1].base_stat}%">${cb.stats[1].base_stat}</div>  
            </div>
          </div>
          <div class="stats">
            <h3>${cb.stats[2].stat.name}</h3>
            <div class="stat_inner" >
              <div class="def stat" style="width:${cb.stats[2].base_stat}%">${cb.stats[2].base_stat}</div>  
            </div>
          </div>
          <div class="stats">
            <h3>${cb.stats[3].stat.name}</h3>
            <div class="stat_inner" >
              <div class="specAttack stat" style="width:${cb.stats[3].base_stat}%">${cb.stats[3].base_stat}</div>  
            </div>
          </div>
          <div class="stats">
            <h3>${cb.stats[4].stat.name}</h3>
            <div class="stat_inner" >
              <div class="specDef stat" style="width:${cb.stats[4].base_stat}%">${cb.stats[4].base_stat}</div>  
            </div>
          </div>
          <div class="stats">
            <h3>${cb.stats[5].stat.name}</h3>
            <div class="stat_inner" >
              <div class="speed stat" style="width:${cb.stats[5].base_stat}%">${cb.stats[5].base_stat}</div>  
            </div>
          </div>
        </div>
        <button class='back' onclick="goBack()">Go Back </button>
      </div>
    `
  })

  $buttons.classList.toggle('active')
}

function goBack(){
  location.reload()
}

window.addEventListener('load' , () => {
  $allPages.innerHTML =  allPages
  $currentPage.innerHTML = currentPage

  $prev.setAttribute('disabled', true)
})

$next.addEventListener('click', e => {
  e.preventDefault()
  

  offsetCount += limit
  currentPage++

  if(currentPage === allPages){
    $next.setAttribute('disabled', true)
  }

  $currentPage.innerHTML = currentPage
  $prev.removeAttribute('disabled')
  getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${offsetCount}`, cb => {
    cardTemplate(cb.results)
  })
  $pageInput.value = ''

})

$prev.addEventListener('click', e => {
  e.preventDefault()

  offsetCount -= limit
  currentPage--
  $currentPage.innerHTML = currentPage
  if(currentPage === 1){
    $prev.setAttribute('disabled', true)
  }
  $next.removeAttribute('disabled')

  getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${offsetCount}`, cb => {
    cardTemplate(cb.results)
  })
  $pageInput.value = ''


})

$pageInput.addEventListener('input', e => {
  selectPage = e.target.value.toUpperCase().trim()
  const selectedVal = $inputSelect.value
  if(selectedVal === 'name'){
    getData(`${baseUrl}pokemon`, `limit=${allPokemons}&offset=${offsetCount}`, cb => {
      const filtered = cb.results.filter(item => item.name.toUpperCase().includes(selectPage))
      cardTemplate(filtered)
    })
  }
})

$inputBtn.addEventListener('click', e => {
  e.preventDefault()

  if(selectPage > allPages || selectPage < 1 || selectPage === currentPage){
     alert('введите корректную страницу')
  }else{
    $currentPage.innerHTML = selectPage
    if(selectPage != 1){
      $prev.removeAttribute('disabled')
    }else{
      $prev.setAttribute('disabled', true)
    }
    const selectedOffset = selectPage * limit - limit
    currentPage = selectPage
    getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${selectedOffset}`, cb => {
      cardTemplate(cb.results)
    })
    $pageInput.value = ''
  }
})

