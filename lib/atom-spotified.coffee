AtomSpotifiedView = require './atom-spotified-view'
{CompositeDisposable} = require 'atom'

module.exports = AtomSpotified =
  atomSpotifiedView: null
  modalPanel: null
  subscriptions: null

  config:
    maxHeight:
      type: 'integer'
      default: 250
      min: 0
      description: 'Maximum height of the list before scrolling is required. Set to 0 to disable scrolling.'

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
    if @atomSpotifiedView.isVisible then @atomSpotifiedView.hide() else @atomSpotifiedView.show()
