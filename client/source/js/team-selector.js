const template = document.createElement('template')
template.innerHTML = /* html */`
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">

<div class="input-field col s6">
  <input  id="teamselector" type="text" list="teams">
  <label class="active" for="teamselector">Search for a team:</label>
  <datalist id="teams"></datalist>
</div>
`

/**
 * A Autocomplete component
 *
 * @class TeamSelector
 * @extends {window.HTMLElement}
 */
export class TeamSelector extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._input = this.shadowRoot.querySelector('input')
    this._datalist = this.shadowRoot.querySelector('datalist')
    this.teams = []
    this._apiURL = ''
    this._minLength = 1
    this._selectedTeam = undefined
  }

  static get observedAttributes () {
    return ['src', 'minlength']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'src') {
      this._apiURL = newValue
    } else if (name === 'minlength') {
      this._minLength = parseInt(newValue)
    }
  }

  connectedCallback () {
    this._input.addEventListener('input', async event => {
      if (this._input.value.length === 0 || this._input.value.length < this._minLength) {
        return
      }

      await this.search(this._input.value)
      this._updateRendering()

      let hit = this.teams.filter(team => team.name === this._input.value)
      if (hit.length > 0) {
        // Team selected
        let detail = {
          newTeam: await this.getTeam(hit[0].id),
          oldTeam: this._selectedTeam
        }

        this._selectedTeam = detail.newTeam

        this.dispatchEvent(new window.CustomEvent('selectedchanged', { detail }))
        this._input.blur()
        this._input.focus()
      }
    })
  }

  async getTeam (id) {
    let teamResult = await window.fetch(`${this._apiURL}/teams/${id}`)
    return teamResult.json()
  }

  async search (str) {
    let oldTeams = this.teams.slice()
    this.teams = []

    // Search for teams
    let searchResult = await window.fetch(`${this._apiURL}/teams/?q=${str}`)
    searchResult = await searchResult.json()
    this.teams = searchResult.teams

    this.dispatchEvent(new window.CustomEvent('teamsupdate', { detail: { oldTeams, newTeams: this.teams } }))
  }

  _updateRendering () {
    this._datalist.innerHTML = ''
    this.teams.forEach(team => {
      let option = document.createElement('option')
      option.setAttribute('value', team.name)

      this._datalist.appendChild(option)
    })
  }
}

// Registers the custom event
window.customElements.define('team-selector', TeamSelector)
