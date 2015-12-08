'use babel'

import { CompositeDisposable } from 'atom'
import spotify from 'spotify-node-applescript'

export default class AtomSpotifiedView {
  constructor (serializedState) {
    this.isVisible = true
    this.currentTrackID = ''
    this.retryCount = 0

    this.subscriptions = new CompositeDisposable()

    this.root = document.createElement('div')
    this.root.classList.add('atom-spotified')

    this.cover = document.createElement('div')
    this.cover.classList.add('cover')
    this.cover.classList.add('show-placeholder')
    this.root.appendChild(this.cover)

    this.placeholderIcon = document.createElement('i')
    this.placeholderIcon.classList.add('fa')
    this.placeholderIcon.classList.add('fa-spotify')
    this.cover.appendChild(this.placeholderIcon)

    this.albumArt = document.createElement('img')
    this.albumArt.classList.add('album-art')
    this.cover.appendChild(this.albumArt)

    // Create info element
    info = document.createElement('div')
    info.classList.add('info')
    this.root.appendChild(info)

    this.name = document.createElement('div')
    this.name.classList.add('name')
    this.name.textContent = 'Spotified'
    info.appendChild(this.name)
    this.subscriptions.add(atom.tooltips.add(this.name, {title: function () { return this.textContent }}))

    this.artist = document.createElement('div')
    this.artist.classList.add('artist')
    this.artist.textContent = 'Atom'
    info.appendChild(this.artist)

    this.playerState = document.createElement('img')
    this.playerState.classList.add('player-state')
    this.playerState.src = 'atom://atom-spotified/assets/equalizer_white_pause.gif'
    info.appendChild(this.playerState)

    atom.config.observe('atom-spotified.showEqualizer', (value) =>
      value ? this.playerState.classList.remove('hidden') : this.playerState.classList.add('hidden'))
  }

  serialize() {

  }

  destroy() {
    this.subscriptions.dispose()
    this.root.remove()
  }

  getElement() {
    return this.root
  }

  show() {
    this.isVisible = true
    this.poller = setInterval(() => this.updateTrackInfo(), 5000)

    setTimeout(() => this.updateTrackInfo())

    atom.packages
      .activatePackage('tree-view')
      .then((treeViewPkg) =>
        treeViewPkg.mainModule.treeView.append(this.root)
      )
  }

  hide() {
    this.root.remove()
    this.isVisible = false
    clearInterval(this.poller)
  }

  updateTrackInfo () {
    spotify.getState((error, state) => {
      if (state) {
        if (state.state == 'paused') {
          this.playerState.src = 'atom://atom-spotified/assets/equalizer_white_pause.gif'
        } else {
          this.playerState.src = 'atom://atom-spotified/assets/equalizer_white.gif'
        }

        trackId = state.track_id.split(':')[2]

        if (trackId != this.currentTrackID) {
          const options = {
            credentials: 'include',
            method: 'GET',
            mode: 'cors',
          }

          fetch(`https://api.spotify.com/v1/tracks/${trackId}`, options)
            .then((response) => {
              if (response.ok) {
                return response.json()
              } else {
                spotify.getTrack((error, track) => {
                  track ?
                    this.handleUpdate(trackId, track.name, track.artist) :
                    this.handleError(error)
                })
                throw new Error('Spotify API request failed')
              }
            })
            .then((trackInfo) => {
              // trackInfo.artists [id, name, href]
              // trackInfo.album {id, name, images[url, height, width]}
              // trackInfo.name
              // trackInfo.popularity
              this.handleUpdate(trackId, trackInfo.name, trackInfo.artists[0].name, trackInfo.album.images[1].url)
            })
            .catch((error) => {
              spotify.getTrack((error, track) => {
                track ?
                  this.handleUpdate(trackId, track.name, track.artist) :
                  this.handleError(error)
              })
            })
        }
      } else {
        // cannot get player state
        this.handleError(error)
      }
    })
  }

  handleUpdate(id, track, artist, album) {
    this.name.textContent = track
    this.artist.textContent = artist
    this.currentTrackID = id
    this.retryCount = 0

    if (album) {
      this.albumArt.src = album
      this.cover.classList.remove('show-placeholder')
    } else {
      this.cover.classList.add('show-placeholder')
    }
  }

  handleError(error) {
    console.error('atom-spotified:', error)

    if (this.retryCount > 3 && this.currentTrackID != '') {
      this.name.textContent = 'Error'
      this.artist.textContent = 'Something is wrong'
      this.cover.classList.add('show-placeholder')
      this.currentTrackID = ''
    } else {
      this.retryCount++
    }
  }
}
