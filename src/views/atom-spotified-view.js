'use babel'

import { CompositeDisposable } from 'atom'

class AtomSpotifiedView {
  constructor () {
    this.subscriptions = new CompositeDisposable()
    this.visible = true

    this.element = document.createElement('div')
    this.element.classList.add('atom-spotified')

    this.cover = document.createElement('div')
    this.cover.classList.add('cover')
    this.cover.classList.add('show-placeholder')
    this.element.appendChild(this.cover)

    // this.expander = document.createElement('div')
    // this.expander.classList.add('toggle')
    // const icon = document.createElement('i')
    // icon.classList.add('fa')
    // icon.classList.add('fa-angle-up')
    // this.expander.appendChild(icon)
    // this.cover.appendChild(this.expander)

    this.placeholderIcon = document.createElement('i')
    this.placeholderIcon.classList.add('fa')
    this.placeholderIcon.classList.add('fa-spotify')
    this.cover.appendChild(this.placeholderIcon)

    this.albumArt = document.createElement('img')
    this.albumArt.classList.add('album-art')
    this.cover.appendChild(this.albumArt)

    let info = document.createElement('div')
    info.classList.add('info')
    this.element.appendChild(info)

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

    return this
  }

  destroy () {
    this.subscriptions.dispose()
    this.element.remove()
  }

  toggle () {
    if (this.visible) {
      this.element.classList.add('hidden')
    } else {
      this.element.classList.remove('hidden')
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

export default AtomSpotifiedView
