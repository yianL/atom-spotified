'use babel'

import AtomSpotifiedView from './atom-spotified-view'
import conifgSchema from './config-schema'

export default AtomSpotified = {
  config: conifgSchema,

  activate: (state) => {
    this.atomSpotifiedView = new AtomSpotifiedView(state.atomSpotifiedViewState)
    this.atomSpotifiedView.show()

    // Register command that toggles this view
    this.subscriptions = atom.commands.add('atom-workspace', 'atom-spotified:toggle', () => {
      this.atomSpotifiedView.isVisible ? this.atomSpotifiedView.hide() :this.atomSpotifiedView.show()
    })
  },

  deactivate: () => {
    this.subscriptions.dispose()
    this.atomSpotifiedView.destroy()
  },

  serialize: () => ({
    atomSpotifiedViewState: this.atomSpotifiedView.serialize(),
  }),
}
