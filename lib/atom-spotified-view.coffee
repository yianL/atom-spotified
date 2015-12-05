{CompositeDisposable} = require 'atom'
spotify = require 'spotify-node-applescript'

module.exports =
class AtomSpotifiedView
  constructor: (serializedState) ->
    @isVisible = true
    @currentTrackID = ''
    @retryCount = 0

    @subscriptions = new CompositeDisposable

    @root = document.createElement 'div'
    @root.classList.add 'atom-spotified'

    @cover = document.createElement 'div'
    @cover.classList.add 'cover'
    @cover.classList.add 'show-placeholder'
    @root.appendChild @cover

    @placeholderIcon = document.createElement 'i'
    @placeholderIcon.classList.add 'fa'
    @placeholderIcon.classList.add 'fa-spotify'
    @cover.appendChild @placeholderIcon

    @albumArt = document.createElement 'img'
    @albumArt.classList.add 'album-art'
    @cover.appendChild @albumArt

    # Create info element
    info = document.createElement 'div'
    info.classList.add 'info'
    @root.appendChild info

    @name = document.createElement 'div'
    @name.classList.add 'name'
    @name.textContent = 'Spotified'
    info.appendChild @name
    @subscriptions.add atom.tooltips.add @name, {title: () -> @textContent}

    @artist = document.createElement 'div'
    @artist.classList.add 'artist'
    @artist.textContent = 'Atom'
    info.appendChild @artist

    @playerState = document.createElement 'img'
    @playerState.classList.add 'player-state'
    @playerState.src = 'atom://atom-spotified/assets/equalizer_white_pause.gif'
    info.appendChild @playerState

    atom.config.observe 'atom-spotified.showEqualizer', (value) =>
      if value then @playerState.classList.remove('hidden') else @playerState.classList.add('hidden')

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @subscriptions.dispose()
    @root.remove()

  getElement: ->
    @root

  show: ->
    @isVisible = true
    @poller = setInterval =>
      @updateTrackInfo()
    , 5000

    setTimeout =>
      @updateTrackInfo()

    atom.packages.activatePackage('tree-view').then (treeViewPkg) =>
      treeViewPkg.mainModule.treeView.append @root

  hide: ->
    @root.remove()
    @isVisible = false
    clearInterval @poller

  updateTrackInfo: () ->
    spotify.getState (error, state) =>
      if state
        # state.state = 'paused' 'playing'
        if state.state == 'paused'
          @playerState.src = 'atom://atom-spotified/assets/equalizer_white_pause.gif'
        else
          @playerState.src = 'atom://atom-spotified/assets/equalizer_white.gif'

        trackId = state.track_id.split(':')[2]

        if trackId != @currentTrackID
          options =
            credentials: 'include'
            method: 'GET'
            mode: 'cors'

          fetch "https://api.spotify.com/v1/tracks/#{trackId}", options
            .then (response) ->
              if response.ok
                response.json()
              else
                spotify.getTrack (error, track) =>
                  if track
                    @handleUpdate(trackId, track.name, track.artist)
                  else # cannot get current track
                    @handleError(error)
                throw new Error('Spotify API request failed')
            .then (trackInfo) =>
              # trackInfo.artists [id, name, href]
              # trackInfo.album {id, name, images[url, height, width]}
              # trackInfo.name
              # trackInfo.popularity
              @handleUpdate(trackId, trackInfo.name, trackInfo.artists[0].name, trackInfo.album.images[1].url)
            .catch (error) =>
              spotify.getTrack (error, track) =>
                if track
                  @handleUpdate(trackId, track.name, track.artist)
                else # cannot get current track
                  @handleError(error)
      else # cannot get player state
        @handleError(error)

  handleUpdate: (id, track, artist, album) ->
    @name.textContent = track
    @artist.textContent = artist
    @currentTrackID = id
    @retryCount = 0

    if album
      @albumArt.src = album
      @cover.classList.remove 'show-placeholder'
    else
      @cover.classList.add 'show-placeholder'

  handleError: (error) ->
    console.error 'atom-spotified:', error

    if  @retryCount > 3 && @currentTrackID != ''
      @name.textContent = 'Error'
      @artist.textContent = 'Something is wrong'
      @cover.classList.add 'show-placeholder'
      @currentTrackID = ''

    @retryCount++
