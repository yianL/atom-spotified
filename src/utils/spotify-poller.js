'use babel'

import spotify from './spotify-applescript'
import { Errors } from './constants'

export default class AtomSpotifiedPoller {
  constructor () {
    this.trackInfo = {}
    this.subscriptions = []
    this.retryCount = 0
    this.state = 'stopped'
  }

  start () {
    setTimeout(() => this.updateTrackInfo())
    this.poller = setInterval(() => this.updateTrackInfo(), 5000)
    this.state = 'started'
    this.subscriptions.forEach((cb) => cb({
      message: 'Initializing..'
    }))
  }

  stop () {
    clearInterval(this.poller)
    this.state = 'stopped'
  }

  updateTrackInfo () {
    spotify.getState()
      .then((state) => {
        const trackId = state.track_id.split(':')[2]

        if (trackId === this.trackInfo.id) {
          // same track update player state if needed
          return (state.state !== this.trackInfo.state) && this.handleUpdate({ state: state.state })
        }

        // use applescript info
        spotify.getTrack()
          .then((track) => this.handleUpdate({
            state: state.state,
            id: trackId,
            name: track.name,
            artist: track.artist,
            cover: track.artwork_url,
          }))
          .catch((error) => this.handleError(error))

      })
      .catch((error) => {
        // cannot get player state
        return this.handleError(error)
      })
  }

  addSubscriber (cb) {
    this.subscriptions.push(cb)
  }

  removeSubscriber (cb) {
    const idx = this.subscriptions.indexOf(cb)

    if (idx > -1) {
      this.subscriptions.splice(idx, 1)
    }
  }

  handleUpdate ({ state, id, name, artist, cover }) {
    this.retryCount = 0
    this.trackInfo.id = id || this.trackInfo.id
    this.trackInfo.state = state || this.trackInfo.state
    this.trackInfo.name = name || this.trackInfo.name
    this.trackInfo.artist = artist || this.trackInfo.artist
    this.trackInfo.cover = cover || this.trackInfo.cover

    this.subscriptions.forEach((cb) => cb({
      trackInfo: this.trackInfo,
      message: undefined
    }))
  }

  handleError (error) {
    switch (error.message) {
      case Errors.NO_DATA:
        if(this.retryCount++ > 2) {
          this.subscriptions.forEach((cb) => cb({
            trackInfo: {
              state: 'paused'
            },
            message: 'Spotify is not running'
          }))
        }
        break;

      default:
        // unhandled errors
        console.error('atom-spotified error:', error)

        if (this.retryCount > 3 && this.trackInfo.id) {
          this.subscriptions.forEach((cb) => cb({
            trackInfo: {
              state: 'error'
            },
            message: 'Failed to get track info'
          }))
          delete this.trackInfo.id
        } else {
          this.retryCount++
        }
    }
  }
}
