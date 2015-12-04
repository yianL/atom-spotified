AtomSpotifiedView = require './atom-spotified-view'
{CompositeDisposable} = require 'atom'

module.exports = AtomSpotified =
  atomSpotifiedView: null
  subscriptions: null

  config:
    showEqualizer:
      type: 'boolean'
      default: true
      description: 'Show the equalizer at the bottom right corner'

  activate: (state) ->
    @atomSpotifiedView = new AtomSpotifiedView(state.atomSpotifiedViewState)
    @atomSpotifiedView.show()

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-spotified:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()
    @atomSpotifiedView.destroy()

  serialize: ->
    atomSpotifiedViewState: @atomSpotifiedView.serialize()

  toggle: ->
    if @atomSpotifiedView.isVisible
      @atomSpotifiedView.hide()
    else
      @atomSpotifiedView.show()
