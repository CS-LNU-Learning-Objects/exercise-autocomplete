import './team-selector.js'

const selector = document.querySelector('#teams')
const template = document.querySelector('#teamCardTemplate')
const cardContainer = document.querySelector('#teamCard')
// const info = document.querySelector('#teaminfo')

selector.addEventListener('selectedchanged', e => {
  console.log(`A new team selected: ${e.detail.newTeam.name}`)

  let team = e.detail.newTeam
  let card = template.content.cloneNode(true)

  card.querySelector('#teamName').textContent = team.name
  card.querySelector('#teamNick').textContent = team.nickname
  card.querySelector('#teamUrl').setAttribute('href', team.url)

  cardContainer.innerHTML = ''
  cardContainer.appendChild(card)
})
