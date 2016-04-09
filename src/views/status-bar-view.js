'use babel'

import { CompositeDisposable } from 'atom'

class StatusBarView {
  constructor () {
    this.subscriptions = new CompositeDisposable()
    this.visible = true

    this.element = document.createElement('div')
    this.element.classList.add('atom-spotified-status', 'inline-block')

    this.playerState = document.createElement('img')
    this.playerState.classList.add('player-state')
    this.playerState.src = 'atom://atom-spotified/assets/equalizer_white.gif'
    this.element.appendChild(this.playerState)

    this.track = document.createElement('a')
    this.track.textContent = 'ATOM-SPOTIFIED'
    this.track.classList.add('inline-block')
    this.track.href = '#'
    this.element.appendChild(this.track)

    this.subscriptions.add(
      atom.tooltips.add(this.track, {title: () => this.element.textContent})
    )

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
      this.track.textContent = `Error - ${error.message}`
      return
    }

    const { state, name, artist } = trackInfo

    this.playerState.src = state === 'paused'
      ? 'atom://atom-spotified/assets/equalizer_white_pause.gif'
      : 'atom://atom-spotified/assets/equalizer_white.gif'
    this.track.textContent = `${name} - ${artist}`
  }
}

export default StatusBarView
