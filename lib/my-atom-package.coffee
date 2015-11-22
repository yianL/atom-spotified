MyAtomPackageView = require './my-atom-package-view'
{CompositeDisposable} = require 'atom'

module.exports = MyAtomPackage =
  myAtomPackageView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @myAtomPackageView = new MyAtomPackageView(state.myAtomPackageViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @myAtomPackageView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'my-atom-package:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @myAtomPackageView.destroy()

  serialize: ->
    myAtomPackageViewState: @myAtomPackageView.serialize()

  toggle: ->
    console.log 'MyAtomPackage was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
