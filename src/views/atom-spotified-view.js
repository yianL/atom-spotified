'use babel'

import { CompositeDisposable } from 'atom'

class AtomSpotifiedView extends HTMLElement {
  initialize () {
    this.subscriptions = new CompositeDisposable()
    this.visible = true

    this.classList.add('atom-spotified')

    this.cover = document.createElement('div')
    this.cover.classList.add('cover')
    this.cover.classList.add('show-placeholder')
    this.appendChild(this.cover)

    this.placeholderIcon = document.createElement('i')
    this.placeholderIcon.classList.add('fa')
    this.placeholderIcon.classList.add('fa-spotify')
    this.cover.appendChild(this.placeholderIcon)

    this.albumArt = document.createElement('img')
    this.albumArt.classList.add('album-art')
    this.cover.appendChild(this.albumArt)

    let info = document.createElement('div')
    info.classList.add('info')
    this.appendChild(info)

    this.name = document.createElement('div')
    this.name.classList.add('name')
    this.name.textContent = 'Spotified'
    info.appendChild(this.name)
    this.subscriptions.add(atom.tooltips.add(this.name, {title: () => this.textContent}))

    this.artist = document.createElement('div')
    this.artist.classList.add('artist')
    this.artist.textContent = 'Atom'
    info.appendChild(this.artist)

    this.playerState = document.createElement('img')
    this.playerState.classList.add('player-state')
    this.playerState.src = 'atom://atom-spotified/assets/equalizer_white_pause.gif'
    info.appendChild(this.playerState)

    atom.config.observe('atom-spotified.showSoundBar', (value) => {
      value ? this.playerState.classList.remove('hidden') : this.playerState.classList.add('hidden')
    })
  }

  destroy () {
    this.subscriptions.dispose()
  }

  toggle () {
    if (this.visible) {
      this.classList.add('hidden')
    } else {
      this.classList.remove('hidden')
    }
    this.visible = !this.visible
  }

  get update () {
    return this.handleUpdate.bind(this)
  }

  handleUpdate (trackInfo, error) {
    if (error) {
      this.name.textContent = 'Error'
      this.artist.textContent = 'Something is wrong'
      this.cover.classList.add('show-placeholder')
      return
    }

    const { state, name, artist, cover } = trackInfo

    this.playerState.src = state === 'paused'
      ? 'atom://atom-spotified/assets/equalizer_white_pause.gif'
      : 'atom://atom-spotified/assets/equalizer_white.gif'
    this.name.textContent = name
    this.artist.textContent = artist

    if (cover) {
      this.albumArt.src = cover
      this.cover.classList.remove('show-placeholder')
    } else {
      this.cover.classList.add('show-placeholder')
    }
  }
}

export default document.registerElement('atom-spotified', { prototype: AtomSpotifiedView.prototype, extends: 'div' })
