'use babel'

import { CompositeDisposable } from 'atom'

class StatusBarView extends HTMLElement {
  initialize() {
    this.subscriptions = new CompositeDisposable()

    this.classList.add('atom-spotified-status', 'inline-block')

    this.playerState = document.createElement('img')
    this.playerState.classList.add('player-state')
    this.playerState.src = 'atom://atom-spotified/assets/equalizer_white.gif'
    this.appendChild(this.playerState)

    this.track = document.createElement('a')
    this.track.textContent = 'ATOM-SPOTIFIED'
    this.track.classList.add('inline-block')
    this.track.href = '#'
    this.appendChild(this.track)

    this.subscriptions.add(atom.tooltips.add(this.track, { title: function () { return this.textContent }}))

  }

  destroy() {
    this.subscriptions.dispose()
  }

  get update() {
    return ::this.handleUpdate
  }

  handleUpdate(trackInfo, error) {
    if (error) {
      this.track.textContent = `Error - ${error.message}`
      return
    }

    const { state, name, artist } = trackInfo

    this.playerState.src = state === 'paused' ?
      'atom://atom-spotified/assets/equalizer_white_pause.gif' :
      'atom://atom-spotified/assets/equalizer_white.gif'
    this.track.textContent = `${name} - ${artist}`
  }
}

export default document.registerElement('status-bar-spotified', { prototype: StatusBarView.prototype, extends: 'div' })
