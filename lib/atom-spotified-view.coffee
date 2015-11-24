spotify = require 'spotify-node-applescript'
require('es6-promise').polyfill()
require('isomorphic-fetch')

module.exports =
class AtomSpotifiedView
  constructor: (serializedState) ->
    @root = document.createElement('div')
    @root.classList.add('atom-spotified')

    cover = document.createElement('div')
    cover.classList.add('cover')
    @root.appendChild(cover)

    @albumArt = document.createElement('img')
    @albumArt.classList.add('album-art')
    cover.appendChild(@albumArt)

    # Create info element
    info = document.createElement('div')
    info.textContent = ''
    info.classList.add('info')
    @root.appendChild(info)

    @name = document.createElement('div')
    @name.textContent = ''
    @name.classList.add('name')
    info.appendChild(@name)

    @artist = document.createElement('div')
    @artist.textContent = ''
    @artist.classList.add('artist')
    info.appendChild(@artist)

    @isVisible = true
    @currentTrackID = ''

    @updateTrackInfo()

    setInterval =>
      @updateTrackInfo()
    , 5000

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @root.remove()

  getElement: ->
    @root

  show: ->
    @isVisible = true
    atom.packages.activatePackage('tree-view').then (treeViewPkg) =>
      treeViewPkg.mainModule.treeView.append @root

  hide: ->
    @root.remove()
    @isVisible = false

  updateTrackInfo: () ->
    spotify.isRunning (err, isRunning) =>
      if isRunning
        spotify.getState (err, state) =>
          if state
            spotify.getTrack (error, track) =>
              if track
                trackId = track.id.split(':')[2]
                if trackId != @currentTrackID
                  options =
                    credentials: 'include'
                    method: 'GET'
                    mode: 'cors'
                  fetch "https://api.spotify.com/v1/tracks/#{trackId}", options
                    .then (response) ->
                      response.json()
                    .then (trackInfo) =>
                      @albumArt.src = trackInfo.album.images[1].url
                  @name.textContent = track.name
                  @artist.textContent = track.artist
                  @currentTrackID = trackId
              else
                @name.textContent = ''
                @artist.textContent = ''
      else # spotify isn't running, hide the sound bars!
        @name.textContent = ''
        @artist.textContent = ''
